import { usePermissions } from "../hooks/usePermissions";
import { UserRole } from "../utils/permissions";

interface PostActionsProps {
  userRole: UserRole;
  postAuthorId: string;
  currentUserId: string;
}

export function PostActions({
  userRole,
  postAuthorId,
  currentUserId,
}: PostActionsProps) {
  const { can } = usePermissions(userRole);
  const isOwnPost = postAuthorId === currentUserId;

  const handleEdit = () => {
    // Add edit modal or navigation
    // Add API integration
  };

  const handleDelete = () => {
    // Add confirmation dialog
    // Add API integration
  };

  return (
    <div className="post-actions">
      {/* Edit button */}
      {(can("editAnyPost") || (can("editOwnPosts") && isOwnPost)) && (
        <button onClick={() => handleEdit()}>Edit</button>
      )}

      {/* Delete button */}
      {(can("deleteAnyPost") || (can("deleteOwnPosts") && isOwnPost)) && (
        <button onClick={() => handleDelete()}>Delete</button>
      )}
    </div>
  );
}
