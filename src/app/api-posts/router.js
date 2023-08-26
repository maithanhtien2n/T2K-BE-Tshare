module.exports = (router) => {
  const commonRoute = "/api/v1";
  const controller = require("./controller");
  const { authenticateToken } = require("../middlewares/index");
  const { upload, loadFileUpload } = require("../../utils/handleUploads");

  // API load ảnh, video
  router.get("/uploads/:name", loadFileUpload);

  // API tạo mới bài viết
  router.post(
    `${commonRoute}/posts`,
    upload.fields([{ name: "posts_file" }]),
    controller.createPostsCT
  );

  // API like bài viết
  router.post(`${commonRoute}/posts/like`, controller.likePostsCT);

  // API comment bài viết
  router.post(`${commonRoute}/posts/comment`, controller.commentPostsCT);

  // API lấy danh sách bài viết của người dùng
  router.get(`${commonRoute}/posts/:id`, controller.getListPostsCT);

  // API tìm kiếm người dùng và bài viết
  router.post(`${commonRoute}/search`, controller.searchCT);
};
