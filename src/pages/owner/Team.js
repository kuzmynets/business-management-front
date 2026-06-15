import { useEffect, useMemo, useState } from "react";
import Toolbar from "../../components/Toolbar";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
    approveInvite,
    createInvite,
    getInvites,
    getMembers,
    rejectMemberRemoval,
    rejectInvite,
    removeMember,
} from "../../api/invites";

export default function Team() {
    const { user } = useContext(AuthContext);
    const isOwner = user?.role === "OWNER";
    const isManager = user?.role === "MANAGER";

    const [tab, setTab] = useState("members");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(isManager ? "EMPLOYEE" : "MANAGER");
    const [invites, setInvites] = useState([]);
    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const loadTeam = async () => {
        try {
            setLoading(true);
            setError("");

            const [invitesData, membersData] = await Promise.all([
                getInvites(),
                getMembers(),
            ]);

            setInvites(Array.isArray(invitesData) ? invitesData : []);
            setMembers(Array.isArray(membersData) ? membersData : []);
        } catch {
            setError("Не вдалося завантажити команду");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeam();
    }, []);

    const stats = useMemo(() => {
        const result = {
            managers: 0,
            employees: 0,
            active: members.length,
            pending: 0,
        };

        for (const member of members) {
            if (member.role === "MANAGER") result.managers += 1;
            if (member.role === "EMPLOYEE") result.employees += 1;
        }

        for (const invite of invites) {
            if (invite.status === "pending") result.pending += 1;
        }

        return result;
    }, [invites, members]);

    const visibleMembers = useMemo(
        () => isManager ? members.filter(member => member.role === "EMPLOYEE") : members,
        [isManager, members]
    );

    const visibleInvites = useMemo(
        () => isManager ? invites.filter(invite => invite.role === "EMPLOYEE") : invites,
        [isManager, invites]
    );

    const sendInvite = async (e) => {
        e.preventDefault();

        try {
            setSending(true);
            setError("");

            await createInvite({ email, role });

            setEmail("");
            setRole(isManager ? "EMPLOYEE" : "MANAGER");
            await loadTeam();
        } catch {
            setError("Не вдалося надіслати запрошення");
        } finally {
            setSending(false);
        }
    };

    const approve = async (token) => {
        if (!isOwner) return;
        await approveInvite(token);
        await loadTeam();
    };

    const reject = async (token) => {
        await rejectInvite(token);
        await loadTeam();
    };

    const remove = async (memberId) => {
        if (!window.confirm(isOwner ? "Видалити учасника з бізнесу?" : "Надіслати власнику запит на видалення?")) return;
        await removeMember(memberId);
        await loadTeam();
    };

    const keepMember = async (memberId) => {
        await rejectMemberRemoval(memberId);
        await loadTeam();
    };

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
                <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Команда</h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            {isOwner
                                ? "Запрошення, підтвердження доступу та активні учасники бізнесу"
                                : "Керування працівниками бізнесу через підтвердження власника"}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <Stat title="Менеджери" value={stats.managers} />
                        <Stat title="Працівники" value={stats.employees} />
                        <Stat title="Активні учасники" value={stats.active} />
                        <Stat title="Очікують" value={stats.pending} />
                    </div>

                    <form
                        onSubmit={sendInvite}
                        className="bg-white rounded shadow p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-3"
                    >
                        <input
                            required
                            type="email"
                            className="border rounded px-3 py-2 min-h-[44px]"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {isOwner ? (
                            <select
                                className="border rounded px-3 py-2 min-h-[44px]"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="MANAGER">Менеджер</option>
                                <option value="EMPLOYEE">Працівник</option>
                            </select>
                        ) : (
                            <input
                                value="Працівник"
                                disabled
                                className="border rounded px-3 py-2 bg-gray-100 min-h-[44px]"
                            />
                        )}

                        <button
                            disabled={sending}
                            className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 min-h-[44px]"
                        >
                            {sending ? "Надсилання..." : "Надіслати"}
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        <TabButton active={tab === "members"} onClick={() => setTab("members")}>
                            Активні
                        </TabButton>
                        <TabButton active={tab === "invites"} onClick={() => setTab("invites")}>
                            Запрошення
                        </TabButton>
                    </div>

                    {loading ? (
                        <Skeleton />
                    ) : tab === "members" ? (
                        <MembersTable
                            members={visibleMembers}
                            onRemove={remove}
                            onKeep={keepMember}
                            isOwner={isOwner}
                        />
                    ) : (
                        <InvitesTable
                            invites={visibleInvites}
                            onApprove={approve}
                            onReject={reject}
                            isOwner={isOwner}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

function Stat({ title, value }) {
    return (
        <div className="bg-white p-4 sm:p-5 rounded shadow">
            <div className="text-xs sm:text-sm text-gray-500">{title}</div>
            <div className="text-xl sm:text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}

function TabButton({ active, children, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded min-h-[44px] text-sm sm:text-base ${
                active ? "bg-gray-900 text-white" : "bg-white border"
            }`}
        >
            {children}
        </button>
    );
}

function MembersTable({ members, onRemove, onKeep, isOwner }) {
    if (members.length === 0) {
        return <Empty text="Активних учасників поки немає" />;
    }

    return (
        <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                <tr>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Роль</th>
                    <th className="p-3 text-left">Дата</th>
                    <th className="p-3 text-left">Статус</th>
                    <th className="p-3 text-right">Дії</th>
                </tr>
                </thead>
                <tbody>
                {members.map((member) => (
                    <tr key={member.id} className="border-t">
                        <td className="p-3">{member.email || "—"}</td>
                        <td className="p-3">{translateRole(member.role)}</td>
                        <td className="p-3">{member.joined_at ? new Date(member.joined_at).toLocaleDateString() : "—"}</td>
                        <td className="p-3">{translateStatus(member.status)}</td>
                        <td className="p-3 text-right">
                            {member.role !== "OWNER" && member.status === "active" && (
                                <button className="px-3 py-2 min-h-[44px] bg-red-600 text-white rounded text-sm"
                                        onClick={() => onRemove(member.id)}>
                                    Видалити
                                </button>
                            )}
                            {isOwner && member.status === "removal_requested" && (
                                <div className="flex justify-end gap-2">
                                    <button className="px-3 py-2 min-h-[44px] bg-red-600 text-white rounded text-sm"
                                            onClick={() => onRemove(member.id)}>
                                        Підтвердити
                                    </button>
                                    <button className="px-3 py-2 min-h-[44px] bg-gray-200 text-sm rounded"
                                            onClick={() => onKeep(member.id)}>
                                        Залишити
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function InvitesTable({ invites, onApprove, onReject, isOwner }) {
    if (invites.length === 0) {
        return <Empty text="Запрошень немає" />;
    }

    return (
        <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                <tr>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Роль</th>
                    <th className="p-3 text-left">Статус</th>
                    <th className="p-3 text-right">Дії</th>
                </tr>
                </thead>
                <tbody>
                {invites.map((invite) => (
                    <tr key={invite.id || invite.token} className="border-t">
                        <td className="p-3">{invite.email}</td>
                        <td className="p-3">{translateRole(invite.role)}</td>
                        <td className="p-3">{translateStatus(invite.status)}</td>
                        <td className="p-3 text-right space-x-2">
                            {invite.status === "pending" && (
                                <>
                                    <button className="px-3 py-2 min-h-[44px] bg-green-600 text-white rounded text-sm"
                                            onClick={() => onApprove(invite.token || invite.id)}>
                                        Підтвердити
                                    </button>
                                    <button className="px-3 py-2 min-h-[44px] bg-red-600 text-white rounded text-sm"
                                            onClick={() => onReject(invite.token || invite.id)}>
                                        Відхилити
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function Skeleton() {
    return (
        <div className="bg-white rounded shadow p-4 sm:p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
    );
}

function Empty({ text }) {
    return <div className="bg-white rounded shadow p-4 sm:p-6 text-gray-500 text-sm">{text}</div>;
}

function translateRole(role) {
    return {
        OWNER: "Власник",
        MANAGER: "Менеджер",
        EMPLOYEE: "Працівник",
    }[role] || role;
}

function translateStatus(status) {
    return {
        active: "Активний",
        pending: "Очікує",
        approved: "Підтверджено",
        rejected: "Відхилено",
        removal_requested: "Очікує видалення",
    }[status] || status;
}