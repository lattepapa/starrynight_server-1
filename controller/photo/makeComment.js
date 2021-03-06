const { Reply, Photo } = require("../../models");
const jwt = require("jsonwebtoken");
const KEY = process.env.SECRET_KEY;

module.exports = {
  post: async (req, res) => {
    try {
      // 클라이언트로부터 로그인 토큰정보, 댓글 단 사진의 경로, 댓글을 받아온다
      const { photoPath, comment } = req.body;
      const userToken = req.headers.authorization;

      // Token을 decoding 한다
      let token = userToken;
      let decode = jwt.verify(token, KEY);

      // 새 댓글 인스턴스를 만든다
      const photo = await Photo.findOne({ where: { photoPath: photoPath } });
      const newReply = await Reply.create({
        comment: comment,
        writerId: decode.id,
        photoId: photo.id,
      });

      // 댓글 생성 성공 시 success: true 값을 보내준다
      res.status(201).json({ ...newReply, success: true });
    } catch (err) {
      // 댓글 생성 실패 시 success: false 값을 보내준다
      res.status(500).json({ success: false });
    }
  },
};
