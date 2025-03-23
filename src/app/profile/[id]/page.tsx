import UserProfile from "@/components/profile/UserProfile";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // In a real app, fetch user data based on params.id
  const mockUser = {
    name: "John Doe",
    avatar: "/placeholder-avatar.jpg",
    bio: "Passionate about teaching and learning new skills",
    location: "New York, USA",
    skillsOffered: ["JavaScript", "React", "Next.js"],
    skillsWanted: ["Guitar", "Spanish", "Photography"],
    rating: 4.8,
    completedExchanges: 12,
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <UserProfile user={mockUser} />
    </div>
  );
}
