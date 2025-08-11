# University Ranking Indicator System

A comprehensive web application for managing and calculating university ranking indicators across multiple categories with secure user authentication and real-time data processing.

## Features

### Authentication & Security
- Secure user authentication with Supabase
- Row Level Security (RLS) policies
- Protected routes and data access

### Multi-Tab Dashboard
- **TOC Tab**: Comprehensive university data entry with 10 indicators, classification, and ranking
- **FSR Tab**: Faculty-Student Ratio calculations with real-time updates
- **IFR Tab**: International Faculty Ratio metrics and analysis
- **ISR Tab**: International Student Ratio calculations with diversity visualization

### Data Management
- Real-time calculations and updates
- Form validation with error handling
- Data persistence across sessions
- Export functionality (CSV)
- Auto-save capabilities

### UI/UX Features
- Responsive design for all devices
- Modern, clean interface with professional styling
- Loading states and smooth transitions
- Progress indicators and visual feedback
- Accessible design (WCAG 2.1 AA compliant)

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd university-ranking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file from `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Add your Supabase credentials to `.env`

4. **Create database schema**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     user_id UUID REFERENCES auth.users PRIMARY KEY,
     email TEXT NOT NULL,
     full_name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create universities table
   CREATE TABLE universities (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     user_id UUID REFERENCES auth.users NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indicators table
   CREATE TABLE indicators (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     university_id UUID REFERENCES universities(id) NOT NULL,
     category TEXT NOT NULL,
     metric_name TEXT NOT NULL,
     value DECIMAL NOT NULL,
     calculated_score DECIMAL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
   ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can view own universities" ON universities
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can manage own universities" ON universities
     FOR ALL USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own indicators" ON indicators
     FOR SELECT USING (auth.uid() = (SELECT user_id FROM universities WHERE id = university_id));

   CREATE POLICY "Users can manage own indicators" ON indicators
     FOR ALL USING (auth.uid() = (SELECT user_id FROM universities WHERE id = university_id));
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage Guide

### Getting Started
1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Navigation**: Use the tab navigation to switch between different calculation modules
3. **Data Entry**: Enter your university data in the TOC tab
4. **Calculations**: Use FSR, IFR, and ISR tabs for specific ratio calculations

### Tab Functions

#### TOC (Table of Contents)
- Enter university indicators (0-100%)
- Set classification categories
- Input overall ranking
- Export data to CSV
- Auto-save functionality

#### FSR (Faculty-Student Ratio)
- Input total academic staff and students
- View real-time ratio calculations
- See FSR score with progress visualization

#### IFR (International Faculty Ratio)
- Enter international and total faculty numbers
- Calculate international faculty percentage
- View diversity metrics

#### ISR (International Student Ratio)
- Input international and total student numbers
- Calculate international student percentage
- Visualize student body composition

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Netlify Deployment
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## API Documentation

The application uses Supabase for backend operations:

### Authentication
- `signUp(email, password, fullName)` - User registration
- `signIn(email, password)` - User login
- `signOut()` - User logout
- `getCurrentUser()` - Get current user session

### Database Operations
- All CRUD operations are handled through Supabase client
- Real-time subscriptions for data updates
- Row Level Security ensures data privacy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.