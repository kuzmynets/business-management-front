import { createContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { redirectByRole } from "../utils/redirectByRole";

export const AuthContext = createContext(null);

const API = "http://127.0.0.1:8000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Ініціалізація з localStorage ---
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        setLoading(false);
    }, []);

    // --- Login через Firebase ---
    const login = async (email, password, navigate) => {
        try {
            // 1. Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            // 2. GET /auth/me на бекенд для отримання ролі + business
            const res = await fetch(`${API}/auth/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (!res.ok) throw new Error("Не вдалося отримати інформацію користувача");

            const data = await res.json();

            const userData = {
                email: data.email,
                role: data.role,
                businessId: data.business_id,
                token: idToken, // Firebase token
            };

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            navigate(redirectByRole(userData.role));
        } catch (err) {
            throw new Error(err.message || "Помилка логіну");
        }
    };

    // --- Owner реєстрація через бекенд ---
    const registerOwner = async (email, password, business_name) => {
        const res = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, business_name }),
        });

        if (!res.ok) throw new Error("Помилка реєстрації");

        const data = await res.json();

        const userData = {
            email: data.email,
            role: data.role,
            businessId: data.business_id,
            token: null, // ще не залогінений через Firebase
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // --- Logout ---
    const logout = async () => {
        setUser(null);
        localStorage.removeItem("user");
        await auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, registerOwner, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};