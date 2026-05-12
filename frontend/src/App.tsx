import { useState, useEffect } from 'react';
import { UserList } from './components/UserList';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { User, Message } from './models/types';
import { getUsers, getMessages, createMessage } from './services/api';
import { Settings, Sun, Moon, X, Users as GroupIcon } from 'lucide-react';

type AuthPage = 'login' | 'signup';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

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
    const loggedInUserJSON = localStorage.getItem('vibechat_user');
    if (loggedInUserJSON && loggedInUserJSON !== 'undefined') {
        try {
            const user: User = JSON.parse(loggedInUserJSON);
            setCurrentUser(user);
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('vibechat_user');
        }
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
    if (!selectedUser) {
        alert("Please select a user to send a message to.");
        return;
    }
    try {
        await createMessage(currentUser.id, selectedUser.id, text);
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

    const filteredUsers = users.filter(user => user.id !== currentUser?.id);
  const conversationMessages = messages.filter(msg => 
    (msg.sender_id === currentUser?.id && msg.receiver_id === selectedUser?.id) ||
    (msg.sender_id === selectedUser?.id && msg.receiver_id === currentUser?.id)
  );

  const searchedMessages = conversationMessages.filter(msg => 
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
        <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
            <div className="p-4 bg-white rounded-lg shadow-sm mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Welcome, <span className="text-blue-600">{currentUser.nickname}</span></h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setIsGroupModalOpen(true)} className="focus:outline-none">
                        <GroupIcon className="h-6 w-6" />
                    </button>
                    <button onClick={() => setIsSettingsOpen(true)} className="focus:outline-none">
                        <Settings className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-sm w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Settings</h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="focus:outline-none">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Theme</h3>
                                <div className="flex items-center space-x-4">
                                    <button className="flex items-center space-x-2 p-2 rounded-md border w-full justify-center">
                                        <Sun className="h-5 w-5" />
                                        <span>Light</span>
                                    </button>
                                    <button className="flex items-center space-x-2 p-2 rounded-md border w-full justify-center bg-gray-800 text-white">
                                        <Moon className="h-5 w-5" />
                                        <span>Dark</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Avatar</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                                    <button className="font-semibold">Change Avatar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isGroupModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Create a Group</h2>
                    <button onClick={() => setIsGroupModalOpen(false)} className="focus:outline-none">
                        <X className="h-6 w-6" />
                    </button>
                    </div>
                    <div className="space-y-4 mb-6" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {users.map(user => (
                        <div key={user.id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelection(user.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`user-${user.id}`} className="ml-3 text-sm font-medium text-gray-700">
                            {user.nickname}
                        </label>
                        </div>
                    ))}
                    </div>
                    <button 
                    onClick={() => {
                        // Logic to create group will be added here
                        setIsGroupModalOpen(false);
                    }}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                    Create Group
                    </button>
                </div>
                </div>
            )}

            <UserList users={filteredUsers} onSelectUser={setSelectedUser} selectedUser={selectedUser} />
            <div className="mt-auto">
                <button 
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
        </div>
      <div className="flex-1 flex flex-col">
        {selectedUser && (
            <div className="p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder={`Search in chat with ${selectedUser.nickname}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        )}
        <ChatWindow messages={searchedMessages} users={users} currentUser={currentUser} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
