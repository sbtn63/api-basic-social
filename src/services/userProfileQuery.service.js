const { models } = require("../libs/sequelize");
const { Sequelize, Op } = require('sequelize');

const USER_PUBLIC_PROFILE_COLUMNS = [
  'id',
  'firstName',
  'lastName',
  'avatarUrl'
];

const FOLLOWERS_AGGREGATE_INCLUDE = () => ({
  model: models.User,
  as: 'followers',
  attributes: [],
  through: { attributes: [] }
});

const findUsersByFullNameByInfluence = async (fullname, pagination = {}) => {
  const searchPattern = `%${fullname.toLowerCase().replaceAll(/\s+/g, '')}%`;
  const limit = Number(pagination.limit) || 10;
  const offset = Number(pagination.offset) || 0;

  const selectAttributes = [
    ...USER_PUBLIC_PROFILE_COLUMNS,
    getFollowersCountLiteral()
  ];

  return await models.User.findAll({
    attributes: selectAttributes,
    include: FOLLOWERS_AGGREGATE_INCLUDE(),
    where: Sequelize.where(
      Sequelize.fn('LOWER',
        Sequelize.fn('CONCAT',
          Sequelize.col('User.first_name'),
          Sequelize.col('User.last_name')
        )
      ),
      { [Op.like]: searchPattern }
    ),
    group: ['User.id', 'User.first_name', 'User.last_name', 'User.avatar_url'],
    order: [[Sequelize.literal('followersCount'), 'DESC']],
    limit: limit,
    offset: offset,
    subQuery: false
  });
};

const getFollowersCountLiteral = () => [
  Sequelize.fn('COUNT', Sequelize.col('followers.id')), 'followersCount'
];


module.exports = {
  findUsersByFullNameByInfluence
};
