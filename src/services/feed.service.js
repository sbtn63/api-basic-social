import { models } from '../libs/sequelize.js';
import { Sequelize } from 'sequelize';
import { POST_PUBLIC_COLUMNS, SERVICE_MESSAGES } from './consts.js';
import ResponseSuccess from '../schemas/responseSuccess.schema.js';
import { userInclude } from './user.service.js';
import { getFollowersUser } from './userFollow.service.js';

const COMMENT_AGGREGATE_INCLUDE = () => ({
  model: models.Comment,
  as: 'comments',
  attributes: [],
});

const REACTION_AGGREGATE_INCLUDE = () => ({
  model: models.PostReaction,
  as: 'postReactions',
  attributes: [],
});

const findAllPosts = async(pagination = {}) => {
  const limit = Number(pagination.limit) || 10;
  const offset = Number(pagination.offset) || 0;

  return await models.Post.findAll({
    attributes: [...POST_PUBLIC_COLUMNS, getComentsCountLiteral(), getReactionsCountLiteral()],
    include: [
      userInclude(),
      COMMENT_AGGREGATE_INCLUDE(),
      REACTION_AGGREGATE_INCLUDE(),
    ],
    group: ['Post.id', 'user.id'],
    order: [
      [Sequelize.literal('reactionsCount'), 'DESC'],
      ['createdAt', 'DESC']
    ],
    limit: limit,
    offset: offset,
    subQuery: false,
  });
};

const findPostFollowersUser = async (followedIds, pagination = {}) => {
  const limit = Number(pagination.limit) || 10;
  const offset = Number(pagination.offset) || 0;

  return await models.Post.findAll({
    attributes: [...POST_PUBLIC_COLUMNS, getComentsCountLiteral(), getReactionsCountLiteral()],
    include: [
      userInclude(),
      COMMENT_AGGREGATE_INCLUDE(),
      REACTION_AGGREGATE_INCLUDE(),
    ],
    where: {
      user_id: {
        [Sequelize.Op.in]: followedIds,
      },
    },
    group: ['Post.id', 'user.id'],
    order: [['createdAt', 'DESC']],
    limit: limit,
    offset: offset,
    subQuery: false,
  });
};

const getComentsCountLiteral = () => [
  Sequelize.fn('COUNT', 
    Sequelize.fn('DISTINCT',
        Sequelize.col('comments.id')
    )
   ), 'commentCount'
];

const getReactionsCountLiteral = () => [
  Sequelize.fn('COUNT', 
    Sequelize.fn('DISTINCT', 
        Sequelize.col('postReactions.user_id')
    )
  ), 'reactionsCount'
];

const feed = async (userId, pagination) => {
    const followers = await getFollowersUser(userId);
    let posts = await findAllPosts(pagination);
    if (followers && followers.length !== 0) {
      const followedIds = followers.map(followed => followed.id);
      posts = await findPostFollowersUser(followedIds, pagination);
    }
    return ResponseSuccess.success(SERVICE_MESSAGES.POST_LIST, posts);
};

export {
    feed,
};