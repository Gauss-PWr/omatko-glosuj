import { useAuth } from './Auth'
import Login from './Login'
import Panel from './Panel'
import omatkoLogo from '../assets/omatko logo.jpg'



export const Wrapper: React.FC = () => {
    const {state, dispatch} = useAuth()

    return (
        <div>
            <div className="img-box">
            <img src={omatkoLogo} alt="Logo OMatKo"/>
            </div>
            { state.isAuntheticated ? <Panel/> : <Login/>}
        </div>
    )
}

