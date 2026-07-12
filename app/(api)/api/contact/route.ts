import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// In-memory per-IP rate limit: 1 message / 24h.
// Note: resets on server restart and is per-instance; the client also guards via localStorage.
const RATE_WINDOW_MS = 24 * 60 * 60 * 1000;
const lastSent = new Map<string, number>();

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "invalid_body" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: "missing_fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "invalid_email" }, { status: 400 });
  }
  if (message.length > 5000 || name.length > 200) {
    return NextResponse.json({ success: false, error: "too_long" }, { status: 400 });
  }

  // Rate limit
  const ip = getIp(req);
  const now = Date.now();
  const prev = lastSent.get(ip);
  if (prev && now - prev < RATE_WINDOW_MS) {
    const retryAfter = Math.ceil((RATE_WINDOW_MS - (now - prev)) / 1000);
    return NextResponse.json(
      { success: false, error: "rate_limited", retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    console.error("Contact mail not configured: set GMAIL_USER and GMAIL_APP_PASSWORD");
    return NextResponse.json({ success: false, error: "not_configured" }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const escapeHtml = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to,
      replyTo: email,
      subject: `📮 New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
          <h2 style="color:#dc3c2d">New portfolio message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <hr style="border:none;border-top:1px solid #eee" />
          <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
        </div>`,
    });

    lastSent.set(ip, now);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact mail send error:", err);
    return NextResponse.json({ success: false, error: "send_failed" }, { status: 500 });
  }
}
