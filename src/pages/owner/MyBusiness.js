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
            setError("Не вдалося завантажити бізнес");
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
            setSuccess("Бізнес успішно оновлено");
            setShowSaveModal(false);

        } catch {
            setError("Не вдалося оновити бізнес");
        } finally {
            setSaving(false);
        }
    };

    const deleteBusiness = async () => {
        try {
            await apiRequest("/business", {
                method: "DELETE"
            });

            navigate("/");

        } catch {
            setError("Не вдалося видалити бізнес");
        }
    };

    if (loading) {
        return <div className="p-6">Завантаження...</div>;
    }

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-5xl mx-auto space-y-6">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Мій бізнес
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Керування профілем компанії
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
                                    Інформація про компанію
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Основні дані бізнесу
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
                                    Логотип
                                </div>
                            )}

                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    Назва компанії
                                </label>

                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-1">
                                    URL логотипа
                                </label>

                                <input
                                    value={form.logo_url}
                                    onChange={(e) =>
                                        setForm({ ...form, logo_url: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                        </div>

                        <div className="text-sm text-gray-500">
                            Зареєстровано:
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
                                    Підписка
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Поточний тариф бізнесу
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
                                        Оновити тариф
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
                            Зберегти зміни
                        </button>

                    </div>

                    {/* DANGER ZONE */}
                    <div className="bg-white border border-red-300 rounded-xl shadow p-6 space-y-5">

                        <div>
                            <h2 className="text-xl font-semibold text-red-600">
                                Небезпечна зона
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Ці дії неможливо скасувати
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Видалити бізнес
                            </button>

                        </div>

                    </div>

                </div>
            </div>

            {/* MODALS */}
            {showSaveModal && (
                <Modal
                    title="Збереження змін"
                    text="Застосувати зміни до налаштувань бізнесу?"
                    onClose={() => setShowSaveModal(false)}
                    onConfirm={updateBusiness}
                />
            )}

            {showDeleteModal && (
                <Modal
                    title="Видалення бізнесу"
                    text="Ця дія повністю видалить всі дані бізнесу."
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
                        Скасувати
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white ${
                            danger ? "bg-red-600" : "bg-blue-600"
                        }`}
                    >
                        Підтвердити
                    </button>
                </div>

            </div>
        </div>
    );
}