import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getActiveAudio = async (req, res) => {
  try {
    const audio = await prisma.audio.findFirst({
      where: { isActive: true }
    });
    res.json(audio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};