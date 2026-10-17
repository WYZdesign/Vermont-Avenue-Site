import crypto from "node:crypto";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local or the environment.");
  process.exit(1);
}

const ownerEmail = process.env.OWNER_EMAIL;
const ownerPassword = process.env.OWNER_PASSWORD;
if (!ownerEmail || !ownerPassword) {
  console.error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  process.exit(1);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return "scrypt$" + salt + "$" + hash;
}

const content = [
  ["tagline", "Created by musicians, for musicians."],
  ["about_intro", "Vermont Avenue Records is an independent record label based out of Los Angeles."],
  ["booking_note", "We reply within one business day. A 50% deposit secures the date."],
  ["contact_note", "Bookings, press, or a question about the label. We read everything."],
];

const users = [
  { email: ownerEmail, name: "John McGrath", role: "owner", password: ownerPassword },
];

if (process.env.SEED_DEMO === "1") {
  users.push(
    { email: "client@example.com", name: "Demo Client", role: "client", password: "client-dev-2026" },
    { email: "fan@example.com", name: "Demo Fan", role: "fan", password: "fan-dev-2026" },
    { email: "team@example.com", name: "Demo Team", role: "team", password: "team-dev-2026" },
  );
}

const pool = new Pool({ connectionString: url });

try {
  for (const user of users) {
    await pool.query(
      `insert into users (email, name, role, password_hash)
       values (lower($1), $2, $3, $4)
       on conflict (email) do update
         set name = excluded.name,
             role = excluded.role,
             password_hash = excluded.password_hash`,
      [user.email, user.name, user.role, hashPassword(user.password)],
    );
    console.log("user:", user.email, "(" + user.role + ")");
  }

  for (const [key, value] of content) {
    await pool.query(
      "insert into content_blocks (key, value) values ($1, $2) on conflict (key) do nothing",
      [key, value],
    );
  }
  console.log("content blocks seeded:", content.length);

  if (process.env.SEED_DEMO === "1") {
    await pool.query(
      `insert into bookings (name, email, phone, event_type, act, venue, guests, budget, message, status)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        "Demo Client",
        "client@example.com",
        "555-0100",
        "Wedding",
        "DJ + Live Combo",
        "The Stowaway, Los Angeles",
        "120",
        "$2,500",
        "Demo booking for admin testing.",
        "new",
      ],
    );
    console.log("demo booking created");
  }
} catch (error) {
  console.error("seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
