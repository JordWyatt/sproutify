const hasDatePassed = timestamp => {
  const now = new Date();
  const then = new Date(timestamp);
  return then <= now;
};

module.exports = { hasDatePassed };
