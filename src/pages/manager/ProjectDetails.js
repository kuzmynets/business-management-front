import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../../api/client";

export default function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const projectData = await apiRequest(`/projects/${id}`);
        const taskData = await apiRequest(`/projects/${id}/tasks`);
        const employeeData = await apiRequest("/employees");

        setProject(projectData);
        setTasks(taskData);
        setEmployees(employeeData);
    };

    const createTask = async (e) => {
        e.preventDefault();

        const task = await apiRequest("/tasks", {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
                project_id: id,
                assigned_to: assignedTo
            })
        });

        setTasks(prev => [...prev, task]);
        setTitle("");
        setDescription("");
        setAssignedTo("");
    };

    if (!project) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">{project.title}</h1>

            <form onSubmit={createTask} className="space-y-3 bg-white p-4 rounded shadow">
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Task title"
                    className="border px-3 py-2 rounded w-full"
                    required
                />

                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Task description"
                    className="border px-3 py-2 rounded w-full"
                />

                <select
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    required
                >
                    <option value="">Assign employee</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.email}
                        </option>
                    ))}
                </select>

                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Create Task
                </button>
            </form>

            <div className="space-y-3">
                {tasks.map(task => (
                    <div key={task.id} className="bg-white p-4 shadow rounded">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-gray-600">{task.description}</div>
                        <div className="text-xs text-gray-500">
                            Assigned to: {task.assigned_email}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
