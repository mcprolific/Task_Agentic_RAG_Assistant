import React, { useState } from "react";



const ChatInput = ({ onSend }) => {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() === "") return;
        onSend(input);
        setInput("");
    };

    return (
        <div className="flex gap-2 p-4 border-t border-gray-700 bg-gray-800">
            <input
                className="flex-1 px-4 py-2 rounded-md text-white bg-gray-700 focus:outline-none"
                placeholder="Ask your agent..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
                className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
                onClick={handleSend}
            >
                Send
            </button>
        </div>
    );
}

export default ChatInput;