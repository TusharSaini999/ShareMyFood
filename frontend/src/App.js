import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { NavBar } from "./components/nav-bar";
import Home from "./pages/main-page";
import { Footer } from "./components/footer";
import AuthComponent from "./pages/auth";
import ContactPage from "./pages/contact";
import AboutPage from "./pages/about";
import NGOLeaderboard from "./pages/leaderboard";



function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />       
          <Route path="/auth" element={<AuthComponent />} />
          <Route path="/contact" element={<ContactPage />} />      
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ngo leaderboard" element={<NGOLeaderboard />} />

        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
