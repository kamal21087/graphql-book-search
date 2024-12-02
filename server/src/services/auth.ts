import jwt, { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload extends BaseJwtPayload {
  _id: string;
  username: string;
  email: string;
}

// Function to extract user from token
export const authenticateToken = (authHeader?: string) => {
  if (!authHeader) {
    console.error('No authorization header provided.');
    return null;
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET || '';

  if (!secretKey) {
    console.error('Error: JWT secret key is not set in environment variables.');
    return null;
  }

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

// Function to sign JWT token
export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET || '';

  if (!secretKey) {
    throw new Error('Error: JWT secret key is not set in environment variables.');
  }

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
