import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <h1>Привіт, {user.email}</h1>
            <p>Роль: {user.role}</p>
            <button onClick={logout}>Вийти</button>
        </div>
    );
};
