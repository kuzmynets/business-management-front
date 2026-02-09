import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const RegisterOwnerPage = () => {
    const { registerOwner } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await registerOwner(email, password, businessName);
            navigate("/dashboard");
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={submit}
                className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Створення бізнесу</h2>

                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="Назва бізнесу"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Пароль"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />

                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Створити
                </button>
            </form>
        </div>
    );
};
