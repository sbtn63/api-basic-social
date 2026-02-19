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
    where: Sequelize.where(
      Sequelize.fn('LOWER',
        Sequelize.fn('CONCAT',
          Sequelize.col('first_name'),
          Sequelize.col('last_name')
        )
      ),
      { [Op.like]: searchPattern }
    ),
    order: [[Sequelize.literal('followersCount'), 'DESC']],
    limit: limit,
    offset: offset,
    subQuery: false
  });
};

const getFollowingCountLiteral = () => {
  return [
    Sequelize.literal(`(
      SELECT COUNT(*)
      FROM user_follows AS uf
      WHERE uf.follower_id = User.id
    )`),
    'followingCount'
  ];
};

const getFollowersCountLiteral = () => [
  Sequelize.literal(`(
    SELECT COUNT(*)
    FROM user_follows AS uf
    WHERE uf.followed_id = User.id
  )`),
  'followersCount'
];


module.exports = {
  findUsersByFullNameByInfluence,
  getFollowersCountLiteral,
  getFollowingCountLiteral
};
