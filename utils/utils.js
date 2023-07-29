const bcrypt = require("bcrypt");

function generateUniqueCode() {
  let characters = "0123456789";
  let code = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
    characters =
      characters.slice(0, randomIndex) + characters.slice(randomIndex + 1);
  }

  return code;
}

function generateHashedPassword(password) {
  return (hashedPassword = bcrypt.hashSync(password, 10));
}

module.exports = { generateUniqueCode, generateHashedPassword };
