import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function OrdersPage() {
    const { user } = useContext(AuthContext);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await apiRequest(`/orders?business_id=${user.businessId}`);
            setOrders(Array.isArray(data) ? data : []);
        } catch {
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    <h1 className="text-2xl font-bold">Orders</h1>
                    {error && <div className="text-red-600">{error}</div>}

                    {orders.length === 0 ? (
                        <p className="text-gray-500">No orders found</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div
                                    key={order.id}
                                    className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between">
                                        <div className="font-semibold">{order.title}</div>
                                        <div className="text-sm text-gray-500">{order.status}</div>
                                    </div>

                                    <div className="text-sm text-gray-500 mt-1">
                                        Manager: {order.manager_email || "N/A"} | Client: {order.client_name || "—"} | Deadline: {order.deadline || "—"}
                                    </div>

                                    <div className="text-sm text-gray-500 mt-1">
                                        Final Result: {order.final_result || "—"}
                                    </div>

                                    {order.tasks?.length > 0 && (
                                        <div className="mt-2 text-sm text-gray-400">
                                            <strong>Tasks:</strong>
                                            <ul className="ml-4 list-disc">
                                                {order.tasks.map(task => (
                                                    <li key={task.id}>
                                                        {task.title} – {task.assigned_email || "Unassigned"} – {task.status}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}