const { DataTypes } = require("sequelize");
module.exports = (app) => {
  const { INTEGER, STRING, BIGINT, DATE } = DataTypes;

  const Record = app.model.define(
    "records",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      time: { type:  BIGINT},
      title: {type: STRING},
      b_id: {type: BIGINT},
      start_time: {type: DATE},
      end_time: {type: DATE},
    },
    {
      freezeTableName: true,
    }
  );
  Record.associate = function(){
    app.model.Record.belongsTo(app.model.Book, {foreignKey: "b_id", targetKey: "id", as: "books" });
}
  return Record;
};
