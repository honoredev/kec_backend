import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { initializePrisma } from './prisma-init.js';
import { createInitialAdmin } from './controllers/adminController.js';
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
} from './controllers/articlesController.js';
import {
  getBets,
  getBetById,
  createBet,
  voteBet,
  deleteBet
} from './controllers/betsController.js';

dotenv.config();

// Initialize Prisma client
await initializePrisma();

// Create initial admin account
await createInitialAdmin();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://www.ikarita.com','https://ikaritamedia.vercel.app'] // Your frontend domain
    : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173'], // Local development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', authRoutes);

// Article routes (no authentication required)
app.get('/api/articles', getArticles);
app.get('/api/articles/:id', getArticleById);
app.post('/api/articles/:id/views', incrementViews);
app.post('/api/articles/:id/like', likeArticle);
app.post('/api/articles/:id/share', shareArticle);
app.get('/api/articles/:id/comments', getComments);
app.post('/api/articles/:id/comments', createComment);
app.post('/api/articles', createArticle);
app.put('/api/articles/:id', updateArticle);
app.delete('/api/articles/:id', deleteArticle);

// Categories
app.get('/api/categories', (req, res) => res.json({ categories: [] }));
app.post('/api/categories', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.delete('/api/categories/:id', (req, res) => res.json({ message: 'Category deleted' }));

// Videos
app.get('/api/videos', (req, res) => res.json({ videos: [] }));
app.post('/api/videos', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.delete('/api/videos/:id', (req, res) => res.json({ message: 'Video deleted' }));

// Live Matches
app.get('/api/live-matches', (req, res) => res.json([]));
app.post('/api/live-matches', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.put('/api/live-matches/:id', (req, res) => res.json({ id: req.params.id, ...req.body }));
app.delete('/api/live-matches/:id', (req, res) => res.json({ message: 'Live match deleted' }));

// Audios
app.get('/api/audios', (req, res) => res.json([]));
app.post('/api/audios', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.put('/api/audios/:id', (req, res) => res.json({ id: req.params.id, ...req.body }));
app.delete('/api/audios/:id', (req, res) => res.json({ message: 'Audio deleted' }));

// Fun Content
app.get('/api/fun', (req, res) => res.json({ funContent: [] }));
app.post('/api/fun', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.delete('/api/fun/:id', (req, res) => res.json({ message: 'Fun content deleted' }));

// Bets routes
app.get('/api/bets', getBets);
app.get('/api/bets/:id', getBetById);
app.post('/api/bets', createBet);
app.post('/api/bets/:id/vote', voteBet);
app.delete('/api/bets/:id', deleteBet);

// Financial Data
app.get('/api/financial', (req, res) => res.json({ financialData: [] }));
app.delete('/api/financial/:id', (req, res) => res.json({ message: 'Financial data deleted' }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'KEC Backend API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`KEC Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${JSON.stringify(corsOptions.origin)}`);
});
