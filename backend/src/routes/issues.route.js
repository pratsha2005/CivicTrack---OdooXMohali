const port = import.meta.env.VITE_BACKEND_URL;

export const loginUserRoute = `${port}/api/v1/users/login`;
export const registerUserRoute = `${port}/api/v1/users/register`;
export const logoutUserRoute = `${port}/api/v1/users/logout`;
export const refreshTokenRoute = `${port}/api/v1/users/refresh-token`;
export const changePasswordRoute = `${port}/api/v1/users/changepassword`;
export const profileRoute = `${port}/api/v1/users/profile`;
export const updateUserRoute = `${port}/api/v1/users/update`; // 👈 for name/avatar
export const updateLocationRoute = `${port}/api/v1/users/update-location`;

// Issue Routes
export const registerIssueRoute = `${port}/api/v1/issues/register-issue`;
export const getAllIssuesRoute = `${port}/api/v1/issues/getAllIssues`;
export const getNearbyIssuesRoute = `${port}/api/v1/issues/getNearbyIssues`;
export const editIssueStatusRoute = (issueId) => `${port}/api/v1/issues/editIssue/${issueId}`;
export const editIssueRoute = (id) => `${port}/api/v1/issues/editIssue/${id}`;
export const reportIssueRoute = (id) => `${port}/api/v1/issues/reportIssue/${id}`;
export const getIssuesByUserIdRoute = `${port}/api/v1/issues/getIssueByUserId`;
export const deleteIssueRoute = (id) => `${port}/api/v1/issues/deleteIssue/${id}`;
