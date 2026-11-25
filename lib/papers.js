// Turns content/Papers.md into structured data for the Papers page.
//
// Expected shape of the markdown (the same format the file already uses):
//
//   ## Section title
//
//   Optional group label:
//
//   - [Paper title](https://link)
//     - Note (any markdown, can nest further)
//
// Runs at build time only (from getStaticProps).

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// A short label for where a link goes, shown next to the title.
export function sourceLabel(url) {
  let host;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  if (host === "arxiv.org") return "arXiv";
  if (host === "youtube.com" || host === "youtu.be") return "Video";
  if (host === "github.com") return "GitHub";
  if (/\.pdf($|[?#])/i.test(url)) return "PDF";
  if (host === "openreview.net") return "OpenReview";
  return host;
}

const LINK = /^\[([\s\S]+?)\]\((\S+?)\)\s*([\s\S]*)$/;

export function parsePapers(markdown) {
  const sections = [];
  let section = null;
  let group = null;
  let item = null;
  let itemText = null; // raw text of the item line(s) until the link closes

  const finishItem = () => {
    if (!item) return;
    const match = itemText.trim().match(LINK);
    if (match) {
      item.title = match[1].replace(/\s+/g, " ").trim();
      item.url = match[2];
      item.extra = match[3].trim();
    } else {
      item.title = itemText.trim();
      item.url = null;
      item.extra = "";
    }
    item.source = item.url ? sourceLabel(item.url) : null;
    item.notes = item.notes.join("\n").trim();
    group.items.push(item);
    item = null;
    itemText = null;
  };

  const ensureGroup = (label) => {
    if (!section) {
      section = { title: "Papers", id: "papers", intro: [], groups: [] };
      sections.push(section);
    }
    group = {
      label,
      id: label ? `${section.id}-${slugify(label)}` : null,
      items: [],
    };
    section.groups.push(group);
  };

  for (const line of markdown.split("\n")) {
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      finishItem();
      const title = heading[1].trim();
      section = { title, id: slugify(title), intro: [], groups: [] };
      sections.push(section);
      group = null;
      continue;
    }

    if (/^-\s+/.test(line)) {
      finishItem();
      if (!group) ensureGroup(null);
      item = { notes: [] };
      itemText = line.replace(/^-\s+/, "");
      continue;
    }

    if (/^\s+\S/.test(line) && item) {
      // Continuation of a link title that wrapped onto the next line.
      if (!item.notes.length && !LINK.test(itemText.trim())) {
        itemText += " " + line.trim();
      } else {
        item.notes.push(line.replace(/^ {2}/, ""));
      }
      continue;
    }

    if (line.trim() === "") continue;

    // Any other top-level text: a group label ("Transformers:") or intro text.
    finishItem();
    const text = line.trim();
    if (text.endsWith(":")) {
      ensureGroup(text.slice(0, -1).trim());
    } else if (section) {
      section.intro.push(text);
    }
  }
  finishItem();

  // Drop empty groups (e.g. a label with nothing under it).
  for (const s of sections) {
    s.groups = s.groups.filter((g) => g.items.length > 0);
    s.intro = s.intro.join(" ");
  }
  return sections.filter((s) => s.groups.length > 0);
}
