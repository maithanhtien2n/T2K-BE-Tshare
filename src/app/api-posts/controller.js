const model = require("./model");
const { onResponse } = require("../../utils/index");

module.exports = {
  createPostsCT: async (req, res) => {
    const { user_id, posts_content, type_file } = req.body;

    // Đường dẫn tệp ảnh banner
    const posts_file = `http://${req.headers.host}/uploads/${
      req.files["posts_file"] === undefined
        ? "null"
        : req.files["posts_file"][0].filename
    }`;

    await onResponse(req, res, model.createPostsMD, {
      checkData: ["user_id"],
      data: { user_id, posts_content, posts_file, type_file },
    });
  },

  likePostsCT: async (req, res) => {
    await onResponse(req, res, model.likePostsMD, {
      data: ({ posts_id, user_id } = req.body),
    });
  },

  commentPostsCT: async (req, res) => {
    await onResponse(req, res, model.commentPostsMD, {
      data: ({ posts_id, user_id, comment_content } = req.body),
    });
  },

  getListPostsCT: async (req, res) => {
    await onResponse(req, res, model.getListPostsMD, {
      data: { user_id: req.params.id },
    });
  },

  searchCT: async (req, res) => {
    const { key_search, searchByUser, searchByPosts } = req.body;
    await onResponse(req, res, model.searchMD, {
      checkData: ["key_search"],
      data: { key_search, searchByUser, searchByPosts },
    });
  },
};
