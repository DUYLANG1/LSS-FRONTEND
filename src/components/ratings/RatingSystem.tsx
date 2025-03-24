interface RatingProps {
  userId: string;
  skillId: string;
  onRate: (rating: number, comment: string) => void;
}

export function RatingSystem({ userId, skillId, onRate }: RatingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star, "")}
            className="text-yellow-400 hover:text-yellow-500"
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        placeholder="Add a comment..."
        className="w-full p-2 border rounded"
        onChange={(e) => onRate(0, e.target.value)}
      />
    </div>
  );
}
