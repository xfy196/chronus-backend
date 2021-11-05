const { DataTypes } = require("sequelize");
module.exports = (app) => {
  const { INTEGER, STRING, DATE} = DataTypes;
  const Book = app.model.define(
    "books",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: STRING },
      u_id: {type: INTEGER},
      last_record_time: {type: DATE}
    },
    {
      freezeTableName: true,
    }
  );
  Book.associate = function(){
      app.model.Book.belongsTo(app.model.User, {foreignKey: "u_id", targetKey: "id", as: "users" });
      app.model.Book.hasMany(app.model.Record, { sourceKey: "id", foreignKey: "b_id", as: "records" });
  }
  return Book;
};
