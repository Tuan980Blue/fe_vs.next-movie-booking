"use client";

import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export default function RoleGuard({ 
  children, 
  allowedRoles = [], 
  requireAll = false,
  fallback = null 
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, don't render anything
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // If no roles specified, render children
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const userRoles = user.roles || [];
  const normalizedUserRoles = userRoles.map(role => role.toLowerCase());
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  let hasPermission = false;

  if (requireAll) {
    // User must have ALL specified roles
    hasPermission = normalizedAllowedRoles.every(role => 
      normalizedUserRoles.includes(role)
    );
  } else {
    // User must have at least ONE of the specified roles
    hasPermission = normalizedAllowedRoles.some(role => 
      normalizedUserRoles.includes(role)
    );
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function UserOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['user']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminOrUser({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin', 'user']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
