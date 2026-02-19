export default function TaskCard({ task, onStatusChange }) {
    const statusColor = {
        pending: "bg-gray-200 text-gray-700",
        in_progress: "bg-yellow-200 text-yellow-800",
        done: "bg-green-200 text-green-800"
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">{task.title}</h3>
                <span className={`px-2 py-1 rounded text-xs ${statusColor[task.status]}`}>
          {task.status}
        </span>
            </div>

            <p className="text-sm text-gray-600">{task.description}</p>

            <p className="text-xs text-red-500">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>

            {task.status !== "done" && (
                <div className="flex gap-2">
                    {task.status !== "in_progress" && (
                        <button
                            onClick={() => onStatusChange(task.id, "in_progress")}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg"
                        >
                            In Progress
                        </button>
                    )}

                    <button
                        onClick={() => onStatusChange(task.id, "done")}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
}
