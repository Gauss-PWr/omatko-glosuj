import './App.css'
import './assets/hamburgers.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router'
import LecturesView from '@/components/LecturesView'
import PostersView from '@/components/PostersView'
import Login from '@/components/Login'
import Nav from '@/components/Nav'
import useAuth from '@/components/Auth'
function App() {
  const { loggedIn } = useAuth()

  if (!loggedIn) return <Login/>

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Nav />
      <Routes>
        <Route path="/lectures" element={<LecturesView />} />
        <Route path="/posters" element={<PostersView />} />
        <Route path="*" element={<LecturesView />} />
      </Routes>
    </Router>
  )
}

export default App
