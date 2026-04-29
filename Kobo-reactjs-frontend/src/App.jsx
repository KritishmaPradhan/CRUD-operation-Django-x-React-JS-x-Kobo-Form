import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowDetails from "./pages/ShowDetails";
import CreateDetails from "./pages/CreateDetails";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/details" element={<ShowDetails />} />
          <Route path="/create" element={<CreateDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
  
export default App;