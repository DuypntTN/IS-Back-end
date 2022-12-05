const { validateCheck, validateExistence } = require("../helps/ValidationBody");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const bcrypt = require('bcryptjs');
const { findOne, findAll, insertOne, update_One } = require("../services/DatabaseServices");
const Collections = require("../services/Collections");
const ObjectId = require('mongodb').ObjectId;

const getUserDetails = async (user_id) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const userInfo = await findOne(new Collections().user, { _id: ObjectId(user_id) });
      if (userInfo) {
        console.log(userInfo);
        resolve(userInfo);
      } else {
        console.log(userInfo);
        reject("User not found");
      }
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

const getUserList = async () => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const userList = await findAll(new Collections().user, {});
      if (userList) {
        console.log("userList ", userList);
        resolve(userList);
      }
      else {
        reject("userList not found");
      }
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

const signIn = async (userAccount) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const result = await findOne(new Collections().user, { username: userAccount.username });
      if (result) {
        console.log(result);
        console.log("username found");
        if (!bcrypt.compareSync(userAccount.password, result.password)) {
          console.log("Wrong password");
          reject("Wrong username or password");
        }
        console.log("Sign in successfully");
        resolve(result);
      }
      else {
        console.log("username not found");
      }
      reject("Wrong username or password");
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

const signUp = async (newAccount) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      console.log("newAccount", newAccount);
      // Validate
      validateCheck(
        {
          username: newAccount.username,
          email: newAccount.email,
          password: newAccount.password,
          phoneNumber: newAccount.phoneNumber,
          userType: newAccount.userType,
        },
        newAccount);

      // Check if username already exists
      if (await validateExistence(newAccount.username)) {
        console.log("username already exists");
        reject("username already exists");
      }
      else {
        // Add info to User class
        const newUser = new User();
        console.log("User_Id", newUser._id);

        // hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newAccount.password, salt);

        // Set user's info
        newUser.password = hash;
        newUser.setInfo(newAccount);

        // Create a hotel for hotel owner
        if (newAccount.userType === newUser.getTypeUser().Hotel) {
          validateCheck(
            {
              licenseNumber: newAccount.licenseNumber,
              hotelName: newAccount.hotelName,
              hotelAddress: newAccount.hotelAddress,
              hotelPhoneNumber: newAccount.hotelPhoneNumber,
            },
            newAccount);
          newHotel = new Hotel();
          console.log("Hotel_Id", newHotel._id);

          newUser.hotelId = newHotel._id;
          newHotel.userId = newUser._id;
          newHotel.setInfo(newAccount);
        }

        // Insert to database
        try {
          const insertUserResult = await insertOne(new Collections().user, newUser);
          if (insertUserResult["acknowledged"] === true) {
            console.log("Insert new user successfully");

            if (newAccount.userType === newUser.getTypeUser().Hotel) {
              try {
                const insertHotelResult = await insertOne(new Collections().hotel, newHotel);

                if (insertHotelResult["acknowledged"] === true) {
                  console.log("Insert new hotel successfully");
                } else {
                  console.log("Insert new hotel failed");
                  reject("Create new hotel failed");
                }

              } catch (err) {
                console.log(err);
                reject(err);
              }
            }

            try {
              const findResult = await findOne(new Collections().user, { username: newAccount.username });
              if (findResult) {
                console.log("Find successfully");
                resolve(findResult);
              }
              else {
                console.log("Find failed");
                reject("Cannot find user");
              }
            } catch (err) {
              console.log(err);
              reject(err);
            }

          }
          else {
            console.log("Insert new user failed");
            reject("Sign up failed");
          }
        } catch (err) {
          reject(err);
        }
      }

    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

const changeUserInfo = async (userChangeInfo) => { // no update username, password
  const promise = new Promise(async (resolve, reject) => {
    try {
      // Update information
      const updateResult = await update_One(new Collections().user, { username: userChangeInfo.username }, userChangeInfo);
      if (updateResult["matchedCount"] === 0) {
        console.log("user not found!");
        reject("user not found!");

      } else {
        console.log("update sucessfully");
        try {
          const findResult = await findOne(new Collections().user, { username: userChangeInfo.username });
          if (findResult) {
            console.log("Find successfully");
            resolve(findResult);
          } else {
            console.log("Find failed");
            reject("Cannot find user");
          }
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }

    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

const changePassword = async (userChangePassword) => {
  return new Promise(async (resovle, reject) => {
    try {
      const result = await findOne(new Collections().user, { _id: ObjectId(userChangePassword["_id"]) });
      if (result) {
        console.log("user found");
        if (!bcrypt.compareSync(userChangePassword.old_password, result.password)) {
          console.log("Wrong password");
          reject("Wrong password");
        }
        else {
          // hash password
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(userChangePassword.new_password, salt);

          const updatePassword = await update_One(new Collections().user, { _id: ObjectId(userChangePassword["_id"]) }, { password: hash });
          if (updatePassword["matchedCount"] === 0) {
            console.log("user not found!");
            reject("Update password failed!");
          } else {
            console.log("Update password successfully");
            resovle("Update password successfully");
          }
        }
      } else {
        console.log("user not found");
        reject("User not found");
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

module.exports = {
  getUserDetails,
  signIn,
  getUserList,
  signUp,
  changeUserInfo,
  changePassword,
};