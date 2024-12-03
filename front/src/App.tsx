
import { ReactElement } from 'react'
import './App.css'
import { Wrapper } from './components/Wrapper'
import { AuthProvider } from './components/Auth'
import { Provider } from 'react-redux'
import { store } from './store'


const App = (): ReactElement => {
  return (
        <div className='App'>
          <Provider store={store}>
          <AuthProvider>
            <Wrapper />
          </AuthProvider>
          </Provider>
        </div>
  )
}

export default App
