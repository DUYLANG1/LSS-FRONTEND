"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { userService, UserProfile } from "@/services/userService";
import { useParams } from "next/navigation";
import { Skill } from "@/services/skillsService";
import Link from "next/link";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [skillsError, setSkillsError] = useState<string | null>(null);

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

    const fetchUserSkills = async () => {
      if (!userId) return;

      try {
        setIsLoadingSkills(true);
        setSkillsError(null);
        const response = await userService.getUserSkills(userId);
        setSkills(response.data || []);
      } catch (err) {
        console.error("Error fetching user skills:", err);
        setSkillsError("Failed to load user skills. Please try again.");
        setSkills([]);
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchUserProfile();
    fetchUserSkills();
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
            {isLoadingSkills ? (
              <p className="text-gray-500">Loading skills...</p>
            ) : skillsError ? (
              <p className="text-red-500">{skillsError}</p>
            ) : skills.length === 0 ? (
              <p className="text-gray-500 italic">
                This user hasn't added any skills yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <Link href={`/skills/${skill.id}`} className="block">
                      <h3 className="font-medium text-lg mb-1">
                        {skill.title}
                      </h3>
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 mr-2">
                          {skill.category?.name || "Uncategorized"}
                        </span>
                        {skill.level && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {skill.level.charAt(0) +
                              skill.level.slice(1).toLowerCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {skill.description || "No description provided"}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
