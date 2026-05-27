import { useEffect, useState, useContext } from "react";
import { apiRequest } from "../../api/client";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../components/Toolbar";
import { AuthContext } from "../../contexts/AuthContext";

export default function ManagerDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await apiRequest("/manager/dashboard");
            setData(res);
        } catch {
            setError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    if (!data) {
        return (
            <>
                <Toolbar role={user.role} />
                <div className="p-6 text-red-600">{error}</div>
            </>
        );
    }

    const criticalIssues = [
        ...(data.overdue_orders || []).map(x => ({ ...x, type: "order" })),
        ...(data.overdue_tasks || []).map(x => ({ ...x, type: "task" })),
        ...(data.problem_orders || []).map(x => ({ ...x, type: "order" }))
    ];

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">Панель менеджера</h1>

                    {error && <div className="text-red-600">{error}</div>}

                    <div className="grid md:grid-cols-4 gap-4">
                        <Stat title="Завершено сьогодні" value={data.completed_today || 0} />
                        <Stat title="У роботі" value={data.in_progress || 0} />
                        <Stat title="Працівники" value={data.employees_count || 0} />
                        <Stat title="Активні замовлення" value={data.active_orders?.length || 0} />
                    </div>

                    {/* CRITICAL */}
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
                        <h2 className="text-lg font-semibold text-red-600 mb-4">
                            Критичні ситуації
                        </h2>

                        {criticalIssues.length === 0 ? (
                            <div className="text-gray-500 text-sm">Критичних ситуацій немає</div>
                        ) : (
                            <div className="space-y-3">
                                {criticalIssues.map(item => (
                                    <div
                                        key={item.id + item.type}
                                        onClick={() =>
                                            navigate(
                                                item.type === "task"
                                                    ? `/manager/tasks/${item.id}`
                                                    : `/manager/orders/${item.id}`
                                            )
                                        }
                                        className="p-4 border border-red-200 rounded cursor-pointer hover:shadow"
                                    >
                                        <div className="font-medium">
                                            {item.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {item.type.toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ACTIVE WORK */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Активні операції
                        </h2>

                        <div className="grid md:grid-cols-2 gap-3">

                            {(data.active_orders || []).map(o => (
                                <div
                                    key={o.id}
                                    onClick={() => navigate(`/manager/orders/${o.id}`)}
                                    className="p-4 border rounded cursor-pointer hover:shadow"
                                >
                                    <div className="font-medium">{o.title}</div>
                                    <div className="text-sm text-gray-500">Order</div>
                                </div>
                            ))}

                            {(data.team_tasks || []).map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => navigate(`/manager/tasks/${t.id}`)}
                                    className="p-4 border rounded cursor-pointer hover:shadow"
                                >
                                    <div className="font-medium">{t.title}</div>
                                    <div className="text-sm text-gray-500">Task</div>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* QUICK STATUS */}
                    <div className="bg-white p-6 rounded-xl shadow grid grid-cols-3 gap-4 text-center">

                        <div>
                            <div className="text-xl font-bold">
                                {data.active_orders?.length || 0}
                            </div>
                                    <div className="text-sm text-gray-500">Активні замовлення</div>
                        </div>

                        <div>
                            <div className="text-xl font-bold text-red-600">
                                {criticalIssues.length}
                            </div>
                            <div className="text-sm text-gray-500">Критичні</div>
                        </div>

                        <div>
                            <div className="text-xl font-bold">
                                {data.team_tasks?.length || 0}
                            </div>
                            <div className="text-sm text-gray-500">Задачі</div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

function Stat({ title, value }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}
