import { useEffect, useState } from "react";
import Toolbar from "../../components/Toolbar";
import { getInvites, createInvite } from "../../api/invites";

export default function Team() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("EMPLOYEE");
    const [invites, setInvites] = useState([]);

    const loadInvites = async () => {
        const data = await getInvites();
        setInvites(data);
    };

    useEffect(() => {
        loadInvites();
    }, []);

    const sendInvite = async (e) => {
        e.preventDefault();
        await createInvite({ email, role });
        setEmail("");
        setRole("EMPLOYEE");
        loadInvites();
    };

    return (
        <>
            <Toolbar role="OWNER" />

            <div className="p-6 max-w-xl space-y-6">
                <form onSubmit={sendInvite} className="bg-white p-4 rounded shadow space-y-4">
                    <h2 className="font-semibold">Invite user</h2>

                    <input
                        required
                        type="email"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                    </select>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        Send invite
                    </button>
                </form>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Pending invites</h2>

                    <ul className="space-y-2 text-sm">
                        {invites.map((i) => (
                            <li key={i.id} className="flex justify-between">
                                <span>{i.email}</span>
                                <span className="text-gray-500">
                  {i.role} · {i.status}
                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}