require("./db/conn");

//cron jobs
require("./job/Task");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");

//App Routes
const OrganizationRoutes = require("./routes/Organization");
const EmployeeRoutes = require("./routes/Employee");
const TaskRoutes = require("./routes/Task");
const TimeRoutes = require("./routes/Time");
const LeaveRoutes = require("./routes/Leave");
const AnnouncementRoutes = require("./routes/Announcement");
const ChatRoutes = require("./routes/Chat");
const NotificationRoutes = require("./routes/Notification");
const WakaTimeRoutes = require("./routes/Wakatime");

//App initialization
const app = express();

app.use(
    cors({
        origin: "*",
        preflightContinue: true,
        methods: "GET, HEAD, PUT, POST, DELETE",
    })
);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "application/pdf"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(cors());
app.use(morgan("dev"));
//App utilities
app.use(express.static(path.join(__dirname, "Public")));
app.use(bodyParser.urlencoded({ extended: false })); //x-www-form-urlencoded
app.use(
    bodyParser.json({
        limit: "50mb",
        extended: true,
    })
); //application/json
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
        limits: { fileSize: 15728640 },
    }).fields([{ name: "pan_attachment", maxCount: 1 }])
);

app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS,GET,POST,PUT,PATCH,DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});

app.use("/discuss", (req, res) => {
    console.log("hey");
    res.sendFile(path.join(__dirname, "view", "chat.html"));
});

app.use("/org", OrganizationRoutes);
app.use("/employee", EmployeeRoutes);
app.use("/task", TaskRoutes);
app.use("/time", TimeRoutes);
app.use("/leave", LeaveRoutes);
app.use("/announcement", AnnouncementRoutes);
app.use("/chat", ChatRoutes);
app.use("/notification", NotificationRoutes);
app.use("/wakatime", WakaTimeRoutes);

app.use(errorHandler);

module.exports = app;
