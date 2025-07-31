import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css'

function App() {
  const socketRef = useRef(null);
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);


  useEffect(() => {
    console.log('App mounted');

    socketRef.current = io('http://localhost:3000', {
      transports: ['polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server:', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Connection failed:', err.message);
    });

    socketRef.current.on('receive_message', (data) => {
      setChat(prev => [...prev, data]);
    });


    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleSend = () => {
    if (message.trim()) {
      socketRef.current.emit('send_message', {
        text: message,
        sender: username
      });
      setMessage('');
    }
  };


  if (!hasJoined) {
  return (
    <div className="container">
      <h1>Join Chat</h1>
      <div className="input-group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your nickname"
        />
        <button onClick={() => setHasJoined(true)} disabled={!username.trim()}>
          Join
        </button>
      </div>
    </div>
  );
}



return (
  <div className="container">
    <h1>Socket.IO Chat App</h1>

    <div className="chat-box">
      {chat.map((msg, i) => (
        <div key={i} className="message">
          <strong>{msg.sender}:</strong> {msg.text}
        </div>
      ))}
    </div>

    <div className="input-group">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  </div>
);

}

export default App;
