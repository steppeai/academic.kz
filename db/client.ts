import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
const connectionString = process.env.DATABASE_URL || "";
let db: ReturnType<typeof drizzle<typeof schema>>;
declare global { var __db: ReturnType<typeof drizzle<typeof schema>> | undefined; }
if (process.env.NODE_ENV === "production") { db = drizzle(new Pool({ connectionString }), { schema }); }
else { if (!global.__db) global.__db = drizzle(new Pool({ connectionString }), { schema }); db = global.__db; }
export { db };