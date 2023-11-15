
import { ReactElement } from 'react'
import './App.css'
import { Wrapper } from './components/Wrapper'
import { AuthProvider } from './components/Auth'

const App = (): ReactElement => {
  return (
        <div className='App'>
          <AuthProvider>
            <Wrapper />
          </AuthProvider>
        </div>
  )
}

export default App
