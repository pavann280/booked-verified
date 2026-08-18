📅 Booked & Verified

A trusted appointment booking platform that connects customers with verified service providers and allows users to discover providers, view available time slots, and book appointments.

The platform is designed around a simple idea: make it easier to find a professional you can trust and book an appointment with confidence.

🚀 Features

- 🔐 User authentication
- ✅ Verified service-provider directory
- 👤 Provider profiles
- 📅 Provider availability and open time slots
- ⚡ Instant appointment booking
- 📋 Customer booking dashboard
- 🧑‍💼 Provider workspace for managing appointments
- 🛡️ Admin verification and provider management
- 🔎 Search providers by name, location, or service
- 🔒 Secure database access using Supabase Row Level Security
- 📱 Responsive web interface

🏗️ How It Works

Customer

1. Create an account or sign in.
2. Browse verified service providers.
3. View a provider's profile and available slots.
4. Select a convenient time.
5. Confirm the appointment.
6. Manage bookings from the customer dashboard.

Service Provider

1. Create/sign in to a provider account.
2. Manage profile information.
3. Set available appointment slots.
4. View incoming bookings.
5. Manage appointments from the provider workspace.

Administrator

1. Review provider registrations.
2. Verify provider information.
3. Manage the verification queue.
4. Maintain the integrity and security of the platform.

🛠️ Tech Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

Backend & Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

Development

- Git
- GitHub
- Lovable

📂 Project Structure

booked-verified/
├── public/
├── src/
├── supabase/
├── .gitignore
├── package.json
├── README.md
└── ...

⚙️ Local Setup

1. Clone the repository

git clone https://github.com/pavann280/booked-verified.git

2. Open the project

cd booked-verified

3. Install dependencies

npm install

4. Configure environment variables

Create a ".env" file in the project root and add the required Supabase configuration used by the application.

Example:

VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

Do not commit private or service-role keys to GitHub.

5. Start the development server

npm run dev

Open the local URL displayed in the terminal.

🔐 Security

The application uses Supabase authentication and Row Level Security to control access to application data.

Environment variables containing private credentials should remain outside the public repository.

📸 Screenshots

Screenshots of the application will be added here, including:

- Homepage
- Provider directory
- Provider profile
- Appointment booking
- Customer dashboard
- Provider workspace
- Admin verification interface

🎯 Project Goal

The goal of Booked & Verified is to provide a reliable appointment-booking experience where customers can discover verified professionals, view real availability, and manage appointments from one platform.

🔮 Future Improvements

- Email/SMS appointment notifications
- Appointment reminders
- Provider ratings and reviews
- Advanced search and filtering
- Calendar integration
- Online payments
- Analytics dashboard
- Mobile application

👨‍💻 Developer

Pavan Kumar

GitHub: https://github.com/pavann280

---

⭐ If you find this project interesting, feel free to explore the repository.
