const { models } = require("../libs/sequelize");
const { Sequelize, Op } = require('sequelize');
const { COMMENT_PUBLIC_COLUMNS } = require("./consts");
const { userInclude } = require("./user.service");

const findAllRecentComments = async(condition, pagination = {}) => {
  const limit = Number(pagination.limit) || 10;
  const offset = Number(pagination.offset) || 0;

  return await models.Comment.findAll({
    attributes: [...COMMENT_PUBLIC_COLUMNS, getRepliesCountLiteral()],
    where: condition,
    include: [
      userInclude(),
      REPLIES_AGGREGATE_INCLUDE()
    ],
    group: ['Comment.id', 'user.id'],
    order: [['createdAt', 'DESC']],
    limit: limit,
    offset: offset,
    subQuery: false,
  });
};

const REPLIES_AGGREGATE_INCLUDE = () => ({
  model: models.Comment,
  as: 'replies',
  attributes: [],
  required: false,
  duplicating: false
});

const getRepliesCountLiteral = () => [
  Sequelize.fn('COUNT', Sequelize.col('replies.id')), 'repliesCount'
];

module.exports = {
  findAllRecentComments
};
