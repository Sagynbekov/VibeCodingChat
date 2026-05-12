import { User } from '../models/types';

interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}

export const UserList = ({ users, onSelectUser, selectedUser }: UserListProps) => {
  return (
    <div className="w-1/4 border-r border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className={`p-2 cursor-pointer rounded ${
              selectedUser?.id === user.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
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
