const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const apiError = require("../utils/apiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.createUser(
    name,
    email,
    hashedPassword,
    phone,
    address
  );
  user.password = undefined;
  res.status(201).send({
    success: true,
    message: "user created successfully",
    user: user,
  });
});

const loginController = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) {
    return next(new apiError(`invalid Email`));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new apiError(`invalid password`));
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,});
  user.password = undefined;
  res.status(200).send({
    success: true,
    message: "login successfully",
    token,
    user: user,
  });
});

const updateUserController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const existingUser = await userModel.findById(id);
  if (!existingUser) {
    return next(new apiError(`no user found for this id ${id}`,404));
  }
  const {   name=existingUser.name,
            email=existingUser.email,
            phone=existingUser.phone,
            address=existingUser.address
        } = req.body;

  const user = await userModel.updateUser(id, name, email, phone, address);
  user.password = undefined;
  res.status(200).send({
    success: true,
    message: "user updated successfully",
    user: user,
  });
});
module.exports = {
  registerController,
  loginController,
  updateUserController,
};
