const Err = (req, res, err) => {
  console.error(err);
  return res.send({ status: "error", message: err });
};

module.exports = { Err };
