import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Delete data from Comments before Nodes due to relation
async function deleteAllData(modelNames: string[]) {
  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      if (model) {
        await model.deleteMany({});
        console.log(`Cleared data from ${modelName}`);
      } else {
        console.error(`Model ${modelName} not found.`);
      }
    } catch (error) {
      console.error(`Failed to clear data from ${modelName}:`, error);
    }
  }
}

// Reads data from JSON files and seeds it into the corresponding models sequentially
async function seedData(fileNames: string[]) {
  const dataDirectory = path.join(__dirname, "seedData");

  for (const fileName of fileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const modelName =
      path.basename(fileName, path.extname(fileName)).charAt(0).toUpperCase() +
      path.basename(fileName, path.extname(fileName)).slice(1);
    const model: any = prisma[modelName as keyof typeof prisma];

    if (model) {
      await Promise.all(jsonData.map((data: any) => model.create({ data })));
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } else {
      console.error(`No Prisma model matches the file name: ${fileName}`);
    }
  }
}

async function main() {
  const orderedFileNames = ["nodes.json", "comments.json"];
  const modelNames = orderedFileNames.map(
    (fileName) =>
      path.basename(fileName, path.extname(fileName)).charAt(0).toUpperCase() +
      path.basename(fileName, path.extname(fileName)).slice(1)
  );

  await deleteAllData(modelNames.reverse());
  await seedData(orderedFileNames);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
