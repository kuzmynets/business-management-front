const API_URL = "http://127.0.0.1:8000";

export async function apiRequest(path, options = {}) {
    const stored = localStorage.getItem("user");
    const token = stored ? JSON.parse(stored).token : null;

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        let error = "API error";
        try {
            const body = await res.json();
            error = body.detail || error;
        } catch (_) {}
        throw new Error(error);
    }

    return res.status === 204 ? null : res.json();
}
