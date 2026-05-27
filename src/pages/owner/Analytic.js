import { useContext, useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function Analytic() {
    const { user } = useContext(AuthContext);

    const [data, setData] = useState(null);
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [subscriptionBlocked, setSubscriptionBlocked] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const business = await apiRequest("/business");
            const subscription = business?.subscription_plan || business?.subscription || "BASIC";

            if (!subscription || subscription === "BASIC" || subscription === "FREE") {
                setSubscriptionBlocked(true);
                return;
            }

            setData(await apiRequest("/analytics"));
        } catch {
            setError("Не вдалося завантажити аналітику");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Завантаження...</div>;

    if (subscriptionBlocked) {
        return (
            <>
                <Toolbar role={user.role} />
                <div className="min-h-screen bg-gray-100 p-6">
                    <div className="max-w-4xl mx-auto bg-white rounded shadow p-10 text-center">
                        <h1 className="text-3xl font-bold">Pro-аналітика</h1>
                        <p className="text-gray-600 mt-4">
                            Отримайте прибутковість, completion rate, топ-виконавців,
                            вузькі місця процесів і динаміку доходу в одному екрані.
                        </p>
                        <a
                            href="/owner/subscribe"
                            className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
                        >
                            Оновити підписку
                        </a>
                    </div>
                </div>
            </>
        );
    }

    if (!data) {
        return (
            <>
                <Toolbar role={user.role} />
                <div className="p-6 text-red-600">{error}</div>
            </>
        );
    }

    const summary = data.summary || {};
    const performance = (data.manager_performance || []).filter((person) => {
        if (roleFilter === "ALL") return true;
        return person.role === roleFilter;
    });

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Аналітика</h1>
                        <p className="text-gray-500 mt-1">
                            Фінанси, продуктивність команди і місця, де бізнес втрачає темп
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        <Metric title="Дохід" value={`$${money(summary.income)}`} />
                        <Metric title="Прибуток" value={`$${money(summary.profit)}`} />
                        <Metric title="Виконання замовлень" value={`${summary.order_completion_rate || 0}%`} />
                        <Metric title="Виконання задач" value={`${summary.task_completion_rate || 0}%`} />
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        <Metric title="Активні замовлення" value={summary.active_orders || 0} />
                        <Metric title="Активні задачі" value={summary.active_tasks || 0} />
                        <Metric title="Середній чек" value={`$${money(summary.avg_order_value)}`} />
                        <Metric title="У команді" value={summary.team_members || 0} />
                    </div>

                    <section className="bg-white rounded shadow p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">Динаміка доходу</h2>
                                <p className="text-sm text-gray-500">Чистий рух грошей по місяцях</p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            {(data.revenue || []).map((item) => (
                                <div key={item.month} className="grid grid-cols-[120px_1fr_120px] gap-3 items-center">
                                    <div className="font-medium">{item.month}</div>
                                    <div className="h-3 bg-gray-100 rounded overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${barWidth(item.amount, data.revenue)}%` }}
                                        />
                                    </div>
                                    <div className="text-right font-semibold">${money(item.amount)}</div>
                                </div>
                            ))}
                            {(data.revenue || []).length === 0 && (
                                <div className="text-gray-500">Даних ще немає</div>
                            )}
                        </div>
                    </section>

                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded shadow p-5">
                            <h2 className="text-lg font-semibold">Топ-виконавці</h2>
                            <div className="mt-4 space-y-3">
                                {(data.top_performers || []).map((person) => (
                                    <Performer key={person.user_id} person={person} />
                                ))}
                                {(data.top_performers || []).length === 0 && (
                                    <div className="text-gray-500">Поки немає завершених робіт</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded shadow p-5">
                            <h2 className="text-lg font-semibold">Вузькі місця</h2>
                            <div className="mt-4 space-y-3">
                                {(data.bottlenecks || []).map((item) => (
                                    <div key={item.status} className="flex justify-between border-b pb-2">
                                        <span>{item.status}</span>
                                        <span className="font-semibold text-red-600">{item.count}</span>
                                    </div>
                                ))}
                                {(data.bottlenecks || []).length === 0 && (
                                    <div className="text-gray-500">Критичних затримок не видно</div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded shadow p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Командна ефективність</h2>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="border px-3 py-2 rounded"
                            >
                                <option value="ALL">Усі</option>
                                <option value="MANAGER">Менеджери</option>
                                <option value="EMPLOYEE">Працівники</option>
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-5">
                            {performance.map((person) => (
                                <Performer key={person.user_id} person={person} detailed />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function Metric({ title, value }) {
    return (
        <div className="bg-white rounded shadow p-5">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
    );
}

function Performer({ person, detailed }) {
    const score = Number(person.orders_completed || 0) + Number(person.tasks_completed || 0);
    return (
        <div className="border rounded p-4">
            <div className="flex justify-between gap-3">
                <div>
                    <div className="font-semibold">{person.name || "Unknown"}</div>
                    <div className="text-sm text-gray-500">{person.role}</div>
                </div>
                <div className="text-xl font-bold">{score}</div>
            </div>
            {detailed && (
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div>Замовлення: <b>{person.orders_completed}</b></div>
                    <div>Задачі: <b>{person.tasks_completed}</b></div>
                </div>
            )}
        </div>
    );
}

function money(value) {
    return Number(value || 0).toFixed(2);
}

function barWidth(amount, rows) {
    const max = Math.max(...(rows || []).map((row) => Math.abs(Number(row.amount || 0))), 1);
    return Math.max((Math.abs(Number(amount || 0)) / max) * 100, 4);
}
