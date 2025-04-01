import { UserAvatar } from "@/components/user/UserAvatar";
import { Card, CardBody } from "@/components/common/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/common/Button";

interface ExchangeRequestProps {
  fromUser: {
    name: string;
    avatar: string;
    offeredSkill: string;
    id?: string;
  };
  toUser: {
    name: string;
    avatar: string;
    requestedSkill: string;
    id?: string;
  };
  status: "pending" | "accepted" | "rejected";
  onAccept?: () => void;
  onReject?: () => void;
}

export default function ExchangeRequest({
  fromUser,
  toUser,
  status,
  onAccept,
  onReject,
}: ExchangeRequestProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-3">
            <UserAvatar name={fromUser.name} imageUrl={fromUser.avatar} />
            <div>
              <p className="font-medium">{fromUser.name}</p>
              <p className="text-sm text-gray-600">
                Offering: {fromUser.offeredSkill}
              </p>
            </div>
          </div>

          <div className="text-2xl hidden sm:block">↔️</div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium">{toUser.name}</p>
              <p className="text-sm text-gray-600">
                Requesting: {toUser.requestedSkill}
              </p>
            </div>
            <UserAvatar name={toUser.name} imageUrl={toUser.avatar} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          {status === "pending" && (
            <>
              <Button variant="success" onClick={onAccept}>
                Accept
              </Button>
              <Button variant="danger" onClick={onReject}>
                Reject
              </Button>
            </>
          )}
          {status !== "pending" && <StatusBadge status={status} />}
        </div>
      </CardBody>
    </Card>
  );
}
