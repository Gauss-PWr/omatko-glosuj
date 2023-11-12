import { ReactElement, useState } from "react";
import './Login.css'
import axios from "axios";


interface Login {
    username: string,
    password: string
}

const loginData: Login = {
    username: '',
    password: ''
}

const Login = (): ReactElement => {

    const[formData, setFormData] = useState(loginData)

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
        //dzwoni do centrali i sie pyta czy git
        //cookies
        //jak jest git to pobiera dane i sie zmienia w panel
        axios.post("http://localhost:5555/token", formData, {headers: {"content-type": "application/x-www-form-urlencoded"}})
        .then((response) => {
              console.log(response);
              if (response.statusText == "OK") {
                alert("Sukces!");
              }
            })
        .catch(function (error) {alert("Złe dane logowania!")}) 
        console.log(formData)
    }

    return (
        <form className="Login" onSubmit={handleSubmit}>
            <div className="login-box">
                <input type="text" placeholder="Login" name="username" onChange={handleChange} value={formData.username}/>
                <input type="password" placeholder="Hasło" name="password" onChange={handleChange} value={formData.password}/>
                <button type="submit">Zaloguj</button>
            </div>
        </form>
    )
}



export default Login