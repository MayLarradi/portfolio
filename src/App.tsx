import { useEffect, useState } from "react";

function ContactForm() {
	const [formData, setFormData] = useState({ name: "", email: "", message: "" });
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus("loading");

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			setStatus("success");
			setMessage("Message sent successfully! I'll get back to you soon.");
			setFormData({ name: "", email: "", message: "" });

			setTimeout(() => {
				setStatus("idle");
				setMessage("");
			}, 5000);
		} catch (error) {
			setStatus("error");
			setMessage("Failed to send message. Please try again.");
			setTimeout(() => {
				setStatus("idle");
				setMessage("");
			}, 5000);
		}
	};

	return (
		<form className="soft-card p-6 reveal reveal-delay-1" onSubmit={handleSubmit}>
			<label className="text-sm text-stone-300" htmlFor="name">
				Your Name
			</label>
			<input
				className="contact-input mt-2"
				id="name"
				placeholder="Jane Doe"
				value={formData.name}
				onChange={handleChange}
				required
			/>

			<label className="mt-5 block text-sm text-stone-300" htmlFor="email">
				Email Address
			</label>
			<input
				className="contact-input mt-2"
				id="email"
				type="email"
				placeholder="jane@example.com"
				value={formData.email}
				onChange={handleChange}
				required
			/>

			<label className="mt-5 block text-sm text-stone-300" htmlFor="message">
				Message
			</label>
			<textarea
				className="contact-input mt-2 min-h-32.5 resize-none"
				id="message"
				placeholder="Tell me about your project or opportunity..."
				value={formData.message}
				onChange={handleChange}
				required
			></textarea>

			{message && (
				<p
					className={`mt-4 text-sm ${
						status === "success" ? "text-green-400" : "text-red-400"
					}`}
				>
					{message}
				</p>
			)}

			<button
				className="primary-btn mt-6 w-full justify-center disabled:opacity-50"
				type="submit"
				disabled={status === "loading"}
			>
				<span aria-hidden="true">{status === "loading" ? "⏳" : "✈"}</span>
				{status === "loading" ? "Sending..." : "Send Message"}
			</button>
		</form>
	);
}

export default function App() {
	useEffect(() => {
		const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
		if (!elements.length) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
		);

		elements.forEach((element) => observer.observe(element));

		return () => observer.disconnect();
	}, []);

	return (
		<div className="portfolio-shell min-h-screen">
			<div className="portfolio-bg" aria-hidden="true"></div>

			<header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 reveal">
				<div className="text-lg font-semibold">Mayssae Larradi</div>
				<nav className="hidden items-center gap-8 text-sm md:flex">
					<a className="nav-link" href="#about">
						About
					</a>
					<a className="nav-link" href="#projects">
						Projects
					</a>
					<a className="nav-link" href="#skills">
						Skills
					</a>
					<a className="nav-link" href="#experience">
						Experience
					</a>
					<a className="nav-link" href="#contact">
						Contact
					</a>
				</nav>
				<a className="pill-btn" href="#contact">
					Let's Talk
				</a>
			</header>

			<main className="mx-auto w-full max-w-6xl px-6 pb-20">
				<section className="grid items-center gap-10 pb-16 pt-8 md:grid-cols-[1.05fr_0.95fr] md:pt-12">
					<div className="reveal">
						<p className="section-label">🚀 SOFTWARE ENGINEER & DESIGNER</p>
						<h1 className="font-display mt-4 text-5xl leading-tight md:text-7xl">
							Mayssae Larradi
						</h1>
						<p className="muted-text mt-4 text-lg leading-relaxed">
							MSc Student in Software Engineering at NUAA. Building scalable systems,
							intuitive interfaces, and AI-powered solutions.
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<span className="chip">Full-Stack Dev</span>
							<span className="chip">AI/ML Researcher</span>
							<span className="chip">UX Designer</span>
						</div>
						<div className="mt-8 flex flex-wrap gap-4">
							<a className="primary-btn" href="#projects">
								View Projects
								<span aria-hidden="true">→</span>
							</a>
							<a
								className="secondary-btn"
								href="/resume.pdf"
								download
								rel="noreferrer"
								target="_blank"
							>
								<span aria-hidden="true">↓</span>
								Download Resume
							</a>
						</div>
						<div className="mt-8 flex flex-wrap gap-6 text-sm text-stone-300">
							<a className="nav-link" href="https://github.com/MayLarradi" rel="noopener noreferrer" target="_blank">
								GitHub
							</a>
							<a
								className="nav-link"
								href="https://www.linkedin.com/in/mayssae-larradi/"
								rel="noopener noreferrer"
								target="_blank"
							>
								LinkedIn
							</a>
							<a className="nav-link" href="mailto:mayssaelarradi@gmail.com">
								Email
							</a>
						</div>
					</div>
					<div className="glass-card portrait-card hero-card reveal reveal-delay-1">
						<span className="hero-orb hero-orb--one float-slow" aria-hidden="true"></span>
						<span className="hero-orb hero-orb--two float-slow float-delay-1" aria-hidden="true"></span>
						<div className="photo-circle photo-circle--hero" aria-hidden="true"></div>
					</div>
				</section>

				<section id="about" className="grid gap-10 pb-16 md:grid-cols-[0.9fr_1.1fr]">
					<div className="glass-card portrait-card reveal">
						<div className="photo-circle photo-circle--about" aria-hidden="true"></div>
					</div>
					<div className="reveal reveal-delay-1">
						<p className="section-label">ABOUT ME</p>
						<h2 className="font-display section-title mt-3">
							Crafting elegant solutions through code and design
						</h2>
						<p className="muted-text mt-5 leading-relaxed">
							I'm focused on building software that balances technical rigor with user-centered
							design. My work spans full-stack development, machine learning research, and
							creating intuitive digital experiences.
						</p>
						<div className="mt-8 grid gap-6 md:grid-cols-2">
							<div>
								<p className="text-xs uppercase tracking-[0.3em] text-stone-500">📍 Location</p>
								<p className="mt-2 font-semibold">Nanjing, China</p>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.3em] text-stone-500">🎓 Education</p>
								<p className="mt-2 font-semibold">MSc Software Engineering · NUAA</p>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.3em] text-stone-500">🔧 Expertise</p>
								<p className="mt-2 font-semibold">Web Dev · AI/ML · UI/UX Design</p>
							</div>
						</div>
					</div>
				</section>

				<section id="projects" className="pb-16 reveal">
					<p className="section-label">💡 FEATURED WORK</p>
					<h2 className="font-display section-title mt-3">Selected Projects</h2>
					<p className="muted-text mt-3 max-w-2xl">
						Full-stack solutions and AI research that solve real problems.
					</p>
					<div className="mt-10 grid gap-6 md:grid-cols-3">
						<article className="soft-card p-5 reveal">
							<div className="project-image">
								<div className="project-actions">
									<span className="icon-circle" aria-hidden="true">
										↗
									</span>
									<span className="icon-circle" aria-hidden="true">
										⟲
									</span>
								</div>
							</div>
							<div className="mt-5 space-y-3">
								<span className="project-title-bar">
									Employee Food Ordering &amp; Reservation Platform
								</span>
								<p className="muted-text text-sm leading-relaxed">
									Full-stack web app for meal pre-ordering and reservation with vendor
									aggregation, role-based access, and inventory management.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="chip">Laravel, PHP</span>
									<span className="chip">2022-2023</span>
								</div>
							</div>
						</article>
						<article className="soft-card p-5 reveal reveal-delay-1">
							<div className="project-image"></div>
							<div className="mt-5 space-y-3">
								<span className="project-title-bar">User Behavior Prediction</span>
								<p className="muted-text text-sm leading-relaxed">
									Deep learning research focused on predicting user interactions and behavior
									patterns using neural networks and feature engineering.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="chip">TensorFlow</span>
									<span className="chip">2025-Present</span>
								</div>
							</div>
						</article>
						<article className="soft-card p-5 reveal reveal-delay-2">
							<div className="project-image"></div>
							<div className="mt-5 space-y-3">
								<span className="project-title-bar">Research &amp; Development</span>
								<p className="muted-text text-sm leading-relaxed">
									Exploring AI-enhanced systems and scalable solutions through academic research
									and applied deep learning projects.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="chip">AI/ML</span>
									<span className="chip">Ongoing</span>
								</div>
							</div>
						</article>
					</div>
				</section>

				<section id="skills" className="pb-16 text-center reveal">
					<p className="section-label">⚡ EXPERTISE</p>
					<h2 className="font-display section-title mt-3">Skills &amp; Technologies</h2>
					<p className="muted-text mt-4">Tools and platforms I use to build.</p>
					<div className="mt-10 grid gap-8 text-left md:grid-cols-3">
						<div className="reveal">
							<div className="skill-heading">
								<span className="skill-line" aria-hidden="true"></span>
								<h3 className="font-display text-xl">Frontend Development</h3>
							</div>
							<div className="mt-4 flex flex-wrap gap-3">
								<span className="chip">React</span>
								<span className="chip">JavaScript</span>
								<span className="chip">HTML5</span>
								<span className="chip">CSS3</span>
								<span className="chip">Tailwind CSS</span>
								<span className="chip">Bootstrap</span>
							</div>
						</div>
						<div className="reveal reveal-delay-1">
							<div className="skill-heading">
								<span className="skill-line" aria-hidden="true"></span>
								<h3 className="font-display text-xl">Backend Engineering</h3>
							</div>
							<div className="mt-4 flex flex-wrap gap-3">
								<span className="chip">Laravel</span>
								<span className="chip">PHP</span>
								<span className="chip">Node.js</span>
								<span className="chip">Express.js</span>
								<span className="chip">PostgreSQL / MySQL</span>
								<span className="chip">REST APIs</span>
							</div>
						</div>
						<div className="reveal reveal-delay-2">
							<div className="skill-heading">
								<span className="skill-line" aria-hidden="true"></span>
								<h3 className="font-display text-xl">AI &amp; Machine Learning</h3>
							</div>
							<div className="mt-4 flex flex-wrap gap-3">
								<span className="chip">TensorFlow</span>
								<span className="chip">Keras</span>
								<span className="chip">scikit-learn</span>
								<span className="chip">Pandas</span>
								<span className="chip">NumPy</span>
							</div>
						</div>
					</div>
				</section>

				<section id="experience" className="pb-16 reveal">
					<p className="section-label">📚 BACKGROUND</p>
					<h2 className="font-display section-title mt-3">Experience &amp; Education</h2>
					<p className="muted-text mt-4 max-w-2xl">Academic and professional highlights.</p>
					<div className="mt-10 grid gap-6">
						<div className="timeline">
							<span className="timeline-dot" aria-hidden="true"></span>
							<article className="soft-card p-6 reveal">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div className="flex items-start gap-4">
										<span className="icon-circle" aria-hidden="true">
											🎓
										</span>
										<div>
											<h3 className="font-display text-xl">
												Master of Science in Software Engineering
											</h3>
											<p className="muted-text text-sm">
												Nanjing University of Aeronautics and Astronautics (NUAA) · Nanjing, China
											</p>
										</div>
									</div>
									<p className="text-sm text-stone-400">2026 - Present</p>
								</div>
								<p className="muted-text mt-4 text-sm leading-relaxed">
									First-year MSc focused on software engineering, systems design, and applied AI.
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									<span className="chip">Coursework</span>
									<span className="chip">Research</span>
								</div>
							</article>
						</div>
						<div className="timeline">
							<span className="timeline-dot" aria-hidden="true"></span>
							<article className="soft-card p-6 reveal reveal-delay-1">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div className="flex items-start gap-4">
										<span className="icon-circle" aria-hidden="true">
											💼
										</span>
										<div>
											<h3 className="font-display text-xl">
												Administrative &amp; Operations Intern
											</h3>
											<p className="muted-text text-sm">M. Distribution · Bouznika, Morocco</p>
										</div>
									</div>
									<p className="text-sm text-stone-400">Jun 2024 - Sep 2025</p>
								</div>
								<p className="muted-text mt-4 text-sm leading-relaxed">
									Processed and tracked client orders end-to-end, coordinating with sales and
									warehouse teams to confirm availability, monitor overdue payments, and ensure
									accurate fulfillment. Maintained structured digital records and performed stock
									checks and inventory reconciliation to prevent discrepancies.
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									<span className="chip">Order Processing</span>
									<span className="chip">Inventory Control</span>
									<span className="chip">Data Accuracy</span>
								</div>
							</article>
						</div>
						<div className="timeline">
							<span className="timeline-dot" aria-hidden="true"></span>
							<article className="soft-card p-6 reveal">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div className="flex items-start gap-4">
										<span className="icon-circle" aria-hidden="true">
											💼
										</span>
										<div>
											<h3 className="font-display text-xl">
												Operations &amp; Digital Support Intern
											</h3>
											<p className="muted-text text-sm">Moony · Bouznika, Morocco</p>
										</div>
									</div>
									<p className="text-sm text-stone-400">Jun 2024 - Sep 2025</p>
								</div>
								<p className="muted-text mt-4 text-sm leading-relaxed">
									Supported daily operational workflows, handling order processing, client
									follow-ups, and administrative records while liaising with sales staff to
									confirm orders and flag outstanding issues.
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									<span className="chip">Operations Support</span>
									<span className="chip">Client Follow-up</span>
									<span className="chip">Documentation</span>
								</div>
							</article>
						</div>
						<div className="timeline">
							<span className="timeline-dot" aria-hidden="true"></span>
							<article className="soft-card p-6 reveal">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div className="flex items-start gap-4">
										<span className="icon-circle" aria-hidden="true">
											💼
										</span>
										<div>
											<h3 className="font-display text-xl">Web Development Intern</h3>
											<p className="muted-text text-sm">
												Multisac · Bouznika, Morocco (Compulsory graduation internship)
											</p>
										</div>
									</div>
									<p className="text-sm text-stone-400">2022 - 1 month</p>
								</div>
								<p className="muted-text mt-4 text-sm leading-relaxed">
									Embedded with the internal development and maintenance team, contributing to
									live web system workflows, practicing version control and team-based delivery,
									and developing the company&apos;s capstone project.
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									<span className="chip">Web Development</span>
									<span className="chip">Version Control</span>
									<span className="chip">Team Delivery</span>
								</div>
							</article>
						</div>
					</div>
				</section>

				<section id="resume" className="pb-16 reveal">
					<div className="glass-card mx-auto max-w-4xl px-8 py-12 text-center reveal">
						<div className="icon-circle mx-auto" aria-hidden="true">
							📄
						</div>
						<h2 className="font-display mt-5 text-2xl md:text-3xl">Download My Resume</h2>
						<p className="muted-text mt-3">Europass resume PDF.</p>
						<a className="primary-btn mt-6" href="/resume.pdf" download rel="noreferrer" target="_blank">
							<span aria-hidden="true">↓</span>
							Download Resume (PDF)
						</a>
						<p className="muted-text mt-4 text-xs">PDF format</p>
					</div>
				</section>

				<section id="contact" className="pb-16 reveal">
					<p className="section-label text-center">✉️ GET IN TOUCH</p>
					<h2 className="font-display section-title mt-3 text-center">Let&apos;s Connect</h2>
					<p className="muted-text mx-auto mt-3 max-w-2xl text-center">
						Interested in collaboration, opportunities, or just want to chat?
					</p>
					<div className="mt-12 grid gap-10 md:grid-cols-[0.95fr_1.05fr]">
						<div className="reveal">
							<h3 className="font-display text-2xl">Contact Information</h3>
							<p className="muted-text mt-3">Email is the fastest way to reach me.</p>
							<div className="mt-8 space-y-6">
								<div className="flex items-center gap-4">
									<span className="icon-circle" aria-hidden="true">
										✉️
									</span>
									<div>
										<p className="text-xs uppercase tracking-[0.25em] text-stone-500">Email</p>
										<p className="font-semibold">mayssaelarradi@gmail.com</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<span className="icon-circle" aria-hidden="true">
										in
									</span>
									<div>
										<p className="text-xs uppercase tracking-[0.25em] text-stone-500">
											LinkedIn
										</p>
										<p className="font-semibold">linkedin.com/in/mayssae-larradi</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<span className="icon-circle" aria-hidden="true">
										GH
									</span>
									<div>
										<p className="text-xs uppercase tracking-[0.25em] text-stone-500">GitHub</p>
										<p className="font-semibold">github.com/MayLarradi</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<span className="icon-circle" aria-hidden="true">
										📍
									</span>
									<div>
										<p className="text-xs uppercase tracking-[0.25em] text-stone-500">
											Location
										</p>
										<p className="font-semibold">Nanjing, China</p>
									</div>
								</div>
							</div>
						</div>
						<ContactForm />
					</div>
				</section>
			</main>

			<footer className="border-t border-white/5 py-10">
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="text-lg font-semibold">Mayssae Larradi</p>
						<p className="muted-text mt-1 text-sm">Crafted with care and curiosity</p>
					</div>
					<nav className="flex flex-wrap gap-6 text-sm">
						<a className="footer-link" href="#about">
							About
						</a>
						<a className="footer-link" href="#projects">
							Projects
						</a>
						<a className="footer-link" href="#experience">
							Experience
						</a>
						<a className="footer-link" href="#contact">
							Contact
						</a>
					</nav>
					<div className="flex gap-3">
						<a
							className="social-pill"
							href="https://github.com/MayLarradi"
							aria-label="GitHub"
							rel="noopener noreferrer"
							target="_blank"
						>
							🐙
						</a>
						<a
							className="social-pill"
							href="https://www.linkedin.com/in/mayssae-larradi/"
							aria-label="LinkedIn"
							rel="noopener noreferrer"
							target="_blank"
						>
							in
						</a>
						<a
							className="social-pill"
							href="mailto:mayssaelarradi@gmail.com"
							aria-label="Email"
						>
							✉️
						</a>
					</div>
				</div>
				<div className="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-2 px-6 text-xs text-stone-500 md:flex-row md:justify-between">
					<p>© 2026 Mayssae Larradi. All rights reserved.</p>
					<p>Built with React, TypeScript & Tailwind CSS</p>
				</div>
			</footer>
		</div>
	);
}
