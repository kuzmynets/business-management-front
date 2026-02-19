import {useContext, useEffect, useState} from "react";
import TaskCard from "../../components/TaskCard";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";
import {AuthContext} from "../../contexts/AuthContext";

export default function EmployeeDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await apiRequest("/tasks/my");
            setTasks(data);
        } catch (err) {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await apiRequest(`/tasks/${taskId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus })
            });

            setTasks(prev =>
                prev.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
        } catch {
            setError("Failed to update status");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-2xl font-bold">My Tasks</h1>

                    {error && (
                        <div className="text-red-600">{error}</div>
                    )}

                    {tasks.length === 0 && (
                        <p className="text-gray-500">No tasks assigned</p>
                    )}

                    <div className="space-y-4">
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}