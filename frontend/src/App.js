import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { NavBar } from "./components/nav-bar";
import Home from "./pages/main-page";
import { Footer } from "./components/footer";



function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />       
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
