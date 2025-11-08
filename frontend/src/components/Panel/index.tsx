import './panel.css'
import { useLoginMutation } from '@/services/api'
import { useState } from 'react'




const Panel = () => {

    const [login] = useLoginMutation()
    const [loggedIn, setLoggedIn] = useState(false)

    const handleLogin = async () => {
        const user = {
            username: "admin"
        }
        try {
            const res = await login(user)
            setLoggedIn(res.data.authenticated)
        }
        catch (e) {
            console.log(e)
        }
    }


    handleLogin
    if (loggedIn) return (<div>"logged in!"</div>)
    return <button onClick={handleLogin}>Click me!</button>
}



export default Panel