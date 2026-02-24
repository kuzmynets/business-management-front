import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

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
        } catch (err) {
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = ["", "NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    <h1 className="text-2xl font-bold">Orders</h1>

                    {error && <div className="text-red-600">{error}</div>}

                    {/* FILTER */}
                    <div className="flex gap-2 items-center">
                        <label>Status:</label>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            {statusOptions.map(s => (
                                <option key={s} value={s}>{s || "All"}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchOrders}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                            Apply
                        </button>
                    </div>

                    {/* ORDERS LIST */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-gray-500">No orders found</div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div
                                    key={order.id}
                                    className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
                                    onClick={() => navigate(`/manager/orders/${order.id}`)}
                                >
                                    <div className="flex justify-between">
                                        <div className="font-semibold">{order.title}</div>
                                        <div className="text-sm text-gray-500">{order.status}</div>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Manager: {order.manager_email || "N/A"} | Deadline: {order.deadline || "—"}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Tasks: {order.tasks_count || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
