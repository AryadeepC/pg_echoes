const paginate = (query, total, page = 1, size = 10) => {
  const skip = (page - 1) * size;
  const pages = Math.ceil(total / size);
  query = query.skip(skip).limit(size);
  return [query, pages];
};

module.exports = paginate;
