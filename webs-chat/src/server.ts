


import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });

// user structure
interface User {
    socket: WebSocket;
    room: string;
}

// all connected users
let allSockets: User[] = [];

// rooms store karne ke liye (unique)
let rooms: Set<string> = new Set();

wss.on("connection", (socket) => {

    socket.on("message", (message) => {

        let parsedMessage;

        // 🛑 safe JSON parsing
        try {
            parsedMessage = JSON.parse(message.toString());
        } catch {
            socket.send("Invalid JSON");
            return;
        }

        console.log("received:", parsedMessage);

        // 🟢 CREATE ROOM
        if (parsedMessage.type === "create") {

            const roomId = parsedMessage.payload.roomId;

            // check room exist karta hai ya nahi
            if (rooms.has(roomId)) {
                socket.send("Room already exists");
                return;
            }

            // new room create
            rooms.add(roomId);

            socket.send("Room created: " + roomId);
        }

        // 🔵 JOIN ROOM
        if (parsedMessage.type === "join") {

            const roomId = parsedMessage.payload.roomId;

            // check room exist karta hai ya nahi
            if (!rooms.has(roomId)) {
                socket.send("Room does not exist");
                return;
            }

            // ❗ duplicate avoid (important)
            allSockets = allSockets.filter(user => user.socket !== socket);

            // user ko room assign karo
            allSockets.push({
                socket,
                room: roomId
            });

            socket.send("Joined room: " + roomId);
        }

        // 💬 CHAT
        if (parsedMessage.type === "chat") {

            let currentUserRoom: string | null = null;

            // find user room
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket === socket) {
                    currentUserRoom = allSockets[i].room;
                    break;
                }
            }

            // agar user ne join nahi kiya
            if (!currentUserRoom) {
                socket.send("Join a room first");
                return;
            }

            // same room ke sab users ko message bhejo
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room === currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });

    // ❌ disconnect handle
    socket.on("close", () => {
        allSockets = allSockets.filter(user => user.socket !== socket);
    });
});





// import { WebSocketServer, WebSocket } from "ws";

// const wss = new WebSocketServer({ port: 8000 });

// // User ka structure
// interface User {
//     socket: WebSocket;
//     room: string;
// }

// // connected users list
// let allSockets: User[] = [];

// // rooms store karne ke liye
// let rooms: Set<string> = new Set();

// wss.on("connection", (socket) => {

//     socket.on("message", (message) => {

//         const parsedMessage = JSON.parse(message.toString());
//         console.log("received message", parsedMessage);

//         // 🟢 CREATE ROOM
//         if (parsedMessage.type === "create") {

//             const roomId = parsedMessage.payload.roomId;

//             // check karo room already exist hai ya nahi
//             if (rooms.has(roomId)) {
//                 socket.send("Room already exists");
//                 return;
//             }

//             rooms.add(roomId); // room create
//             socket.send("Room created successfully");
//         }

//         // 🔵 JOIN ROOM
//         if (parsedMessage.type === "join") {

//             const roomId = parsedMessage.payload.roomId;

//             // check karo room exist karta hai ya nahi
//             if (!rooms.has(roomId)) {
//                 socket.send("Room does not exist");
//                 return;
//             }

//             // user ko room me add karo
//             allSockets.push({
//                 socket,
//                 room: roomId
//             });

//             socket.send("Joined room " + roomId);
//         }

//         // 💬 CHAT
//         if (parsedMessage.type === "chat") {

//             let currentUserRoom: string | null = null;

//             // find karo user ka room
//             for (let i = 0; i < allSockets.length; i++) {
//                 if (allSockets[i].socket === socket) {
//                     currentUserRoom = allSockets[i].room;
//                     break;
//                 }
//             }

//             // agar room nahi mila
//             if (!currentUserRoom) {
//                 socket.send("Join room first");
//                 return;
//             }

//             // same room ke sabko message bhejo
//             for (let i = 0; i < allSockets.length; i++) {
//                 if (allSockets[i].room === currentUserRoom) {
//                     allSockets[i].socket.send(parsedMessage.payload.message);
//                 }
//             }
//         }
//     });

//     // ❌ disconnect handle
//     socket.on("close", () => {
//         allSockets = allSockets.filter(user => user.socket !== socket);
//     });
// });
