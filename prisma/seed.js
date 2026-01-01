import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@kec.com' },
    update: {},
    create: {
      email: 'admin@kec.com',
      passwordHash: 'hashed_password',
      name: 'KEC Admin',
      role: 'admin'
    }
  });

  const categories = [
    { name: 'Politics', slug: 'politics', description: 'Political news' },
    { name: 'Economics', slug: 'economics', description: 'Economic news' },
    { name: 'Technology', slug: 'technology', description: 'Tech news' },
    { name: 'Sports', slug: 'sports', description: 'Sports news' },
    { name: 'Health', slug: 'health', description: 'Health news' },
    { name: 'Culture', slug: 'culture', description: 'Cultural news' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  // Seed videos
  const videos = [
    { title: 'Breaking News Update', slug: 'breaking-news-update', description: 'Latest breaking news', videoUrl: 'https://www.youtube.com/shorts/TwbereOm4e8', categoryId: 1, duration: '10:30' },
    { title: 'Tech Innovation', slug: 'tech-innovation', description: 'New technology trends', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', categoryId: 3, duration: '8:45' },
    { title: 'Sports Highlights', slug: 'sports-highlights', description: 'Best sports moments', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', categoryId: 4, duration: '12:20' }
  ];

  for (const video of videos) {
    await prisma.video.upsert({
      where: { slug: video.slug },
      update: {},
      create: video
    });
  }

  // Seed live matches
  const liveMatches = [
    { team1: 'Arsenal', team2: 'Newcastle', score: '2-1', time: '75\'', streamUrl: 'https://2live.sia-live.live/bein-1/', isActive: true },
    { team1: 'Barcelona', team2: 'Real Madrid', score: '1-1', time: '60\'', streamUrl: 'https://2live.sia-live.live/bein-2/', isActive: false }
  ];

  for (const match of liveMatches) {
    await prisma.liveMatch.create({
      data: match
    });
  }

  // Seed audios
  const audios = [
    { title: 'Morning News Bulletin', artist: 'KEC News', audioUrl: 'https://example.com/news.mp3', duration: '5:30', type: 'news', isActive: true },
    { title: 'Jazz Evening', artist: 'Various Artists', audioUrl: 'https://example.com/jazz.mp3', duration: '45:00', type: 'music', isActive: false },
    { title: 'Tech Talk Podcast', artist: 'KEC Tech', audioUrl: 'https://example.com/podcast.mp3', duration: '30:15', type: 'podcast', isActive: false }
  ];

  for (const audio of audios) {
    await prisma.audio.create({
      data: audio
    });
  }

  console.log('Database seeded with categories, videos, live matches, and audios!');}
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });