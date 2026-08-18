📅 Booked & Verified

«A trusted appointment booking platform connecting customers with verified service providers.»

Booked & Verified is a web-based appointment booking platform designed to make it easier for customers to discover trusted professionals, view their real availability, and book appointments with confidence.

The platform provides separate experiences for customers, service providers, and administrators, with provider verification and secure database access built into the system.

🌐 Live Demo

"Visit Booked & Verified" (https://verified-booking-buddy.lovable.app)

💻 Source Code

"View the GitHub Repository" (https://github.com/pavann280/booked-verified)

---

✨ Features

👤 Customer Features

- 🔐 User registration and authentication
- 🔎 Search service providers by name, city, or service
- ✅ Browse verified service providers
- 👨‍💼 View detailed provider profiles
- 📅 View available appointment slots
- ⚡ Book appointments instantly
- 📋 View and manage appointments
- 📊 Customer booking dashboard

🧑‍💼 Service Provider Features

- 🔐 Secure provider authentication
- 👤 Provider profile management
- 📝 Manage provider information and listings
- 📅 Create and manage available time slots
- 📋 View customer appointments
- 🗓️ Manage appointment availability
- 📊 Provider workspace/dashboard

🛡️ Administrator Features

- 🔐 Secure administrator access
- 📋 Provider verification queue
- 🔎 Review provider information
- ✅ Verify eligible service providers
- 👥 Manage provider listings
- 🛡️ Control access to protected application data

---

🔄 How the Platform Works

Customer Flow

Sign Up / Sign In
       ↓
Browse Verified Providers
       ↓
View Provider Profile
       ↓
Check Available Time Slots
       ↓
Select Appointment
       ↓
Confirm Booking
       ↓
Manage Appointment

Provider Flow

Provider Sign In
       ↓
Manage Profile
       ↓
Set Availability
       ↓
Receive Bookings
       ↓
Manage Appointments

Administrator Flow

Admin Sign In
       ↓
View Verification Queue
       ↓
Review Provider
       ↓
Verify Provider
       ↓
Provider Appears in Verified Directory

---

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

Development & Version Control

- Git
- GitHub
- Lovable

---

🏗️ Architecture

The application follows a modern web application architecture:

                    ┌──────────────────────┐
                    │       Customer       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │  TypeScript + Vite   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Supabase       │
                    │ Authentication + API │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      PostgreSQL      │
                    │       Database       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Row Level         │
                    │      Security        │
                    └──────────────────────┘

---

📂 Project Structure

booked-verified/
│
├── public/
│   └── static assets
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── ...
│
├── supabase/
│   └── database configuration
│
├── .gitignore
├── package.json
├── README.md
└── ...

---

⚙️ Run the Project Locally

1. Clone the repository

git clone https://github.com/pavann280/booked-verified.git

2. Open the project directory

cd booked-verified

3. Install dependencies

npm install

4. Configure environment variables

Create a ".env" file in the root directory.

Add the required Supabase configuration:

VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

«Never commit private service-role keys, API secret keys, passwords, or other sensitive credentials to GitHub.»

5. Start the development server

npm run dev

The application will be available at the local URL shown in your terminal.

---

🔐 Security

Security is an important part of the application.

The project uses:

- Supabase Authentication
- PostgreSQL
- Row Level Security (RLS)
- Protected application data
- Role-based access to different application areas
- Environment variables for configuration

The database access policies are designed to prevent unauthorized users from accessing protected application data.

---

📸 Application Screenshots

🏠 Homepage

The homepage provides users with an introduction to the platform and allows them to discover verified service providers.

👨‍💼 Provider Directory

Customers can browse verified providers and search for professionals based on available information.

👤 Provider Profile

Customers can view provider information and available appointment slots.

📅 Appointment Booking

Customers can select an available time slot and confirm an appointment.

📋 Customer Dashboard

Customers can view and manage their booked appointments from one place.

🧑‍💼 Provider Workspace

Providers can manage their profile, availability, and appointments.

🛡️ Admin Verification

Administrators can review providers and manage the verification process.

---

🎯 Project Goal

The goal of Booked & Verified is to create a reliable appointment-booking experience where customers can:

- Discover trusted professionals
- View verified providers
- Check real availability
- Book appointments easily
- Manage bookings from one platform

At the same time, service providers can manage their availability and appointments, while administrators can maintain the quality and trustworthiness of the provider directory.

---

🚀 Future Improvements

The following features can be added in future versions:

- 📧 Email appointment notifications
- 📱 SMS appointment reminders
- ⭐ Provider ratings and reviews
- 🔎 Advanced search and filtering
- 📅 Google Calendar integration
- 💳 Online payment integration
- 📊 Advanced analytics dashboard
- 📱 Mobile application
- 🔔 Real-time booking notifications
- 🤖 AI-powered provider recommendations
- 📈 Provider performance analytics

---

📌 Project Highlights

- Full-stack appointment booking workflow
- Separate customer, provider, and admin experiences
- Verified provider directory
- Real availability and appointment slots
- Authentication and protected data
- Supabase-backed database
- Row Level Security
- Responsive web interface
- Cloud deployment
- GitHub version control

---

👨‍💻 Developer

Pavan Kumar

GitHub:
https://github.com/pavann280

Project Repository:
https://github.com/pavann280/booked-verified

Live Application:
https://verified-booking-buddy.lovable.app

---

⭐ Project

If you find Booked & Verified interesting, feel free to explore the live application and source code.

🌐 Live Demo:
https://verified-booking-buddy.lovable.app

💻 GitHub:
https://github.com/pavann280/booked-verified
