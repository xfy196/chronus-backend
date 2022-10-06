/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    security: {
      csrf: false,
    },
    httpclient: {
      contentType: "json",
      // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
      // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
      // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
      enableDNSCache: false,
      // 对同一个域名进行 DNS 查询的最小间隔时间
      dnsCacheLookupInterval: 10000,
      // DNS 同时缓存的最大域名数量，默认 1000
      dnsCacheMaxLength: 1000,

      request: {
        // 默认 request 超时时间
        timeout: 3000,
      },

      httpAgent: {
        // 默认开启 http KeepAlive 功能
        keepAlive: true,
        // 空闲的 KeepAlive socket 最长可以存活 4 秒
        freeSocketTimeout: 4000,
        // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
        timeout: 30000,
        // 允许创建的最大 socket 数
        maxSockets: Number.MAX_SAFE_INTEGER,
        // 最大空闲 socket 数
        maxFreeSockets: 256,
      },

      httpsAgent: {
        // 默认开启 https KeepAlive 功能
        keepAlive: true,
        // 空闲的 KeepAlive socket 最长可以存活 4 秒
        freeSocketTimeout: 4000,
        // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
        timeout: 30000,
        // 允许创建的最大 socket 数
        maxSockets: Number.MAX_SAFE_INTEGER,
        // 最大空闲 socket 数
        maxFreeSockets: 256,
      },
    },
  });
  config.sequelize =
    process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production"
      ? {
        dialect: "mysql",
        host: "sh-cdb-2m4bqgrw.sql.tencentcdb.com",
        port: 59108,
        database: "db_chronus",
        username: "root",
        password: "591196qwert",
      }
      : {
        dialect: "mysql",
        host: "127.0.0.1",
        port: 3306,
        database: "db_chronus",
        username: "root",
        password: "123456",
      };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1624982332864_9406";

  // add your middleware config here
  config.middleware = [ "auth", "errorHandler" ];
  config.auth = {
    noAuthUrls: [ "/api/users/getToken", "/api/common/config" ],
  };
  config.errorHandler = {
    enable: true,
    match() {
      // 这里可以设置对应规则去匹配，例如只在ios下开启
      // const reg = /iphone|ipad|ipod/i;
      return true;
    },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    bodyParser: {
      enable: true,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
