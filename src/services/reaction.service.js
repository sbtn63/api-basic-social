import { models } from '../libs/sequelize.js';
import { REACTION_PUBLIC_COLUMNS } from './consts.js';

const reactionInclude = () => ({
  model: models.Reaction,
  as: 'reaction',
  attributes: REACTION_PUBLIC_COLUMNS
});

export {
  reactionInclude
};
