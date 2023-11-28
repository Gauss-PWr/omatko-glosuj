import { useAuth } from './Auth'
import Login from './Login'
import Panel from './Panel'
import './Wrapper.css'
import omatkoLogo from '../assets/omatko.svg'




export const Wrapper: React.FC = () => {
    const {state, dispatch} = useAuth()


    return (
        <div className='Wrapper'>
            <div className="img-box">
            <img src={omatkoLogo} alt="Logo OMatKo"/>
            </div>
            { state.isAuntheticated ? [ <Panel/>,
             <button className="logout" onClick={() => {dispatch({type: 'LOGOUT', payload: {username: '', password: ''}})}}>Wyloguj</button>] 
            : <Login/>}
        </div>
    )
}



