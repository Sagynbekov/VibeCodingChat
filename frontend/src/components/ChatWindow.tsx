import { Message, User } from '../models/types';
import { useRef, useEffect } from 'react';

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

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

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
                        <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${messageBg}`}>
                            <p>{msg.content}</p>
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
