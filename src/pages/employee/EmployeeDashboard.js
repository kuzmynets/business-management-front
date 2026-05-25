import { useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../api/client";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function EmployeeDashboard() {
    const { user } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [tab, setTab] = useState("ACTIVE");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await apiRequest("/employee/tasks/my");
            setTasks(Array.isArray(data) ? data : []);
        } catch {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

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

    const renderTask = (task) => (
        <div key={task.id} className="bg-white p-4 rounded shadow space-y-3">

            <div className="flex justify-between">
                <div className="font-semibold">{task.title}</div>
                <div className="text-sm text-gray-500">{task.status}</div>
            </div>

            <div className="text-sm text-gray-600">
                {task.description || "No description"}
            </div>

            {task.deadline && (
                <div className="text-sm text-red-500">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                </div>
            )}

            <div className="flex gap-2">
                {task.status !== "IN_PROGRESS" && task.status !== "DONE" && (
                    <button
                        onClick={() => updateStatus(task.id, "IN_PROGRESS")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                    >
                        Start
                    </button>
                )}

                {task.status !== "PAUSED" && task.status !== "DONE" && (
                    <button
                        onClick={() => updateStatus(task.id, "PAUSED")}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                    >
                        Pause
                    </button>
                )}

                {task.status !== "DONE" && (
                    <button
                        onClick={() => updateStatus(task.id, "DONE")}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                        Complete
                    </button>
                )}
            </div>
        </div>
    );

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">My Tasks</h1>

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
                            Active
                        </button>

                        <button
                            onClick={() => setTab("DONE")}
                            className={`px-4 py-2 rounded ${
                                tab === "DONE"
                                    ? "bg-green-600 text-white"
                                    : "bg-white"
                            }`}
                        >
                            Completed
                        </button>
                    </div>

                    <div className="space-y-4">
                        {tab === "ACTIVE" &&
                            activeTasks.map(renderTask)
                        }

                        {tab === "DONE" &&
                            doneTasks.map(renderTask)
                        }
                    </div>

                </div>
            </div>
        </>
    );
}