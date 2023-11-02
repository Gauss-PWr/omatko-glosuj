import { ReactElement, useState } from "react";
import './Login.css'

interface Login {
    login: string,
    password: string
}

const loginData: Login = {
    login: '',
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
        console.log(formData)
    }

    return (
        <form className="Login" onSubmit={handleSubmit}>
            <div className="login-box">
                <input type="text" placeholder="Login" name="login" onChange={handleChange} value={formData.login}/>
                <input type="password" placeholder="Hasło" name="password" onChange={handleChange} value={formData.password}/>
                <button type="submit">Zaloguj</button>
            </div>
        </form>
    )
}



export default Login