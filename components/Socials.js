import { FaLinkedin, FaGithubSquare } from "react-icons/fa";

export default function Socials({ className }) {
  return (
    <>
      <div
        id="socials"
        className={"d-flex justify-content-around " + className}
      >
        <a href="https://www.linkedin.com/in/rgoulazian/">
          <FaLinkedin size="2em" />
          <span className="ml-1">Linkedin</span>
        </a>
        <a href="https://github.com/Richie78321">
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
