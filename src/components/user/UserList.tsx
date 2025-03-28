interface User {
  id: string;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onBanUser: (userId: string) => void;
}

export function UserList({ users, onBanUser }: UserListProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex justify-between items-center p-4 border rounded"
        >
          <div>
            <h4 className="font-medium">{user.name}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={() => onBanUser(user.id)}
            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Ban User
          </button>
        </div>
      ))}
    </div>
  );
}
