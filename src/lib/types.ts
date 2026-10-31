export type BookingStatus = "new" | "quoted" | "booked" | "closed" | "lost";

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  event_type: string;
  act: string;
  venue: string | null;
  guests: string | null;
  budget: string | null;
  message: string | null;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
};

export type Invoice = {
  id: string;
  booking_id: string | null;
  client_id: string | null;
  number: string;
  amount_cents: number;
  status: "draft" | "sent" | "paid" | "void";
  due_date: string | null;
  stripe_payment_link: string | null;
  notes: string | null;
  line_items: Array<{ description: string; quantity: number; unit_cents: number }>;
  tax_cents: number;
  deposit_cents: number;
  client_name: string | null;
  client_email: string | null;
  service_date: string | null;
  paid_at: string | null;
  created_at: string;
};

export type Contract = {
  id: string;
  booking_id: string | null;
  client_id: string | null;
  title: string;
  body: string;
  status: "draft" | "sent" | "signed" | "void";
  signed_at: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  event_date: string | null;
  venue: string | null;
  act: string | null;
  contract_type: string;
  fee_cents: number;
  deposit_cents: number;
  set_length_minutes: number | null;
  created_at: string;
};

export type SocialPost = {
  id: string;
  platform: string;
  content: string;
  media_urls: string[];
  scheduled_for: string | null;
  status: "draft" | "scheduled" | "published" | "failed" | "archived";
  external_url: string | null;
  notes: string | null;
  created_at: string;
};

export type Campaign = {
  id: string;
  name: string;
  channel: string | null;
  status: string;
  audience: string | null;
  sent_at: string | null;
  notes: string | null;
  created_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  created_at: string;
};

export type ContentBlock = {
  key: string;
  value: string;
  updated_at: string;
};

export type Logistics = {
  id: string;
  booking_id: string | null;
  event_date: string | null;
  venue: string | null;
  crew: string | null;
  equipment: string | null;
  checklist: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};
