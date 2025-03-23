interface UserProfileProps {
  user: {
    name: string;
    avatar: string;
    bio: string;
    location: string;
    skillsOffered: string[];
    skillsWanted: string[];
    rating: number;
    completedExchanges: number;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.location}</p>
          <div className="flex items-center gap-2 mt-2">
            <span>⭐ {user.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{user.completedExchanges} exchanges</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-gray-700">{user.bio}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Skills Offered</h3>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Skills Wanted</h3>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.map((skill) => (
              <span
                key={skill}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
