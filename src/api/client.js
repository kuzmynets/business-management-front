const API_URL = "http://127.0.0.1:8000";

export async function apiRequest(path, options = {}) {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    const token = user?.token || null;
    const businessId = user?.businessId || null;

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(businessId && { "X-Business-Id": businessId }),
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
