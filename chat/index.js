const Message = require("../model/Message");
const chatController = require("../controller/ChatController");
const Employee = require("../model/Employee");
const Organization = require("../model/Organization");
const Notification = require("../model/Notification");

const { rooms } = require("../singleton");

module.exports = function (io) {
    io.on("connection", (client) => {
        client.on("userIsOnline", chatController.handlerUserIsOnline);

        client.on("userIsOffine", chatController.handlerUserIsOffline);

        client.on("getOrganizationMembers", async (orgId) => {
            const orgObj = await Employee.find({
                organization: orgId,
            });
            client.emit("onOrganizationMembers", orgObj);
        });

        client.on("disconnect", () => {
            //console.log(client.id, 'disconnected')
        });

        client.on("sendJoinRequest", async (joinParams) => {
            let messageHistory;
            console.log(joinParams);
            switch (joinParams.joinType) {
                case "organization": {
                    messageHistory = await Message.find({
                        roomId: joinParams.roomId,
                    })
                        .populate({ path: "from" })
                        .sort({ createdAt: 1 });
                    console.log(messageHistory);
                    client.join(joinParams.roomId);
                    io.to(joinParams.roomId).emit(
                        "getChatHistory",
                        messageHistory
                    );
                    break;
                }
                case "employee": {
                    console.log("hii");
                    let roomInRoomList = rooms.find(
                        (room) => room === joinParams.roomId
                    );
                    let reverseRoomId = joinParams.roomId
                        .split("|")
                        .reverse()
                        .join("|");
                    let reverseRoomIdInList = rooms.find(
                        (room) => room === reverseRoomId
                    );

                    if (!!roomInRoomList) {
                        client.join(joinParams.roomId);
                        messageHistory = await Message.find({
                            roomId: joinParams.roomId,
                        }).sort({ createdAt: 1 });
                        io.to(joinParams.roomId).emit(
                            "getChatHistory",
                            messageHistory
                        );
                    } else if (!!reverseRoomIdInList) {
                        client.join(reverseRoomId);
                        messageHistory = await Message.find({
                            roomId: reverseRoomId,
                        }).sort({ createdAt: 1 });
                        io.to(reverseRoomId).emit(
                            "getChatHistory",
                            messageHistory
                        );
                    } else {
                        rooms.push(joinParams.roomId);
                        client.join(joinParams.roomId);
                        messageHistory = await Message.find({
                            roomId: joinParams.roomId,
                        }).sort({ createdAt: 1 });
                        io.to(joinParams.roomId).emit(
                            "getChatHistory",
                            messageHistory
                        );
                    }
                    break;
                }
            }
        });

        client.on("chatMessage", async (obj) => {
            switch (obj.type) {
                case "organization": {
                    const orgObj = await Organization.findById(obj.from);
                    io.to(obj.roomId).emit("newMessage", {
                        from: orgObj,
                        to: obj.to,
                        text: obj.msg,
                        createdAt: Date.now(),
                        roomId: obj.roomId,
                    });
                    await Message.create({
                        from: obj.from,
                        to: obj.to,
                        text: obj.msg,
                        roomId: obj.roomId,
                    });

                    await Employee.find({ organization: obj.to }).then(
                        async (result) => {
                            result.map((item) => {
                                if (item._id !== obj.from) {
                                    return Notification.create({
                                        message: `You have a new message in your Organization Workspace`,
                                        operation: "Workspace",
                                        actor: item._id,
                                    });
                                }
                            });
                        }
                    );

                    break;
                }
                case "employee": {
                    const empObj = await Employee.findById(obj.from);

                    let roomInRoomList = rooms.find(
                        (room) => room === obj.roomId
                    );
                    let reverseRoomId = obj.roomId
                        .split("|")
                        .reverse()
                        .join("|");
                    let reverseRoomIdInList = rooms.find(
                        (room) => room === reverseRoomId
                    );
                    if (!!roomInRoomList) {
                        io.to(obj.roomId).emit("newMessage", {
                            from: empObj,
                            to: obj.to,
                            text: obj.msg,
                            createdAt: Date.now(),
                            roomId: obj.roomId,
                        });
                        await Message.create({
                            from: obj.from,
                            to: obj.to,
                            text: obj.msg,
                            roomId: obj.roomId,
                        });
                        await Notification.create({
                            message: `You have a new message in your Organization from ${obj.from}`,
                            operation: "Workspace",
                            actor: obj.to,
                        });
                    } else if (!!reverseRoomIdInList) {
                        io.to(reverseRoomId).emit("newMessage", {
                            from: empObj,
                            to: obj.to,
                            text: obj.msg,
                            createdAt: Date.now(),
                            roomId: reverseRoomId,
                        });
                        await Message.create({
                            from: obj.from,
                            to: obj.to,
                            text: obj.msg,
                            roomId: reverseRoomId,
                        });
                        await Notification.create({
                            message: `You have a new message in your Organization from ${obj.from}`,
                            operation: "Workspace",
                            actor: obj.to,
                        });
                    } else {
                        io.to(obj.roomId).emit("newMessage", {
                            from: empObj,
                            to: obj.to,
                            text: obj.msg,
                            createdAt: Date.now(),
                            roomId: obj.roomId,
                        });
                        await Message.create({
                            from: obj.from,
                            to: obj.to,
                            text: obj.msg,
                            roomId: obj.roomId,
                        });
                        await Notification.create({
                            message: `You have a new message in your Organization from ${obj.from}`,
                            operation: "Workspace",
                            actor: obj.to,
                        });
                    }
                    break;
                }
            }
        });
    });
};
