-- CreateEnum
CREATE TYPE "TaskAssignmentSource" AS ENUM ('MANAGER', 'WORKER');

-- AlterTable
ALTER TABLE "TaskAssignment"
ADD COLUMN "assignedByUserId" TEXT,
ADD COLUMN "source" "TaskAssignmentSource" NOT NULL DEFAULT 'MANAGER';

-- CreateIndex
CREATE INDEX "TaskAssignment_assignedByUserId_idx" ON "TaskAssignment"("assignedByUserId");

-- AddForeignKey
ALTER TABLE "TaskAssignment"
ADD CONSTRAINT "TaskAssignment_assignedByUserId_fkey"
FOREIGN KEY ("assignedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
