import { useState } from "react";
import { useAuth } from "../context/authContext";

export default function AuthPage() {
  const { signUp, logIn } = useAuth(); 
  const [isSignup, setIsSignup] = useState(true); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) signUp(name, email, password);
    else logIn(email, password);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h1>{isSignup ? "Sign Up" : "Log In"}</h1>
      <form onSubmit={handleSubmit}>
        {isSignup && <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isSignup ? "Register" : "Login"}</button>
      </form>
      <p>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsSignup(!isSignup)} style={{ color: "blue" }}>
          {isSignup ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}