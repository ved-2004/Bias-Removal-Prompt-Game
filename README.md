🧩 BiasBusters
Catch the Bias Monster - Learn, Play, and Make AI Fair!
BiasBusters is an interactive web platform that teaches kids about fairness in AI through play. Players “catch” bias monsters hidden in AI-generated sentences by identifying and correcting biased language — helping build the next generation of fair, responsible AI users.

🚀 Features
Conversational AI Trainer: Chat-like interface powered entirely by Claude, generating and refining biased sentences for correction.
Bias Type Selector: Train models across Gender, Age, and Sexual Orientation bias categories.
Gamified Learning: Earn XP, unlock badges, and climb the leaderboard while helping Claude learn fairness.
Why It Worked/Didn’t Modal: Get instant explanations after every attempt.
Interactive Glossary: Full-page, animated glossary of AI ethics terms.
Onboarding Story Mode: Story-driven introduction featuring the “Bias Monster.”
Dark/Light Themes: Adaptive design with ShadCN tokens for accessibility.
Celebrations: Confetti and avatar pop-ups when bias scores drop or milestones are achieved.

🛠️ Tech Stack
Layer	Technologies
Frontend	Next.js 14, TypeScript, ShadCN UI, TailwindCSS, Framer Motion
AI Engine	Claude API (Anthropic) for bias generation and feedback
Backend	Firebase (Firestore + Auth)
Hosting	Vercel
Animations	Framer Motion + Lottie
State Handling	LocalStorage for onboarding and challenges

🧠 How It Works
Claude generates a biased sentence under the selected bias type.
The player rewrites it to make it fairer.
Claude analyzes the rewritten version and computes a bias score reduction.
Reduced bias = more XP and celebrations.
Players receive an educational explanation of why it worked or didn’t.

🎮 Gameplay Loop
Choose a Bias Type — Gender, Sexual Orientation, or Age.
Review the AI’s “biased” output.
Rewrite the sentence to make it fairer.
Watch your bias score drop and collect badges.
Compete on the leaderboard and become a Fairness Hero!

🌟 Educational Impact
BiasBusters helps children:

Understand AI bias and how it affects technology.
Build critical thinking around fairness and inclusion.
Develop early AI ethics literacy in a safe, playful environment.

💼 Future Scope
Introduce new bias categories like Cultural and Socioeconomic.
Add a Teacher Dashboard for classroom analytics.
Launch mobile-first experience with touch-friendly UI.
Partner with schools and nonprofits to expand AI ethics education globally.

🖼️ Branding
Logo: Cartoon-style shield badge with a spark mascot. 
Colors: Purple–Pink–Yellow gradient palette. 
Tagline: “Catch the Bias Monster!” Mascot: The Bias Monster — a playful ghost that represents hidden AI bias.

🧰 Setup & Run Locally
# Clone the repository
git clone https://github.com/ved-2004/Bias-Removal-Prompt-Game.git
cd BiasBusters

# Install dependencies
npm install

# Run development server
npm run dev
App runs locally at (https://bias-removal-prompt-game.vercel.app).

🧩 Team
Parth Gosar

Ved Chadderwala

Purav Sanghavi

📜 License
This project is licensed under the MIT License.
