# The 1% Club - Global Trivia Platform

A comprehensive trivia platform featuring all episodes and seasons from The 1% Club game show across all countries. Test your knowledge with questions that challenge different percentages of the population!

## 🎮 Features

### For Players
- **Complete Question Database**: Access all questions, answers, and detailed explanations from every episode
- **Multi-Country Content**: Browse and play questions from all countries that have aired The 1% Club
- **Season & Episode Organization**: Navigate through content organized by country, season, and episode
- **User Authentication**: Sign in to track your progress and save your favorite questions
- **Beautiful UI**: Enjoy a modern, responsive interface designed for an engaging trivia experience
- **Progress Tracking**: Monitor your performance and see how you compare to the actual show statistics

### For Administrators
- **Admin Panel**: Comprehensive dashboard for content management
- **Content Management**:
  - Add new countries as the show expands globally
  - Create and manage seasons for each country
  - Add individual episodes with metadata
  - Input questions with multiple choice answers
  - Provide detailed explanations for each answer
- **Bulk Operations**: Import multiple questions at once
- **Content Moderation**: Review and approve user-submitted corrections

## 🌍 Available Countries
- United Kingdom
- Australia
- United States
- Netherlands
- France
- Germany
- Spain
- (More countries added as they air the show)

## 📊 Question Structure
Each question includes:
- **Difficulty Percentage** (90%, 80%, 70%, etc.)
- **Question Text**
- **Multiple Choice Options**
- **Correct Answer**
- **Detailed Explanation**
- **Episode Reference** (Country, Season, Episode number)
- **Air Date**

## 🛠️ Tech Stack
- **Frontend**: Next.js 16 with React Server Components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL (Supabase)
- **Internationalization**: next-intl (English & Greek)
- **UI Components**: shadcn/ui with Tailwind CSS
- **Type Safety**: TypeScript with strict mode
- **Package Manager**: PNPM for fast, efficient dependency management

## 🎯 Game Modes

### Classic Mode
Play through episodes exactly as they aired on TV, with questions in the original order and difficulty progression.

### Practice Mode
Select specific difficulty levels to practice and improve your skills.

### Random Challenge
Get random questions from any country, season, or episode for variety.

### Country Championship
Compete with questions specifically from your selected country's version of the show.

## 📱 Responsive Design
The platform is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PNPM package manager
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/1-percent-club.git
cd 1-percent-club
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

5. Run database migrations:
```bash
pnpm prisma migrate dev
```

6. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📝 Admin Access
To access the admin panel:
1. Sign in with your Google account
2. Navigate to `/admin`
3. Use the dashboard to manage content

Admin privileges are granted through the database. Update a user's role to 'ADMIN' in the User table.

## 🔒 Privacy & Security
- Secure authentication via OAuth
- User data encryption
- GDPR compliant
- No personal data sharing

## 🤝 Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Submitting question corrections
- Reporting bugs
- Suggesting new features
- Adding support for new countries

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer
This is an unofficial fan project. All questions and content from The 1% Club are property of their respective copyright holders. This platform is for educational and entertainment purposes only.

## 🙏 Acknowledgments
- The 1% Club creators and production teams worldwide
- All contributors who help maintain the question database
- The open-source community for the amazing tools used in this project

## 📧 Contact
For questions, suggestions, or issues, please:
- Open an issue on GitHub
- Contact us at: your-email@example.com

---

**Ready to prove you're in the 1%?** Start playing now! 🎮