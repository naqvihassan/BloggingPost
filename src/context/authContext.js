import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();

    const signUp = (name, email, password) => {
        if (users.find(u => u.email === email)) {
            alert("User already exists!");
            return;
        }
        const newUser = { name, email, password };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        router.push("/posts");
    };

    const logIn = (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            alert("Invalid email or password");
            return;
        }
        setCurrentUser(user);
        router.push("/posts");
    };

    const logOut = () => {
        setCurrentUser(null);
        router.push("/auth");
    };

    return (
        <AuthContext.Provider value={{ currentUser, users, signUp, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);