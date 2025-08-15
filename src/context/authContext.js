import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const signUp = (name, email, password) => {
    if (users.find(u => u.email === email)) {
      alert("User already exists!");
      return;
    }
    const newUser = { name, email, password };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const logIn = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      alert("Invalid email or password");
      return;
    }
    setCurrentUser(user);
  };

  const logOut = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      users, 
      signUp, 
      logIn, 
      logOut, 
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
