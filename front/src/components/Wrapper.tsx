import { useAuth } from './Auth'
import Login from './Login'
import Panel from './Panel'



export const Wrapper: React.FC = () => {
    const {state, dispatch} = useAuth()

    return (
        <div>
            <div className="img-box">
            <img src="/src/assets/omatko logo.jpg" alt="Logo OMatKo"/>
            </div>
            { state.isAuntheticated ? <Panel/> : <Login/>}
        </div>
    )
}

