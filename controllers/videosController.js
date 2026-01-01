import { PrismaClient } from '@prisma/client';
import cloudinary from '../cloudinary/cloud.js';

const prisma = new PrismaClient();

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').trim('-');
}

export const getVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createVideo = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { title, description, categoryId, duration, videoUrl } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required', field: 'title' });
    }
    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL is required', field: 'videoUrl' });
    }
    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required', field: 'categoryId' });
    }
    
    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });
    
    if (!categoryExists) {
      return res.status(400).json({ 
        message: `Category with ID ${categoryId} does not exist`, 
        field: 'categoryId',
        availableCategories: await prisma.category.findMany({ select: { id: true, name: true } })
      });
    }
    
    const videoData = {
      title,
      slug: slugify(title),
      description,
      videoUrl,
      categoryId: parseInt(categoryId),
      duration
    };
    
    console.log('Creating video with data:', videoData);
    
    const video = await prisma.video.create({
      data: videoData,
      include: { category: true }
    });
    
    console.log('Video created successfully:', video);
    
    res.status(201).json(video);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    await prisma.video.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};