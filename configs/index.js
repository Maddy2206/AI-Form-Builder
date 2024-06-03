import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon('postgresql://neondb_owner:dy6WQHrnSUt9@ep-tight-bonus-a5i5yk8s.us-east-2.aws.neon.tech/AI-formbuilder?sslmode=require');
export const db = drizzle(sql,{schema});