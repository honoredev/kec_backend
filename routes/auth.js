import express from 'express';
import multer from 'multer';
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle, incrementViews, likeArticle, shareArticle, getComments, createComment } from '../controllers/articlesController.js';
import { getVideos, createVideo, deleteVideo } from '../controllers/videosController.js';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoriesController.js';
import { getAllLiveMatches, getActiveLiveMatch, createLiveMatch, updateLiveMatch, deleteLiveMatch } from '../controllers/liveMatchController.js';
import { getFunContent, getFunById, createFun, updateFun, deleteFun, likeFun } from '../controllers/funController.js';
import { getFinancialData, getFinancialById, createFinancial, updateFinancial, deleteFinancial, incrementViews as incrementFinancialViews } from '../controllers/financialController.js';
import { getActiveAudio } from '../controllers/audioController.js';
import { adminLogin, verifyToken, authenticateAdmin } from '../controllers/adminController.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

// Multiple image upload configuration
const multipleUpload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'additionalImages', maxCount: 10 }
]);

// Admin Authentication Routes
router.post('/admin/login', adminLogin);
router.get('/admin/verify', verifyToken);

// Articles routes
router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);
router.post('/articles', authenticateAdmin, multipleUpload, createArticle);
router.put('/articles/:id', authenticateAdmin, multipleUpload, updateArticle);
router.delete('/articles/:id', authenticateAdmin, deleteArticle);
router.post('/articles/:id/view', incrementViews);
router.post('/articles/:id/like', likeArticle);
router.post('/articles/:id/share', shareArticle);
router.get('/articles/:id/comments', getComments);
router.post('/articles/:id/comments', createComment);

// Videos routes
router.get('/videos', getVideos);
router.post('/videos', authenticateAdmin, createVideo);
router.delete('/videos/:id', authenticateAdmin, deleteVideo);

// Categories routes
router.get('/categories', getCategories);
router.post('/categories', authenticateAdmin, createCategory);
router.delete('/categories/:id', authenticateAdmin, deleteCategory);

// Live Match routes
router.get('/live-matches', getAllLiveMatches);
router.get('/live-matches/active', getActiveLiveMatch);
router.post('/live-matches', authenticateAdmin, createLiveMatch);
router.put('/live-matches/:id', authenticateAdmin, updateLiveMatch);
router.delete('/live-matches/:id', authenticateAdmin, deleteLiveMatch);

// Fun routes
router.get('/fun', getFunContent);
router.get('/fun/:id', getFunById);
router.post('/fun', authenticateAdmin, multipleUpload, createFun);
router.put('/fun/:id', authenticateAdmin, multipleUpload, updateFun);
router.delete('/fun/:id', authenticateAdmin, deleteFun);
router.post('/fun/:id/like', likeFun);

// Financial routes
router.get('/financial', getFinancialData);
router.get('/financial/:id', getFinancialById);
router.post('/financial', authenticateAdmin, multipleUpload, createFinancial);
router.put('/financial/:id', authenticateAdmin, multipleUpload, updateFinancial);
router.delete('/financial/:id', authenticateAdmin, deleteFinancial);
router.post('/financial/:id/view', incrementFinancialViews);

// Audio routes
router.get('/audios/active', getActiveAudio);

export default router;