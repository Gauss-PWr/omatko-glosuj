import { NavLink } from "react-router";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <p>
        {" "}
        omatko-glosuj | OMatKo!!! 2025 |{" "}
        <NavLink to="/regulamin">regulamin</NavLink>
      </p>
    </footer>
  );
};

export default Footer;
