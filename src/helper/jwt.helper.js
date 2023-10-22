const jwt = require("jsonwebtoken");

/* 
    jsonwebtoken helper function that is used to create a new token
*/

exports.createJWTToken = (payload, secretToken, expiresIn) => {
  try {
    if (typeof payload !== "object" || !payload) {
      throw new Error("Payload must be object and non empty");
    }

    if (typeof secretToken !== "string" || secretToken === "") {
      throw new Error("Secret token must be string and non empty");
    }

    const token = jwt.sign(payload, secretToken, { expiresIn });
    return token;
  } catch (error) {
    throw error;
  }
};
