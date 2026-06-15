import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../api/client";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function EmployeeDashboard() {
    const { user } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [tab, setTab] = useState("ACTIVE");

    const statusLabels = {
        NEW: "Нова",
        IN_PROGRESS: "В процесі",
        PAUSED: "Призупинено",
        DONE: "Завершено",
    };

    const fetchTasks = useCallback(async () => {
        try {
            const [data, managerData] = await Promise.all([
                apiRequest("/employee/tasks/my"),
                apiRequest("/employee/tasks/manager").catch(() => null),
            ]);

            setTasks(Array.isArray(data) ? data : []);
            setManager(managerData);

        } catch {
            setError("Не вдалося завантажити задачі");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const updateStatus = async (taskId, status) => {
        await apiRequest(`/employee/tasks/${taskId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });

        setTasks(prev =>
            prev.map(t =>
                t.id === taskId ? { ...t, status } : t
            )
        );
    };

    const activeTasks = useMemo(
        () => tasks.filter(t => t.status !== "DONE"),
        [tasks]
    );

    const doneTasks = useMemo(
        () => tasks.filter(t => t.status === "DONE"),
        [tasks]
    );

    const currentTask =
        activeTasks.find(t => t.status === "IN_PROGRESS") ||
        activeTasks[0];

    const renderTask = (task) => (
        <div
            key={task.id}
            className={`bg-white p-4 rounded shadow space-y-3 ${
                currentTask?.id === task.id
                    ? "border-l-4 border-blue-600"
                    : ""
            }`}
        >

            <div className="flex justify-between">

                <div className="font-semibold">
                    {task.title}
                </div>

                <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                        {statusLabels[task.status] || task.status}
                    </span>
                </div>

            </div>

            <div className="text-sm text-gray-600">
                {task.description || "Опис відсутній"}
            </div>

            {task.deadline && (
                <div className="text-sm text-red-500">
                    Дедлайн: {new Date(task.deadline).toLocaleDateString()}
                </div>
            )}

            <div className="flex gap-2">

                {task.status !== "IN_PROGRESS" &&
                    task.status !== "DONE" && (
                        <button
                            onClick={() =>
                                updateStatus(task.id, "IN_PROGRESS")
                            }
                            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                        >
                            Розпочати
                        </button>
                    )}

                {task.status !== "PAUSED" &&
                    task.status !== "DONE" && (
                        <button
                            onClick={() =>
                                updateStatus(task.id, "PAUSED")
                            }
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                        >
                            Пауза
                        </button>
                    )}

                {task.status !== "DONE" && (
                    <button
                        onClick={() =>
                            updateStatus(task.id, "DONE")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                        Завершити
                    </button>
                )}

            </div>

        </div>
    );

    if (loading) {
        return (
            <div className="p-6">
                Завантаження...
            </div>
        );
    }

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-5xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">
                        Мої задачі
                    </h1>

                    {manager && (
                        <div className="bg-white p-4 rounded shadow">

                            <div className="text-sm text-gray-500">
                                Ваш менеджер
                            </div>

                            <div className="font-semibold">
                                {manager.name || manager.email}
                            </div>

                            {manager.contacts && (
                                <div className="text-sm text-gray-600">
                                    {manager.contacts}
                                </div>
                            )}

                        </div>
                    )}

                    {error && (
                        <div className="text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2">

                        <button
                            onClick={() => setTab("ACTIVE")}
                            className={`px-4 py-2 rounded ${
                                tab === "ACTIVE"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white"
                            }`}
                        >
                            Активні
                        </button>

                        <button
                            onClick={() => setTab("DONE")}
                            className={`px-4 py-2 rounded ${
                                tab === "DONE"
                                    ? "bg-green-600 text-white"
                                    : "bg-white"
                            }`}
                        >
                            Завершені
                        </button>

                    </div>

                    <div className="space-y-4">

                        {tab === "ACTIVE" &&
                            activeTasks.map(renderTask)}

                        {tab === "DONE" &&
                            doneTasks.map(renderTask)}

                    </div>

                </div>

            </div>
        </>
    );
}
