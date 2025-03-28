interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export function ExchangeModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: ExchangeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--card-background)] rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Request Skill Exchange</h2>
        <p className="mb-4">
          Would you like to propose a skill exchange with {userName}?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={onConfirm}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
