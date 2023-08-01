const Err = (req, res, err, code = 500) => {
  console.error(err);
  // return res.send({ status: "error", message: err });
  return res.status(code).send({ status: "error", message: err });
};

module.exports = { Err };
