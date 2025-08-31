CREATE TABLE IF NOT EXISTS "Card" (
    "mainNumber" INTEGER PRIMARY KEY,
    "numberOfClicks" INTEGER NOT NULL,
    "timeOfFirstClick" TIMESTAMP NULL
);

INSERT INTO "Card" ("mainNumber", "numberOfClicks", "timeOfFirstClick") VALUES
(1,5,'2025-08-31 10:32:03.282'),
(2,0,NULL),
(3,10,'2025-08-31 21:32:03.282'),
(4,15,'2025-08-31 20:33:03.282'),
(5,11,'2025-08-31 23:32:03.282'),
(6,0,NULL),
(7,20,'2025-08-31 20:32:03.282'),
(8,1,'2025-08-31 20:32:03.100');