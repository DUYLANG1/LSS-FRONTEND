"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExchangeModal } from "@/components/exchanges/ExchangeModal";

interface RequestExchangeButtonProps {
  skillId: string;
  skillTitle: string;
  skillOwnerId: string;
  className?: string;
}

export function RequestExchangeButton({
  skillId,
  skillTitle,
  skillOwnerId,
  className = "",
}: RequestExchangeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleRequestExchange = (e: React.MouseEvent) => {
    // Stop propagation to prevent parent link navigation
    e.stopPropagation();
    // Prevent default to avoid form submission or link navigation
    e.preventDefault();

    if (!session) {
      router.push(`/auth/signin?callbackUrl=/skills`);
      return;
    }

    // Don't allow requesting exchange for own skills
    if (session.user?.id === skillOwnerId) {
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <>
      {/* Use a button instead of an anchor tag */}
      <button
        onClick={handleRequestExchange}
        className={`${className}`}
        disabled={session?.user?.id === skillOwnerId}
      >
        Request Exchange
      </button>

      {isModalOpen && (
        <ExchangeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          skillOwnerId={skillOwnerId}
          requestedSkillId={skillId}
          requestedSkillTitle={skillTitle}
        />
      )}
    </>
  );
}
