const { validationResult } = require("express-validator");
const Organization = require("../model/Organization");

exports.getOrganizations = (req, res, next) => {
  Organization.find()
    .then((result) => {
      res.status(200).json({ message: "Organizations fetched", data: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
