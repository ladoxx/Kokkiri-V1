/**
 * Enums and Constants for SQLite compatibility
 * Mirrors Prisma enum structures for strong TypeScript checking
 */

export const RoleType = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
} as const;
export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const InquiryStatus = {
  NEW: "NEW",
  UNREAD: "UNREAD",
  IN_PROGRESS: "IN_PROGRESS",
  WAITING_FOR_CUSTOMER: "WAITING_FOR_CUSTOMER",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
} as const;
export type InquiryStatus = (typeof InquiryStatus)[keyof typeof InquiryStatus];

export const NotificationChannel = {
  EMAIL: "EMAIL",
  KAKAO_ALIMTALK: "KAKAO_ALIMTALK",
} as const;
export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const NotificationStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SENT: "SENT",
  FAILED: "FAILED",
  RETRY_SCHEDULED: "RETRY_SCHEDULED",
} as const;
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
