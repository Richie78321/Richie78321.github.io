import React, { useEffect, useRef } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";

// Shows a still frame, and plays the clip while the card is hovered. On touch
// screens (no hover), it plays while the card is mostly on screen instead.
// Respects the "reduce motion" accessibility setting.
function ProjectVideo({ src, poster, title }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: hover)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.6 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const play = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ref.current?.play().catch(() => {});
  };
  const pause = () => ref.current?.pause();

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={title}
      muted
      loop
      playsInline
      preload="none"
      onMouseEnter={play}
      onMouseLeave={pause}
    />
  );
}

function ProjectCard({ projectMarkdown }) {
  const {
    attributes: { title, image, video, link, date, imageFit },
    body,
  } = projectMarkdown;

  return (
    <>
      <div className="project-card card h-100">
        <div
          className={
            "project-image card-img-top" +
            (imageFit === "contain" ? " fit-contain" : "")
          }
        >
          {video ? (
            <ProjectVideo src={video} poster={image} title={title} />
          ) : (
            <img src={image} alt={title} loading="lazy" />
          )}
        </div>
        <div className="card-body">
          <a href={link} target="_blank" rel="noreferrer">
            <h5 className="card-title mb-0">{title}</h5>
          </a>
          <div className="mb-2">
            <i className="text-muted">{moment(date, "MM/DD/YYYY").year()}</i>
          </div>
          <ReactMarkdown linkTarget="_blank" className="card-text">
            {body}
          </ReactMarkdown>
        </div>
      </div>
      <style jsx>{`
        .project-card {
          transition: 0.1s;
        }

        /* Same-shaped image area on every card so titles line up in a row.
           Images fill the area; add imageFit: "contain" to a project's front
           matter to show the whole image instead (e.g. diagrams). */
        .project-image {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #fff;
        }

        .project-image :global(img),
        .project-image :global(video) {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-image.fit-contain :global(img),
        .project-image.fit-contain :global(video) {
          object-fit: contain;
        }

        .project-card:hover {
          box-shadow: 0px 0px 5px 1px rgba(232, 232, 232, 1);
          -moz-box-shadow: 2px 2px 5px 1px rgba(232, 232, 232, 1);
          -webkit-box-shadow: 2px 2px 5px 1px rgba(232, 232, 232, 1);
        }
      `}</style>
    </>
  );
}

export default function Projects({ projectsMarkdown }) {
  projectsMarkdown.sort(
    (a, b) =>
      moment(b.attributes.date, "MM/DD/YYYY") -
      moment(a.attributes.date, "MM/DD/YYYY")
  );

  return (
    <>
      <h3>Some of my favorite free-time projects</h3>
      <p className="mb-4">
        Here is a list of some of my favorite projects that I've done in my free
        time. Check out my{" "}
        <a
          href="https://github.com/Richie78321"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{" "}
        for more!
      </p>
      <div className="row">
        {projectsMarkdown.map((projectMarkdown, index) => (
          <div key={index} className="col-sm-6 col-lg-4 mb-3">
            <ProjectCard projectMarkdown={projectMarkdown} />
          </div>
        ))}
      </div>
    </>
  );
}
