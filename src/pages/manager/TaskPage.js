import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function TasksPage() {
    const { user } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Форма для створення задачі
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskProject, setNewTaskProject] = useState("");
    const [newTaskAssignee, setNewTaskAssignee] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tasksData, projectsData, employeesData] = await Promise.all([
                apiRequest("/tasks"),
                apiRequest("/projects"),
                apiRequest("/employees")
            ]);

            setTasks(Array.isArray(tasksData) ? tasksData : []);
            setProjects(Array.isArray(projectsData) ? projectsData : []);
            setEmployees(Array.isArray(employeesData) ? employeesData : []);

        } catch (err) {
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();

        try {
            const task = await apiRequest("/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title: newTaskTitle,
                    project_id: newTaskProject,
                    assigned_to: newTaskAssignee,
                    status: "NEW"
                })
            });

            setNewTaskTitle("");
            setNewTaskProject("");
            setNewTaskAssignee("");
            setTasks(prev => [...prev, task]);
        } catch {
            setError("Failed to create task");
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        try {
            await apiRequest(`/tasks/${taskId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus })
            });

            setTasks(prev =>
                prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
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
                <div className="max-w-5xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">Tasks</h1>
                    {error && <div className="text-red-600">{error}</div>}

                    {/* CREATE TASK */}
                    <form onSubmit={createTask} className="bg-white p-4 rounded shadow space-y-3">
                        <h2 className="font-semibold">Create New Task</h2>
                        <input
                            type="text"
                            placeholder="Task title"
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <select
                            value={newTaskProject}
                            onChange={e => setNewTaskProject(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Select project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                        <select
                            value={newTaskAssignee}
                            onChange={e => setNewTaskAssignee(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Assign to employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.email}</option>
                            ))}
                        </select>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            Create Task
                        </button>
                    </form>

                    {/* TASK LIST */}
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{task.title}</div>
                                    <div className="text-sm text-gray-500">
                                        Project: {task.project_title} | Assigned: {task.assigned_email}
                                    </div>
                                </div>
                                <select
                                    value={task.status}
                                    onChange={e => updateStatus(task.id, e.target.value)}
                                    className="border px-2 py-1 rounded"
                                >
                                    <option value="NEW">New</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}