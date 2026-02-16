import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function ManagerDashboard() {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Toolbar role={user.role} />

            <div className="p-6 grid grid-cols-3 gap-4">
                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Active Orders</p>
                    <p className="text-2xl font-bold">7</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Team Tasks</p>
                    <p className="text-2xl font-bold">18</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Problems</p>
                    <p className="text-2xl font-bold text-red-600">2</p>
                </div>
            </div>
        </>
    );
}
