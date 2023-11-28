import { useAuth } from "./Auth";
import Login from "./Login";
import Panel from "./Panel";
import "./Wrapper.css";
import omatkoLogo from "../assets/omatko.svg";
import { ReactElement } from "react";

export const Wrapper: React.FC = () => {
  const { state, dispatch } = useAuth();

  return (
    <div className="Wrapper">
      <div className="img-box">
        <img src={omatkoLogo} alt="Logo OMatKo" />
      </div>
      {state.isAuntheticated ? (
        [
          <Panel key={1} />,
          <button
            key={2}
            className="logout"
            onClick={() => {
              dispatch({
                type: "LOGOUT",
                payload: { username: "", password: "" },
              });
            }}
          >
            Wyloguj
          </button>,
        ]
      ) : (
        <Login />
      )}
      <Footer/>
    </div>
  );
};


const Footer = (): ReactElement => {
  return (
    <div className="Footer">
      OMatKo!!! 2023 | <a href="https://prac.im.pwr.edu.pl/~omatko/?page_id=358">Regulamin</a>
    </div>
  )
}