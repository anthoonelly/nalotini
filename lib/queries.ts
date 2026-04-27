import { sql, ensureDbReady, newId } from "./db";
import { Listing, Reservation, Conversation, Message } from "./types";
import { moderateListing } from "./moderation";

function mapListing(row: any): Listing {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name ?? "Użytkownik",
    type: row.type,
    category: row.category,
    title: row.title,
    description: row.description,
    activityType: row.activity_type,
    flightDate: row.flight_date
      ? new Date(row.flight_date).toISOString().slice(0, 10)
      : null,
    flightTime: row.flight_time,
    location: row.location,
    destination: row.destination,
    totalSeats: row.total_seats,
    availableSeats: row.available_seats,
    costType: row.cost_type,
    costAmount: row.cost_amount,
    settlementMethod: row.settlement_method,
    visibility: row.visibility,
    status: row.status,
    moderationFlags: row.moderation_flags,
    moderationNote: row.moderation_note,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getActiveListings(opts: {
  category?: string;
  location?: string;
  fromDate?: string;
  onlyAvailable?: boolean;
  limit?: number;
} = {}): Promise<Listing[]> {
  await ensureDbReady();
  const limit = opts.limit ?? 100;

  // Use single dynamic-but-safe query via tagged template branches.
  let rows: any[];
  if (opts.category && opts.location) {
    rows = await sql`
      SELECT l.*, u.name AS author_name
      FROM listings l JOIN users u ON u.id = l.author_id
      WHERE l.status = 'active'
        AND l.category = ${opts.category}
        AND l.location ILIKE ${"%" + opts.location + "%"}
      ORDER BY l.created_at DESC LIMIT ${limit}
    `;
  } else if (opts.category) {
    rows = await sql`
      SELECT l.*, u.name AS author_name
      FROM listings l JOIN users u ON u.id = l.author_id
      WHERE l.status = 'active' AND l.category = ${opts.category}
      ORDER BY l.created_at DESC LIMIT ${limit}
    `;
  } else if (opts.location) {
    rows = await sql`
      SELECT l.*, u.name AS author_name
      FROM listings l JOIN users u ON u.id = l.author_id
      WHERE l.status = 'active'
        AND l.location ILIKE ${"%" + opts.location + "%"}
      ORDER BY l.created_at DESC LIMIT ${limit}
    `;
  } else {
    rows = await sql`
      SELECT l.*, u.name AS author_name
      FROM listings l JOIN users u ON u.id = l.author_id
      WHERE l.status = 'active'
      ORDER BY l.created_at DESC LIMIT ${limit}
    `;
  }

  let listings = rows.map(mapListing);

  if (opts.fromDate) {
    listings = listings.filter(
      (l) => !l.flightDate || l.flightDate >= opts.fromDate!
    );
  }
  if (opts.onlyAvailable) {
    listings = listings.filter(
      (l) => l.availableSeats === null || (l.availableSeats ?? 0) > 0
    );
  }
  return listings;
}

export async function getListingById(id: string): Promise<Listing | null> {
  await ensureDbReady();
  const rows = await sql`
    SELECT l.*, u.name AS author_name
    FROM listings l JOIN users u ON u.id = l.author_id
    WHERE l.id = ${id}
  `;
  if (rows.length === 0) return null;
  return mapListing(rows[0]);
}

export async function getListingsByAuthor(authorId: string): Promise<Listing[]> {
  await ensureDbReady();
  const rows = await sql`
    SELECT l.*, u.name AS author_name
    FROM listings l JOIN users u ON u.id = l.author_id
    WHERE l.author_id = ${authorId}
    ORDER BY l.created_at DESC
  `;
  return rows.map(mapListing);
}

export async function getPendingListings(): Promise<Listing[]> {
  await ensureDbReady();
  const rows = await sql`
    SELECT l.*, u.name AS author_name
    FROM listings l JOIN users u ON u.id = l.author_id
    WHERE l.status = 'pending_review'
    ORDER BY l.created_at DESC
  `;
  return rows.map(mapListing);
}

export async function getAllListingsForAdmin(): Promise<Listing[]> {
  await ensureDbReady();
  const rows = await sql`
    SELECT l.*, u.name AS author_name
    FROM listings l JOIN users u ON u.id = l.author_id
    ORDER BY l.created_at DESC LIMIT 500
  `;
  return rows.map(mapListing);
}

export interface CreateListingInput {
  authorId: string;
  type: "offer" | "request";
  category: string;
  title: string;
  description: string;
  activityType?: string | null;
  flightDate?: string | null;
  flightTime?: string | null;
  location: string;
  destination?: string | null;
  totalSeats?: number | null;
  availableSeats?: number | null;
  costType?: string | null;
  costAmount?: number | null;
  settlementMethod?: string | null;
  visibility: "public" | "verified_only";
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  await ensureDbReady();
  const id = newId("lst");
  const moderation = moderateListing({
    title: input.title,
    description: input.description,
    activityType: input.activityType,
    costAmount: input.costAmount,
  });
  const status = moderation.shouldReview ? "pending_review" : "active";
  const flags = moderation.flags.length > 0 ? JSON.stringify(moderation.flags) : null;

  await sql`
    INSERT INTO listings (
      id, author_id, type, category, title, description, activity_type,
      flight_date, flight_time, location, destination,
      total_seats, available_seats, cost_type, cost_amount, settlement_method,
      visibility, status, moderation_flags
    ) VALUES (
      ${id}, ${input.authorId}, ${input.type}, ${input.category}, ${input.title},
      ${input.description}, ${input.activityType ?? null},
      ${input.flightDate ?? null}, ${input.flightTime ?? null},
      ${input.location}, ${input.destination ?? null},
      ${input.totalSeats ?? null}, ${input.availableSeats ?? null},
      ${input.costType ?? null}, ${input.costAmount ?? null}, ${input.settlementMethod ?? null},
      ${input.visibility}, ${status}, ${flags}::jsonb
    )
  `;

  const created = await getListingById(id);
  return created!;
}

export async function updateListingStatus(
  id: string,
  status: "active" | "pending_review" | "rejected" | "closed",
  note?: string
): Promise<void> {
  await ensureDbReady();
  await sql`
    UPDATE listings SET status = ${status}, moderation_note = ${note ?? null}
    WHERE id = ${id}
  `;
}

export async function adminUpdateListing(
  id: string,
  fields: Partial<CreateListingInput> & { status?: string; moderationNote?: string }
): Promise<void> {
  await ensureDbReady();
  // Only update provided fields. Build with COALESCE pattern.
  const current = await getListingById(id);
  if (!current) return;

  const merged = {
    title: fields.title ?? current.title,
    description: fields.description ?? current.description,
    category: fields.category ?? current.category,
    location: fields.location ?? current.location,
    destination: fields.destination ?? current.destination,
    totalSeats: fields.totalSeats ?? current.totalSeats,
    availableSeats: fields.availableSeats ?? current.availableSeats,
    flightDate: fields.flightDate ?? current.flightDate,
    flightTime: fields.flightTime ?? current.flightTime,
    costType: fields.costType ?? current.costType,
    costAmount: fields.costAmount ?? current.costAmount,
    activityType: fields.activityType ?? current.activityType,
    visibility: fields.visibility ?? current.visibility,
    status: fields.status ?? current.status,
    moderationNote: fields.moderationNote ?? current.moderationNote,
  };

  await sql`
    UPDATE listings SET
      title = ${merged.title},
      description = ${merged.description},
      category = ${merged.category},
      location = ${merged.location},
      destination = ${merged.destination},
      total_seats = ${merged.totalSeats},
      available_seats = ${merged.availableSeats},
      flight_date = ${merged.flightDate},
      flight_time = ${merged.flightTime},
      cost_type = ${merged.costType},
      cost_amount = ${merged.costAmount},
      activity_type = ${merged.activityType},
      visibility = ${merged.visibility},
      status = ${merged.status},
      moderation_note = ${merged.moderationNote}
    WHERE id = ${id}
  `;
}

export async function deleteListing(id: string): Promise<void> {
  await ensureDbReady();
  await sql`DELETE FROM listings WHERE id = ${id}`;
}

// ===== Reservations =====

function mapReservation(row: any): Reservation {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitle: row.listing_title,
    userId: row.user_id,
    userName: row.user_name ?? "Użytkownik",
    seats: row.seats,
    message: row.message,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getReservationsByUser(userId: string): Promise<Reservation[]> {
  await ensureDbReady();
  const rows = await sql`
    SELECT r.*, u.name AS user_name, l.title AS listing_title
    FROM reservations r
    JOIN users u ON u.id = r.user_id
    JOIN listings l ON l.id = r.listing_id
    WHERE r.user_id = ${userId}
    ORDER BY r.created_at DESC
  `;
  return rows.map(mapReservation);
}

export async function getReservationsForListing(listingId: string): Promise<Reservation[]> {
  await ensureDbReady();
  const rows = await sql`
    SELECT r.*, u.name AS user_name, l.title AS listing_title
    FROM reservations r
    JOIN users u ON u.id = r.user_id
    JOIN listings l ON l.id = r.listing_id
    WHERE r.listing_id = ${listingId}
    ORDER BY r.created_at DESC
  `;
  return rows.map(mapReservation);
}

export async function getReservationsForAuthor(authorId: string): Promise<Reservation[]> {
  await ensureDbReady();
  const rows = await sql`
    SELECT r.*, u.name AS user_name, l.title AS listing_title
    FROM reservations r
    JOIN users u ON u.id = r.user_id
    JOIN listings l ON l.id = r.listing_id
    WHERE l.author_id = ${authorId}
    ORDER BY r.created_at DESC
  `;
  return rows.map(mapReservation);
}

export async function createReservation(input: {
  listingId: string;
  userId: string;
  seats: number;
  message?: string;
}): Promise<Reservation> {
  await ensureDbReady();
  const id = newId("res");
  await sql`
    INSERT INTO reservations (id, listing_id, user_id, seats, message)
    VALUES (${id}, ${input.listingId}, ${input.userId}, ${input.seats}, ${input.message ?? null})
  `;
  const rows = await sql`
    SELECT r.*, u.name AS user_name, l.title AS listing_title
    FROM reservations r
    JOIN users u ON u.id = r.user_id
    JOIN listings l ON l.id = r.listing_id
    WHERE r.id = ${id}
  `;
  return mapReservation(rows[0]);
}

export async function getReservation(id: string): Promise<Reservation | null> {
  await ensureDbReady();
  const rows = await sql`
    SELECT r.*, u.name AS user_name, l.title AS listing_title
    FROM reservations r
    JOIN users u ON u.id = r.user_id
    JOIN listings l ON l.id = r.listing_id
    WHERE r.id = ${id}
  `;
  return rows.length ? mapReservation(rows[0]) : null;
}

export async function updateReservationStatus(
  id: string,
  status: "pending" | "accepted" | "rejected" | "cancelled"
): Promise<void> {
  await ensureDbReady();
  await sql`UPDATE reservations SET status = ${status} WHERE id = ${id}`;
}

export async function decrementListingSeats(listingId: string, by: number) {
  await ensureDbReady();
  await sql`
    UPDATE listings
    SET available_seats = GREATEST(0, COALESCE(available_seats, 0) - ${by})
    WHERE id = ${listingId}
  `;
}

// ===== Conversations & Messages =====

export async function getOrCreateConversation(input: {
  userId: string;
  otherUserId: string;
  listingId?: string | null;
}): Promise<string> {
  await ensureDbReady();
  const [a, b] = [input.userId, input.otherUserId].sort();
  const listingId = input.listingId ?? null;

  let rows;
  if (listingId) {
    rows = await sql`
      SELECT id FROM conversations
      WHERE user_a = ${a} AND user_b = ${b} AND listing_id = ${listingId}
      LIMIT 1
    `;
  } else {
    rows = await sql`
      SELECT id FROM conversations
      WHERE user_a = ${a} AND user_b = ${b} AND listing_id IS NULL
      LIMIT 1
    `;
  }
  if (rows.length > 0) return rows[0].id;

  const id = newId("cnv");
  await sql`
    INSERT INTO conversations (id, listing_id, user_a, user_b)
    VALUES (${id}, ${listingId}, ${a}, ${b})
  `;
  return id;
}

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  await ensureDbReady();
  const rows = await sql`
    SELECT
      c.id,
      c.listing_id,
      l.title AS listing_title,
      CASE WHEN c.user_a = ${userId} THEN c.user_b ELSE c.user_a END AS other_id,
      ub.name AS other_name,
      (SELECT body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_body,
      COALESCE(
        (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1),
        c.created_at
      ) AS last_at
    FROM conversations c
    LEFT JOIN listings l ON l.id = c.listing_id
    JOIN users ub ON ub.id = (CASE WHEN c.user_a = ${userId} THEN c.user_b ELSE c.user_a END)
    WHERE c.user_a = ${userId} OR c.user_b = ${userId}
    ORDER BY last_at DESC
  `;
  return rows.map((r: any) => ({
    id: r.id,
    listingId: r.listing_id,
    listingTitle: r.listing_title,
    otherUserId: r.other_id,
    otherUserName: r.other_name,
    lastMessageAt: new Date(r.last_at).toISOString(),
    lastMessageBody: r.last_body,
  }));
}

export async function getMessages(conversationId: string, userId: string): Promise<Message[]> {
  await ensureDbReady();
  // Verify access
  const conv = await sql`
    SELECT id FROM conversations WHERE id = ${conversationId}
      AND (user_a = ${userId} OR user_b = ${userId})
  `;
  if (conv.length === 0) return [];

  const rows = await sql`
    SELECT m.*, u.name AS sender_name
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    WHERE m.conversation_id = ${conversationId}
    ORDER BY m.created_at ASC
  `;
  return rows.map((r: any) => ({
    id: r.id,
    conversationId: r.conversation_id,
    senderId: r.sender_id,
    senderName: r.sender_name,
    body: r.body,
    createdAt: new Date(r.created_at).toISOString(),
  }));
}

export async function sendMessage(input: {
  conversationId: string;
  senderId: string;
  body: string;
}): Promise<void> {
  await ensureDbReady();
  const id = newId("msg");
  await sql`
    INSERT INTO messages (id, conversation_id, sender_id, body)
    VALUES (${id}, ${input.conversationId}, ${input.senderId}, ${input.body})
  `;
}

// ===== Reports =====

export async function createReport(input: {
  listingId: string;
  reporterId?: string | null;
  reason: string;
  details?: string | null;
}): Promise<void> {
  await ensureDbReady();
  const id = newId("rep");
  await sql`
    INSERT INTO reports (id, listing_id, reporter_id, reason, details)
    VALUES (${id}, ${input.listingId}, ${input.reporterId ?? null}, ${input.reason}, ${input.details ?? null})
  `;
}

export async function getOpenReports() {
  await ensureDbReady();
  const rows = await sql`
    SELECT r.*, l.title AS listing_title, u.name AS reporter_name
    FROM reports r
    JOIN listings l ON l.id = r.listing_id
    LEFT JOIN users u ON u.id = r.reporter_id
    WHERE r.status = 'open'
    ORDER BY r.created_at DESC
  `;
  return rows.map((r: any) => ({
    id: r.id,
    listingId: r.listing_id,
    listingTitle: r.listing_title,
    reporterId: r.reporter_id,
    reporterName: r.reporter_name,
    reason: r.reason,
    details: r.details,
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
  }));
}

export async function resolveReport(id: string) {
  await ensureDbReady();
  await sql`UPDATE reports SET status = 'resolved' WHERE id = ${id}`;
}

// ===== Users =====

export async function getAllUsers() {
  await ensureDbReady();
  const rows = await sql`
    SELECT id, email, name, phone, role, visibility, banned, created_at
    FROM users ORDER BY created_at DESC
  `;
  return rows.map((r: any) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    phone: r.phone,
    role: r.role,
    visibility: r.visibility,
    banned: r.banned,
    createdAt: new Date(r.created_at).toISOString(),
  }));
}

export async function setUserBanned(id: string, banned: boolean) {
  await ensureDbReady();
  await sql`UPDATE users SET banned = ${banned} WHERE id = ${id}`;
}

export async function setUserRole(id: string, role: "user" | "admin") {
  await ensureDbReady();
  await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
}

export async function getUserByEmail(email: string) {
  await ensureDbReady();
  const rows = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}`;
  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  await ensureDbReady();
  const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
  if (!rows[0]) return null;
  const u = rows[0];
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    visibility: u.visibility,
    banned: u.banned,
    createdAt: new Date(u.created_at).toISOString(),
  };
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  phone?: string | null;
}) {
  await ensureDbReady();
  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(input.password, 10);
  const id = newId("usr");
  const email = input.email.toLowerCase().trim();
  await sql`
    INSERT INTO users (id, email, password_hash, name, phone, role, visibility)
    VALUES (${id}, ${email}, ${passwordHash}, ${input.name}, ${input.phone ?? null}, 'user', 'verified')
  `;
  return id;
}

export async function updateUserProfile(
  id: string,
  fields: { name?: string; phone?: string | null; visibility?: "public" | "verified" }
) {
  await ensureDbReady();
  const current = await getUserById(id);
  if (!current) return;
  await sql`
    UPDATE users SET
      name = ${fields.name ?? current.name},
      phone = ${fields.phone === undefined ? current.phone : fields.phone},
      visibility = ${fields.visibility ?? current.visibility}
    WHERE id = ${id}
  `;
}
