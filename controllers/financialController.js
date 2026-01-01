import { PrismaClient } from '@prisma/client';
import cloudinary from '../cloudinary/cloud.js';

const prisma = new PrismaClient();

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').trim('-');
}

export const getFinancialData = async (req, res) => {
  try {
    const financialData = await prisma.financial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ financialData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFinancialById = async (req, res) => {
  try {
    const { id } = req.params;
    const financial = await prisma.financial.findUnique({
      where: { id: parseInt(id) }
    });
    if (!financial) {
      return res.status(404).json({ message: 'Financial data not found' });
    }
    res.json(financial);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createFinancial = async (req, res) => {
  try {
    const { title, description, category, trend, isPositive } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    let imageUrl = null;
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(
        `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
        { folder: 'kec/financial' }
      );
      imageUrl = result.secure_url;
    }
    
    const financial = await prisma.financial.create({
      data: {
        title,
        slug: slugify(title),
        description: description || '',
        imageUrl,
        category: category || 'charts',
        trend: trend || null,
        isPositive: isPositive !== undefined ? Boolean(isPositive) : true
      }
    });
    
    res.status(201).json(financial);
  } catch (error) {
    console.error('Error creating financial data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateFinancial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, trend, isPositive } = req.body;
    
    const updateData = { title, description, category, trend, isPositive: Boolean(isPositive) };
    if (title) updateData.slug = slugify(title);
    
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(
        `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
        { folder: 'kec/financial' }
      );
      updateData.imageUrl = result.secure_url;
    }
    
    const financial = await prisma.financial.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    res.json(financial);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFinancial = async (req, res) => {
  try {
    await prisma.financial.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Financial data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const financial = await prisma.financial.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });
    res.json({ views: financial.views });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};