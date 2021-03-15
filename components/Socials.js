import { FaLinkedin, FaGithubSquare, FaFileAlt } from "react-icons/fa";

export default function Socials({ className }) {
  return (
    <>
      <div
        id="socials"
        className={"d-flex justify-content-around " + className}
      >
        <a
          target="_blank"
          rel="noreferrer"
          href="https://1drv.ms/b/s!Al1rmChF7eaeg4prNmJxllqoZZAvmw"
          className="text-center"
        >
          <FaFileAlt size="2em" />
          <span className="ml-1">Resume</span>
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/in/rgoulazian/"
          className="text-center"
        >
          <FaLinkedin size="2em" />
          <span className="ml-1">Linkedin</span>
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/Richie78321"
          className="text-center"
        >
          <FaGithubSquare size="2em" />
          <span className="ml-1">GitHub</span>
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
