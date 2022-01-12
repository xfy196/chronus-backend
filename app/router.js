"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.prefix("/api");
  router.get("common", "/common/config", controller.common.getConfig);
  router.get("users", "/users/queryUserInfo", controller.user.getUserInfo);
  router.get(
    "records",
    "/records/getRecordsByBId",
    controller.record.getRecordsByBId
  );
  router.get("records", "/records/getTotals", controller.record.getTotals);
  router.resources("users", "/users", controller.user);
  router.resources("books", "/books", controller.book);
  router.resources("records", "/records", controller.record);
  router.resources("common", "/common", controller.common);
  router.post("users", "/users/getToken", controller.user.login);
};
