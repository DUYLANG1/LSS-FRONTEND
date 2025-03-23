"use client";
import SkillCard from "@/components/skills/SkillCard";
import ExchangeRequest from "@/components/exchanges/ExchangeRequest";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">My Skills</h2>
          <div className="space-y-4">
            {/* Add your skills data here */}
            <SkillCard
              title="JavaScript Development"
              description="Frontend development with React and Next.js"
              category="Programming"
              userAvatar="/placeholder-avatar.jpg"
              userName="You"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Exchange Requests</h2>
          <div className="space-y-4">
            {/* Add your exchange requests data here */}
            <ExchangeRequest
              fromUser={{
                name: "John Doe",
                avatar: "/placeholder-avatar.jpg",
                offeredSkill: "Guitar Lessons",
              }}
              toUser={{
                name: "You",
                avatar: "/your-avatar.jpg",
                requestedSkill: "JavaScript Development",
              }}
              status="pending"
              onAccept={() => console.log("Accepted")}
              onReject={() => console.log("Rejected")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
