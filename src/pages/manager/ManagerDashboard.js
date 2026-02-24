import { useEffect, useState, useContext } from "react";
import { apiRequest } from "../../api/client";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../components/Toolbar";
import { AuthContext } from "../../contexts/AuthContext";

export default function ManagerDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await apiRequest("/projects");
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Failed to load projects");
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (e) => {
        e.preventDefault();

        try {
            const project = await apiRequest("/projects", {
                method: "POST",
                body: JSON.stringify({ title: newProjectTitle })
            });

            setNewProjectTitle("");

            if (project?.id) {
                navigate(`/manager/projects/${project.id}`);
            } else {
                fetchProjects();
            }

        } catch {
            setError("Failed to create project");
        }
    };

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto space-y-8">

                    <h1 className="text-2xl font-bold">Projects</h1>

                    {error && (
                        <div className="text-red-600">{error}</div>
                    )}

                    {/* CREATE PROJECT */}
                    <div className="bg-white p-4 rounded-xl shadow">
                        <form onSubmit={createProject} className="flex gap-2">
                            <input
                                value={newProjectTitle}
                                onChange={e => setNewProjectTitle(e.target.value)}
                                placeholder="New project title"
                                className="border px-3 py-2 rounded w-80"
                                required
                            />
                            <button className="bg-blue-600 text-white px-4 rounded">
                                Create
                            </button>
                        </form>
                    </div>

                    {/* PROJECT LIST */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : projects.length === 0 ? (
                        <div className="text-gray-500">
                            No projects yet
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {projects.map(project => (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/manager/projects/${project.id}`)}
                                    className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
                                >
                                    <div className="font-semibold">
                                        {project.title}
                                    </div>

                                    {project.description && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {project.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}