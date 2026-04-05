import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function ManagerOrders() {

    const { user } = useContext(AuthContext);

    const [orders, setOrders] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [title, setTitle] = useState("");
    const [client, setClient] = useState("");
    const [deadline, setDeadline] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskAssignee, setTaskAssignee] = useState("");

    useEffect(()=>{
        loadData();
    },[]);

    const loadData = async () => {
        try {

            const [ordersData, employeesData] = await Promise.all([
                apiRequest("/orders"),
                apiRequest("/employees")
            ]);

            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setEmployees(Array.isArray(employeesData) ? employeesData : []);

        } catch {
            setError("Failed to load data");
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
                    client,
                    deadline
                })
            });

            setOrders(prev => [...prev, order]);

            setTitle("");
            setClient("");
            setDeadline("");

        } catch {
            setError("Failed to create order");
        }
    };

    const updateStatus = async (orderId, status) => {

        try {

            await apiRequest(`/orders/${orderId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status })
            });

            setOrders(prev =>
                prev.map(o =>
                    o.id === orderId ? { ...o, status } : o
                )
            );

        } catch {
            setError("Failed to update status");
        }
    };

    const createTask = async (e) => {

        e.preventDefault();

        if(!selectedOrder) return;

        try {

            const task = await apiRequest("/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title: taskTitle,
                    order_id: selectedOrder,
                    assigned_to: taskAssignee,
                    status: "NEW"
                })
            });

            setOrders(prev =>
                prev.map(o =>
                    o.id === selectedOrder
                        ? { ...o, tasks:[...(o.tasks||[]), task] }
                        : o
                )
            );

            setTaskTitle("");
            setTaskAssignee("");

        } catch {
            setError("Failed to create task");
        }
    };

    if(loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role}/>

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-6xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">
                        Orders Management
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
                            Create Order
                        </h2>

                        <input
                            value={title}
                            onChange={e=>setTitle(e.target.value)}
                            placeholder="Order title"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />

                        <input
                            value={client}
                            onChange={e=>setClient(e.target.value)}
                            placeholder="Client name"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />

                        <input
                            type="date"
                            value={deadline}
                            onChange={e=>setDeadline(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />

                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            Create
                        </button>

                    </form>

                    {/* ORDER LIST */}

                    <div className="space-y-4">

                        {orders.map(order => (

                            <div
                                key={order.id}
                                className="bg-white p-4 rounded shadow space-y-3"
                            >

                                <div className="flex justify-between">

                                    <div>

                                        <div className="font-semibold">
                                            {order.title}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Client: {order.client}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Deadline: {order.deadline}
                                        </div>

                                    </div>

                                    <select
                                        value={order.status}
                                        onChange={(e)=>updateStatus(order.id,e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="NEW">New</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>

                                </div>

                                {/* TASK LIST */}

                                {order.tasks && order.tasks.length > 0 && (

                                    <div className="text-sm">

                                        <div className="font-medium">
                                            Tasks
                                        </div>

                                        <ul className="list-disc ml-4">

                                            {order.tasks.map(task => (
                                                <li key={task.id}>
                                                    {task.title} – {task.status}
                                                </li>
                                            ))}

                                        </ul>

                                    </div>

                                )}

                                {/* CREATE TASK */}

                                <form
                                    onSubmit={(e)=>{
                                        setSelectedOrder(order.id);
                                        createTask(e);
                                    }}
                                    className="flex gap-2"
                                >

                                    <input
                                        value={taskTitle}
                                        onChange={e=>setTaskTitle(e.target.value)}
                                        placeholder="Task title"
                                        className="border px-2 py-1 rounded flex-1"
                                        required
                                    />

                                    <select
                                        value={taskAssignee}
                                        onChange={e=>setTaskAssignee(e.target.value)}
                                        className="border px-2 py-1 rounded"
                                        required
                                    >
                                        <option value="">Assign</option>

                                        {employees.map(emp => (
                                            <option
                                                key={emp.id}
                                                value={emp.id}
                                            >
                                                {emp.email}
                                            </option>
                                        ))}

                                    </select>

                                    <button className="bg-green-600 text-white px-3 rounded">
                                        Add Task
                                    </button>

                                </form>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </>
    );
}