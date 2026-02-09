export const redirectByRole = (role) => {
    if (role === "OWNER") return "/dashboard";
    if (role === "MANAGER") return "/dashboard";
    if (role === "EMPLOYEE") return "/my-tasks";
    return "/login";
};
