const Sequelize = require("sequelize");
const sequelize = new Sequelize("tshare", "tienthanh2000", "tienthanh2000", {
  host: "db4free.net",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Kết nối database thành công!");
  })
  .catch((error) => {
    console.error("Kết nối database lỗi:", error);
  });

module.exports = sequelize;
