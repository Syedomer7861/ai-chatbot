-- CreateTable
CREATE TABLE "AppSettings" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "botName" TEXT NOT NULL DEFAULT 'AI Assistant',
    "botPersona" TEXT NOT NULL DEFAULT 'A helpful shopping assistant.',
    "lastSynced" DATETIME,
    "updatedAt" DATETIME NOT NULL
);
