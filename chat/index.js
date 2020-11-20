const Message = require("../model/Message");
const chatController = require("../controller/ChatController");
const Employee = require("../model/Employee");
const Organization = require("../model/Organization");

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
                    }).sort({ createdAt: 1 });
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
            const empObj = await Employee.findById(obj.from);
            switch (obj.type) {
                case "organization": {
                    io.to(obj.roomId).emit("newMessage", {
                        from: empObj._id,
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
                    break;
                }
                case "employee": {
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
                            from: empObj._id,
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
                    } else if (!!reverseRoomIdInList) {
                        io.to(reverseRoomId).emit("newMessage", {
                            from: empObj._id,
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
                    } else {
                        io.to(obj.roomId).emit("newMessage", {
                            from: empObj._id,
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
                    }
                    break;
                }
            }
        });
    });
};
