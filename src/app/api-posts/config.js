const sequelize = require("../../configs/connectDatabase");
const { DataTypes } = require("sequelize");
const { UsersInfo, Account } = require("../authentication/config");

const ListPosts = sequelize.define(
  "ListPosts",
  {
    posts_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    posts_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    posts_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "list_posts",
    timestamps: false,
  }
);

const Likes = sequelize.define(
  "Likes",
  {
    like_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    posts_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "likes",
    timestamps: false,
  }
);

const Comments = sequelize.define(
  "Comments",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    posts_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
    timestamps: false,
  }
);

// Thực hiện ràng buộc
UsersInfo.belongsTo(Account, { foreignKey: "account_id", as: "account_info" });
ListPosts.belongsTo(UsersInfo, { foreignKey: "user_id", as: "poster_info" });

ListPosts.hasMany(Likes, { foreignKey: "posts_id", as: "list_like" });
Likes.belongsTo(UsersInfo, { foreignKey: "user_id", as: "user_info" });

ListPosts.hasMany(Comments, { foreignKey: "posts_id", as: "list_comment" });
Comments.belongsTo(UsersInfo, { foreignKey: "user_id", as: "user_info" });

module.exports = {
  ListPosts,
  Likes,
  UsersInfo,
  Comments,
  Account,
};
