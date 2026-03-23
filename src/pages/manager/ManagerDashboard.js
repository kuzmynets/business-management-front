import { useEffect, useState, useContext } from "react";
import { apiRequest } from "../../api/client";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../components/Toolbar";
import { AuthContext } from "../../contexts/AuthContext";

export default function ManagerDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeOrders, setActiveOrders] = useState([]);
    const [overdueOrders, setOverdueOrders] = useState([]);
    const [teamTasks, setTeamTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [problemOrders, setProblemOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [
                activeOrdersData,
                overdueOrdersData,
                teamTasksData,
                overdueTasksData,
                problemOrdersData
            ] = await Promise.all([
                apiRequest("/orders?status=IN_PROGRESS"),
                apiRequest("/orders?overdue=true"),
                apiRequest("/tasks?status=IN_PROGRESS"),
                apiRequest("/tasks?overdue=true"),
                apiRequest("/orders?problematic=true")
            ]);

            setActiveOrders(Array.isArray(activeOrdersData) ? activeOrdersData : []);
            setOverdueOrders(Array.isArray(overdueOrdersData) ? overdueOrdersData : []);
            setTeamTasks(Array.isArray(teamTasksData) ? teamTasksData : []);
            setOverdueTasks(Array.isArray(overdueTasksData) ? overdueTasksData : []);
            setProblemOrders(Array.isArray(problemOrdersData) ? problemOrdersData : []);
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

                    <h1 className="text-2xl font-bold">Operational Control</h1>

                    {error && <div className="text-red-600">{error}</div>}

                    {/* ACTIVE ORDERS */}
                    <Section
                        title="Active Orders"
                        items={activeOrders}
                        onClick={(id) => navigate(`/manager/orders/${id}`)}
                    />

                    {/* OVERDUE ORDERS */}
                    <Section
                        title="Overdue Orders"
                        items={overdueOrders}
                        onClick={(id) => navigate(`/manager/orders/${id}`)}
                        danger
                    />

                    {/* TEAM TASKS IN PROGRESS */}
                    <Section
                        title="Team Tasks In Progress"
                        items={teamTasks}
                        onClick={(id) => navigate(`/manager/tasks`)}
                    />

                    {/* OVERDUE TASKS */}
                    <Section
                        title="Overdue Tasks"
                        items={overdueTasks}
                        onClick={(id) => navigate(`/manager/tasks`)}
                        danger
                    />

                    {/* PROBLEMATIC ORDERS */}
                    <Section
                        title="Problematic Orders"
                        items={problemOrders}
                        onClick={(id) => navigate(`/manager/orders/${id}`)}
                        danger
                    />

                </div>
            </div>
        </>
    );
}

function Section({ title, items, onClick, danger }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className={`text-lg font-semibold mb-4 ${danger ? "text-red-600" : ""}`}>
                {title}
            </h2>

            {items.length === 0 ? (
                <div className="text-gray-500 text-sm">No data</div>
            ) : (
                <div className="space-y-3">
                    {items.map(item => (
                        <div
                            key={item.id}
                            onClick={() => onClick(item.id)}
                            className={`p-4 rounded border cursor-pointer hover:shadow 
              ${danger ? "border-red-300" : "border-gray-200"}`}
                        >
                            <div className="font-medium">{item.title}</div>
                            {item.deadline && (
                                <div className="text-sm text-gray-500">
                                    Deadline: {item.deadline}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}