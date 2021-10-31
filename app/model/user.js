const { DataTypes } = require("sequelize");
const moment = require("moment")
module.exports = (app) => {
  const { INTEGER, STRING, NUMBER, DATE } = DataTypes;

  const User = app.model.define(
    "users",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      nickName: { type: STRING },
      openId: { type: STRING },
      gender: { type: NUMBER },
      city: { type: STRING },
      province: { type: STRING },
      country: { type: STRING },
      avatarUrl: { type: STRING },
      unionId: { type: STRING },
      timestamp: { type: DATE },
      userId: {type: STRING},
      sessionKeyTime: {type: DATE,
        get () {
          // console.log(this.getDataValue('created_time'))
          return this.getDataValue('sessionKeyTime') ? moment(this.getDataValue('sessionKeyTime')).valueOf() : null;
        }
      },
      language: {type: STRING},
    },
    {
      freezeTableName: true,
    }
  );
  User.associate = function(){
    app.model.User.hasMany(app.model.Book, {sourceKey: "id",foreignKey: "u_id", as: "books"});
}
  return User;
};
