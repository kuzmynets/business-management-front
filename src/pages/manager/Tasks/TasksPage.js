import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiRequest } from "../../../api/client";
import Toolbar from "../../../components/Toolbar";
import { useNavigate } from "react-router-dom";

export default function ManagerTasksPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [assigneeFilter, setAssigneeFilter] = useState("");

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [tasksData, employeesData] = await Promise.all([
                apiRequest("/tasks"),
                apiRequest("/employees")
            ]);

            setTasks(Array.isArray(tasksData) ? tasksData : []);
            setEmployees(Array.isArray(employeesData) ? employeesData : []);
        } catch {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch =
            t.title?.toLowerCase().includes(search.toLowerCase()) ||
            t.order_title?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter ? t.status === statusFilter : true;

        const matchesAssignee = assigneeFilter
            ? String(t.assigned_to) === assigneeFilter
            : true;

        return matchesSearch && matchesStatus && matchesAssignee;
    });

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-6xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">Tasks</h1>

                    {error && <div className="text-red-600">{error}</div>}

                    {/* FILTERS */}
                    <div className="bg-white p-4 rounded shadow flex gap-3 flex-wrap">

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="border px-3 py-2 rounded flex-1 min-w-[200px]"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">All statuses</option>
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="DONE">Done</option>
                        </select>

                        <select
                            value={assigneeFilter}
                            onChange={(e) => setAssigneeFilter(e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">All employees</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>
                                    {e.email}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* LIST */}
                    <div className="space-y-3">
                        {filteredTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => navigate(`/manager/tasks/${task.id}`)}
                                className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <div className="font-semibold">
                                            {task.title}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Order: {task.order_title || "—"}
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {task.status}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredTasks.length === 0 && (
                            <div className="text-gray-500 text-sm">
                                No tasks found
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}