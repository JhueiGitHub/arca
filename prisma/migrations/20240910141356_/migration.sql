-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignSystem" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorToken" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "designSystemId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FontToken" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "designSystemId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FontToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_profileId_idx" ON "Note"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignSystem_profileId_key" ON "DesignSystem"("profileId");

-- CreateIndex
CREATE INDEX "ColorToken_parentId_idx" ON "ColorToken"("parentId");

-- CreateIndex
CREATE INDEX "ColorToken_designSystemId_idx" ON "ColorToken"("designSystemId");

-- CreateIndex
CREATE UNIQUE INDEX "ColorToken_designSystemId_name_key" ON "ColorToken"("designSystemId", "name");

-- CreateIndex
CREATE INDEX "FontToken_parentId_idx" ON "FontToken"("parentId");

-- CreateIndex
CREATE INDEX "FontToken_designSystemId_idx" ON "FontToken"("designSystemId");

-- CreateIndex
CREATE UNIQUE INDEX "FontToken_designSystemId_name_key" ON "FontToken"("designSystemId", "name");
