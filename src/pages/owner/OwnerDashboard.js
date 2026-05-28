import { useContext, useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function OwnerDashboard() {
    const { user } = useContext(AuthContext);

    const [data, setData] = useState({
        revenue: 0,
        profit: 0,
        active_orders: 0,
        team_members: 0,
        businesses_count: 0,
        orders: [],
        tasks: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await apiRequest("/dashboard");
            setData({
                revenue: res?.revenue ?? 0,
                profit: res?.profit ?? 0,
                active_orders: res?.active_orders ?? 0,
                team_members: res?.team_members ?? 0,
                businesses_count: res?.businesses_count ?? 0,
                orders: Array.isArray(res?.orders) ? res.orders : [],
                tasks: Array.isArray(res?.tasks) ? res.tasks : [],
            });
        } catch {
            setError("Не вдалося завантажити дашборд");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Завантаження...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">Панель власника</h1>
                        <p className="text-gray-500 mt-1">
                            Замовлення, задачі, команда і фінансовий стан поточного бізнесу
                        </p>
                    </div>

                    {error && <div className="text-red-600">{error}</div>}

                    <div className="grid md:grid-cols-5 gap-4">
                        <Card title="Дохід" value={`$${Number(data.revenue || 0).toFixed(2)}`} />
                        <Card title="Прибуток" value={`$${Number(data.profit || 0).toFixed(2)}`} />
                        <Card title="Активні замовлення" value={data.active_orders} />
                        <Card title="Команда" value={data.team_members} />
                        <Card title="Бізнеси" value={data.businesses_count} />
                    </div>

                    <section className="bg-white rounded shadow overflow-hidden">
                        <div className="p-5 border-b">
                            <h2 className="text-lg font-semibold">Замовлення</h2>
                            <p className="text-sm text-gray-500">Хто створив, поточний стан і хто завершив</p>
                        </div>

                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Назва</th>
                                <th className="p-3 text-left">Клієнт</th>
                                <th className="p-3 text-left">Статус</th>
                                <th className="p-3 text-left">Створив</th>
                                <th className="p-3 text-left">Завершив</th>
                                <th className="p-3 text-left">Бюджет</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="p-3 font-medium">{order.title || "-"}</td>
                                    <td className="p-3">{order.client_name || "-"}</td>
                                    <td className="p-3"><Badge value={order.status} /></td>
                                    <td className="p-3">{order.created_by_name || "-"}</td>
                                    <td className="p-3">{order.completed_by_name || "-"}</td>
                                    <td className="p-3">${Number(order.budget || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                            {data.orders.length === 0 && (
                                <tr><td className="p-6 text-gray-500" colSpan="6">Замовлень поки немає</td></tr>
                            )}
                            </tbody>
                        </table>
                    </section>

                    <section className="bg-white rounded shadow overflow-hidden">
                        <div className="p-5 border-b">
                            <h2 className="text-lg font-semibold">Задачі</h2>
                            <p className="text-sm text-gray-500">Хто призначив і кому призначено</p>
                        </div>

                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Задача</th>
                                <th className="p-3 text-left">Замовлення</th>
                                <th className="p-3 text-left">Статус</th>
                                <th className="p-3 text-left">Працівник</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.tasks.map((task) => (
                                <tr key={task.id} className="border-t">
                                    <td className="p-3 font-medium">{task.title || "-"}</td>
                                    <td className="p-3">{task.order_title || "-"}</td>
                                    <td className="p-3"><Badge value={task.status} /></td>
                                    <td className="p-3">{task.assigned_to_name || "-"}</td>
                                </tr>
                            ))}
                            {data.tasks.length === 0 && (
                                <tr><td className="p-6 text-gray-500" colSpan="6">Задач поки немає</td></tr>
                            )}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white p-5 rounded shadow">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
    );
}

function Badge({ value }) {
    return (
        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
            {value || "-"}
        </span>
    );
}
