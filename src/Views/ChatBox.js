
import React, { useState } from 'react';
import './ChatBox.css';

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState('');

    const sendMessage = (e) => {
        e.preventDefault();
        if (query.trim() !== '') {
            const newMessage = { id: messages.length + 1, text: query, sender: 'user' };
            setMessages([...messages, newMessage]);
            setQuery('');
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(file);
        }
    };

    return (
        <div className="chatbox-container">
            <div className="messages-container">
                {messages.map((msg) => (

                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                    
                    
                ))}
                <div className="message-input">
                    "RECIEVED"
                </div>
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
            <div className="file-upload-container">
                <label htmlFor="file-upload" className="file-upload-label">Upload a PDF</label>
                <input id="file-upload" type="file" accept=".pdf" onChange={handleFileUpload} className="file-input"/>
            </div>
        </div>
    );
}

export default ChatBox;
