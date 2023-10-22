/* 
    error response controller
*/
exports.errorResponse = (
  res,
  { statusCode = 500, message = "Internal server error" }
) => {
  return res
    .status(statusCode)
    .json({ success: false, status: statusCode, message });
};

/* 
    success response controller
*/
exports.successResponse = (
  res,
  { statusCode = 200, message = "Success", payload = null }
) => {
  if (payload === null) {
    return res
      .status(statusCode)
      .json({ success: true, status: statusCode, message });
  }
  return res
    .status(statusCode)
    .json({ success: true, status: statusCode, message, payload });
};
