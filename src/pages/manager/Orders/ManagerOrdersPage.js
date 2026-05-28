import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiRequest } from "../../../api/client";
import Toolbar from "../../../components/Toolbar";
import { useNavigate } from "react-router-dom";

const STATUSES = [
    "NEW",
    "IN_PROGRESS",
    "REVIEW",
    "COMPLETED"
];

export default function ManagerOrders() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);

    const [title, setTitle] = useState("");
    const [clientId, setClientId] = useState("");
    const [newClient, setNewClient] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ordersData, clientsData] = await Promise.all([
                apiRequest("/orders"),
                apiRequest("/clients")
            ]);

            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setClients(Array.isArray(clientsData) ? clientsData : []);

        } catch {
            setError("Не вдалося завантажити дані");
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (e) => {
        e.preventDefault();

        try {
            const order = await apiRequest("/orders", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    client_id: clientId || null,
                    client_name: newClient || null,
                    budget,
                    deadline,
                    description
                })
            });

            setOrders(prev => [...prev, order]);

            setTitle("");
            setClientId("");
            setNewClient("");
            setBudget("");
            setDeadline("");
            setDescription("");

        } catch {
            setError("Не вдалося створити замовлення");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await apiRequest(`/orders/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status })
            });

            setOrders(prev =>
                prev.map(o => o.id === id ? { ...o, status } : o)
            );

        } catch {
            setError("Не вдалося оновити статус");
        }
    };

    if (loading) return <div className="p-6">Завантаження...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="p-6 bg-gray-100 min-h-screen space-y-6">

                <h1 className="text-2xl font-bold">
                    Замовлення
                </h1>

                {error && (
                    <div className="text-red-600">
                        {error}
                    </div>
                )}

                {/* CREATE ORDER */}
                <form
                    onSubmit={createOrder}
                    className="bg-white p-4 rounded shadow space-y-3"
                >

                    <h2 className="font-semibold">
                        Створити замовлення
                    </h2>

                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Назва"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />

                    <select
                        value={clientId}
                        onChange={e => setClientId(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">
                            Оберіть клієнта
                        </option>

                        {clients.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        value={newClient}
                        onChange={e => setNewClient(e.target.value)}
                        placeholder="Або новий клієнт"
                        className="w-full border px-3 py-2 rounded"
                    />

                    <input
                        type="number"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        placeholder="Бюджет"
                        className="w-full border px-3 py-2 rounded"
                    />

                    <input
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Опис"
                        className="w-full border px-3 py-2 rounded"
                    />

                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        Створити
                    </button>

                </form>

                {/* KANBAN */}
                <div className="grid grid-cols-4 gap-4">

                    {STATUSES.map(status => (
                        <div
                            key={status}
                            className="bg-gray-200 p-3 rounded"
                        >

                            <div className="font-semibold mb-3">
                                {status}
                            </div>

                            <div className="space-y-2">

                                {orders
                                    .filter(o => o.status === status)
                                    .map(order => (

                                        <div
                                            key={order.id}
                                            className="bg-white p-3 rounded shadow"
                                        >

                                            {/* CLICK AREA */}
                                            <div
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigate(`/manager/orders/${order.id}`)
                                                }
                                            >

                                                <div className="font-medium">
                                                    {order.title}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {order.client_name}
                                                </div>

                                            </div>

                                            {/* CONTROLS */}
                                            <div className="mt-2">

                                                <select
                                                    value={order.status}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(order.id, e.target.value);
                                                    }}
                                                    className="text-xs border rounded px-1"
                                                >

                                                    {STATUSES.map(s => (
                                                        <option key={s} value={s}>
                                                            {s}
                                                        </option>
                                                    ))}

                                                </select>

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </>
    );
}