import "./App.css";
import "./assets/hamburgers.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import LecturesView from "@/views/Lectures";
import PostersView from "@/views/Posters";
import Login from "@/components/Login";
import Nav from "@/components/Nav";
import useAuth from "@/hooks/Auth";
import Footer from "@/components/Footer";
function App() {
  const { loading, loggedIn } = useAuth();

  if (loading) return null;
  if (!loggedIn) return <Login />;

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Nav />
      <main>
        <Routes>
          <Route path="/lectures" element={<LecturesView />} />
          <Route path="/posters" element={<PostersView />} />
          <Route path="*" element={<LecturesView />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
