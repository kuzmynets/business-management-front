import { useContext, useEffect, useMemo, useState } from "react";
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

    const summary = useMemo(() => data?.summary || {}, [data]);
    const revenueRows = useMemo(() => data?.revenue || [], [data]);
    const maxRevenue = useMemo(
        () => Math.max(...revenueRows.map((row) => Math.abs(Number(row.amount || 0))), 1),
        [revenueRows]
    );
    const performance = useMemo(() => (data?.manager_performance || []).filter((person) => {
        if (roleFilter === "ALL") return true;
        return person.role === roleFilter;
    }), [data, roleFilter]);

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

    if (loading) {
        return (
            <div className="p-4 sm:p-6 text-sm sm:text-base">
                Завантаження...
            </div>
        );
    }

    if (subscriptionBlocked) {
        return (
            <>
                <Toolbar role={user.role} />
                <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
                    <div className="max-w-4xl mx-auto bg-white rounded shadow p-6 sm:p-10 text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold">Pro-аналітика</h1>
                        <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">
                            Розширені метрики продуктивності та фінансів
                        </p>

                        <a
                            href="/owner/subscribe"
                            className="
                                inline-flex items-center justify-center
                                mt-6 sm:mt-8
                                bg-blue-600 hover:bg-blue-700 text-white
                                px-4 sm:px-6 py-3
                                rounded
                                min-h-[44px]
                                w-full sm:w-auto
                            "
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
                <div className="p-4 sm:p-6 text-red-600 text-sm sm:text-base">
                    {error}
                </div>
            </>
        );
    }

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
                <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Аналітика</h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Фінанси та продуктивність
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <Metric title="Дохід" value={`$${money(summary.income)}`} />
                        <Metric title="Прибуток" value={`$${money(summary.profit)}`} />
                        <Metric title="Замовлення" value={`${summary.order_completion_rate || 0}%`} />
                        <Metric title="Задачі" value={`${summary.task_completion_rate || 0}%`} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <Metric title="Активні замовлення" value={summary.active_orders || 0} />
                        <Metric title="Активні задачі" value={summary.active_tasks || 0} />
                        <Metric title="Середній чек" value={`$${money(summary.avg_order_value)}`} />
                        <Metric title="Команда" value={summary.team_members || 0} />
                    </div>

                    <section className="bg-white rounded shadow p-4 sm:p-5 overflow-hidden">
                        <h2 className="text-base sm:text-lg font-semibold">Дохід</h2>

                        <div className="mt-4 space-y-3 overflow-x-auto">
                            {revenueRows.map((item) => (
                                <div
                                    key={item.month}
                                    className="grid grid-cols-[80px_1fr_80px] sm:grid-cols-[120px_1fr_120px] gap-2 sm:gap-3 items-center min-w-[320px]"
                                >
                                    <div className="text-sm font-medium">{item.month}</div>

                                    <div className="h-2 sm:h-3 bg-gray-100 rounded overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${barWidth(item.amount, maxRevenue)}%` }}
                                        />
                                    </div>

                                    <div className="text-right text-sm sm:text-base font-semibold">
                                        ${money(item.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                        <div className="bg-white rounded shadow p-4 sm:p-5">
                            <h2 className="text-base sm:text-lg font-semibold">Топ</h2>
                            <div className="mt-3 sm:mt-4 space-y-3">
                                {(data.top_performers || []).map((person) => (
                                    <Performer key={person.user_id} person={person} />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded shadow p-4 sm:p-5">
                            <h2 className="text-base sm:text-lg font-semibold">Вузькі місця</h2>
                            <div className="mt-3 sm:mt-4 space-y-3">
                                {(data.bottlenecks || []).map((item) => (
                                    <div key={item.status} className="flex justify-between border-b pb-2 text-sm">
                                        <span>{item.status}</span>
                                        <span className="font-semibold text-red-600">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </section>

                    <section className="bg-white rounded shadow p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <h2 className="text-base sm:text-lg font-semibold">Команда</h2>

                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="border px-3 py-2 rounded min-h-[44px] text-sm"
                            >
                                <option value="ALL">Усі</option>
                                <option value="MANAGER">Менеджери</option>
                                <option value="EMPLOYEE">Працівники</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5">
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
        <div className="bg-white rounded shadow p-4 sm:p-5">
            <div className="text-xs sm:text-sm text-gray-500">{title}</div>
            <div className="text-xl sm:text-2xl font-bold mt-2">{value}</div>
        </div>
    );
}

function Performer({ person, detailed }) {
    const score = Number(person.orders_completed || 0) + Number(person.tasks_completed || 0);

    return (
        <div className="border rounded p-3 sm:p-4">
            <div className="flex justify-between gap-3">
                <div className="min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate">
                        {person.name || "Unknown"}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                        {person.role}
                    </div>
                </div>
                <div className="text-lg sm:text-xl font-bold">
                    {score}
                </div>
            </div>

            {detailed && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 text-xs sm:text-sm">
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

function barWidth(amount, max) {
    return Math.max((Math.abs(Number(amount || 0)) / max) * 100, 4);
}