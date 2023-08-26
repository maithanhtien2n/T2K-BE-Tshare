module.exports = (router) => {
  const commonRoute = "/api/v1";
  const controller = require("./controller");
  const { authenticateToken } = require("../middlewares/index");
  const { upload } = require("../../utils/handleUploads");

  // API đăng ký tài khoản
  router.post(`${commonRoute}/account/register`, controller.registerCT);

  // API đăng nhập tài khoản
  router.post(`${commonRoute}/account/login`, controller.loginCT);

  // API lấy thông tin người dùng đã đăng nhập
  router.get(
    `${commonRoute}/user-info/:id`,
    authenticateToken,
    controller.userInfoCT
  );

  // API lấy thông tin người dùng khác
  router.get(
    `${commonRoute}/personal-info/:username`,
    authenticateToken,
    controller.personalInfoCT
  );

  // API lấy thông tin tài khoản người dùng
  router.get(
    "/api/v1/account-info",
    authenticateToken,
    controller.accountInfoCT
  );

  // API thêm bạn bè
  router.post("/api/v1/add-friend", authenticateToken, controller.addFriendCT);

  // API lấy danh sách bạn bè
  router.get(
    "/api/v1/friends/:id",
    authenticateToken,
    controller.listFriendsCT
  );

  // -----------------------------------API TRANG CÁ NHÂN -------------------------------
  // API đăng nhập tài khoản
  router.post(
    `${commonRoute}/user-info/avatar`,
    upload.fields([{ name: "avatar_user" }]),
    controller.updateAvatarCT
  );
};
