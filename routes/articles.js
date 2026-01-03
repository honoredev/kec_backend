import express from 'express';
import multer from 'multer';
import { 
  getArticles, 
  getArticleById, 
  createArticle, 
  updateArticle, 
  deleteArticle,
  incrementViews,
  likeArticle,
  shareArticle,
  getComments,
  createComment
} from '../controllers/articlesController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes (no authentication required)
router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);
router.post('/articles/:id/views', incrementViews);
router.post('/articles/:id/like', likeArticle);
router.post('/articles/:id/share', shareArticle);
router.get('/articles/:id/comments', getComments);
router.post('/articles/:id/comments', createComment);

// Protected routes (authentication required for creating/editing)
router.post('/articles', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'additionalImages', maxCount: 10 }
]), createArticle);

router.put('/articles/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'additionalImages', maxCount: 10 }
]), updateArticle);

router.delete('/articles/:id', deleteArticle);

export default router;