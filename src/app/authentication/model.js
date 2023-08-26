const { Account, UsersInfo, Friends } = require("./config");
const { throwError } = require("../../utils/index");
const { deleteFile, getFileName } = require("../../utils/handleUploads");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
require("dotenv").config();

module.exports = {
  registerMD: async ({
    full_name,
    user_name,
    password,
    birth_date,
    gender,
  }) => {
    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const accountInfo = await Account.findOne({ where: { user_name } });

      if (accountInfo) {
        throwError(210, "Tên người dùng đã tồn tại!");
      }

      const account = await Account.create({
        user_name,
        password: hashedPassword,
        role: "user",
      });

      await UsersInfo.create({
        account_id: account.account_id,
        full_name,
        birth_date,
        gender,
      });

      return "Đăng ký tài khoản thành công!";
    } catch (error) {
      throw error;
    }
  },

  loginMD: async ({ user_name, password }) => {
    try {
      const account = await Account.findOne({ where: { user_name } });

      if (!account || !bcrypt.compareSync(password, account.password)) {
        throwError(205, "Tên tài khoản hoặc mật khẩu không chính xác!");
      }

      const user_info = await UsersInfo.findOne({
        where: { account_id: account.account_id },
      });

      return {
        account_id: account.account_id,
        user_name: account.user_name,
        user_info,
        accessToken: jwt.sign(
          { account_id: account.account_id, user_name: account.user_name },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        ),
      };
    } catch (error) {
      throw error;
    }
  },

  userInfoMD: async ({ params }) => {
    try {
      const account = await Account.findOne({
        where: {
          [Op.or]: [
            { account_id: params }, // Tìm theo account_id
            { user_name: params }, // Hoặc tìm theo user_name
          ],
        },
      });

      if (!account)
        throwError(
          204,
          `Không tìm thấy thông tin người dùng có tham số là ${params}`
        );

      const userInfo = await UsersInfo.findOne({
        where: { account_id: account.account_id },
      });

      return userInfo;
    } catch (error) {
      throw error;
    }
  },

  personalInfoMD: async ({ user_name }) => {
    try {
      const account = await Account.findOne({ where: { user_name } });

      if (!account)
        throwError(
          204,
          `Không tìm thấy thông tin người dùng có username là ${user_name}`
        );

      const userInfo = await UsersInfo.findOne({
        where: { account_id: account.account_id },
      });

      return userInfo;
    } catch (error) {
      throw error;
    }
  },

  accountInfoMD: async ({ account_info }) => {
    try {
      return account_info;
    } catch (error) {
      throw error;
    }
  },

  addFriendMD: async ({ friend_id, user_id }) => {
    try {
      const friends = await Friends.findOne({ where: { friend_id, user_id } });

      if (friends) {
        await Friends.destroy({ where: { id: friends.id } });
        return "Xóa bạn thành công!";
      } else {
        await Friends.create({ friend_id, user_id });
        return "Thêm bạn thành công!";
      }
    } catch (error) {
      throw error;
    }
  },

  listFriendsMD: async ({ id }) => {
    try {
      const friends = await Friends.findAll({
        where: {
          [Op.or]: [
            { user_id: id }, // Tìm theo account_id
            { friend_id: id }, // Hoặc tìm theo user_name
          ],
          [Op.and]: [
            { status: "accepted" }, // Trạng thái là "accepted"
            // Thêm điều kiện khác nếu cần
          ],
        },
        attributes: ["user_id", "status"],
        include: [
          {
            model: UsersInfo,
            as: "info_friend",
          },
        ],
      });

      return friends;
    } catch (error) {
      throw error;
    }
  },

  // ---------------------- API TRANG CÁ NHÂN ---------------------------------

  updateAvatarMD: async ({ user_id, avatar_user }) => {
    try {
      const usersInfo = await UsersInfo.findOne({ where: { user_id } });

      if (!usersInfo) {
        deleteFile([getFileName(avatar_user)]);
        throwError(204, "Không tìm thấy id người dùng!");
      }

      if (getFileName(avatar_user) === "null") {
        throwError(205, "Lỗi tải ảnh không thành công!");
      }

      if (usersInfo.avatar_user) {
        deleteFile([getFileName(usersInfo.avatar_user)]);
      }

      await UsersInfo.update({ avatar_user }, { where: { user_id } });

      return "Cập nhật ảnh đại diện thành công!";
    } catch (error) {
      throw error;
    }
  },
};
