const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, },
  password: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, validate: { isEmail: true } },
  sex: { type: DataTypes.STRING, validate: {isIn: [['Мужчика', 'Женщина']]}}
  // createdAt
});

const Blog = sequelize.define('blogs', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  message: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE }
})

User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  User, Blog
};
