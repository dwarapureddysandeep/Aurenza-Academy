import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const batches = await prisma.batch.findMany({
    include: {
      course: { select: { id: true, name: true, slug: true } },
      trainer: { select: { id: true, name: true } }
    }
  });

  console.log('--- ALL BATCHES IN POSTGRESQL ---');
  batches.forEach(b => {
    console.log(`ID: ${b.id}`);
    console.log(`Course: ${b.course.name} (ID: ${b.course.id}, Slug: ${b.course.slug})`);
    console.log(`Trainer: ${b.trainer.name} (ID: ${b.trainer.id})`);
    console.log(`StartDate: ${b.startDate}`);
    console.log(`TimeSlot: ${b.timeSlot}`);
    console.log('---------------------------------');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
