import { createContext, useState, useEffect } from "react";
import { redirectByRole } from "../utils/redirectByRole";

export const AuthContext = createContext(null);

const API = "http://127.0.0.1:8000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- init from localStorage ---
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    // --- login ---
    const login = async (email, password, navigate) => {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error("Невірний email або пароль");
        }

        const data = await res.json();

        const userData = {
            email: data.email,
            role: data.role,
            token: data.access_token,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        navigate(redirectByRole(userData.role));
    };

    // --- owner register ---
    const registerOwner = async (email, password, business_name) => {
        const res = await fetch(`${API}/auth/register-owner`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, business_name }),
        });

        if (!res.ok) {
            throw new Error("Помилка реєстрації");
        }

        const data = await res.json();

        const userData = {
            email: data.email,
            role: data.role,
            token: data.access_token,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // --- logout ---
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const value = {
        user,
        loading,
        login,
        registerOwner,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};