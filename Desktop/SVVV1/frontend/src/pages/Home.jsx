import { Link } from "react-router-dom";

export default function Home(){
  return (
    <section className="py-20 text-center bg-gray-50">
      <h1>Build Fast. Innovate Faster.</h1>
      <p >Quick start template for hackathons using React + Vite + Tailwind.</p>
      <Link to="/signup">Get Started</Link>
    </section>
  );
}
