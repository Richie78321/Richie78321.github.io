import React, { useMemo, useState } from "react";
import path from "path";
import fs from "fs";
import BaseLayout from "../layouts/BaseLayout";
import ReactMarkdown from "react-markdown";
import { parsePapers } from "../lib/papers";

function PaperItem({ item, showAllNotes }) {
  const [open, setOpen] = useState(false);
  const hasNotes = item.notes.length > 0;
  const notesOpen = hasNotes && (open || showAllNotes);

  return (
    <li className="paper">
      <div className="paper-row">
        <div className="paper-main">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          ) : (
            <span>{item.title}</span>
          )}
          {item.source && <span className="source">{item.source}</span>}
        </div>
        {hasNotes && !showAllNotes && (
          <button
            type="button"
            className="notes-toggle"
            aria-expanded={notesOpen}
            onClick={() => setOpen(!open)}
          >
            Notes <span aria-hidden="true">{open ? "▴" : "▾"}</span>
          </button>
        )}
      </div>
      {notesOpen && (
        <div className="notes">
          <ReactMarkdown linkTarget="_blank">{item.notes}</ReactMarkdown>
        </div>
      )}
    </li>
  );
}

export default function Papers({ sections }) {
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [query, setQuery] = useState("");

  const totalPapers = sections.reduce(
    (n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0),
    0
  );

  // Filter by title (and notes) when the search box has text.
  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        groups: s.groups
          .map((g) => ({
            ...g,
            items: g.items.filter(
              (i) =>
                i.title.toLowerCase().includes(q) ||
                i.notes.toLowerCase().includes(q) ||
                (g.label || "").toLowerCase().includes(q)
            ),
          }))
          .filter((g) => g.items.length > 0),
      }))
      .filter((s) => s.groups.length > 0);
  }, [query, sections]);

  return (
    <BaseLayout title="Richie Goulazian - Papers">
      <div className="container papers-page">
        <a className="home-link" href="/">
          ← Richie Goulazian
        </a>

        <header className="page-header">
          <h1>Papers</h1>
          <p className="lead-text">
            Papers and other resources I found helpful when learning a subject,
            with my notes on some of them.
          </p>
        </header>

        <div className="row">
          {/* Table of contents: sidebar on large screens */}
          <nav className="col-lg-3 d-none d-lg-block" aria-label="Sections">
            <div className="toc">
              <div className="toc-heading">Contents</div>
              <ul>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                    {s.groups.some((g) => g.label) && (
                      <ul>
                        {s.groups
                          .filter((g) => g.label)
                          .map((g) => (
                            <li key={g.id}>
                              <a href={`#${g.id}`}>{g.label}</a>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <main className="col-lg-9">
            {/* Section links: chips on small screens */}
            <nav className="chips d-lg-none" aria-label="Sections">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="chip">
                  {s.title}
                </a>
              ))}
            </nav>

            <div className="controls">
              <input
                type="search"
                className="form-control search"
                placeholder={`Search ${totalPapers} papers`}
                aria-label="Search papers"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="custom-control custom-switch notes-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="showNotesSwitch"
                  checked={showAllNotes}
                  onChange={(e) => setShowAllNotes(e.target.checked)}
                />
                <label
                  className="custom-control-label"
                  htmlFor="showNotesSwitch"
                >
                  Show all notes
                </label>
              </div>
            </div>

            {visibleSections.length === 0 && (
              <p className="text-muted">No papers match “{query}”.</p>
            )}

            {visibleSections.map((s) => (
              <section key={s.id} id={s.id} className="paper-section">
                <h2>{s.title}</h2>
                {s.intro && <p className="text-muted">{s.intro}</p>}
                {s.groups.map((g, gi) => (
                  <div key={g.id || gi} className="paper-group">
                    {g.label && (
                      <h3 id={g.id} className="group-label">
                        {g.label}
                      </h3>
                    )}
                    <ul className="paper-list">
                      {g.items.map((item, ii) => (
                        <PaperItem
                          key={`${item.title}-${ii}`}
                          item={item}
                          showAllNotes={showAllNotes}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
          </main>
        </div>
      </div>

      <style jsx>{`
        .papers-page {
          padding-top: 1.5rem;
          padding-bottom: 4rem;
        }

        .home-link {
          display: inline-block;
          color: #6c757d;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .home-link:hover {
          color: #007bff;
          text-decoration: none;
        }

        .page-header {
          max-width: 46rem;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: clamp(2.25rem, 1.5rem + 3vw, 3.5rem);
          font-weight: 300;
          margin-bottom: 0.5rem;
        }

        .lead-text {
          color: #6c757d;
          font-size: 1.1rem;
          margin-bottom: 0;
        }

        /* Sidebar table of contents */
        .toc {
          position: sticky;
          top: 1.5rem;
          max-height: calc(100vh - 3rem);
          overflow-y: auto;
          padding-right: 1rem;
          border-right: 1px solid #e9ecef;
          font-size: 0.9rem;
        }

        .toc-heading {
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.75rem;
          color: #6c757d;
          margin-bottom: 0.5rem;
        }

        .toc ul {
          list-style: none;
          padding-left: 0;
          margin-bottom: 0;
        }

        .toc > ul > li {
          margin-bottom: 0.6rem;
        }

        .toc > ul > li > a {
          color: #212529;
          font-weight: 500;
        }

        .toc ul ul {
          margin-top: 0.25rem;
          padding-left: 0.75rem;
          border-left: 1px solid #e9ecef;
        }

        .toc ul ul li {
          margin: 0.15rem 0;
        }

        .toc ul ul a {
          color: #6c757d;
        }

        .toc a:hover {
          color: #007bff;
          text-decoration: none;
        }

        /* Section chips on small screens */
        .chips {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
          margin-bottom: 1rem;
          scrollbar-width: none;
        }

        .chip {
          flex: none;
          border: 1px solid #dee2e6;
          border-radius: 999px;
          padding: 0.25rem 0.85rem;
          font-size: 0.9rem;
          color: #495057;
          white-space: nowrap;
        }

        .chip:hover {
          border-color: #007bff;
          color: #007bff;
          text-decoration: none;
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem 1.5rem;
          margin-bottom: 2rem;
          max-width: 46rem;
        }

        .search {
          flex: 1 1 16rem;
          max-width: 24rem;
        }

        .notes-switch {
          color: #6c757d;
        }

        .paper-section {
          max-width: 46rem;
          margin-bottom: 2.5rem;
          scroll-margin-top: 1rem;
        }

        .paper-section h2 {
          font-size: 1.6rem;
          font-weight: 400;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 1rem;
        }

        .paper-group {
          margin-bottom: 1.25rem;
        }

        .group-label {
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6c757d;
          margin: 0 0 0.4rem;
          scroll-margin-top: 1rem;
        }

        .paper-list {
          list-style: none;
          padding-left: 0;
          margin-bottom: 0;
        }
      `}</style>

      {/* Styles for PaperItem rows (separate component, so global-scoped here) */}
      <style jsx global>{`
        .papers-page .paper {
          padding: 0.45rem 0;
          border-bottom: 1px solid #f1f3f5;
        }

        .papers-page .paper:last-child {
          border-bottom: none;
        }

        .papers-page .paper-row {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }

        .papers-page .paper-main {
          flex: 1;
          min-width: 0;
        }

        .papers-page .source {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0 0.45rem;
          font-size: 0.72rem;
          line-height: 1.5;
          color: #6c757d;
          background: #f1f3f5;
          border-radius: 4px;
          white-space: nowrap;
          vertical-align: middle;
          max-width: 12rem;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .papers-page .notes-toggle {
          flex: none;
          border: none;
          background: none;
          padding: 0;
          font-size: 0.85rem;
          color: #6c757d;
          cursor: pointer;
        }

        .papers-page .notes-toggle:hover {
          color: #007bff;
        }

        .papers-page .notes {
          margin: 0.5rem 0 0.25rem;
          padding: 0.75rem 1rem;
          background: #f8f9fa;
          border-left: 3px solid #cfe2ff;
          border-radius: 0 4px 4px 0;
          font-size: 0.92rem;
          color: #343a40;
        }

        .papers-page .notes ul {
          list-style: disc;
          padding-left: 1.1rem;
          margin-bottom: 0;
        }

        .papers-page .notes ul ul {
          list-style: circle;
        }

        .papers-page .notes li {
          margin-bottom: 0.35rem;
        }

        .papers-page .notes li:last-child {
          margin-bottom: 0;
        }

        .papers-page .notes ul ul {
          margin-top: 0.35rem;
        }

        .papers-page .notes p {
          margin-bottom: 0;
        }

        .papers-page .notes code {
          color: #343a40;
          background: #e9ecef;
          padding: 0 0.25rem;
          border-radius: 3px;
        }
      `}</style>
    </BaseLayout>
  );
}

export function getStaticProps() {
  const papersMarkdownPath = path.join(process.cwd(), "content", "Papers.md");

  return {
    props: {
      sections: parsePapers(fs.readFileSync(papersMarkdownPath).toString()),
    },
  };
}
