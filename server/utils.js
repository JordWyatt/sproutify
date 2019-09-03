const hasDatePassed = timestamp => {
  const now = new Date();
  const then = new Date(timestamp);
  if (then <= now) {
    console.log(`${then} is before ${now}`);
    return true;
  } else {
    console.log(`${then} is after ${now}`);
    return false;
  }
};

module.exports = { hasDatePassed };
