-- CreateTable
CREATE TABLE "Nodes" (
    "id" UUID NOT NULL,
    "prev" UUID,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "tag" UUID NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_tag_fkey" FOREIGN KEY ("tag") REFERENCES "Nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
