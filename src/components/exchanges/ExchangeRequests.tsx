interface ExchangeRequest {
  id: string;
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
  createdAt: string;
}

export function ExchangeRequests() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Exchange Requests</h2>
      {/* Add ExchangeRequest components here */}
    </div>
  );
}
