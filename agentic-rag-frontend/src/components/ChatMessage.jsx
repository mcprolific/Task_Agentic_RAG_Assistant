const ChatMessage = ({ message, isUser, usedRetrieval }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-lg px-4 py-2 rounded-lg break-words shadow-sm
          ${isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"}
        `}
      >
        {message}
        {usedRetrieval && !isUser && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            (retrieved)
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
