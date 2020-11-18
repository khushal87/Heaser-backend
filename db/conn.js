const mongoose = require("mongoose");
const constants = require("../config/dev");

mongoose.Promise = global.Promise;
mongoose.connect(constants.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
let db = mongoose.connection;
db.on("error", (e) => {
    throw new Error("> UNABLE TO CONNECT TO THE DATABASE! CHECK CONNECTION");
});
