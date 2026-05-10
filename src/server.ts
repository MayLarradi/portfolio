import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type NextFunction, type Request, type Response } from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const app = express();
const port = Number(process.env.PORT ?? 3000);
const publicDir = path.resolve(__dirname, "..", "public");
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
	throw new Error("Missing RESEND_API_KEY. Set it in .env.local or the environment.");
}
const resend = new Resend(resendApiKey);

const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMax = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const rateLimitContact = (req: Request, res: Response, next: NextFunction) => {
	const ip = req.ip || "unknown";
	const now = Date.now();
	const record = rateLimitStore.get(ip);

	if (!record || now > record.resetAt) {
		rateLimitStore.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
		return next();
	}

	if (record.count >= rateLimitMax) {
		const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
		res.setHeader("Retry-After", retryAfterSeconds.toString());
		return res.status(429).json({ error: "Too many requests. Please try again later." });
	}

	record.count += 1;
	if (rateLimitStore.size > 1000) {
		for (const [storedIp, storedRecord] of rateLimitStore.entries()) {
			if (storedRecord.resetAt < now) {
				rateLimitStore.delete(storedIp);
			}
		}
	}
	return next();
};

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use((req, res, next) => {
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
	res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
	next();
});
app.use(express.static(publicDir));

app.post("/api/contact", rateLimitContact, async (req: Request, res: Response) => {
	try {
		const { name, email, message } = req.body ?? {};
		const nameValue = typeof name === "string" ? name.trim() : "";
		const emailValue = typeof email === "string" ? email.trim() : "";
		const messageValue = typeof message === "string" ? message.trim() : "";

		if (!nameValue || !emailValue || !messageValue) {
			return res.status(400).json({ error: "Missing required fields" });
		}
		if (!isValidEmail(emailValue)) {
			return res.status(400).json({ error: "Invalid email address" });
		}
		if (nameValue.length > 120 || emailValue.length > 254 || messageValue.length > 2000) {
			return res.status(400).json({ error: "Input exceeds allowed length" });
		}

		const normalizedName = nameValue.replace(/[\r\n]/g, " ").trim();
		const normalizedEmail = emailValue.replace(/[\r\n]/g, "");
		const safeName = escapeHtml(normalizedName);
		const safeEmail = escapeHtml(normalizedEmail);
		const safeMessage = escapeHtml(messageValue).replace(/\n/g, "<br>");
		const replyTo = normalizedEmail;

		// Send email to your inbox
		await resend.emails.send({
			from: "Contact Form <onboarding@resend.dev>",
			to: "mayssaelarradi@gmail.com",
			replyTo,
			subject: `New Contact Form Message from ${normalizedName}`,
			text: `New Contact Form Submission\nName: ${normalizedName}\nEmail: ${normalizedEmail}\n\n${messageValue}`,
			html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
		});

		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Contact form error:", error);
		res.status(500).json({ error: "Failed to send message" });
	}
});

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
