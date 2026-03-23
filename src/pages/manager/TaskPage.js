import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function TasksPage() {
    const { user } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("");
    const [orderFilter, setOrderFilter] = useState("");
    const [assigneeFilter, setAssigneeFilter] = useState("");

    const emptyForm = {
        title: "",
        description: "",
        order_id: "",
        assigned_to: "",
        status: "NEW",
        deadline: ""
    };

    const [form, setForm] = useState(emptyForm);
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadData();
    }, [statusFilter, orderFilter, assigneeFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            let query = [];
            if (statusFilter) query.push(`status=${statusFilter}`);
            if (orderFilter) query.push(`order_id=${orderFilter}`);
            if (assigneeFilter) query.push(`assigned_to=${assigneeFilter}`);

            const queryString = query.length ? `?${query.join("&")}` : "";

            const [tasksData, ordersData, employeesData] = await Promise.all([
                apiRequest(`/tasks${queryString}`),
                apiRequest("/orders"),
                apiRequest("/employees")
            ]);

            setTasks(Array.isArray(tasksData) ? tasksData : []);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setEmployees(Array.isArray(employeesData) ? employeesData : []);
        } catch {
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveTask = async () => {
        try {
            if (editingTask) {
                await apiRequest(`/tasks/${editingTask.id}`, {
                    method: "PUT",
                    body: JSON.stringify(form)
                });
            } else {
                await apiRequest("/tasks", {
                    method: "POST",
                    body: JSON.stringify(form)
                });
            }

            setForm(emptyForm);
            setEditingTask(null);
            setShowForm(false);
            loadData();
        } catch {
            setError("Failed to save task");
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setForm({
            title: task.title || "",
            description: task.description || "",
            order_id: task.order_id || "",
            assigned_to: task.assigned_to || "",
            status: task.status || "NEW",
            deadline: task.deadline || ""
        });
        setShowForm(true);
    };

    const updateStatus = async (taskId, status) => {
        try {
            await apiRequest(`/tasks/${taskId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status })
            });
            loadData();
        } catch {
            setError("Failed to update status");
        }
    };

    const statusOptions = ["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-6xl mx-auto space-y-6">

                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Tasks Management</h1>
                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setForm(emptyForm);
                                setShowForm(true);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Create Task
                        </button>
                    </div>

                    {error && <div className="text-red-600">{error}</div>}

                    {/* FILTERS */}
                    <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded shadow">

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border px-2 py-2 rounded"
                        >
                            <option value="">All Statuses</option>
                            {statusOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <select
                            value={orderFilter}
                            onChange={(e) => setOrderFilter(e.target.value)}
                            className="border px-2 py-2 rounded"
                        >
                            <option value="">All Orders</option>
                            {orders.map(o => (
                                <option key={o.id} value={o.id}>{o.title}</option>
                            ))}
                        </select>

                        <select
                            value={assigneeFilter}
                            onChange={(e) => setAssigneeFilter(e.target.value)}
                            className="border px-2 py-2 rounded"
                        >
                            <option value="">All Employees</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.email}</option>
                            ))}
                        </select>

                    </div>

                    {/* FORM */}
                    {showForm && (
                        <div className="bg-white p-6 rounded shadow space-y-4">

                            <input
                                name="title"
                                placeholder="Task title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />

                            <select
                                name="order_id"
                                value={form.order_id}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select Order</option>
                                {orders.map(o => (
                                    <option key={o.id} value={o.id}>{o.title}</option>
                                ))}
                            </select>

                            <select
                                name="assigned_to"
                                value={form.assigned_to}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Assign to Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.email}</option>
                                ))}
                            </select>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            >
                                {statusOptions.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            <input
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={saveTask}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    )}

                    {/* LIST */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : tasks.length === 0 ? (
                        <div className="text-gray-500">No tasks</div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map(task => (
                                <div key={task.id} className="bg-white p-5 rounded shadow">

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold">{task.title}</div>
                                            <div className="text-sm text-gray-500">
                                                Order: {task.order_title || "—"} |
                                                Assigned: {task.assigned_email || "—"}
                                            </div>
                                        </div>

                                        <select
                                            value={task.status}
                                            onChange={(e) =>
                                                updateStatus(task.id, e.target.value)
                                            }
                                            className="border px-2 py-1 rounded"
                                        >
                                            {statusOptions.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-sm text-gray-600 mt-2">
                                        Deadline: {task.deadline || "—"}
                                    </div>

                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="mt-3 bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}