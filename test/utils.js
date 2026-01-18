const deleteData = async (models) => {
  await models.AuditLog.destroy({where: {}});
  await models.UserNotification.destroy({where: {}});
  await models.PostReaction.destroy({where: {}});
  await models.Comment.destroy({where: {}});
  await models.Post.destroy({where: {}});
  await models.UserFollow.destroy({ where: {}});
  await models.User.destroy({where: {}});
};

module.exports = {
  deleteData
};
