import { models } from '../libs/sequelize.js';
import { reactionInclude } from './reaction.service.js';
import { userInclude } from './user.service.js';

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

export {
  findAllRecentReactionsPost
};
