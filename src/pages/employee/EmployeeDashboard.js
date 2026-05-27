import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../api/client";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";
import { useTranslation } from "react-i18next";

export default function EmployeeDashboard() {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const [tasks, setTasks] = useState([]);
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [tab, setTab] = useState("ACTIVE");

    const fetchTasks = useCallback(async () => {
        try {
            const [data, managerData] = await Promise.all([
                apiRequest("/employee/tasks/my"),
                apiRequest("/employee/tasks/manager").catch(() => null),
            ]);
            setTasks(Array.isArray(data) ? data : []);
            setManager(managerData);
        } catch {
            setError(t("failed_load_tasks"));
        } finally {
            setLoading(false);
        }
    }, [t]);

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

    const currentTask = activeTasks.find(t => t.status === "IN_PROGRESS") || activeTasks[0];

    const renderTask = (task) => (
        <div
            key={task.id}
            className={`bg-white p-4 rounded shadow space-y-3 ${
                currentTask?.id === task.id ? "border-l-4 border-blue-600" : ""
            }`}
        >

            <div className="flex justify-between">
                <div className="font-semibold">{task.title}</div>
                <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                        {task.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${priorityClass(task.priority)}`}>
                        {task.priority || "MEDIUM"}
                    </span>
                </div>
            </div>

            <div className="text-sm text-gray-600">
                {task.description || t("no_description")}
            </div>

            {task.deadline && (
                <div className="text-sm text-red-500">
                    {t("deadline")}: {new Date(task.deadline).toLocaleDateString()}
                </div>
            )}

            <div className="flex gap-2">

                {task.status !== "IN_PROGRESS" && task.status !== "DONE" && (
                    <button
                        onClick={() => updateStatus(task.id, "IN_PROGRESS")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                    >
                        {t("start")}
                    </button>
                )}

                {task.status !== "PAUSED" && task.status !== "DONE" && (
                    <button
                        onClick={() => updateStatus(task.id, "PAUSED")}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                    >
                        {t("pause")}
                    </button>
                )}

                {task.status !== "DONE" && (
                    <button
                        onClick={() => updateStatus(task.id, "DONE")}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                        {t("complete")}
                    </button>
                )}

            </div>
        </div>
    );

    if (loading) return <div className="p-6">{t("loading")}</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">
                        {t("my_tasks")}
                    </h1>

                    {manager && (
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-sm text-gray-500">Ваш менеджер</div>
                            <div className="font-semibold">{manager.name || manager.email}</div>
                            <div className="text-sm text-gray-600">{manager.email}</div>
                            <div className="text-sm text-gray-600">{manager.role}</div>
                            {manager.contacts && (
                                <div className="text-sm text-gray-600">{manager.contacts}</div>
                            )}
                        </div>
                    )}

                    {error && <div className="text-red-600">{error}</div>}

                    <div className="flex gap-2">

                        <button
                            onClick={() => setTab("ACTIVE")}
                            className={`px-4 py-2 rounded ${
                                tab === "ACTIVE"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white"
                            }`}
                        >
                            {t("active")}
                        </button>

                        <button
                            onClick={() => setTab("DONE")}
                            className={`px-4 py-2 rounded ${
                                tab === "DONE"
                                    ? "bg-green-600 text-white"
                                    : "bg-white"
                            }`}
                        >
                            {t("completed")}
                        </button>

                    </div>

                    <div className="space-y-4">
                        {tab === "ACTIVE" && activeTasks.map(renderTask)}
                        {tab === "DONE" && doneTasks.map(renderTask)}
                    </div>

                </div>
            </div>
        </>
    );
}

function priorityClass(priority) {
    return {
        HIGH: "bg-red-100 text-red-700",
        MEDIUM: "bg-yellow-100 text-yellow-700",
        LOW: "bg-green-100 text-green-700",
    }[priority] || "bg-gray-100 text-gray-700";
}
