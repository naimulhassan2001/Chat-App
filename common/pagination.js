const common = {};

common.pagination = (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const options = {
    page,
    limit,
  };
  return options;
};

module.exports = common;
