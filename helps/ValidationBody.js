const { findOne } = require("../services/DatabaseServices");
const Collections = require("../services/Collections");

const validateCheck = (attr, body) => {
  Object.keys(attr).forEach((key) => {
    if (body[key] === undefined) {
      throw new Error(`${key} is required`);
    }
  });
};

const validateExistence = async (phone_number) => {
  try {
    const result = await findOne(new Collections().user, { phoneNumber: phone_number });
    console.log("result ", result);
    if (result) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

module.exports = {
  validateCheck,
  validateExistence,
};
