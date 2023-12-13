import React from 'react';
import path from "path";
import fs from "fs";
import BaseLayout from '../layouts/BaseLayout';
import ReactMarkdown from 'react-markdown';


export default function Papers({ papersMarkdown }) {
  return (
    <BaseLayout title="Richie Goulazian - Papers">
        <div className="container">
            <h1 className="display-4 mt-md-5 mt-3 mb-2">
                Paper List
            </h1>
            <p className="mb-4 text-muted">
                Below is a list of papers (and other resources) that I found helpful when learning a subject
                <br /><a className="text-nowrap" href="/"> ― Richie Goulazian</a>
            </p>
            <ReactMarkdown linkTarget="_blank" source={papersMarkdown} className="papersMarkdown" />
        </div>
    </BaseLayout>
  );
};

export function getStaticProps() {
    const papersMarkdownPath = path.join(process.cwd(), "content", "Papers.md")

    return {
        props: {
            papersMarkdown: fs.readFileSync(papersMarkdownPath).toString(),
        }
    }
}
