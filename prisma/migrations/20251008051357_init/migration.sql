-- CreateEnum
CREATE TYPE "SignalStatus" AS ENUM ('Unverified', 'HumanVerified', 'Correlated');

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "scriptName" TEXT NOT NULL,
    "dateFrom" TIMESTAMP(3) NOT NULL,
    "dateTo" TIMESTAMP(3) NOT NULL,
    "gistText" TEXT NOT NULL,
    "provenanceTags" TEXT[],
    "confidenceScore" INTEGER NOT NULL,
    "status" "SignalStatus" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrelationJob" (
    "jobId" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "resultGist" TEXT,
    "correlationConfidence" INTEGER,
    "sourcesQueried" TEXT[],

    CONSTRAINT "CorrelationJob_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roles" TEXT[],
    "lastVerifiedAt" TIMESTAMP(3),
    "apiKeys" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "allowedSources" TEXT[],
    "rateLimits" TEXT[],
    "verifierRoles" TEXT[],

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrelationJob" ADD CONSTRAINT "CorrelationJob_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
