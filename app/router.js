"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.prefix("/api");
  router.resources("users", "/users", controller.user);
  router.resources("books", "/books", controller.book);
  router.resources("records", "/reocrds", controller.record);
  router.post("users", "/users/getToken", controller.user.login);
  router.get("users", "/users/queryUserInfo", controller.user.getUserInfo);
  router.get(
    "records",
    "/records/getRecordsByBId",
    controller.record.getRecordsByBId
  );
};
