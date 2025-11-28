import { Link } from "react-router-dom";

export default function Navbar(){
  return (
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">HackProject</Link>
      <div className="space-x-3">
        <Link to="/AdminLogin">Login</Link>
        <Link to="/signup" className="px-3 py-1 rounded border">Signup</Link>
      </div>
    </nav>
  );
}
