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
      <div className="container">
        <div className="row mt-4 no-gutters">
          <div className="col-md-2 align-self-center text-md-left text-center mb-3 mb-md-0">
            <img
              className="rounded img-fluid"
              src="/me.jpg"
              width="150px"
            ></img>
          </div>
          <div className="col-md-10 align-self-center">
            <span className="d-none d-lg-inline">
              <h1 className="display-1 text-center my-auto">
                Richie Goulazian
              </h1>
            </span>
            <span className="d-none d-md-inline d-lg-none">
              <h1 className="display-3 text-center my-auto">
                Richie Goulazian
              </h1>
            </span>
            <span className="d-none d-sm-inline d-md-none">
              <h1 className="display-4 text-center my-auto">
                Richie Goulazian
              </h1>
            </span>
            <span className="d-inline d-sm-none">
              <h1 className="font-weight-normal text-center my-auto">
                Richie Goulazian
              </h1>
            </span>
          </div>
        </div>

        <hr className="mb-3" />
        <Socials />

        <div className="mb-4">
          <h3>About me</h3>
          <ReactMarkdown linkTarget="_blank" source={bioMarkdown} />
          <GitHubScroller />
        </div>

        <Projects projectsMarkdown={projectsMarkdown} />
      </div>
    </BaseLayout>
  );
}

export async function getStaticProps() {
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
