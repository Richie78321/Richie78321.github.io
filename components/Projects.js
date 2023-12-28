import React from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";

function ProjectCard({ projectMarkdown }) {
  const {
    attributes: { title, image, link, date },
    body,
  } = projectMarkdown;

  return (
    <>
      <div className="project-card card h-100">
        <img
          src={image}
          className={
            "card-img-top " + (image.endsWith("gif") ? "freezeframe" : null)
          }
        />
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
  useEffect(() => {
    (async () => {
      // Import and instantiate freezeframe.js, but only when on browser.
      new (await import("freezeframe")).default();
    })();
  }, []);

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
          <div key={index} className="col-md-6 col-lg-4 mb-3">
            <ProjectCard projectMarkdown={projectMarkdown} />
          </div>
        ))}
      </div>
    </>
  );
}
