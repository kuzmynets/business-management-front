import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function OrdersPage() {
    const { user } = useContext(AuthContext);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    const emptyForm = {
        title: "",
        description: "",
        status: "NEW",
        deadline: "",
        client_name: ""
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let url = "/orders";
            if (statusFilter) url += `?status=${statusFilter}`;
            const data = await apiRequest(url);
            setOrders(Array.isArray(data) ? data : []);
        } catch {
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateOrUpdate = async () => {
        try {
            if (editingOrder) {
                await apiRequest(`/orders/${editingOrder.id}`, {
                    method: "PUT",
                    body: JSON.stringify(form)
                });
            } else {
                await apiRequest("/orders", {
                    method: "POST",
                    body: JSON.stringify(form)
                });
            }

            setForm(emptyForm);
            setEditingOrder(null);
            setShowForm(false);
            fetchOrders();
        } catch {
            setError("Failed to save order");
        }
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setForm({
            title: order.title || "",
            description: order.description || "",
            status: order.status || "NEW",
            deadline: order.deadline || "",
            client_name: order.client_name || ""
        });
        setShowForm(true);
    };

    const handleStatusChange = async (id, status) => {
        try {
            await apiRequest(`/orders/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status })
            });
            fetchOrders();
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
                        <h1 className="text-2xl font-bold">Orders Management</h1>
                        <button
                            onClick={() => {
                                setForm(emptyForm);
                                setEditingOrder(null);
                                setShowForm(true);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Create Order
                        </button>
                    </div>

                    {error && <div className="text-red-600">{error}</div>}

                    {/* FILTER */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="">All statuses</option>
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    {/* FORM */}
                    {showForm && (
                        <div className="bg-white p-6 rounded-xl shadow space-y-4">

                            <input
                                name="title"
                                placeholder="Title"
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

                            <input
                                name="client_name"
                                placeholder="Client name"
                                value={form.client_name}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />

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
                                    onClick={handleCreateOrUpdate}
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
                    ) : orders.length === 0 ? (
                        <div className="text-gray-500">No orders</div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-white p-5 rounded shadow">

                                    <div className="flex justify-between">
                                        <div>
                                            <div className="font-semibold text-lg">{order.title}</div>
                                            <div className="text-sm text-gray-500">
                                                Client: {order.client_name || "—"}
                                            </div>
                                        </div>

                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order.id, e.target.value)
                                            }
                                            className="border px-2 py-1 rounded"
                                        >
                                            {statusOptions.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Deadline: {order.deadline || "—"}
                                    </div>

                                    <button
                                        onClick={() => handleEdit(order)}
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