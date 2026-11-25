import BaseLayout from "../layouts/BaseLayout";
import path from "path";
import fs from "fs";
import Socials from "../components/Socials";
import GitHubScroller from "../components/GitHubScroller";
import Projects from "../components/Projects";
import ReactMarkdown from "react-markdown";
import frontmatter from "front-matter";

export default function Index({ bioMarkdown, projectsMarkdown }) {
  return (
    <BaseLayout title="Richie Goulazian - Portfolio">
      <div className="container mb-4">
        <div className="row mt-4 no-gutters">
          <div className="col-md-2 align-self-center text-md-left text-center mb-3 mb-md-0">
            <img
              className="rounded img-fluid"
              src="/me.jpg"
              width="150"
              height="150"
              alt="Photo of Richie Goulazian"
            />
          </div>
          <div className="col-md-10 align-self-center">
            <h1 className="site-name text-center my-auto">Richie Goulazian</h1>
          </div>
        </div>

        <hr className="mb-3" />
        <Socials />

        <div className="mb-4 readable">
          <h3>About me</h3>
          <ReactMarkdown linkTarget="_blank">{bioMarkdown}</ReactMarkdown>
          <GitHubScroller />
        </div>

        <Projects projectsMarkdown={projectsMarkdown} />
      </div>
      <style jsx>{`
        /* One heading that scales smoothly with the screen, instead of four
           copies swapped at breakpoints. Sizes match the old display classes. */
        .site-name {
          font-size: clamp(2.25rem, 1rem + 6vw, 6rem);
          font-weight: 300;
          line-height: 1.1;
        }

        /* Keep paragraphs to a comfortable line length on wide screens. */
        .readable {
          max-width: 48rem;
        }
      `}</style>
    </BaseLayout>
  );
}

export function getStaticProps() {
  const bioMarkdownPath = path.join(process.cwd(), "content", "Bio.md");
  const projectsPath = path.join(process.cwd(), "content", "projects");

  return {
    props: {
      bioMarkdown: fs.readFileSync(bioMarkdownPath).toString(),
      projectsMarkdown: fs
        .readdirSync(projectsPath)
        .map((projectFile) =>
          frontmatter(
            fs.readFileSync(path.join(projectsPath, projectFile)).toString()
          )
        ),
    },
  };
}
