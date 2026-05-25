import { useEffect, useState, useContext } from "react";
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

            const subscription =
                business?.subscription_plan ||
                business?.subscription ||
                "BASIC";

            if (!subscription || subscription === "BASIC") {
                setSubscriptionBlocked(true);
                return;
            }

            const analyticsData = await apiRequest("/analytics");

            setData(analyticsData);

        } catch {
            setError("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (subscriptionBlocked) {

        return (
            <>
                <Toolbar role={user.role} />

                <div className="min-h-screen bg-gray-100 p-6">

                    <div className="max-w-4xl mx-auto">

                        <div className="bg-white rounded-2xl shadow p-10 text-center">

                            <div className="text-3xl font-bold mb-4">
                                Premium Feature
                            </div>

                            <div className="text-gray-500 max-w-xl mx-auto">
                                Analytics are available only for businesses
                                with an active premium subscription.
                            </div>

                            <div className="mt-8">
                                <a
                                    href="/owner/subscribe"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
                                >
                                    Upgrade Subscription
                                </a>
                            </div>

                        </div>

                    </div>

                </div>
            </>
        );
    }

    if (!data) {
        return (
            <>
                <Toolbar role={user.role} />

                <div className="p-6 text-red-600">
                    {error}
                </div>
            </>
        );
    }

    const performance = (data.manager_performance || [])
        .filter(p => {
            if (roleFilter === "ALL") return true;
            return p.role === roleFilter;
        });

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-6xl mx-auto space-y-6">

                    {/* HEADER */}

                    <div>

                        <h1 className="text-3xl font-bold">
                            Analytics
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Revenue trends, performance and bottlenecks
                        </p>

                    </div>

                    {/* FILTERS */}

                    <div className="bg-white rounded-2xl shadow p-5">

                        <div className="max-w-xs">

                            <label className="block text-sm text-gray-500 mb-1">
                                Role Filter
                            </label>

                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full border px-3 py-2 rounded-lg"
                            >
                                <option value="ALL">
                                    All
                                </option>

                                <option value="MANAGER">
                                    Managers
                                </option>

                                <option value="EMPLOYEE">
                                    Employees
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* REVENUE */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-5">
                            Revenue Dynamics
                        </h2>

                        {(data.revenue || []).length === 0 ? (

                            <div className="text-gray-500">
                                No data
                            </div>

                        ) : (

                            <div className="space-y-3">

                                {data.revenue.map(r => (

                                    <div
                                        key={r.month}
                                        className="flex justify-between border-b pb-2"
                                    >

                                        <span className="font-medium">
                                            {r.month}
                                        </span>

                                        <span className="text-green-600 font-semibold">
                                            ${r.amount}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                    {/* PERFORMANCE */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-5">
                            Team Performance
                        </h2>

                        {performance.length === 0 ? (

                            <div className="text-gray-500">
                                No data
                            </div>

                        ) : (

                            <div className="grid md:grid-cols-2 gap-4">

                                {performance.map(p => (

                                    <div
                                        key={p.user_id}
                                        className="border rounded-xl p-4"
                                    >

                                        <div className="font-semibold text-lg">
                                            {p.name}
                                        </div>

                                        <div className="text-sm text-gray-500 mt-1">
                                            Role: {p.role}
                                        </div>

                                        <div className="mt-4 space-y-1 text-sm">

                                            <div>
                                                Orders Completed:{" "}
                                                <span className="font-medium">
                                                    {p.orders_completed}
                                                </span>
                                            </div>

                                            <div>
                                                Tasks Completed:{" "}
                                                <span className="font-medium">
                                                    {p.tasks_completed}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                    {/* BOTTLENECKS */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-5">
                            Process Bottlenecks
                        </h2>

                        {(data.bottlenecks || []).length === 0 ? (

                            <div className="text-gray-500">
                                No data
                            </div>

                        ) : (

                            <div className="space-y-3">

                                {data.bottlenecks.map(b => (

                                    <div
                                        key={b.status}
                                        className="flex justify-between border-b pb-2"
                                    >

                                        <span className="font-medium">
                                            {b.status}
                                        </span>

                                        <span className="text-red-600 font-semibold">
                                            {b.avg_days} days
                                        </span>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </>
    );
}