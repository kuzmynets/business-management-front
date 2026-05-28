import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiRequest } from "../../../api/client";
import Toolbar from "../../../components/Toolbar";

export default function TaskDetailsPage() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "",
        assigned_to: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [taskData, employeesData] = await Promise.all([
                apiRequest(`/tasks/${id}`),
                apiRequest("/employees")
            ]);

            setTask(taskData);
            setEmployees(Array.isArray(employeesData) ? employeesData : []);

            setForm({
                title: taskData?.title || "",
                description: taskData?.description || "",
                status: taskData?.status || "NEW",
                assigned_to: taskData?.assigned_to || ""
            });

        } catch {
            setError("Не вдалося завантажити завдання");
            setTask(null);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = useMemo(() => {
        if (!task) return false;

        return (
            form.title !== (task.title || "") ||
            (form.description || "") !== (task.description || "") ||
            form.status !== (task.status || "") ||
            (form.assigned_to || "") !== (task.assigned_to || "")
        );
    }, [form, task]);

    const buildPayload = () => {
        const payload = {};

        if (form.title !== task.title) payload.title = form.title;
        if ((form.description || "") !== (task.description || "")) payload.description = form.description;
        if (form.status !== task.status) payload.status = form.status;
        if ((form.assigned_to || "") !== (task.assigned_to || "")) payload.assigned_to = form.assigned_to;

        return payload;
    };

    const updateTask = async () => {
        const payload = buildPayload();

        await apiRequest(`/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });

        navigate("/manager/tasks");
    };

    const handleSaveClick = () => {
        if (!hasChanges) return;
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setShowConfirm(false);
        await updateTask();
    };

    if (loading) return <div className="p-6">Завантаження...</div>;
    if (!task) return <div className="p-6">Завдання не знайдено</div>;

    const disableSave = !hasChanges;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">Деталі завдання</h1>

                    {error && <div className="text-red-600">{error}</div>}

                    <div className="bg-white p-4 rounded shadow">
                        <label className="text-sm text-gray-500">Назва</label>
                        <input
                            className="w-full border px-3 py-2 rounded mt-1"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <label className="text-sm text-gray-500">Опис</label>
                        <textarea
                            className="w-full border px-3 py-2 rounded mt-1"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <label className="text-sm text-gray-500">Статус</label>
                        <select
                            className="w-full border px-3 py-2 rounded mt-1"
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="NEW">NEW</option>
                            <option value="IN_PROGRESS">IN-PROGRESS</option>
                            <option value="PAUSED">PAUSED</option>
                            <option value="DONE">DONE</option>
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <label className="text-sm text-gray-500">Виконавець</label>
                        <select
                            className="w-full border px-3 py-2 rounded mt-1"
                            value={form.assigned_to}
                            onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                        >
                            <option value="">Не призначено</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => navigate("/manager/tasks")}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Назад
                        </button>

                        <button
                            disabled={disableSave}
                            onClick={handleSaveClick}
                            className={`px-4 py-2 rounded text-white ${
                                disableSave
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600"
                            }`}
                        >
                            Зберегти зміни
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow w-96 space-y-4">

                        <div className="text-lg font-semibold">
                            Підтвердження
                        </div>

                        <div className="text-sm text-gray-600">
                            Застосувати зміни до цього завдання?
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-2 bg-gray-300 rounded"
                            >
                                Скасувати
                            </button>

                            <button
                                onClick={confirmSave}
                                className="px-3 py-2 bg-blue-600 text-white rounded"
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