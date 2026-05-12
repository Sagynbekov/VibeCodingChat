import { useState, useEffect } from 'react';
import { UserList } from './components/UserList';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { User, Message } from './models/types';
import { getUsers, getMessages, createMessage } from './services/api';

type AuthPage = 'login' | 'signup';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<AuthPage>('login');

  const fetchAllData = async () => {
    try {
        const usersData = await getUsers();
        setUsers(usersData);
        
        const messagesData = await getMessages();
        setMessages(messagesData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('vibechat_user');
    if (loggedInUser) {
        const user: User = JSON.parse(loggedInUser);
        setCurrentUser(user);
    }
  }, []);


  useEffect(() => {
    if (currentUser) {
        fetchAllData();
        const intervalId = setInterval(fetchAllData, 5000);
        return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  const handleSendMessage = async (text: string) => {
    if (!currentUser) {
        alert("Please log in to send a message.");
        return;
    };
    try {
        await createMessage(currentUser.id, text);
        const messagesData = await getMessages();
        setMessages(messagesData);
    } catch (error) {
        console.error("Failed to send message:", error);
    }
  };

  const handleAuthSuccess = (user: User) => {
      localStorage.setItem('vibechat_user', JSON.stringify(user));
      setCurrentUser(user);
  }

  const handleLogout = () => {
      localStorage.removeItem('vibechat_user');
      setCurrentUser(null);
      setAuthPage('login');
  }

  if (!currentUser) {
      if (authPage === 'login') {
          return <Login onLoginSuccess={handleAuthSuccess} switchToSignUp={() => setAuthPage('signup')} />
      }
      return <SignUp onSignUpSuccess={handleAuthSuccess} switchToLogin={() => setAuthPage('login')} />
  }

  return (
    <div className="flex h-screen bg-white">
        <div className="w-1/4 border-r border-gray-200 p-4 flex flex-col">
            <UserList users={users} onSelectUser={() => {}} selectedUser={currentUser} />
            <div className="mt-auto">
                <button 
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Logout
                </button>
            </div>
        </div>
      <div className="flex-1 flex flex-col">
        <ChatWindow messages={messages} users={users} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
