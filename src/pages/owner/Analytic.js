import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend
} from "recharts";

export default function AnalyticsPage() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState({
        incomeOverTime: [],
        ordersCompletion: [],
        managersPerformance: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hasSubscription, setHasSubscription] = useState(true); // перевірка підписки

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            // GET /analytics?business_id=...
            const res = await apiRequest(`/analytics?business_id=${user.businessId}`);
            setData(res);
            setHasSubscription(res.has_subscription); // якщо бекенд повертає info про підписку
        } catch {
            setError("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    if (!hasSubscription) {
        return (
            <>
                <Toolbar role={user.role} />
                <div className="p-6 text-center text-gray-500">
                    Analytics available only for subscribed users.
                </div>
            </>
        );
    }

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-6xl mx-auto space-y-8">

                    <h1 className="text-2xl font-bold">Analytics</h1>
                    {error && <div className="text-red-600">{error}</div>}

                    {/* Income over time */}
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-semibold mb-2">Income Over Time</h2>
                        <LineChart width={700} height={300} data={data.incomeOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="income" stroke="#4F46E5" />
                        </LineChart>
                    </div>

                    {/* Orders completion */}
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-semibold mb-2">Orders Completion Over Time</h2>
                        <LineChart width={700} height={300} data={data.ordersCompletion}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="completed" stroke="#10B981" name="Completed Orders"/>
                            <Line type="monotone" dataKey="pending" stroke="#F59E0B" name="Pending Orders"/>
                        </LineChart>
                    </div>

                    {/* Managers Performance */}
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-semibold mb-2">Managers Performance</h2>
                        <BarChart width={700} height={300} data={data.managersPerformance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="manager" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed_orders" fill="#4F46E5" name="Completed Orders"/>
                            <Bar dataKey="pending_orders" fill="#F59E0B" name="Pending Orders"/>
                        </BarChart>
                    </div>

                    {/* Optional: Bottlenecks / problem tasks */}
                    {data.bottlenecks && data.bottlenecks.length > 0 && (
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold mb-2">Process Bottlenecks</h2>
                            <ul className="list-disc list-inside">
                                {data.bottlenecks.map((b, idx) => (
                                    <li key={idx}>
                                        {b.task_title} - {b.issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}