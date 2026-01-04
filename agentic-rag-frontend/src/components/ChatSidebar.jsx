import React from 'react'

const ChatSidebar = ({ history, onSelect }) => {
    return (
        <div div className="w-64 p-4 bg-gray-900 border-r border-gray-700 flex flex-col gap-2 overflow-y-auto" >
            <h2 className="text-lg font-bold text-white mb-4">Sessions</h2>
            {
                history.map((session, idx) => (
                    <button
                        key={idx}
                        className="p-2 rounded-md text-left hover:bg-gray-700 text-white"
                        onClick={() => onSelect(session.id)}
                    >
                        {session.id}
                    </button>
                ))
            }
        </div>
    );
}

export default ChatSidebar;