import { PrismaClient } from '@prisma/client';
import cloudinary from '../cloudinary/cloud.js';

const prisma = new PrismaClient();

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').trim('-');
}

export const getFunContent = async (req, res) => {
  try {
    const funContent = await prisma.fun.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ funContent });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFunById = async (req, res) => {
  try {
    const { id } = req.params;
    const fun = await prisma.fun.findUnique({
      where: { id: parseInt(id) }
    });
    if (!fun) {
      return res.status(404).json({ message: 'Fun content not found' });
    }
    res.json(fun);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createFun = async (req, res) => {
  try {
    const { title, description, type, author } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    let imageUrl = null;
    
    // Handle image upload with timeout
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      if (imageFiles.length > 0) {
        try {
          // Upload with timeout and smaller file size
          const uploadPromise = cloudinary.uploader.upload(
            `data:${imageFiles[0].mimetype};base64,${imageFiles[0].buffer.toString('base64')}`,
            { 
              folder: 'kec/fun',
              timeout: 30000, // 30 second timeout
              resource_type: 'auto'
            }
          );
          
          const result = await Promise.race([
            uploadPromise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Upload timeout')), 30000)
            )
          ]);
          
          imageUrl = result.secure_url;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError.message);
          // Continue without image if upload fails
          imageUrl = 'https://via.placeholder.com/400x300?text=Upload+Failed';
        }
      }
    }
    
    // Retry database operation with exponential backoff
    let retries = 3;
    let fun = null;
    
    while (retries > 0) {
      try {
        fun = await prisma.fun.create({
          data: {
            title,
            slug: slugify(title),
            description: description || '',
            imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
            type: type || 'meme',
            author: author || 'Ikarita Media'
          }
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        retries--;
        if (retries === 0) {
          throw dbError; // Throw error if all retries failed
        }
        console.log(`Database connection failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
    
    res.status(201).json(fun);
  } catch (error) {
    console.error('Error creating fun content:', error);
    
    // Check if it's a database connection error
    if (error.code === 'P1001') {
      return res.status(503).json({ 
        message: 'Database connection error. Please check your internet connection and try again.',
        error: 'Database temporarily unavailable'
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateFun = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, author } = req.body;
    
    const updateData = { title, description, type, author };
    if (title) updateData.slug = slugify(title);
    
    // Handle image upload
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      if (imageFiles.length > 0) {
        const result = await cloudinary.uploader.upload(
          `data:${imageFiles[0].mimetype};base64,${imageFiles[0].buffer.toString('base64')}`,
          { folder: 'kec/fun' }
        );
        updateData.imageUrl = result.secure_url;
      }
    }
    
    const fun = await prisma.fun.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    res.json(fun);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const likeFun = async (req, res) => {
  try {
    const { id } = req.params;
    const fun = await prisma.fun.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } }
    });
    res.json(fun);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteFun = async (req, res) => {
  try {
    await prisma.fun.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Fun content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};