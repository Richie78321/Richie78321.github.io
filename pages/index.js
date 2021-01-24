import BaseLayout from "../layouts/BaseLayout";
import ReactMarkdown from "react-markdown";
import path from "path";
import fs from "fs";
import Socials from "../components/socials";

export default function Index({ bioMarkdown }) {
  return (
    <BaseLayout title="Richie Goulazian - Portfolio">
      <div className="mt-5 d-flex flex-column">
        <img
          id="photo"
          className="rounded-circle d-block mx-auto"
          src="/photo.jpg"
        />
        <h1 id="name" className="display-4 mt-4 text-center">
          Richie Goulazian
        </h1>
        <div id="bio" className="row  justify-content-center">
          <div className="mt-4 col-sm-11 col-md-8 col-lg-7 col-xl-5">
            <ReactMarkdown linkTarget="_blank" source={bioMarkdown} />
            <Socials className="mt-5" />
          </div>
        </div>
      </div>

      <style jsx>{`
        #photo {
          width: 150px;
        }

        #name {
          font-family: Oswald, sans-serif;
        }

        #bio {
          font-size: 150%;
        }
      `}</style>
    </BaseLayout>
  );
}

export async function getStaticProps() {
  const bioMarkdownPath = path.join(process.cwd(), "content/Bio.md");

  return {
    props: {
      bioMarkdown: fs.readFileSync(bioMarkdownPath).toString(),
    },
  };
}
