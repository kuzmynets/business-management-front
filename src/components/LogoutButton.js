import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function LogoutButton() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm bg-red-600 px-3 py-1 rounded"
        >
            Logout
        </button>
    );
}
