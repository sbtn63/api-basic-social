const { models } = require("../libs/sequelize");
const { REACTION_PUBLIC_COLUMNS } = require("./consts");

const reactionInclude = () => ({
  model: models.Reaction,
  as: 'reaction',
  attributes: REACTION_PUBLIC_COLUMNS
});

module.exports = {
  reactionInclude
};
