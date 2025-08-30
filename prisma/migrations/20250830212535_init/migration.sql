-- CreateTable
CREATE TABLE "public"."Card" (
    "id" SERIAL NOT NULL,
    "numberOfClicks" INTEGER NOT NULL,
    "timeOfFirstClick" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);
