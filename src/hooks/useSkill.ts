import { useState, useEffect } from "react";
import { Skill, skillsService } from "@/services/skillsService";

export function useSkill(id: string) {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSkill() {
      try {
        setLoading(true);
        const data = await skillsService.getById(id);
        setSkill(data);
      } catch (err) {
        setError("Failed to load skill details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSkill();
  }, [id]);

  return { skill, loading, error };
}
