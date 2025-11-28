import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin.jsx";
import "./pages/loginn.module.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./component/Navbar";
import Footer from './component/Footer.jsx';


 




export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Routes> <Route path="/adminlogin" element={<AdminLogin/>} /></Routes>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home/>} />
           
            <Route path="/signup" element={<Signup/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
