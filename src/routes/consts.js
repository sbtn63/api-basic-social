
const AUTH_ROUTES = Object.freeze({
  REGISTER: "/register",
  LOGIN: "/login",
});

const USER_ROUTES = Object.freeze({
  ME: "/me",
  FOLLOW: "/:id/follow",
  UNFOLLOW: "/:id/unfollow",
  USERS_FILTER: "/search",
  CHANGE_PROFILE: "/profile",
  CHANGE_AVATAR: "/avatar",
  CHANGE_EMAIL: "/email",
  CHANGE_PASSWORD: "/password"
});

const POST_ROUTES = Object.freeze({
  CREATE: "/",
  UPDATE: "/:id",
  DELETE: "/:id",
  REACTION: "/:id/reactions",
  GET_COMMENTS: "/:id/comments",
  CREATE_COMMENT: "/:id/comments",
  UPDATE_COMMENT: "/:id/comments/:commentId",
  DELETE_COMMENT: "/:id/comments/:commentId"
});

const COMMENT_ROUTES = Object.freeze({
  REPLIES: "/:id/replies",
});

export {
  AUTH_ROUTES,
  USER_ROUTES,
  POST_ROUTES,
  COMMENT_ROUTES
};
