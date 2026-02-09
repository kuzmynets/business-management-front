export const redirectByRole = (role) => {
    if (role === "OWNER") return "/owner/dashboard";
    if (role === "MANAGER") return "/dashboard";
    if (role === "EMPLOYEE") return "/my-tasks";
    return "/login";
};
