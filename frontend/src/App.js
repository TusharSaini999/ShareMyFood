import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { NavBar } from "./components/nav-bar";
import Home from "./pages/main-page";
import { Footer } from "./components/footer";
import AuthComponent from "./pages/auth";



function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />       
          <Route path="/auth" element={<AuthComponent />} />       
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
