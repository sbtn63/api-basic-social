
const AUTH_ROUTES = Object.freeze({
  REGISTER: "/register",
  LOGIN: "/login",
});

const USER_ROUTES = Object.freeze({
  ME: "/me",
  FOLLOW: "/:id/follow",
  UNFOLLOW: "/:id/unfollow"
});

module.exports = {
  AUTH_ROUTES,
  USER_ROUTES,
}
