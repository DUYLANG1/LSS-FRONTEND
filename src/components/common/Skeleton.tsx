import React from "react";

type SkeletonVariant =
  | "text"
  | "circular"
  | "rectangular"
  | "card"
  | "avatar"
  | "button";
type SkeletonSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  size?: SkeletonSize;
  className?: string;
  count?: number;
  animated?: boolean;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  size = "md",
  className = "",
  count = 1,
  animated = true,
}: SkeletonProps) {
  const baseClasses = animated ? "animate-pulse" : "";

  const sizeClasses = {
    xs: "h-2",
    sm: "h-4",
    md: "h-6",
    lg: "h-10",
    xl: "h-16",
    full: "h-full",
  };

  const widthClasses = {
    xs: "w-16",
    sm: "w-24",
    md: "w-32",
    lg: "w-48",
    xl: "w-64",
    full: "w-full",
  };

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
    card: "rounded-lg",
    avatar: "rounded-full",
    button: "rounded-lg",
  };

  const getStyle = () => {
    const style: React.CSSProperties = {};

    if (width) {
      style.width = typeof width === "number" ? `${width}px` : width;
    }

    if (height) {
      style.height = typeof height === "number" ? `${height}px` : height;
    }

    return style;
  };

  const renderSkeleton = (index: number) => {
    return (
      <div
        key={index}
        className={`bg-[var(--card-background)] ${baseClasses} ${
          variantClasses[variant]
        } ${!width ? widthClasses[size] : ""} ${
          !height ? sizeClasses[size] : ""
        } ${className}`}
        style={getStyle()}
      />
    );
  };

  return (
    <>
      {count === 1 ? (
        renderSkeleton(0)
      ) : (
        <div className="space-y-2">
          {Array.from({ length: count }).map((_, index) =>
            renderSkeleton(index)
          )}
        </div>
      )}
    </>
  );
}

// Keep the original LoadingState for backward compatibility
export function LoadingState() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Skeleton variant="text" size="lg" width="33%" />
      <Skeleton variant="text" size="sm" width="50%" />
      <div className="space-y-2">
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={128} />
      </div>
    </div>
  );
}

// Predefined skeleton layouts
export function SkillDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Skeleton variant="text" size="sm" width={100} />
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <Skeleton
              variant="rectangular"
              width={80}
              height={24}
              className="mb-2"
            />
            <Skeleton variant="text" size="lg" width={200} />
          </div>
          <Skeleton variant="text" size="xs" width={100} />
        </div>
        <Skeleton variant="rectangular" height={100} />
        <div className="pt-4 flex justify-between items-center">
          <div className="flex items-center">
            <Skeleton variant="avatar" size="md" width={40} height={40} />
            <div className="ml-3">
              <Skeleton variant="text" size="sm" width={120} />
              <Skeleton variant="text" size="xs" width={80} />
            </div>
          </div>
          <Skeleton variant="button" width={120} height={40} />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-[var(--card-border)] rounded-lg p-4">
      <Skeleton variant="text" size="md" className="mb-2" />
      <Skeleton variant="text" size="sm" count={2} className="mb-4" />
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Skeleton variant="avatar" size="sm" width={32} height={32} />
          <Skeleton variant="text" size="sm" width={80} className="ml-2" />
        </div>
        <Skeleton variant="text" size="xs" width={60} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={
            i === 0
              ? "20%"
              : i === columns - 1
              ? "15%"
              : `${65 / (columns - 2)}%`
          }
        />
      ))}
    </div>
  );
}
