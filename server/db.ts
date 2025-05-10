import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon serverless to work with WebSockets
neonConfig.webSocketConstructor = ws;

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create the connection pool with additional configuration for reliability
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Reduce max connections to avoid overloading the database
  idleTimeoutMillis: 30000, // Longer timeout for idle connections
  connectionTimeoutMillis: 5000, // Connection timeout
});

// Add error handling to the pool
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  // Don't crash the application, just log the error
});

// Create the drizzle client
export const db = drizzle(pool, { schema });