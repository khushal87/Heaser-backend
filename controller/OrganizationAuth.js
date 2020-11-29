const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const brcrypt = require("bcrypt");
const axios = require("axios");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const Organization = require("../model/Organization");

exports.createOrganization = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(
            "Validation failed, entered data is incorrect."
        );
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { email } = req.body;
    await Organization.find({ email })
        .then(async (result) => {
            const {
                name,
                roles,
                address,
                country,
                pincode,
                phone,
                email,
                website,
            } = req.body;
            const generatedPassword = crypto.randomBytes(3).toString("hex");
            brcrypt.genSalt(5, function (err, salt) {
                brcrypt.hash(generatedPassword, salt, function (err, hash) {
                    console.log(hash);
                    const org = new Organization({
                        name,
                        email,
                        roles,
                        address,
                        country,
                        pincode,
                        phone,
                        website,
                        password: hash,
                    });

                    org.save()
                        .then(async (result) => {
                            await res.status(200).json({
                                message: "Organization created successfully",
                                organization: result,
                            });
                        })
                        .then(async (res) => {
                            const message = `Thank you for registering on HeaseR. We are happy to have you On board.\n Now manage you HR related tasks with ease in your organization with us.
                \n\n\n. Your login password is - ${hash}`;
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
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.loginOrganization = async (req, res, next) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            const error = new Error(
                "Please provide email and password during registration."
            );
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        await Organization.findOne({ email })
            .select("+password")
            .exec()
            .then(async (organization) => {
                if (!organization) {
                    const error = new Error(
                        "Validation failed, no organization exists for the email."
                    );
                    error.statusCode = 422;
                    throw error;
                }
                const isMatch = password === organization.password;
                if (!isMatch) {
                    const error = new Error(
                        "Validation failed, organization password do not match."
                    );
                    error.statusCode = 422;
                    throw error;
                }
                const token = await jwt.sign(
                    {
                        email: organization.email,
                        userId: organization._id.toString(),
                    },
                    "HeaseRcredentials",
                    { expiresIn: "1h" }
                );
                console.log(token);
                await res.status(200).json({
                    message: "Logged in successfully!",
                    token: token,
                    userId: organization._id.toString(),
                    user: organization,
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
    Organization.findById(id)
        .then((result) => {
            if (!result) {
                const error = new Error(
                    "Validation failed, no organization exists for the email."
                );
                error.statusCode = 422;
                throw error;
            } else {
                const isMatch = currentPassword === result.password;
                if (!isMatch) {
                    const error = new Error(
                        "Validation failed, organization password do not match."
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
