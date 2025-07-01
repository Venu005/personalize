import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create initial users
  const password1 = await hash('password1', 10);
  const password2 = await hash('password2', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      id: '1',
      name: 'User One',
      email: 'user1@example.com',
      password: password1,
      preferences: {
        newsCategories: ["sports", "tech"],
        movieGenres: ["action", "sci-fi"],
        socialHashtags: ["tech", "programming"],
        country: "us",
      },
    },
  });
  
  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      id: '2',
      name: 'User Two',
      email: 'user2@example.com',
      password: password2,
      preferences: {
        newsCategories: ["entertainment", "business"],
        movieGenres: ["comedy", "drama"],
        socialHashtags: ["design", "startup"],
        country: "uk",
      },
    },
  });
  
  console.log({ user1, user2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });