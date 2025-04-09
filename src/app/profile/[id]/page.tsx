"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { userService, UserProfile } from "@/services/userService";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);
        const profile = await userService.getProfile(userId);
        setUserProfile(profile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">Loading user profile...</div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12 text-red-500">
          {error || "User profile not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{userProfile.name}'s Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody>
              <div className="text-center">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl text-gray-500">
                      {userProfile.name.charAt(0)}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                {userProfile.location && (
                  <p className="text-gray-600 mt-1">{userProfile.location}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Member since{" "}
                  {userProfile.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* User Bio */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">About</h2>
              {userProfile.bio ? (
                <p>{userProfile.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio provided</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <Card>
          <CardBody>
            <p className="text-gray-500">
              This user's skills will be displayed here (coming soon)
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
