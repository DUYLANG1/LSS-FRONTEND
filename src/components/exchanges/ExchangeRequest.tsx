interface ExchangeRequestProps {
  fromUser: {
    name: string;
    avatar: string;
    offeredSkill: string;
  };
  toUser: {
    name: string;
    avatar: string;
    requestedSkill: string;
  };
  status: "pending" | "accepted" | "rejected";
  onAccept?: () => void;
  onReject?: () => void;
}

export default function ExchangeRequest({
  fromUser,
  toUser,
  status,
  onAccept,
  onReject,
}: ExchangeRequestProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <img
            src={fromUser.avatar}
            alt={fromUser.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-medium">{fromUser.name}</p>
            <p className="text-sm text-gray-600">
              Offering: {fromUser.offeredSkill}
            </p>
          </div>
        </div>
        <div className="text-2xl">↔️</div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium">{toUser.name}</p>
            <p className="text-sm text-gray-600">
              Requesting: {toUser.requestedSkill}
            </p>
          </div>
          <img
            src={toUser.avatar}
            alt={toUser.name}
            className="w-12 h-12 rounded-full"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        {status === "pending" && (
          <>
            <button
              onClick={onAccept}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={onReject}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Reject
            </button>
          </>
        )}
        {status !== "pending" && (
          <span
            className={`px-3 py-1 rounded-full ${
              status === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
    </div>
  );
}
