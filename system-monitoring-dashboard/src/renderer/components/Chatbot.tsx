import React, { useState } from 'react';

const Chatbot: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, `You: ${input}`]);
            setInput('');
            // Here you can add logic to handle the chatbot response
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Chatbot</h2>
                <button className="chatbot-close" aria-label="Close chatbot" onClick={() => {/* Close logic */}}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="chatbot-body">
                <div className="chatbot-message">
                    {messages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className="chatbot-send" onClick={handleSend} aria-label="Send message">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default Chatbot;