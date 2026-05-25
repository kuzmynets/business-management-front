import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiRequest } from "../../../api/client";
import Toolbar from "../../../components/Toolbar";

export default function TaskDetailsPage() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "",
        assigned_to: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [taskData, employeesData] = await Promise.all([
                apiRequest(`/tasks/${id}`),
                apiRequest("/employees")
            ]);

            setTask(taskData);
            setEmployees(Array.isArray(employeesData) ? employeesData : []);

            setForm({
                title: taskData?.title || "",
                description: taskData?.description || "",
                status: taskData?.status || "NEW",
                assigned_to: taskData?.assigned_to || ""
            });

        } catch {
            setError("Failed to load task");
            setTask(null);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = useMemo(() => {
        if (!task) return false;

        return (
            form.title !== (task.title || "") ||
            (form.description || "") !== (task.description || "") ||
            form.status !== (task.status || "") ||
            (form.assigned_to || "") !== (task.assigned_to || "")
        );
    }, [form, task]);

    const buildPayload = () => {
        const payload = {};

        if (form.title !== task.title) payload.title = form.title;
        if ((form.description || "") !== (task.description || "")) payload.description = form.description;
        if (form.status !== task.status) payload.status = form.status;
        if ((form.assigned_to || "") !== (task.assigned_to || "")) payload.assigned_to = form.assigned_to;

        return payload;
    };

    const updateTask = async () => {
        const payload = buildPayload();

        await apiRequest(`/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });

        navigate("/manager/tasks");
    };

    const handleSaveClick = () => {
        if (!hasChanges) return;
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setShowConfirm(false);
        await updateTask();
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!task) return <div className="p-6">Not found</div>;

    const disableSave = !hasChanges;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">Task Details</h1>

                    {error && <div className="text-red-600">{error}</div>}

                    <div className="bg-white p-4 rounded shadow">
                        <label className="text-sm text-gray-500">Title</label>
                        <input
                            className="w-full border px-3 py-2 rounded mt-1"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <label className="text-sm text-gray-500">Description</label>
                        <textarea
                            className="w-full border px-3 py-2 rounded mt-1"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <label className="text-sm text-gray-500">Status</label>
                        <select
                            className="w-full border px-3 py-2 rounded mt-1"
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="PAUSED">Paused</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <label className="text-sm text-gray-500">Assignee</label>
                        <select
                            className="w-full border px-3 py-2 rounded mt-1"
                            value={form.assigned_to}
                            onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                        >
                            <option value="">Unassigned</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => navigate("/manager/tasks")}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Back
                        </button>

                        <button
                            disabled={disableSave}
                            onClick={handleSaveClick}
                            className={`px-4 py-2 rounded text-white ${
                                disableSave
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600"
                            }`}
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow w-96 space-y-4">

                        <div className="text-lg font-semibold">
                            Confirm update
                        </div>

                        <div className="text-sm text-gray-600">
                            Apply changes to this task?
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmSave}
                                className="px-3 py-2 bg-blue-600 text-white rounded"
                            >
                                Confirm
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}