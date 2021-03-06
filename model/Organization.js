const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const organizationSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    roles: {
        type: Array,
        required: [true, "Defines roles in your Organization"],
    },
    address: {
        type: String,
        required: [true, "Please enter address of your organization"],
    },
    country: {
        type: String,
        required: [true, "Enter country of residence"],
    },
    pincode: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: [true, "Enter Organization contact number"],
    },
    email: {
        type: String,
        required: [true, "Enter Organization email id"],
    },
    website: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

organizationSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Organization", organizationSchema);
