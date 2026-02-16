import { createContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { getMe, registerOwner as registerOwnerApi } from "../api/auth";
import { redirectByRole } from "../utils/redirectByRole";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        setLoading(false);
    }, []);

    const login = async (email, password, navigate) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await cred.user.getIdToken();

        localStorage.setItem(
            "user",
            JSON.stringify({ token: idToken })
        );

        const data = await getMe();

        const userData = {
            email: data.email,
            role: data.role,
            businessId: data.business_id,
            token: idToken,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        navigate(redirectByRole(userData.role));
    };

    const registerOwner = async (email, password, business_name) => {
        const data = await registerOwnerApi({ email, password, business_name });

        const userData = {
            email: data.email,
            role: data.role,
            businessId: data.business_id,
            token: null,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

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