import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:dy6WQHrnSUt9@ep-tight-bonus-a5i5yk8s.us-east-2.aws.neon.tech/AI-formbuilder?sslmode=require',
  }
});