import { User } from '../models/types';

interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}

export const UserList = ({ users, onSelectUser, selectedUser }: UserListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm flex-1 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className={`p-3 cursor-pointer border-b border-gray-100 transition-colors duration-200 ${
              selectedUser?.id === user.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-50'
            }`}
            onClick={() => onSelectUser(user)}
          >
            {user.nickname}
          </li>
        ))}
      </ul>
    </div>
  );
};
