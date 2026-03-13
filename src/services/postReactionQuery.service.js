const { models } = require("../libs/sequelize");
const { reactionInclude } = require("./reaction.service");
const { userInclude } = require("./user.service");

const findAllRecentReactionsPost = async(postId, pagination = {}) => {
  const limit = Number(pagination.limit) || 10;
  const offset = Number(pagination.offset) || 0;

  return await models.PostReaction.findAll({
    attributes: [],
    where: { postId },
    include: [
      userInclude(),
      reactionInclude(),
    ],
    order: [['createdAt', 'DESC']],
    limit: limit,
    offset: offset
  });
};

module.exports = {
  findAllRecentReactionsPost
};
