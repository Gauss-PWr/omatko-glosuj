import { ReactElement, useState } from "react";
import './Login.css'
import { useAuth, User } from "./Auth";
import axios from "axios";

const initialData: User = {
    login: '',
    password: ''
}

const Login = (): ReactElement => {

    const {state, dispatch} = useAuth()
    const[formData, setFormData] = useState(initialData)

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        try {
            const res = await axios.post("http://localhost:5555/token", formData, {headers: {"content-type": "application/x-www-form-urlencoded"}})
            if (await res.statusText === "OK") {
                dispatch({type: 'LOGIN', payload: formData })
            }
            else {
                alert('Bledne costam')
            }
        } catch (error) {
            console.error(error)
        }
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