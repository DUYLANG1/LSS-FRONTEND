interface SkillExchangeProps {
  offeredSkill: {
    title: string;
    description: string;
    category: string;
  };
  requestedSkill: {
    title: string;
    description: string;
    category: string;
  };
  onPropose: () => void;
}

export function SkillExchange({
  offeredSkill,
  requestedSkill,
  onPropose,
}: SkillExchangeProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">I Can Teach</h3>
          <div className="space-y-2">
            <p className="font-medium">{offeredSkill.title}</p>
            <p className="text-gray-600">{offeredSkill.description}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">I Want to Learn</h3>
          <div className="space-y-2">
            <p className="font-medium">{requestedSkill.title}</p>
            <p className="text-gray-600">{requestedSkill.description}</p>
          </div>
        </div>
      </div>
      <button
        onClick={onPropose}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Propose Exchange
      </button>
    </div>
  );
}
