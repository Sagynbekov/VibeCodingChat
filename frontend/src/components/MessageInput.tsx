import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 flex">
      <input
        type="text"
        className="flex-1 border rounded-l-md p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
      />
      <button
        className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
