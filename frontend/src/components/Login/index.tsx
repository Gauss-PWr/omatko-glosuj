import useAuth from "@/components/Auth";
import { ChangeEvent, FormEvent, useState } from "react";
import logo from "@/assets/logo.webp";
import "./login.css";
const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [invalidLogin, setInvalidLogin] = useState(false);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setInvalidLogin(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({ username });
    } catch (e) {
      setInvalidLogin(true);
    }
  };

  return (
    <div className="login-panel uniform-width">
      <div className="login-image-container">
        <img src={logo} alt="Logo OMatKo!!!" />
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="username"
          placeholder="Kod"
          value={username}
          onChange={handleInput}
          className={`login-input ${invalidLogin ? "invalid-login" : ""}`}
        />
        <div className="login-info">
          Kod znajdziesz z tyłu swojego indetyfikatora
        </div>
        <button type="submit" className="login-submit">
          ZALOGUJ
        </button>
      </form>
    </div>
  );
};

export default Login;
