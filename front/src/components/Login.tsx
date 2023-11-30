import { ReactElement, useEffect, useState } from "react";
import "./Login.css";
import { useAuth } from "./Auth";
import axios, { AxiosError } from "axios";
import API_CALL_URL from "../config.ts";

const initialData: User = {
  username: "",
  password: "",
};

const Login = (): ReactElement => {
  const { dispatch } = useAuth();
  const [formData, setFormData] = useState<User>( JSON.parse((localStorage.getItem('user_data')) || JSON.stringify(initialData)));
  const [isDataCorect, setIsDataCorect] = useState(true);

  useEffect(() => {
    const login = async () => {
      
      //wyglada to dziwnie ale no lepiej tak niz wcale
      const data = JSON.parse(
        localStorage.getItem("user_data") || JSON.stringify(initialData)
      );
      if (data === initialData) return;

      try {
        const res = await axios.post(
          `${API_CALL_URL}/auth/token`,
          data,
          { headers: { "content-type": "application/x-www-form-urlencoded" } }
        );

        if ((await res.status) === 200) {
          dispatch({
            type: "LOGIN",
            payload: {
              ...formData,
              token: {
                accessToken: res.data.access_token,
                tokenType: res.data.token_type,
              },
            },
          });
        }
      } catch (error) {
        return;
      }
    };
    login();
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setIsDataCorect(true);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${API_CALL_URL}/auth/token`, formData, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      if ((await res.status) === 200) {
        dispatch({
          type: "LOGIN",
          payload: {
            ...formData,
            token: {
              accessToken: res.data.access_token,
              tokenType: res.data.token_type,
            },
          },
        });

        localStorage.setItem("user_data", JSON.stringify(formData));
      }
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        console.log(err);
      }
      const error = err as AxiosError;
      switch (error.response?.status) {
        case 401:
          setIsDataCorect(false);
      }
    }
  };

  return (
    <form className="Login" onSubmit={handleSubmit}>
      <div className={`login-box ${isDataCorect ? "" : "incorect"}`}>
        <input
          type="text"
          placeholder="Login"
          name="username"
          onChange={handleChange}
          value={formData.username}
        />
        <input
          type="password"
          placeholder="Hasło"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <button type="submit">Zaloguj</button>
      </div>
    </form>
  );
};

export default Login;
