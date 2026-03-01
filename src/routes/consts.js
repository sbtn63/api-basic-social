
const AUTH_ROUTES = Object.freeze({
  REGISTER: "/register",
  LOGIN: "/login",
});

const USER_ROUTES = Object.freeze({
  ME: "/me",
  FOLLOW: "/:id/follow",
  UNFOLLOW: "/:id/unfollow",
  USERS_FILTER: "/search"
});

const POST_ROUTES = Object.freeze({
  CREATE: "/",
  UPDATE: "/:id",
  DELETE: "/:id"
});

module.exports = {
  AUTH_ROUTES,
  USER_ROUTES,
  POST_ROUTES
}
