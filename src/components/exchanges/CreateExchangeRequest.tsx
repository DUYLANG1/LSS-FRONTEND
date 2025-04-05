import React, { useState } from "react";
import { useExchanges } from "@/hooks/useExchanges";

export default function CreateExchangeRequest() {
  const { createExchangeRequest, loading } = useExchanges();

  const [toUserId, setToUserId] = useState("");
  const [offeredSkillId, setOfferedSkillId] = useState("");
  const [requestedSkillId, setRequestedSkillId] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!toUserId || !offeredSkillId || !requestedSkillId) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }

    const success = await createExchangeRequest(
      toUserId,
      offeredSkillId,
      requestedSkillId
    );

    if (success) {
      setMessage({
        text: "Exchange request created successfully!",
        type: "success",
      });
      // Reset form
      setToUserId("");
      setOfferedSkillId("");
      setRequestedSkillId("");
    } else {
      setMessage({ text: "Failed to create exchange request", type: "error" });
    }
  };

  return (
    <div className="create-exchange-form">
      <h2>Create Exchange Request</h2>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="toUserId">User to Exchange With:</label>
          <input
            id="toUserId"
            type="text"
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
            placeholder="Enter user ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="offeredSkillId">Skill You're Offering:</label>
          <input
            id="offeredSkillId"
            type="text"
            value={offeredSkillId}
            onChange={(e) => setOfferedSkillId(e.target.value)}
            placeholder="Enter your skill ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="requestedSkillId">Skill You're Requesting:</label>
          <input
            id="requestedSkillId"
            type="text"
            value={requestedSkillId}
            onChange={(e) => setRequestedSkillId(e.target.value)}
            placeholder="Enter their skill ID"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Exchange Request"}
        </button>
      </form>
    </div>
  );
}
