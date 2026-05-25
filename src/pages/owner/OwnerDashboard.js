import { useEffect, useState, useContext } from "react";
import { apiRequest } from "../../api/client";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function ManagerDashboard() {

    const { user } = useContext(AuthContext);

    const [data, setData] = useState({
        revenue: 0,
        profit: 0,
        recent_activities: []
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
                recent_activities: Array.isArray(res?.recent_activities)
                    ? res.recent_activities
                    : []
            });

        } catch {
            setError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto space-y-8">

                    <h1 className="text-2xl font-bold">
                        Dashboard
                    </h1>

                    {error && (
                        <div className="text-red-600">
                            {error}
                        </div>
                    )}

                    {/* FINANCE STATS */}
                    <div className="grid md:grid-cols-2 gap-4">

                        <Card title="Revenue" value={`$${data.revenue}`} />
                        <Card title="Profit" value={`$${data.profit}`} />

                    </div>

                    {/* ACTIVITY */}
                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-lg font-semibold mb-4">
                            Recent Activities
                        </h2>

                        {data.recent_activities.length === 0 ? (
                            <div className="text-gray-500 text-sm">
                                No activities
                            </div>
                        ) : (
                            <div className="space-y-3">

                                {data.recent_activities.map(a => (
                                    <div
                                        key={a.id}
                                        className="p-3 border rounded"
                                    >
                                        <div className="font-medium">
                                            {a.title || a.action || "Activity"}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {a.date
                                                ? new Date(a.date).toLocaleString()
                                                : ""}
                                        </div>
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

function Card({ title, value }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow">
            <div className="text-sm text-gray-500">{title}</div>

            <div className="text-3xl font-bold mt-2">
                {value}
            </div>
        </div>
    );
}