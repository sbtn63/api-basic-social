'use strict';

import { TYPE_NOTIFICATION_TABLE } from '../models/typeNotifications.models.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // Es buena práctica limpiar antes de insertar en un seeder para evitar duplicados
  await queryInterface.bulkDelete(TYPE_NOTIFICATION_TABLE, null, {});

  await queryInterface.bulkInsert(TYPE_NOTIFICATION_TABLE, [
    { name: "New Followed", created_at: new Date(), updated_at: new Date() },
    { name: "Post Comment", created_at: new Date(), updated_at: new Date() },
    { name: "New Post", created_at: new Date(), updated_at: new Date() },
    { name: "Post Reaction", created_at: new Date(), updated_at: new Date() },
    { name: "Updated Post", created_at: new Date(), updated_at: new Date() },
    { name: "Deleted Post", created_at: new Date(), updated_at: new Date() },
    { name: "Response Comment", created_at: new Date(), updated_at: new Date() },
    { name: "Edit Comment", created_at: new Date(), updated_at: new Date() },
    { name: "Delete Comment", created_at: new Date(), updated_at: new Date() },
  ]);
};

export async function down(queryInterface) {
  await queryInterface.bulkDelete(TYPE_NOTIFICATION_TABLE, null, {});
};


