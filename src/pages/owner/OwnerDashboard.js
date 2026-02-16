import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Toolbar from "../../components/Toolbar";

export default function OwnerDashboard() {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Toolbar role={user.role} />

            <div className="p-6 grid grid-cols-4 gap-4">
                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Active Orders</p>
                    <p className="text-2xl font-bold">12</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">3</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-2xl font-bold">₴24 000</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Profit</p>
                    <p className="text-2xl font-bold text-green-600">₴8 500</p>
                </div>
            </div>
        </>
    );
}
