
// import { useEffect, useRef, useState } from 'react';
// import './App.css'

// function App() {

//   const  [ message , setMessage] = useState (["Hi there" , "hello"]);
//   const wsRef = useRef();

//   useEffect(() =>{


//     const ws = new WebSocket ( "ws://localhost:8000");
//     ws.onmessage = (message) =>{
      
//       setMessage((prev) => [...prev, message.data])
    
//     }
//     wsRef.current = ws;

//     ws.onopen = () =>{
//       ws.send ( JSON.stringify({
//         type: "join" ,
//         payload : {
//           roomId : "red"
//         }
//       }))


//     }

//   } , [])
 

//   return (
//     <div className = 'h-screen bg-black' >
//       <br></br> <br/>
//      <div className = "h-[85vh]"> 
//       { message.map (message => <div className = "m-8"><span className = "text-black bg-white rounded p-4 ">
//         {message}</span></div>)}
//      </div>
//      <div className = "w-full bg-white flex">
//       <input id ="message" className = "flex-1 p-4"></input>
//       <button onClick ={() =>{

//          const message = document.getElementById("message")?.value;
//          wsRef.current.send( JSON.stringify({
//           type: "chat" ,
//           payload: {
//             message: message
//           }
//          }))
//       }} className = "bg-purple-600 text-white p-4" >
//         send message
//       </button>
 
//      </div>
//     </div>
//   )
// }

//  export default App


 import { useEffect, useRef, useState } from 'react';
import './App.css'

function App() {

  const [messages, setMessages] = useState<string[]>([]);
  const [roomId, setRoomId] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("Connected");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };

  }, []);

  return (
    <div className='h-screen bg-black text-white p-4'>

      {/* 🔹 ROOM SECTION */}
      <div className="flex gap-2 mb-4 ">
        <div className ="bg-white" > 
        <input
          placeholder="Enter room id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="p-2 text-black"
        /></div>

        <button
          onClick={() => {
            wsRef.current?.send(JSON.stringify({
              type: "create",
              payload: { roomId }
            }));
          }}
          className="bg-green-600 px-4"
        >
          Create
        </button>

        <button
          onClick={() => {
            wsRef.current?.send(JSON.stringify({
              type: "join",
              payload: { roomId }
            }));
          }}
          className="bg-blue-600 px-4"
        >
          Join
        </button>
      </div>

      {/* 🔹 MESSAGES */}
      <div className="h-[70vh] overflow-y-auto border p-2 flex flex-col justify-left">
        {messages.map((msg, i) => (
          <div key={i} className="m-2">
            <span className="bg-white text-black p-2 rounded">
              {msg}
            </span>
          </div>
        ))}
      </div>

      {/* 🔹 SEND MESSAGE */}
      <div className="w-full bg-white flex mt-4">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 p-2 text-black"
        />

        <button
          onClick={() => {
            if (!inputMessage) return;

            wsRef.current?.send(JSON.stringify({
              type: "chat",
              payload: { message: inputMessage }
            }));

            setInputMessage("");
          }}
          className="bg-purple-600 text-white p-2"
        >
          Send
        </button>
      </div>

    </div>
  )
}

export default App;