import { PrismaClient } from '@prisma/client';
import cloudinary from '../cloudinary/cloud.js';

const prisma = new PrismaClient();

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').trim('-');
}

export const getArticles = async (req, res) => {
  try {
    const { category } = req.query;
    
    let whereClause = {};
    if (category) {
      whereClause = {
        category: {
          name: category
        }
      };
    }
    
    const articles = await prisma.article.findMany({
      where: whereClause,
      include: { author: { select: { id: true, name: true } }, category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ articles });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    let article;
    
    if (isNaN(parseInt(id))) {
      // If id is not a number, treat it as a slug
      article = await prisma.article.findUnique({
        where: { slug: id },
        include: { author: { select: { id: true, name: true } }, category: true }
      });
    } else {
      // If id is a number, treat it as an ID
      article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
        include: { author: { select: { id: true, name: true } }, category: true }
      });
    }
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Increment views
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } }
    });
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, categoryId, sideCategories, leftColumnContent, rightColumnContent } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    let imageUrl = null;
    let allImages = [];
    
    // Collect all uploaded images
    if (req.files && req.files.image) {
      for (const file of req.files.image) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: 'kec/articles' }
        );
        allImages.push(result.secure_url);
      }
    }
    
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: 'kec/articles' }
        );
        allImages.push(result.secure_url);
      }
    }
    
    // Handle single vs multiple images
    if (allImages.length === 1) {
      imageUrl = allImages[0];
    } else if (allImages.length > 1) {
      imageUrl = allImages[0]; // First image as main
    }
    
    // Ensure default author exists
    let author = await prisma.user.findFirst();
    if (!author) {
      const authorNames = ['Jean-Claude Emmanuel', 'Boniface Nkurunziza', 'Olivier Habimana', 'Uwimana Erick', 'Mukamusoni Ndoli'];
      const randomName = authorNames[Math.floor(Math.random() * authorNames.length)];
      
      author = await prisma.user.create({
        data: {
          name: randomName,
          email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@kec.com`,
          passwordHash: 'defaultpassword'
        }
      });
    }
    
    // Ensure default category exists
    let category = await prisma.category.findFirst({ where: { id: parseInt(categoryId) || 1 } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'General',
          slug: 'general',
          description: 'General news and articles'
        }
      });
    }
    
    // Generate unique slug
    let slug = slugify(title);
    let slugExists = await prisma.article.findUnique({ where: { slug } });
    let counter = 1;
    
    while (slugExists) {
      slug = `${slugify(title)}-${counter}`;
      slugExists = await prisma.article.findUnique({ where: { slug } });
      counter++;
    }
    
    const articleData = {
      title,
      slug,
      content,
      excerpt: excerpt || '',
      imageUrl,
      images: allImages.length > 1 ? JSON.stringify(allImages) : null,
      leftColumnContent: leftColumnContent || null,
      rightColumnContent: rightColumnContent || null,
      categoryId: category.id,
      sideCategories: sideCategories || '',
      authorId: author.id,
      status: 'published'
    };
    

    
    const article = await prisma.article.create({
      data: articleData,
      include: { author: { select: { id: true, name: true } }, category: true }
    });
    
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, categoryId, sideCategories, leftColumnContent, rightColumnContent } = req.body;
    
    const updateData = { 
      title, 
      content, 
      excerpt, 
      categoryId: parseInt(categoryId), 
      sideCategories,
      leftColumnContent: leftColumnContent || null,
      rightColumnContent: rightColumnContent || null
    };
    if (title) updateData.slug = slugify(title);
    
    // Handle main image update
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(
        `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
        { folder: 'kec/articles' }
      );
      updateData.imageUrl = result.secure_url;
    }
    
    // Handle additional images update
    let additionalImages = [];
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: 'kec/articles' }
        );
        additionalImages.push(result.secure_url);
      }
      updateData.images = JSON.stringify(additionalImages);
    }
    
    if (req.files && req.files.additionalImages) {
      for (const file of req.files.additionalImages) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: 'kec/articles' }
        );
        additionalImages.push(result.secure_url);
      }
      updateData.images = JSON.stringify(additionalImages);
    }
    
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { author: { select: { id: true, name: true } }, category: true }
    });
    
    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    await prisma.article.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });
    res.json({ views: article.views });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const likeArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } }
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const shareArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { shares: { increment: 1 } }
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    let articleId;
    
    if (isNaN(parseInt(id))) {
      // If id is not a number, treat it as a slug
      const article = await prisma.article.findUnique({ where: { slug: id } });
      if (!article) return res.status(404).json({ message: 'Article not found' });
      articleId = article.id;
    } else {
      articleId = parseInt(id);
    }
    
    // Get comments from memory storage
    const comments = commentsStorage[articleId] || [];
    
    // Sort by newest first
    const sortedComments = comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json({ comments: sortedComments });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// In-memory storage for comments (temporary solution)
let commentsStorage = {};

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author } = req.body;
    
    console.log('Creating comment for article:', id);
    console.log('Comment data:', { content, author });
    
    if (!content || !author) {
      return res.status(400).json({ message: 'Content and author are required' });
    }
    
    let articleId = parseInt(id);
    
    // Initialize comments array for this article if it doesn't exist
    if (!commentsStorage[articleId]) {
      commentsStorage[articleId] = [];
    }
    
    // Create comment object
    const comment = {
      id: Date.now(),
      content,
      author,
      authorName: author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleId,
      isApproved: true
    };
    
    // Store comment in memory
    commentsStorage[articleId].push(comment);
    
    console.log('Comment created:', comment);
    console.log('All comments for article:', commentsStorage[articleId]);
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};