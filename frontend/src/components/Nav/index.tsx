import "./nav.css";
import { NavLink, useNavigate } from "react-router";
import logo from "@/assets/logo.webp";
import { useRef } from "react";
import useAuth from "@/hooks/Auth";
const Nav = () => {
  const { logout, isAdmin } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    menuRef.current?.classList.remove("open");
    menuButtonRef.current?.classList.remove("is-active");
    navigate("/");
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
            <NavLink to="/wyklady" onClick={toggleMenu}>
              Wykłady
            </NavLink>
          </li>
          <li>
            <NavLink to="/plakaty" onClick={toggleMenu}>
              Plakaty
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink to="/wyniki" onClick={toggleMenu}>
                Wyniki
              </NavLink>
            </li>
          )}
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
