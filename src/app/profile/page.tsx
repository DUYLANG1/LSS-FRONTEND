"use client";
import { useSession } from "next-auth/react";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";
import { Card, CardBody } from "@/components/common/Card";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Skills I Can Teach</h2>
              {/* Add SkillList component here */}
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">
                Skills I Want to Learn
              </h2>
              {/* Add SkillList component here */}
            </CardBody>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
