import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function EmployeeTasks() {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Toolbar role={user.role} />

            <div className="p-6 space-y-4">
                <div className="bg-white shadow p-4 rounded">
                    <p className="font-medium">Task: Prepare report</p>
                    <p className="text-sm text-gray-500">Deadline: tomorrow</p>
                    <p className="text-sm text-blue-600">Status: in progress</p>
                </div>
            </div>
        </>
    );
}
