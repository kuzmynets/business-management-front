import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";
import { useNavigate } from "react-router-dom";

export default function MyBusiness() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [business, setBusiness] = useState(null);

    const [form, setForm] = useState({
        name: "",
        logo_url: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    useEffect(() => {
        loadBusiness();
    }, []);

    const loadBusiness = async () => {
        try {
            const data = await apiRequest("/business");

            setBusiness(data);

            setForm({
                name: data?.name || "",
                logo_url: data?.logo_url || ""
            });

        } catch {
            setError("Failed to load business");
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = useMemo(() => {
        if (!business) return false;

        return (
            form.name !== (business.name || "") ||
            form.logo_url !== (business.logo_url || "")
        );
    }, [form, business]);

    const updateBusiness = async () => {
        try {
            setSaving(true);
            setError("");

            const updated = await apiRequest("/business", {
                method: "PATCH",
                body: JSON.stringify(form)
            });

            setBusiness(updated);
            setSuccess("Business updated successfully");
            setShowSaveModal(false);

        } catch {
            setError("Failed to update business");
        } finally {
            setSaving(false);
        }
    };

    const deactivateBusiness = async () => {
        try {
            await apiRequest("/business/deactivate", {
                method: "POST"
            });

            navigate("/");

        } catch {
            setError("Failed to deactivate business");
        }
    };

    const deleteBusiness = async () => {
        try {
            await apiRequest("/business", {
                method: "DELETE"
            });

            navigate("/");

        } catch {
            setError("Failed to delete business");
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-5xl mx-auto space-y-6">

                    <div>
                        <h1 className="text-3xl font-bold">
                            My Business
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Manage your company profile
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded">
                            {success}
                        </div>
                    )}

                    {/* INFO PANEL */}
                    <div className="bg-white rounded-xl shadow p-6 space-y-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Company Information
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Basic information about your business
                                </p>
                            </div>

                            {form.logo_url ? (
                                <img
                                    src={form.logo_url}
                                    alt="logo"
                                    className="w-16 h-16 rounded-xl object-cover border"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                    Logo
                                </div>
                            )}

                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    Company Name
                                </label>

                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    Logo URL
                                </label>

                                <input
                                    value={form.logo_url}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            logo_url: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                        </div>

                        <div className="text-sm text-gray-500">
                            Registered:
                            {" "}
                            {business?.created_at
                                ? new Date(business.created_at).toLocaleDateString()
                                : "—"}
                        </div>

                    </div>

                    {/* SUBSCRIPTION */}
                    <div className="bg-white rounded-xl shadow p-6">

                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Subscription
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Current business subscription plan
                                </p>
                            </div>

                            <div className="text-right">

                                <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium
                                    ${business?.subscription === "PREMIUM"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                                >
                                    {business?.subscription || "FREE"}
                                </div>

                                <div className="mt-3">
                                    <button
                                        onClick={() => navigate("/owner/subscribe")}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Upgrade Subscription
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end">

                        <button
                            disabled={!hasChanges || saving}
                            onClick={() => setShowSaveModal(true)}
                            className={`px-5 py-2 rounded-lg text-white
                                ${hasChanges
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Save Changes
                        </button>

                    </div>

                    {/* DANGER ZONE */}
                    <div className="bg-white border border-red-300 rounded-xl shadow p-6 space-y-5">

                        <div>
                            <h2 className="text-xl font-semibold text-red-600">
                                Danger Zone
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                These actions are irreversible
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">

                            <button
                                onClick={() => setShowDeactivateModal(true)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                            >
                                Deactivate Business
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Delete Business
                            </button>

                        </div>

                    </div>

                </div>
            </div>

            {/* MODALS */}
            {showSaveModal && (
                <Modal
                    title="Save Changes"
                    text="Apply changes to business settings?"
                    onClose={() => setShowSaveModal(false)}
                    onConfirm={updateBusiness}
                />
            )}

            {showDeactivateModal && (
                <Modal
                    title="Deactivate Business"
                    text="Business will become inaccessible."
                    onClose={() => setShowDeactivateModal(false)}
                    onConfirm={deactivateBusiness}
                    danger
                />
            )}

            {showDeleteModal && (
                <Modal
                    title="Delete Business"
                    text="This action permanently deletes all business data."
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={deleteBusiness}
                    danger
                />
            )}
        </>
    );
}

function Modal({ title, text, onClose, onConfirm, danger }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">

                <h2 className={`text-xl font-semibold ${danger ? "text-red-600" : ""}`}>
                    {title}
                </h2>

                <p className="text-gray-600 text-sm">
                    {text}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white ${
                            danger ? "bg-red-600" : "bg-blue-600"
                        }`}
                    >
                        Confirm
                    </button>
                </div>

            </div>
        </div>
    );
}