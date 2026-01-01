import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllLiveMatches = async (req, res) => {
  try {
    const matches = await prisma.liveMatch.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(matches);
  } catch (error) {
    console.error('Error fetching live matches:', error);
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
};

export const getActiveLiveMatch = async (req, res) => {
  try {
    const match = await prisma.liveMatch.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(match);
  } catch (error) {
    console.error('Error fetching active live match:', error);
    res.status(500).json({ error: 'Failed to fetch active live match' });
  }
};

export const createLiveMatch = async (req, res) => {
  try {
    const { team1, team2, score, time, streamUrl, isActive } = req.body;

    if (!team1 || !team2 || !streamUrl) {
      return res.status(400).json({ error: 'team1, team2, and streamUrl are required' });
    }

    const match = await prisma.liveMatch.create({
      data: { team1, team2, score, time, streamUrl, isActive: isActive ?? true }
    });

    res.status(201).json(match);
  } catch (error) {
    console.error('Error creating live match:', error);
    res.status(500).json({ error: 'Failed to create live match' });
  }
};

export const updateLiveMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { team1, team2, score, time, streamUrl, isActive } = req.body;

    const match = await prisma.liveMatch.update({
      where: { id: parseInt(id) },
      data: { team1, team2, score, time, streamUrl, isActive }
    });

    res.json(match);
  } catch (error) {
    console.error('Error updating live match:', error);
    res.status(500).json({ error: 'Failed to update live match' });
  }
};

export const deleteLiveMatch = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.liveMatch.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Live match deleted successfully' });
  } catch (error) {
    console.error('Error deleting live match:', error);
    res.status(500).json({ error: 'Failed to delete live match' });
  }
};
