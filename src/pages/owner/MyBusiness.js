import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function MyBusiness() {
    const { user, logout } = useContext(AuthContext);

    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // --- завантаження бізнесу ---
    const fetchBusiness = async () => {
        setLoading(true);
        try {
            const data = await apiRequest(`/business/${user.businessId}`);
            setBusiness(data);
        } catch {
            setError("Failed to load business info");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusiness();
    }, []);

    // --- оновлення бізнесу ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await apiRequest(`/business/${user.businessId}`, {
                method: "PATCH",
                body: JSON.stringify({ name: business.name, subscription: business.subscription }),
            });
            setError("");
        } catch {
            setError("Failed to update business");
        } finally {
            setUpdating(false);
        }
    };

    // --- підтвердження деактивації ---
    const confirmDeactivate = async () => {
        try {
            await apiRequest(`/business/${user.businessId}/deactivate`, { method: "POST" });
            logout(); // завершення сесії після деактивації
        } catch {
            setError("Failed to deactivate business");
        } finally {
            setShowConfirm(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    if (!business) return <div className="p-6 text-red-600">{error || "Business not found"}</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">My Business</h1>

                    {error && <div className="text-red-600">{error}</div>}

                    <div className="bg-white p-6 rounded-xl shadow space-y-4">
                        <form onSubmit={handleUpdate} className="space-y-4">
                            {/* Назва бізнесу */}
                            <div>
                                <label className="block text-sm font-medium">Business Name</label>
                                <input
                                    type="text"
                                    value={business.name}
                                    onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>

                            {/* Дата створення */}
                            <div>
                                <label className="block text-sm font-medium">Created At</label>
                                <input
                                    type="text"
                                    value={new Date(business.created_at).toLocaleDateString()}
                                    className="w-full border px-3 py-2 rounded bg-gray-100"
                                    readOnly
                                />
                            </div>

                            {/* Підписка */}
                            <div>
                                <label className="block text-sm font-medium">Subscription</label>
                                <select
                                    value={business.subscription}
                                    onChange={(e) => setBusiness({ ...business, subscription: e.target.value })}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="FREE">Free</option>
                                    <option value="PRO">Pro</option>
                                    <option value="ENTERPRISE">Enterprise</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={updating}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {updating ? "Updating..." : "Update"}
                            </button>
                        </form>

                        <hr />

                        {/* Деактивація бізнесу */}
                        <div className="mt-4">
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Deactivate Business
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Модальне вікно підтвердження --- */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
                        <p>Are you sure you want to deactivate this business?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-300"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white"
                                onClick={confirmDeactivate}
                            >
                                Deactivate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}