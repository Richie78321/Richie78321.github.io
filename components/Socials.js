import { FaLinkedin, FaGithubSquare, FaFileAlt, FaBook } from "react-icons/fa";

export default function Socials({ className }) {
  return (
    <>
      <div
        id="socials"
        className={"d-flex justify-content-around mb-4 " + className}
      >
        <a
          target="_blank"
          rel="noreferrer"
          href="./resume.pdf"
          className="text-center mx-2"
        >
          <FaFileAlt size="1.25em" />
          <span className="ml-1 align-middle">Resume</span>
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/in/rgoulazian/"
          className="text-center mx-2"
        >
          <FaLinkedin size="1.25em" />
          <span className="ml-1 align-middle">Linkedin</span>
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/Richie78321"
          className="text-center mx-2"
        >
          <FaGithubSquare size="1.25em" />
          <span className="ml-1 align-middle">GitHub</span>
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="/papers"
          className="text-center mx-2"
        >
          <FaBook size="1.25em" />
          <span className="ml-1 align-middle">Papers</span>
        </a>
      </div>

      <style jsx>{`
        #socials a {
          color: inherit;
        }
      `}</style>
    </>
  );
}
