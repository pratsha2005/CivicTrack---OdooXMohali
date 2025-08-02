const port = import.meta.env.VITE_BACKEND_URL; // from .env

export const loginUserRoute = `${port}/api/v1/users/login`;
export const registerUserRoute = `${port}/api/v1/users/register`;
export const logoutUserRoute = `${port}/api/v1/users/logout`;
export const refreshTokenRoute = `${port}/api/v1/users/refresh-token`;
export const getCurrentUserRoute = `${port}/api/v1/users/profile`;
export const changePasswordRoute = `${port}/api/v1/users/changepassword`;
export const updateNameAndAvatarRoute = `${port}/api/v1/users/update-profile`;
export const updateLocationRoute = `${port}/api/v1/users/update-location`;

export const registerIssueRoute = `${port}/api/v1/issues/register-issue`;
export const getAllIssuesRoute = `${port}/api/v1/issues/getAllIssues`;
export const getNearbyIssuesRoute = (radius) => `${port}/api/v1/issues/getNearbyIssues/${radius}`;
