import { useEffect, useState } from "react";
import Toolbar from "../../components/Toolbar";
import { getInvites, createInvite } from "../../api/invites";

export default function Team() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("EMPLOYEE");
    const [invites, setInvites] = useState([]);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const loadInvites = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getInvites();
            setInvites(Array.isArray(data) ? data : []);
        } catch {
            setError("Failed to load invites");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvites();
    }, []);

    const sendInvite = async (e) => {
        e.preventDefault();

        try {
            setSending(true);
            setError("");

            await createInvite({ email, role });

            setEmail("");
            setRole("EMPLOYEE");

            await loadInvites();
        } catch {
            setError("Failed to send invite");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Toolbar role="OWNER" />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto space-y-6">

                    <div>
                        <h1 className="text-3xl font-bold">Team</h1>
                        <p className="text-gray-500 mt-1">
                            Manage invitations and team access
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* INVITE CARD */}
                    <form
                        onSubmit={sendInvite}
                        className="bg-white rounded-2xl shadow p-6 space-y-4"
                    >
                        <h2 className="text-xl font-semibold">Invite user</h2>

                        <input
                            required
                            type="email"
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <select
                            className="w-full border rounded-lg px-3 py-2"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="MANAGER">Manager</option>
                        </select>

                        <button
                            disabled={sending}
                            className={`px-4 py-2 rounded-lg text-white ${
                                sending
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {sending ? "Sending..." : "Send invite"}
                        </button>
                    </form>

                    {/* INVITES LIST */}
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <div className="p-5 border-b">
                            <h2 className="text-xl font-semibold">
                                Pending invites
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Invitations that are not yet accepted
                            </p>
                        </div>

                        {loading ? (
                            <div className="p-6 text-gray-500">
                                Loading...
                            </div>
                        ) : invites.length === 0 ? (
                            <div className="p-6 text-gray-500">
                                No invites found
                            </div>
                        ) : (
                            <div className="divide-y">
                                {invites.map((i) => (
                                    <div
                                        key={i.id}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {i.email}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Role: {i.role}
                                            </div>
                                        </div>

                                        <div className="text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                i.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : i.status === "ACCEPTED"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-700"
                                            }`}>
                                                {i.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}