export type ContractInput = {
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  eventDate?: string | null;
  venue?: string | null;
  act?: string | null;
  eventType?: string | null;
  feeCents: number;
  depositCents: number;
  setLengthMinutes?: number | null;
};

function money(cents: number): string {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function longDate(value?: string | null): string {
  if (!value) return "[date to be confirmed]";
  const d = new Date(value + "T12:00:00");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function buildPerformanceContract(input: ContractInput): string {
  const fee = money(input.feeCents);
  const deposit = money(input.depositCents);
  const balance = money(Math.max(input.feeCents - input.depositCents, 0));
  const setLength = input.setLengthMinutes ? `${input.setLengthMinutes} minutes` : "the agreed set length";
  const act = input.act || "the Artist";
  const venue = input.venue || "[venue to be confirmed]";
  const eventType = input.eventType || "private event";
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `LIVE PERFORMANCE AGREEMENT

Agreement Date: ${today}

This Live Performance Agreement ("Agreement") is made between Vermont Avenue Records ("Label" or "Artist") and ${input.clientName} ("Client") for a live performance at ${venue} on ${longDate(input.eventDate)}.

1. ENGAGEMENT
The Artist will perform as ${act} for the Client's ${eventType}. The performance will consist of ${setLength} of music, plus a reasonable break if the set exceeds 90 minutes. Load-in, sound check, and set times will be confirmed in writing at least seven (7) days before the event.

2. FEE AND PAYMENT
Total Fee: ${fee}
Non-refundable Deposit: ${deposit} (due upon signing to reserve the date)
Balance Due: ${balance} (due on the day of the performance, prior to the Artist taking the stage)

Accepted payment methods: cash, Zelle, Cash App, Venmo, PayPal, or card at the venue. All payments are in USD.

3. LATE PAYMENT
Balances not paid by the due date accrue a late charge of 1.5 percent per month or the maximum permitted by law, whichever is lower. The Artist may suspend performance until payment is received in full.

4. CANCELLATION BY CLIENT
If the Client cancels more than thirty (30) days before the event, the deposit is forfeited and no further amount is owed. If the Client cancels within thirty (30) days of the event, the full fee is due. Date changes requested more than fourteen (14) days before the event may be applied to a new date within twelve (12) months, subject to Artist availability.

5. CANCELLATION BY ARTIST
If the Artist cannot perform for reasons within the Artist's control, the Artist will refund all amounts paid, including the deposit, within seven (7) days. If the Artist can provide a comparable replacement act acceptable to the Client, the Client may accept the replacement in lieu of a refund.

6. FORCE MAJEURE
Neither party is liable for failure to perform caused by events beyond reasonable control, including government orders, venue closure, severe weather, fire, or public emergency. The affected party must notify the other in writing within forty-eight (48) hours. In that case the parties will reschedule in good faith, and any deposit will be applied to the new date.

7. VENUE AND TECHNICAL REQUIREMENTS
The Client will provide:
a) A safe, level performance area of at least 10 by 12 feet;
b) Access to at least two (2) grounded 20-amp power circuits within 25 feet of the stage;
c) A load-in window of at least sixty (60) minutes before the performance;
d) A secure place for instruments and equipment.
If the venue does not provide a house sound system, the Client will confirm in writing who supplies sound reinforcement.

8. HOSPITALITY AND CONDUCT
The Client will provide water for the performers and a private space to store belongings. The Client is responsible for the conduct of guests. The Artist may stop or end the performance if conditions become unsafe, and the fee remains due.

9. TRAVEL AND PARKING
The fee includes travel within Los Angeles County. Venues outside Los Angeles County may require an additional travel charge at the current IRS mileage rate, disclosed in writing before signing. The Client will provide reasonable parking or reimburse parking costs at the venue.

10. RECORDING AND MEDIA
The Client may photograph and record the performance for personal, non-commercial use. Commercial use, advertising use, or distribution of recordings requires the Artist's written consent. The Artist may record, photograph, and share the performance for portfolio and promotional use unless the Client objects in writing before the event.

11. INDEPENDENT CONTRACTOR
The Artist is an independent contractor. Nothing in this Agreement creates an employment, partnership, or agency relationship. The Artist is responsible for the Artist's own taxes, equipment, and insurance.

12. INSURANCE AND LIABILITY
The Client is responsible for the safety of the venue and for any injury or damage caused by the venue, its staff, or its guests. The Artist is responsible for the Artist's own equipment and conduct. Each party agrees to indemnify the other against claims arising from that party's own negligence or willful misconduct. The Artist carries general liability insurance; certificate available upon request.

13. OVERTIME
Any performance time beyond the agreed set length requires the Client's request and the Artist's agreement, billed at the Artist's standard overtime rate disclosed before the extension begins.

14. EXCLUSIVITY
Unless stated in writing, this Agreement is non-exclusive and the Artist may perform elsewhere on other dates.

15. GOVERNING LAW
This Agreement is governed by the laws of the State of California. The parties will attempt to resolve any dispute in good faith before pursuing legal action.

16. ENTIRE AGREEMENT AND SEVERABILITY
This Agreement is the entire agreement between the parties for this performance. Changes must be in writing and signed by both parties. If any provision is unenforceable, the rest remains in effect.

17. SIGNATURES

Client: ${input.clientName}
Email: ${input.clientEmail || "[email]"}
Phone: ${input.clientPhone || "[phone]"}

Signature: ______________________________   Date: ______________
Print Name: ____________________________   Title: ____________________

Artist: Vermont Avenue Records
Representative: John McGrath
Email: bookings@vermontavenuerecords.com

Signature: ______________________________   Date: ______________
Print Name: ____________________________   Title: ____________________

---
Template provided by Vermont Avenue Records. This document is a starting point and is not legal advice. Have a licensed attorney review it before use.`;
}
