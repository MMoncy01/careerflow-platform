-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('HR', 'TECHNICAL', 'BEHAVIORAL', 'MANAGERIAL', 'FINAL', 'OTHER');

-- CreateEnum
CREATE TYPE "InterviewResult" AS ENUM ('SCHEDULED', 'COMPLETED', 'PASSED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "type" "InterviewType" NOT NULL DEFAULT 'TECHNICAL',
    "round" INTEGER NOT NULL DEFAULT 1,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "result" "InterviewResult" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "nextRoundAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interview_userId_idx" ON "Interview"("userId");

-- CreateIndex
CREATE INDEX "Interview_scheduledAt_idx" ON "Interview"("scheduledAt");

-- CreateIndex
CREATE INDEX "Interview_result_idx" ON "Interview"("result");

-- CreateIndex
CREATE INDEX "Interview_applicationId_idx" ON "Interview"("applicationId");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
