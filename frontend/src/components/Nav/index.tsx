import "./nav.css";
import { NavLink } from "react-router";
import logo from "@/assets/logo.webp";
import { useRef } from "react";
import useAuth from "@/components/Auth";
const Nav = () => {
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMenu = () => {
    menuRef.current?.classList.toggle("open");
    menuButtonRef.current?.classList.toggle("is-active");
  };

  return (
    <nav className="uniform-width">
      <div className="nav-logo-container">
        <img src={logo} alt="Logo OMatKo!!!" />
      </div>
      <div className="nav-button-container">
        <button
          className="hamburger hamburger--collapse"
          type="button"
          onClick={toggleMenu}
          ref={menuButtonRef}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
      <div className="nav-menu-container" ref={menuRef}>
        <ul>
          <li>
            <NavLink to="/lectures" onClick={toggleMenu}>
              Wykłady
            </NavLink>
          </li>
          <li>
            <NavLink to="/posters" onClick={toggleMenu}>
              Plakaty
            </NavLink>
          </li>
          <li>
            <NavLink to="https://omatko.pwr.edu.pl" onClick={toggleMenu}>
              Strona główna
            </NavLink>
          </li>
        </ul>
        <div className="logout-button-container">
          <button
            type="button"
            className="uniform-width"
            onClick={handleLogout}
          >
            Wyloguj
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
