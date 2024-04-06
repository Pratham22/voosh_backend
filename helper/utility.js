import jwt from "jsonwebtoken";

const generateJWTToken = (data) => {
    var token = jwt.sign(data,  "enter-secret-key", {
      expiresIn: 604800,
    });
    return token;
  };

  export {generateJWTToken}