"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Form, FormField, FormInput, FormTextArea } from "@/components/ui/Form";
import {
  userService,
  type UpdateProfileData,
  type UserProfile,
} from "@/services/userService";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileData>();

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          setIsLoading(true);
          const profile = await userService.getProfile(session.user.id);
          setUserProfile(profile);

          // Set form default values
          reset({
            name: profile.name,
            bio: profile.bio || "",
            location: profile.location || "",
            avatarUrl: profile.avatarUrl || "",
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setErrorMessage("Failed to load profile data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [session, reset]);

  const onSubmit = async (data: UpdateProfileData) => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      const updatedProfile = await userService.updateProfile(
        session.user.id,
        data
      );

      setUserProfile(updatedProfile);
      setSuccessMessage("Profile updated successfully!");

      // Update form with new values
      reset({
        name: updatedProfile.name,
        bio: updatedProfile.bio || "",
        location: updatedProfile.location || "",
        avatarUrl: updatedProfile.avatarUrl || "",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);

      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Update Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <h2 className="text-xl font-semibold mb-4">
                  Profile Information
                </h2>

                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {errorMessage}
                  </div>
                )}

                <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <FormField
                    id="name"
                    label="Full Name"
                    required
                    error={errors.name?.message}
                  >
                    <FormInput
                      id="name"
                      placeholder="Your full name"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      error={errors.name?.message}
                    />
                  </FormField>

                  {/* Email Field (Read-only) */}
                  <FormField id="email" label="Email Address">
                    <FormInput
                      id="email"
                      name="email"
                      value={session?.user?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </FormField>

                  {/* Location Field */}
                  <FormField
                    id="location"
                    label="Location"
                    error={errors.location?.message}
                  >
                    <FormInput
                      id="location"
                      placeholder="City, Country"
                      {...register("location")}
                      error={errors.location?.message}
                    />
                  </FormField>

                  {/* Avatar URL Field */}
                  <FormField
                    id="avatarUrl"
                    label="Profile Picture URL"
                    error={errors.avatarUrl?.message}
                  >
                    <FormInput
                      id="avatarUrl"
                      placeholder="https://example.com/your-image.jpg"
                      {...register("avatarUrl", {
                        pattern: {
                          value:
                            /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/,
                          message: "Please enter a valid URL",
                        },
                      })}
                      error={errors.avatarUrl?.message}
                    />
                  </FormField>

                  {/* Bio Field */}
                  <FormField id="bio" label="Bio" error={errors.bio?.message}>
                    <FormTextArea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      rows={4}
                      {...register("bio", {
                        maxLength: {
                          value: 500,
                          message: "Bio must be less than 500 characters",
                        },
                      })}
                      error={errors.bio?.message}
                    />
                  </FormField>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="px-6">
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>

          {/* Profile Summary Card */}
          <div>
            <Card>
              <CardBody>
                <div className="text-center">
                  {userProfile?.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl text-gray-500">
                        {userProfile?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}

                  {userProfile?.location && (
                    <p className="text-gray-600 mt-1">{userProfile.location}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Member since{" "}
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </p>

                  {userProfile?.bio && (
                    <div className="mt-4 text-left">
                      <h4 className="font-medium mb-1">About</h4>
                      <p className="text-sm">{userProfile.bio}</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
