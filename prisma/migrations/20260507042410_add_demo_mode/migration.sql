-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AppSettings" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "botName" TEXT NOT NULL DEFAULT 'AI Assistant',
    "botPersona" TEXT NOT NULL DEFAULT 'A helpful shopping assistant.',
    "demoMode" BOOLEAN NOT NULL DEFAULT false,
    "lastSynced" DATETIME,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AppSettings" ("botName", "botPersona", "lastSynced", "shop", "updatedAt") SELECT "botName", "botPersona", "lastSynced", "shop", "updatedAt" FROM "AppSettings";
DROP TABLE "AppSettings";
ALTER TABLE "new_AppSettings" RENAME TO "AppSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
