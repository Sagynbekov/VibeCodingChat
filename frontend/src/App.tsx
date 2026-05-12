import { useState, useEffect } from 'react';
import { UserList } from './components/UserList';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { User, Message } from './models/types';
import { getUsers, getMessages, createMessage, createUser } from './services/api';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchAllData = async () => {
    try {
        const usersData = await getUsers();
        setUsers(usersData);
        if (usersData.length > 0 && !selectedUser) {
            setSelectedUser(usersData[0]);
        }

        const messagesData = await getMessages();
        setMessages(messagesData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Poll for new data every 5 seconds as a simple real-time mechanism
    const intervalId = setInterval(fetchAllData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!selectedUser) {
        alert("Please select a user to send a message.");
        return;
    };
    try {
        await createMessage(selectedUser.id, text);
        // Refetch messages to show the new one
        const messagesData = await getMessages();
        setMessages(messagesData);
    } catch (error) {
        console.error("Failed to send message:", error);
    }
  };
  
  // Simple user creation for demonstration
  useEffect(() => {
    const setupUsers = async () => {
        const currentUsers = await getUsers();
        if (currentUsers.length === 0) {
            await createUser("Alice");
            await createUser("Bob");
            const usersData = await getUsers();
            setUsers(usersData);
            setSelectedUser(usersData[0]);
        }
    }
    setupUsers();
  }, []);


  return (
    <div className="flex h-screen bg-white">
      <UserList users={users} onSelectUser={setSelectedUser} selectedUser={selectedUser} />
      <div className="flex-1 flex flex-col">
        <ChatWindow messages={messages} users={users} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
