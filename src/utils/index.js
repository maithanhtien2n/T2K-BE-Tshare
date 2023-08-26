const checkNull = (body, fields) => {
  const missingFields = [];
  fields.forEach((field) => {
    if (!body[field] || body[field].trim() === "") {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    throw {
      statusCode: 240,
      statusValue: "Lỗi code không kiểm tra null!",
    };
  }
};

module.exports = {
  onResponse: async (req, res, onModel, { checkData = [], data }) => {
    try {
      if (checkData[0]) checkNull(req.body, checkData);

      const response = await onModel(data);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        statusValue: "OK",
        data: response,
      });
    } catch (error) {
      return res.json({
        success: false,
        statusCode: error.statusCode ? error.statusCode : 204,
        statusValue: error.statusValue ? error.statusValue : error,
        data: null,
      });
    }
  },

  throwError: (statusCode, statusValue) => {
    throw {
      statusCode,
      statusValue,
    };
  },

  removeVietnameseAccents: (str) => {
    const mapAccents = {
      a: "áàảãạăắằẳẵặâấầẩẫậ",
      e: "éèẻẽẹêếềểễệ",
      i: "íìỉĩị",
      o: "óòỏõọôốồổỗộơớờởỡợ",
      u: "úùủũụưứừửữự",
      y: "ýỳỷỹỵ",
      d: "đ",
    };

    for (let char in mapAccents) {
      const accents = mapAccents[char];
      const regex = new RegExp(`[${accents}]`, "g");
      str = str.replace(regex, char);
    }

    return str;
  },
};
