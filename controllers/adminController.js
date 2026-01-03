import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'kec-super-secure-jwt-secret-2025';
const SALT_ROUNDS = 12;

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin user
    const admin = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true
      }
    });

    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify JWT Token
export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify admin still exists
    const admin = await prisma.user.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Invalid token' });
    }

    res.json({ 
      success: true, 
      admin 
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Create initial admin account (run once)
export const createInitialAdmin = async () => {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'ikarita@media.com' }
    });

    if (existingAdmin) {
      // Update existing admin with proper bcrypt hash
      const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
      await prisma.user.update({
        where: { email: 'ikarita@media.com' },
        data: {
          passwordHash: hashedPassword,
          name: 'KEC Administrator',
          role: 'admin'
        }
      });
      console.log('✅ Admin account updated with secure password');
      return;
    }

    // Create new admin account
    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    await prisma.user.create({
      data: {
        name: 'KEC Administrator',
        email: 'ikarita@media.com',
        passwordHash: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Admin account created successfully');
    console.log('📧 Email: ikarita@media.com');
    console.log('🔑 Password: Set from environment variable');
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
};

// Admin Signup (only works if no admin exists)
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return res.status(403).json({ message: 'Admin account already exists. Signup disabled.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create admin account
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin
    });

  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if signup is available
export const checkSignupAvailability = async (req, res) => {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    res.json({
      canSignup: !existingAdmin
    });

  } catch (error) {
    console.error('Check signup error:', error);
    res.status(500).json({ canSignup: false });
  }
};
export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify admin exists and has admin role
    const admin = await prisma.user.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};