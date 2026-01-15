const deleteData = async (models) => {
  await models.Comment.destroy({where: {}});
  await models.Post.destroy({where: {}});
  await models.UserFollow.destroy({ where: {}});
  await models.User.destroy({where: {}});
};

module.exports = {
  deleteData
};
