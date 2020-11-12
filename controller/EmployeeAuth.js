const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const brcrypt = require("bcrypt");
const axios = require("axios");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const Employee = require("../model/Employee");
const Organization = require("../model/Organization");

exports.createEmployee = async (req, res, next) => {
    const { email, organization } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(
            "Validation failed, entered data is incorrect."
        );
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    await Organization.findById(organization)
        .then(async (org) => {
            if (!org) {
                const error = new Error("Could not find organization.");
                error.status = 404;
                throw error;
            } else {
                await Employee.find({ email }).then(async (result) => {
                    if (result.length > 0) {
                        const error = new Error(
                            "Validation failed, employee already exists for the email."
                        );
                        error.statusCode = 422;
                        error.data = errors.array();
                        throw error;
                    } else {
                        const {
                            name,
                            gender,
                            username,
                            password,
                            dob,
                        } = req.body;
                        const generatedPassword = crypto
                            .randomBytes(3)
                            .toString("hex");
                        brcrypt.genSalt(5, function (err, salt) {
                            brcrypt.hash(generatedPassword, salt, function (
                                err,
                                hash
                            ) {
                                const employee = new Employee({
                                    name,
                                    gender,
                                    username,
                                    password,
                                    dob,
                                    organization,
                                    email,
                                    password: hash,
                                    username: name + "@" + org.name,
                                });
                                employee
                                    .save()
                                    .then(async (result) => {
                                        await res.status(200).json({
                                            message:
                                                "Employee created successfully",
                                            organization: result,
                                        });
                                        return result;
                                    })
                                    .then(async (res) => {
                                        const message = `Thank you for registering on HeaseR. We are happy to have you On board.\n Now manage your company ${res._id} related tasks with ease in your organization with us.
                \n\n\n.Your login username is - ${res.username}. Your login password is - ${hash}`;
                                        await sendEmail({
                                            email: email,
                                            subject: "Heaser Registration",
                                            message: message,
                                        });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            });
                        });
                    }
                });
            }
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);

    const { username, password } = req.body;
    try {
        if (!username || !password) {
            const error = new Error(
                "Please provide username and password during registration."
            );
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        await Employee.findOne({ username })
            .select("+password")
            .exec()
            .then(async (employee) => {
                if (!employee) {
                    const error = new Error(
                        "Validation failed, no employee exists for the username."
                    );
                    error.statusCode = 422;
                    throw error;
                }
                const isMatch = password === employee.password;
                if (!isMatch) {
                    const error = new Error(
                        "Validation failed, employee password do not match."
                    );
                    error.statusCode = 422;
                    throw error;
                }
                const token = await jwt.sign(
                    {
                        email: employee.email,
                        userId: employee._id.toString(),
                    },
                    "HeaseRcredentials",
                    { expiresIn: "1h" }
                );
                await res.status(200).json({
                    message: "Logged in successfully!",
                    token: token,
                    userId: employee._id.toString(),
                    user: employee,
                });
            });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;
    Employee.findById(id)
        .select("+password")
        .exec()
        .then((result) => {
            if (!result) {
                const error = new Error(
                    "Validation failed, no employee exists for the email."
                );
                error.statusCode = 422;
                throw error;
            } else {
                const isMatch = currentPassword === result.password;
                if (!isMatch) {
                    const error = new Error(
                        "Validation failed, employee password do not match."
                    );
                    error.statusCode = 422;
                    throw error;
                }
                result.password = newPassword;
                return result.save();
            }
        })
        .then((result) => {
            res.status(200).json({
                message: "User password changed successfully",
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};
