const { User } = require('../../models');

const findOverlap = async function (...args) {
  let bool = [];

  bool.push(await User.findOne({ where: { email: args[0] } }));
  bool.push(await User.findOne({ where: { nickname: args[1] } }));
  bool.push(await User.findOne({ where: { mobile: args[2] } }));

  for (let i = 0; bool.length; i++) {
    if (!bool[i]) {
      return false;
    }
  }
  return true;
}

module.exports = {
  post: async (req, res) => {
    const { email, nickname, mobile, password, loginPlatformId } = req.body;

    if (!email || !nickname || !mobile || !password || !loginPlatformId) {
      res.status(422).send('정보를 다 입력해주세요');
    }

    let overlap = await findOverlap(email, nickname, mobile);
    console.log('판별 : ', overlap);
    if (overlap) {
      const defaultProfilePath = process.env.DEFAULT_IMG;

      const newUser = await User
        .findOrCreate({
          where: { email, nickname },
          defaults: {
            mobile: mobile,
            password: password,
            loginPlatformId: 1,
            profilePath: defaultProfilePath
          }
        });

      if (newUser) {
        const [user, created] = newUser;

        try {
          res.status(201).json('회원가입이 완료되었습니다.');
        } catch (err) {
          res.sendStatus(500);
        }
      }

    } else {
      res.status(409).send('이미 존재하는 유저입니다.');
    }
  }
}
