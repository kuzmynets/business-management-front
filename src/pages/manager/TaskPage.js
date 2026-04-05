import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function ManagerTasks() {

    const { user } = useContext(AuthContext);

    const [tasks,setTasks] = useState([]);
    const [employees,setEmployees] = useState([]);

    const [statusFilter,setStatusFilter] = useState("");
    const [assigneeFilter,setAssigneeFilter] = useState("");

    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    useEffect(()=>{
        loadData();
    },[]);

    const loadData = async () => {

        try {

            const [tasksData, employeesData] = await Promise.all([
                apiRequest("/tasks"),
                apiRequest("/employees")
            ]);

            setTasks(Array.isArray(tasksData) ? tasksData : []);
            setEmployees(Array.isArray(employeesData) ? employeesData : []);

        } catch {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (taskId,status) => {

        try {

            await apiRequest(`/tasks/${taskId}/status`,{
                method:"PATCH",
                body:JSON.stringify({status})
            });

            setTasks(prev =>
                prev.map(t =>
                    t.id === taskId ? {...t,status} : t
                )
            );

        } catch {
            setError("Failed to update status");
        }

    };

    const updateAssignee = async (taskId,assigned_to) => {

        try {

            await apiRequest(`/tasks/${taskId}/assign`,{
                method:"PATCH",
                body:JSON.stringify({assigned_to})
            });

            setTasks(prev =>
                prev.map(t =>
                    t.id === taskId ? {...t,assigned_to} : t
                )
            );

        } catch {
            setError("Failed to assign task");
        }

    };

    const filteredTasks = tasks.filter(task => {

        if(statusFilter && task.status !== statusFilter)
            return false;

        if(assigneeFilter && String(task.assigned_to) !== assigneeFilter)
            return false;

        return true;

    });

    if(loading) return <div className="p-6">Loading...</div>;

    return (

        <>
            <Toolbar role={user.role}/>

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-7xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">
                        Task Management
                    </h1>

                    {error && (
                        <div className="text-red-600">
                            {error}
                        </div>
                    )}

                    {/* FILTERS */}

                    <div className="bg-white p-4 rounded shadow flex gap-4">

                        <select
                            value={statusFilter}
                            onChange={(e)=>setStatusFilter(e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">All Statuses</option>
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>

                        <select
                            value={assigneeFilter}
                            onChange={(e)=>setAssigneeFilter(e.target.value)}
                            className="border px-3 py-2 rounded"
                        >

                            <option value="">All Employees</option>

                            {employees.map(emp=>(
                                <option key={emp.id} value={emp.id}>
                                    {emp.email}
                                </option>
                            ))}

                        </select>

                    </div>

                    {/* TASK LIST */}

                    <div className="space-y-4">

                        {filteredTasks.map(task => (

                            <div
                                key={task.id}
                                className="bg-white p-4 rounded shadow"
                            >

                                <div className="flex justify-between items-start">

                                    <div>

                                        <div className="font-semibold">
                                            {task.title}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Order: {task.order_title}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Deadline: {task.deadline}
                                        </div>

                                    </div>

                                    <div className="flex gap-2">

                                        <select
                                            value={task.status}
                                            onChange={(e)=>updateStatus(task.id,e.target.value)}
                                            className="border px-2 py-1 rounded"
                                        >
                                            <option value="NEW">New</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>

                                        <select
                                            value={task.assigned_to || ""}
                                            onChange={(e)=>updateAssignee(task.id,e.target.value)}
                                            className="border px-2 py-1 rounded"
                                        >

                                            <option value="">
                                                Unassigned
                                            </option>

                                            {employees.map(emp=>(
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.email}
                                                </option>
                                            ))}

                                        </select>

                                    </div>

                                </div>

                            </div>

                        ))}

                        {filteredTasks.length === 0 && (
                            <div className="text-gray-500 text-sm">
                                No tasks found
                            </div>
                        )}

                    </div>

                </div>

            </div>

        </>
    );
}