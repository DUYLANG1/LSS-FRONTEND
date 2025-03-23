"use client";
import ExchangeRequest from "@/components/exchanges/ExchangeRequest";

export default function ExchangesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Active Exchanges</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          <div className="space-y-4">
            <ExchangeRequest
              fromUser={{
                name: "Jane Smith",
                avatar: "/placeholder-avatar.jpg",
                offeredSkill: "Spanish Lessons",
              }}
              toUser={{
                name: "You",
                avatar: "/your-avatar.jpg",
                requestedSkill: "Web Development",
              }}
              status="pending"
              onAccept={() => console.log("Accepted")}
              onReject={() => console.log("Rejected")}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Active Exchanges</h2>
          <div className="space-y-4">
            <ExchangeRequest
              fromUser={{
                name: "Mike Johnson",
                avatar: "/placeholder-avatar.jpg",
                offeredSkill: "Photography",
              }}
              toUser={{
                name: "You",
                avatar: "/your-avatar.jpg",
                requestedSkill: "React Development",
              }}
              status="accepted"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
