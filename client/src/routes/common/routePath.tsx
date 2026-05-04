export const AUTH_ROUTES = {
  LANDING: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
};

export const PROTECTED_ROUTES = {
  OVERVIEW: "/overview",
  APIKEYS: "/api-keys",
  FILES: "/files",
  DOCS: "/docs",
  SETTINGS: "/settings",
};

export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};
