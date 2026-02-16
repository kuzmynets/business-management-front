import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";

export default function AcceptInvite() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const data = await apiRequest(`/invites/validate/${token}`);
                setEmail(data.email);
                setValid(true);
            } catch {
                setError("Невірне або прострочене запрошення");
                setValid(false);
            }
        };
        validateToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await apiRequest(`/invites/accept/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            navigate("/login");
        } catch (err) {
            // якщо бекенд повертає message
            if (err?.message) setError(err.message);
            else setError("Помилка при прийнятті інвайту");
        } finally {
            setLoading(false);
        }
    };

    if (error && !valid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-lg font-semibold">Accept Invite</h2>

                {error && <p className="text-red-600">{error}</p>}

                <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    disabled
                    className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                />

                <input
                    type="password"
                    required
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    {loading ? "Processing..." : "Accept Invite"}
                </button>
            </form>
        </div>
    );
}