import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { user } from '../types/user';

dotenv.config();

const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN as string;

// generating token when signup and login
const generatetoken = async (u: user): Promise<string> => {
  const token = jwt.sign({ userid: u.id, role: u.role }, TOKEN_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  return token;
};

export default generatetoken;
