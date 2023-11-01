
import { ReactElement } from 'react'
import './App.css'
import Login from './components/Login'
import Panel from './components/Panel'


const App = (): ReactElement => {
  return (
        <div className='App'>
          <div className="img-box">
            <img src="/src/assets/omatko logo.jpg" alt="Logo OMatKo"/>
          </div>
          <Login/>
          {/* <Panel/> */}
        </div>
  )
}

export default App
