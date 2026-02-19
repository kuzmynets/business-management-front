import {useContext, useEffect, useState} from "react";
import { apiRequest } from "../../api/client";
import {AuthContext} from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function EmployeeDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await apiRequest("/tasks/my");
            setTasks(data);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (taskId, status) => {
        await apiRequest(`/tasks/${taskId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });

        setTasks(prev =>
            prev.map(t =>
                t.id === taskId ? { ...t, status } : t
            )
        );
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-semibold">My Tasks</h1>

                {tasks.length === 0 && (
                    <p>No tasks assigned</p>
                )}

                {tasks.map(task => (
                    <div
                        key={task.id}
                        className="bg-white shadow rounded p-4 space-y-2"
                    >
                        <div className="flex justify-between">
                            <h2 className="font-medium">{task.title}</h2>
                            <span className="text-sm text-gray-500">
                  {task.status}
                </span>
                        </div>

                        <p className="text-sm text-gray-600">
                            {task.description}
                        </p>

                        {task.deadline && (
                            <p className="text-sm text-red-500">
                                Deadline: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => updateStatus(task.id, "in_progress")}
                                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                            >
                                In Progress
                            </button>

                            <button
                                onClick={() => updateStatus(task.id, "done")}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}