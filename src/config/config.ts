import dotenv from 'dotenv';
import program from '../cli';

dotenv.config();

const mode = program.opts().mode;

console.log(mode);

let envFilePath: string;

switch (mode) {
  case 'prod':
    envFilePath = '../src/config/.env.production';
    break;
  case 'dev':
    envFilePath = './src/config/.env.development';
    break;
  case 'test':
    envFilePath = './src/config/.env.testing';
    break;
  default:
    throw new Error('Invalid mode specified');
}

dotenv.config({ path: envFilePath });

export default {
  port: process.env.PORT,
  urlMongo: process.env.MONGODB_URI,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  environment: mode,
};
