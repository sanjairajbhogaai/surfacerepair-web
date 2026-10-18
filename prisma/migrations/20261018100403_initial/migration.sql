-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('REPAIR', 'QUOTE', 'BUSINESS_VISIT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('RECEIVED', 'DIAGNOSING', 'AWAITING_PARTS', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeviceCategory" AS ENUM ('SURFACE', 'LAPTOP', 'DESKTOP', 'MACBOOK', 'OTHER');

-- CreateEnum
CREATE TYPE "ServicePreference" AS ENUM ('DROP_OFF', 'PICKUP');

-- CreateEnum
CREATE TYPE "ContactTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "NoteVisibility" AS ENUM ('INTERNAL', 'CUSTOMER_VISIBLE');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('OWNER', 'STAFF');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('REQUEST_CREATED', 'REQUEST_STATUS_CHANGED', 'REQUEST_NOTE_ADDED', 'REQUEST_EMAIL_RESENT', 'CUSTOMER_UPDATED', 'STAFF_CREATED', 'STAFF_DEACTIVATED', 'STAFF_ROLE_CHANGED', 'SETTING_UPDATED', 'OWNER_SEEDED');

-- CreateEnum
CREATE TYPE "NotificationKind" AS ENUM ('CUSTOMER_CONFIRMATION', 'STAFF_ALERT', 'STATUS_UPDATE', 'MAGIC_LINK', 'STAFF_INVITE');

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneNormalized" TEXT NOT NULL,
    "email" TEXT,
    "emailNormalized" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" UUID NOT NULL,
    "ticketId" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'RECEIVED',
    "customerId" UUID NOT NULL,
    "deviceCategory" "DeviceCategory",
    "deviceModel" TEXT,
    "issueDescription" TEXT NOT NULL,
    "servicePreference" "ServicePreference",
    "preferredContactTime" "ContactTime",
    "budgetExpectation" TEXT,
    "companyName" TEXT,
    "employeeCount" INTEGER,
    "deviceSummary" TEXT,
    "servicesNeeded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredDateWindow" TEXT,
    "notes" TEXT,
    "trackTokenHash" TEXT NOT NULL,
    "submittedIp" INET,
    "submittedUserAgent" TEXT,
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_status_events" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "fromStatus" "RequestStatus",
    "changedByStaffId" UUID,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_status_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "authorStaffId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "visibility" "NoteVisibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "invitedByStaffId" UUID,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "actorStaffId" UUID,
    "action" "AuditAction" NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "ip" INET,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedByStaffId" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "auth_magic_links" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_magic_links_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "rate_limit_buckets" (
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "notification_failures" (
    "id" UUID NOT NULL,
    "requestId" UUID,
    "kind" "NotificationKind" NOT NULL,
    "provider" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "errorSummary" TEXT NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "notification_failures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_sequences" (
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ticket_sequences_pkey" PRIMARY KEY ("year")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_phoneNormalized_key" ON "customers"("phoneNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "customers_emailNormalized_key" ON "customers"("emailNormalized");

-- CreateIndex
CREATE INDEX "customers_createdAt_idx" ON "customers"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "requests_ticketId_key" ON "requests"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "requests_trackTokenHash_key" ON "requests"("trackTokenHash");

-- CreateIndex
CREATE INDEX "requests_status_createdAt_idx" ON "requests"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "requests_customerId_createdAt_idx" ON "requests"("customerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "requests_type_createdAt_idx" ON "requests"("type", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "requests_createdAt_idx" ON "requests"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "request_status_events_requestId_createdAt_idx" ON "request_status_events"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "notes_requestId_visibility_createdAt_idx" ON "notes"("requestId", "visibility", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_emailNormalized_key" ON "staff_users"("emailNormalized");

-- CreateIndex
CREATE INDEX "staff_users_role_isActive_idx" ON "staff_users"("role", "isActive");

-- CreateIndex
CREATE INDEX "audit_log_createdAt_idx" ON "audit_log"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "audit_log_actorStaffId_createdAt_idx" ON "audit_log"("actorStaffId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "audit_log_targetType_targetId_createdAt_idx" ON "audit_log"("targetType", "targetId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "auth_magic_links_expires_idx" ON "auth_magic_links"("expires");

-- CreateIndex
CREATE INDEX "rate_limit_buckets_expiresAt_idx" ON "rate_limit_buckets"("expiresAt");

-- CreateIndex
CREATE INDEX "notification_failures_resolvedAt_attemptedAt_idx" ON "notification_failures"("resolvedAt", "attemptedAt" DESC);

-- CreateIndex
CREATE INDEX "notification_failures_requestId_idx" ON "notification_failures"("requestId");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_status_events" ADD CONSTRAINT "request_status_events_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_status_events" ADD CONSTRAINT "request_status_events_changedByStaffId_fkey" FOREIGN KEY ("changedByStaffId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_authorStaffId_fkey" FOREIGN KEY ("authorStaffId") REFERENCES "staff_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_users" ADD CONSTRAINT "staff_users_invitedByStaffId_fkey" FOREIGN KEY ("invitedByStaffId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actorStaffId_fkey" FOREIGN KEY ("actorStaffId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_updatedByStaffId_fkey" FOREIGN KEY ("updatedByStaffId") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_failures" ADD CONSTRAINT "notification_failures_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE requests
  ADD CONSTRAINT requests_issue_description_len
  CHECK (char_length("issueDescription") >= 20),
  ADD CONSTRAINT requests_type_shape
  CHECK (
    ("type" = 'BUSINESS_VISIT' AND "companyName" IS NOT NULL AND "employeeCount" IS NOT NULL)
    OR
    ("type" != 'BUSINESS_VISIT' AND "deviceCategory" IS NOT NULL)
  ),
  ADD CONSTRAINT requests_employee_count_pos
  CHECK ("employeeCount" IS NULL OR "employeeCount" > 0);

ALTER TABLE notes
  ADD CONSTRAINT notes_body_len
  CHECK (char_length("body") >= 1 AND char_length("body") <= 4000);
