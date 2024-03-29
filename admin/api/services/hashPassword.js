const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
