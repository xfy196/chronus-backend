const { verify } = require("../utils/index");
module.exports = (options, app) => {
  return async (ctx, next) => {
    // 判断请求头中的token
    const noAuthUrls = options.noAuthUrls;
    // 验证那些是需要进行登录的
    if (!noAuthUrls.includes(ctx.url.split("?")[0])) {
      const authorization = ctx.get("Authorization");
      if (authorization) {
        try {
          // 解密数据
          let data = await verify(authorization);
          // 这边需要验证时间是否已经失效了 失效了，提示用户重新登录， 没有失效放行走后续操作
          // 拿到data中的id去查询用户信息中的session_key_time
          const user = await ctx.service.user.findUserById(data.id);
          if (user.sessionKeyTime < Date.now()) {
            // 登录失效了
            ctx.status = 401;
            ctx.body = {
              code: 401,
              message: "登录已过期，请重新登录",
            };
          } else {
            // 登录未失效 去更新session_key_time
            ctx.session.user = user;
            let res = await ctx.service.updateUserInfo({
              sessionKeyTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
            });
            ctx.status = 200;
            if (res.code !== 200) {
              ctx.status = 500;
              ctx.body = res;
            }
            await next();
          }
        } catch (error) {
          ctx.status = 401;
          ctx.body = {
            code: 401,
            data: error,
            message: "登录已过期，请重新登录",
          };
        }
      } else {
        ctx.status = 401;

        ctx.body = {
          code: 401,
          data: null,
          message: "没有token",
        };
      }
    } else {
      await next();
    }
  };
};
