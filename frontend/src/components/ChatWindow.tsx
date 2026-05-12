import { Message, User } from '../models/types';

interface ChatWindowProps {
  messages: Message[];
  users: User[];
}

const getUserName = (userId: string, users: User[]) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
}

export const ChatWindow = ({ messages, users }: ChatWindowProps) => {
  return (
    <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
            <div key={msg.id} className="mb-4">
                <div className="font-bold">{getUserName(msg.user_id, users)}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
            </div>
            ))}
        </div>
    </div>
  );
};
