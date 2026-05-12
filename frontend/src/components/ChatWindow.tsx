import { Message, User } from '../models/types';
import { useRef, useEffect, useState } from 'react';
import { Settings, Sun, Moon, X, MoreVertical } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  users: User[];
  currentUser: User | null;
}

const getUserName = (userId: string, users: User[]) => {
    const user = users.find(u => u.id === userId);
    return user ? user.nickname : 'Unknown User';
}

export const ChatWindow = ({ messages, users, currentUser }: ChatWindowProps) => {
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleMenuToggle = (messageId: string) => {
    setOpenMenuId(openMenuId === messageId ? null : messageId);
  };

  return (
    <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => {
                const isCurrentUser = msg.sender_id === currentUser?.id;
                const messageAlignment = isCurrentUser ? 'items-end' : 'items-start';
                const messageBg = isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black';

                return (
                    <div key={msg.id} className={`flex flex-col ${messageAlignment} mb-4`}>
                        <div className="font-bold text-sm mb-1">
                            {getUserName(msg.sender_id, users)}
                        </div>
                        <div className={`relative group rounded-lg p-3 max-w-xs lg:max-w-md ${messageBg}`}>
                            <p>{msg.content}</p>
                            <div className="absolute top-0 right-0 mt-1 mr-1 flex items-center">
                                {isCurrentUser && (
                                    <div className="relative">
                                        <button onClick={() => handleMenuToggle(msg.id)} className="focus:outline-none">
                                            <MoreVertical className="h-4 w-4 text-white" />
                                        </button>
                                        {openMenuId === msg.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                );
            })}
            <div ref={endOfMessagesRef} />
        </div>
    </div>
  );
};
