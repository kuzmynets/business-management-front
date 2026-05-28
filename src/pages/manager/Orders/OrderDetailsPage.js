import { useContext, useEffect, useState } from "react";
import { apiRequest } from "../../../api/client";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "../../../components/Toolbar";
import { AuthContext } from "../../../contexts/AuthContext";

export default function OrderDetails() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [original, setOriginal] = useState(null);

    const [taskTitle, setTaskTitle] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        status: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            const data = await apiRequest(`/orders/${id}`);

            setOrder(data);
            setOriginal(data);

            setForm({
                title: data.title || "",
                description: data.description || "",
                budget: data.budget || "",
                deadline: data.deadline || "",
                status: data.status || ""
            });
        } catch {
            setError("Не вдалося завантажити замовлення");
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = () => {
        if (!original) return false;

        return (
            form.title !== (original.title || "") ||
            form.description !== (original.description || "") ||
            form.budget !== (original.budget || "") ||
            form.deadline !== (original.deadline || "") ||
            form.status !== (original.status || "")
        );
    };

    const requestSave = () => {
        if (!hasChanges()) return;
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setSaving(true);

        try {
            await apiRequest(`/orders/${id}`, {
                method: "PATCH",
                body: JSON.stringify(form)
            });

            setOrder(prev => ({ ...prev, ...form }));
            setOriginal(prev => ({ ...prev, ...form }));
        } catch {
            setError("Не вдалося зберегти зміни");
        } finally {
            setSaving(false);
            setShowConfirm(false);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();

        try {
            const task = await apiRequest("/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title: taskTitle,
                    order_id: id
                })
            });

            setOrder(prev => ({
                ...prev,
                tasks: [...(prev.tasks || []), task]
            }));

            setTaskTitle("");
        } catch {
            setError("Не вдалося створити задачу");
        }
    };

    if (loading) {
        return <div className="p-6">Завантаження...</div>;
    }

    if (!order) {
        return <div className="p-6">Замовлення не знайдено</div>;
    }

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-4xl mx-auto space-y-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center">

                        <h1 className="text-2xl font-bold">
                            Деталі замовлення
                        </h1>

                        <div className="flex gap-2">

                            <button
                                onClick={() => navigate("/manager/orders")}
                                className="px-4 py-2 border rounded"
                            >
                                Назад
                            </button>

                            <button
                                onClick={requestSave}
                                disabled={!hasChanges() || saving}
                                className={`px-4 py-2 rounded text-white ${
                                    hasChanges()
                                        ? "bg-blue-600"
                                        : "bg-gray-400"
                                }`}
                            >
                                Зберегти зміни
                            </button>

                        </div>

                    </div>

                    {error && (
                        <div className="text-red-600">
                            {error}
                        </div>
                    )}

                    {/* FORM */}
                    <div className="bg-white p-4 rounded-xl shadow space-y-4">

                        <div>
                            <div className="text-sm text-gray-600">
                                Назва
                            </div>

                            <input
                                value={form.title}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        title: e.target.value
                                    })
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        <div>
                            <div className="text-sm text-gray-600">
                                Опис
                            </div>

                            <textarea
                                value={form.description}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        description: e.target.value
                                    })
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        <div>
                            <div className="text-sm text-gray-600">
                                Бюджет
                            </div>

                            <input
                                type="number"
                                value={form.budget}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        budget: e.target.value
                                    })
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        <div>
                            <div className="text-sm text-gray-600">
                                Дедлайн
                            </div>

                            <input
                                type="date"
                                value={form.deadline}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        deadline: e.target.value
                                    })
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        <div>
                            <div className="text-sm text-gray-600">
                                Статус
                            </div>

                            <select
                                value={form.status}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        status: e.target.value
                                    })
                                }
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="NEW">
                                    NEW
                                </option>

                                <option value="IN_PROGRESS">
                                    IN PROGRESS
                                </option>

                                <option value="REVIEW">
                                    REVIEW
                                </option>

                                <option value="COMPLETED">
                                    COMPLETED
                                </option>
                            </select>
                        </div>

                        {/* CLIENT */}
                        <div>

                            <div className="text-sm text-gray-600">
                                Клієнт
                            </div>

                            <input
                                value={order.client_name || "—"}
                                disabled
                                className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                            />

                        </div>

                    </div>

                    {/* TASKS */}
                    <div className="bg-white p-4 rounded-xl shadow space-y-3">

                        <h2 className="font-semibold">
                            Задачі
                        </h2>

                        <div className="space-y-2">

                            {(order.tasks || []).map(t => (
                                <div
                                    key={t.id}
                                    className="border rounded p-2 text-sm"
                                >
                                    {t.title} — {t.status}
                                </div>
                            ))}

                        </div>

                        <form
                            onSubmit={createTask}
                            className="flex gap-2"
                        >

                            <input
                                value={taskTitle}
                                onChange={e => setTaskTitle(e.target.value)}
                                placeholder="Нова задача"
                                className="flex-1 border px-3 py-2 rounded"
                                required
                            />

                            <button className="bg-blue-600 text-white px-4 rounded">
                                Додати
                            </button>

                        </form>

                    </div>

                </div>

            </div>

            {/* CONFIRM MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-80 space-y-4">

                        <div className="font-semibold text-lg">
                            Підтвердження змін
                        </div>

                        <div className="text-sm text-gray-600">
                            Застосувати зміни до цього замовлення?
                        </div>

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-1 border rounded"
                            >
                                Скасувати
                            </button>

                            <button
                                onClick={confirmSave}
                                disabled={saving}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Підтвердити
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}