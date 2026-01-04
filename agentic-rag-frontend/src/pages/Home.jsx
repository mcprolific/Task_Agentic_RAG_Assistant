import React, { useState } from "react";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import ChatSidebar from "../components/ChatSidebar";
import DarkModeToggle from "../components/DarkModeToggle";
import { queryAgent } from "../api/agentApi";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [sessionId, setSessionId] = useState("default_session");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (msg) => {
    setMessages([...messages, { content: msg, user: true }]);
    setLoading(true);

    try {
      const res = await queryAgent(msg, sessionId);
      setMessages((prev) => [
        ...prev,
        { content: res.answer, user: false, usedRetrieval: res.used_retrieval },
      ]);

      if (!history.find((h) => h.id === sessionId)) {
        setHistory([...history, { id: sessionId }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { content: "Error: " + err.message, user: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectSession = (id) => {
    setSessionId(id);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <ChatSidebar history={history} onSelect={selectSession} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <h1 className="text-2xl font-bold">Agentic RAG Assistant</h1>
          {/* <DarkModeToggle /> */}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg.content}
              isUser={msg.user}
              usedRetrieval={msg.usedRetrieval}
            />
          ))}
          {loading && (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Agent is thinking...
            </p>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
};

export default Home;
