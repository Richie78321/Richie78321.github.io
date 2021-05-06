import { useEffect, useState } from "react";
import moment from "moment";

const TEXT_SCROLLER_TIMEOUT = 3000; // 3 seconds

function TextScroller({ textToScroll }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % textToScroll.length);
    }, TEXT_SCROLLER_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  });

  return textToScroll[currentIndex];
}

export default function GitHubScroller() {
  const [recentCommits, setRecentCommits] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      const githubRepos = await (
        await fetch(
          "https://api.github.com/users/Richie78321/events?per_page=50",
          {
            signal: abortController.signal,
          }
        )
      ).json();

      githubRepos.filter((event) => event.type === "PushEvent");
      setRecentCommits(
        githubRepos.reduce((acc, pushEvent) => {
          if (pushEvent.repo && pushEvent.payload?.commits) {
            acc.push(
              ...pushEvent.payload.commits.map(
                (commit) =>
                  `Committed to ${pushEvent.repo.name} ${moment(
                    pushEvent.created_at
                  ).fromNow()}: ${commit.message}`
              )
            );
          }

          return acc;
        }, [])
      );
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  if (!recentCommits || recentCommits.length == 0) {
    return null;
  }

  return (
    <div class="mx-4">
      <hr />
      I'm always doing something:
      <br />
      <div className="text-truncate my-1 text-primary">
        <TextScroller textToScroll={recentCommits} />
      </div>
      <footer class="blockquote-footer">
        Pulled from my <a href="https://github.com/Richie78321">GitHub</a>
      </footer>
      <hr />
    </div>
  );
}
