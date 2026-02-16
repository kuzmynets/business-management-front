export const redirectByRole = (role) => {
    if (role === "OWNER") return "/owner/dashboard";
    if (role === "MANAGER") return "/manager/dashboard";
    if (role === "EMPLOYEE") return "/employee/tasks";
    return "/login";
};
