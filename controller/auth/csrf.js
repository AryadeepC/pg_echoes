const csurf = require("csurf");
const csrfProtection = csurf({ cookie: { httpOnly: true } });

const crosSol = (req, res) => {
  return res.send();
};

module.exports = {
  crosSol,
};
