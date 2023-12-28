import React, { useState } from "react";
import path from "path";
import fs from "fs";
import BaseLayout from "../layouts/BaseLayout";
import ReactMarkdown from "react-markdown";

const CustomListItem = ({ children }) => {
  // Only render first-level list items
  children = children.filter((child) => child.type !== "ul");
  return <li>{children}</li>;
};

export default function Papers({ papersMarkdown }) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <BaseLayout title="Richie Goulazian - Papers">
      <div className="container">
        <h1 className="display-4 mt-md-5 mt-4 mb-2">Paper List</h1>
        <p className="text-muted mb-3">
          Below is a list of papers (and other resources) that I found helpful
          when learning a subject
          <br />
          <a className="text-nowrap" href="/">
            {" "}
            ― Richie Goulazian
          </a>
        </p>
        <div className="custom-control custom-switch text-muted mb-2">
          <input
            type="checkbox"
            className="custom-control-input"
            id="showNotesSwitch"
            onChange={(e) => setShowNotes(e.target.checked)}
          />
          <label className="custom-control-label" for="showNotesSwitch">
            Show notes
          </label>
        </div>
        {showNotes ? (
          <ReactMarkdown linkTarget="_blank" className="papersMarkdown">
            {papersMarkdown}
          </ReactMarkdown>
        ) : (
          <ReactMarkdown
            linkTarget="_blank"
            className="papersMarkdown"
            components={{
              li: CustomListItem,
            }}
          >
            {papersMarkdown}
          </ReactMarkdown>
        )}
      </div>
    </BaseLayout>
  );
}

export function getStaticProps() {
  const papersMarkdownPath = path.join(process.cwd(), "content", "Papers.md");

  return {
    props: {
      papersMarkdown: fs.readFileSync(papersMarkdownPath).toString(),
    },
  };
}
