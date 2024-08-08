-- CreateTable
CREATE TABLE "conversions" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "offer_id" TEXT,
    "offer_name" TEXT,
    "affiliate_id" TEXT,
    "source" TEXT,
    "session_ip" TEXT,
    "payout" DOUBLE PRECISION,
    "aff_sub" TEXT,
    "aff_sub2" TEXT,
    "aff_sub3" TEXT,
    "aff_sub4" TEXT,
    "aff_sub5" TEXT,

    CONSTRAINT "conversions_pkey" PRIMARY KEY ("id")
);
