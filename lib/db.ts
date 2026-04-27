import { neon, neonConfig, NeonQueryFunction } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

neonConfig.fetchConnectionCache = true;

function getConnectionString(): string {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

let _sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const cs = getConnectionString();
  if (!cs) {
    throw new Error(
      "Brak połączenia z bazą danych. W panelu Vercela przejdź do Storage → Create Database → Neon, a następnie zrób Redeploy."
    );
  }
  _sql = neon(cs);
  return _sql;
}

// Proxy that defers neon() init until first use - this allows Next.js
// to build successfully even when DATABASE_URL is not set at build time.
export const sql: NeonQueryFunction<false, false> = ((
  ...args: Parameters<NeonQueryFunction<false, false>>
) => (getSql() as any)(...args)) as NeonQueryFunction<false, false>;

let initPromise: Promise<void> | null = null;

export function ensureDbReady(): Promise<void> {
  if (!initPromise) {
    initPromise = initSchema().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

async function initSchema() {
  if (!getConnectionString()) {
    throw new Error(
      "Brak połączenia z bazą danych. Skonfiguruj integrację Neon w panelu Vercela (Storage → Create Database → Neon)."
    );
  }

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      visibility TEXT NOT NULL DEFAULT 'verified',
      banned BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      activity_type TEXT,
      flight_date DATE,
      flight_time TEXT,
      location TEXT NOT NULL,
      destination TEXT,
      total_seats INT,
      available_seats INT,
      cost_type TEXT,
      cost_amount INT,
      settlement_method TEXT,
      visibility TEXT NOT NULL DEFAULT 'public',
      status TEXT NOT NULL DEFAULT 'active',
      moderation_flags JSONB,
      moderation_note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      seats INT NOT NULL DEFAULT 1,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      listing_id TEXT REFERENCES listings(id) ON DELETE SET NULL,
      user_a TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_b TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS conversations_pair_idx
    ON conversations (user_a, user_b, listing_id)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      reporter_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await seedAdmin();
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrator";

  if (!email || !password) return;

  const existing = await sql`SELECT id, role FROM users WHERE email = ${email}`;

  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash(password, 10);
    const id = `usr_admin_${Date.now()}`;
    await sql`
      INSERT INTO users (id, email, password_hash, name, role, visibility)
      VALUES (${id}, ${email}, ${passwordHash}, ${name}, 'admin', 'verified')
    `;
    console.log(`[db] Seeded admin account: ${email}`);
  } else if (existing[0].role !== "admin") {
    await sql`UPDATE users SET role = 'admin' WHERE email = ${email}`;
    console.log(`[db] Promoted existing user to admin: ${email}`);
  }
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
