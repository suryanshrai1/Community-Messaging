# 🚀 MessageBoard - Full-Stack Messaging App with Blockchain

A modern, minimal messaging application built with **Next.js**, **Supabase**, and **blockchain integration**. Users can register, authenticate, post messages, manage profiles, and explore a demonstration blockchain that hashes and stores messages.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔐 **Authentication System**
- **Email/Password Registration & Login** with form validation
- **JWT-based authentication** via Supabase Auth
- **Automatic profile creation** with customizable display names
- **Session persistence** across browser sessions

### 💬 **Message Board**
- **Post messages** up to 250 characters
- **Personal dashboard** showing your message history
- **Public feed** displaying all community messages
- **Real-time timestamps** with "time ago" formatting
- **User avatars** with display name initials

### 👤 **Profile Management**
- **Customizable display names** for community visibility
- **Profile settings page** for easy updates
- **Automatic profile setup** for new users

### ⛓️ **Blockchain Integration** (Optional)
- **SHA-256 message hashing** for each post
- **In-memory blockchain** with proper block structure
- **Blockchain explorer** showing block history
- **Cryptographic chain validation**

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, RLS) |
| **Blockchain** | Node.js Crypto, Custom implementation |
| **Deployment** | Vercel (recommended) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account ([sign up here](https://supabase.com))
- Git for version control

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/suryanshrai1/Community-Messaging-App.git
cd messageboard-blockchain
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from Settings > API
3. **Create `.env.local`** in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Set Up the Database

Copy and run this SQL script in your Supabase SQL Editor:

\`\`\`sql
-- Step 1: Drop existing tables if any
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 2: Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content VARCHAR(250) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users based on id" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable read access for all users" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.messages FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.messages TO anon, authenticated;

-- Step 7: Create function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(split_part(NEW.email, '@', 1), 'User')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW;
END;
$$;

-- Step 8: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
\`\`\`

### 5. Run the Application
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

## 📱 Application Flow

### 1. **Home Page** (`/`)
- Landing page with feature overview
- Links to registration and public feed

### 2. **Authentication** (`/register`, `/login`)
- User registration with email validation
- Login with session management
- Automatic redirect to dashboard

### 3. **Dashboard** (`/dashboard`)
- Personal message composition
- View your message history
- Quick navigation to other sections

### 4. **Public Feed** (`/feed`)
- Browse all community messages
- See user display names and timestamps
- No authentication required

### 5. **Profile Management** (`/profile`)
- Update your display name
- Manage account settings
- View current profile information

### 6. **Blockchain Explorer** (`/blockchain`)
- View the message blockchain
- See block hashes and relationships
- Understand the cryptographic chain

## 🏗️ Project Structure

\`\`\`
messageboard-blockchain/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/blockchain/     # Blockchain API endpoints
│   ├── 📄 blockchain/page.tsx # Blockchain explorer
│   ├── 📄 dashboard/page.tsx  # User dashboard
│   ├── 📄 feed/page.tsx       # Public message feed
│   ├── 📄 login/page.tsx      # Login page
│   ├── 📄 profile/page.tsx    # Profile management
│   ├── 📄 register/page.tsx   # Registration page
│   └── 📄 layout.tsx          # Root layout
├── 📁 components/             # Reusable components
│   ├── 📁 ui/                 # shadcn/ui components
│   ├── 📄 auth-form.tsx       # Authentication forms
│   ├── 📄 message-form.tsx    # Message composition
│   ├── 📄 message-list.tsx    # Message display
│   ├── 📄 navigation.tsx      # Navigation bar
│   └── 📄 profile-form.tsx    # Profile management
├── 📁 contexts/               # React contexts
│   └── 📄 auth-context.tsx    # Authentication state
├── 📁 lib/                    # Utilities
│   ├── 📄 blockchain.ts       # Blockchain logic
│   ├── 📄 profile-utils.ts    # Profile helpers
│   └── 📄 supabase.ts         # Supabase client
└── 📁 scripts/                # Database scripts
    ├── 📄 complete-database-reset.sql
    └── 📄 verify-setup.sql
\`\`\`

## 🔒 Security Features

- **Row Level Security (RLS)** for database access control
- **JWT authentication** with automatic token refresh
- **Input validation** on both client and server
- **XSS protection** via React's built-in escaping
- **Foreign key constraints** for data integrity

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Connect to Vercel**
- Visit [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
- Vercel will automatically build and deploy
- Your app will be live at `https://your-app.vercel.app`

### Other Deployment Options
- **Netlify**: Configure for Next.js deployment
- **Railway**: Add environment variables and deploy
- **Self-hosted**: Use `npm run build` and `npm start`

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Registration**: Create new account with email validation
- [ ] **Login**: Sign in with valid credentials
- [ ] **Profile**: Update display name and verify changes
- [ ] **Messages**: Post message and view in feed
- [ ] **Dashboard**: View personal message history
- [ ] **Blockchain**: Explore blockchain data
- [ ] **Navigation**: Test all page transitions
- [ ] **Responsive**: Check mobile and desktop layouts

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify Supabase credentials in `.env.local`
- Check if database tables exist in Supabase dashboard
- Ensure RLS policies are properly configured

**Authentication Issues**
- Confirm email settings in Supabase Auth settings
- Check for email confirmation requirements
- Verify JWT token handling in browser dev tools

**Profile Creation Failures**
- Run the database setup script again
- Check trigger function in Supabase SQL Editor
- Manually verify profile creation in database

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 📈 Future Enhancements

### Planned Features
- [ ] Real-time message updates with Supabase subscriptions
- [ ] Message reactions and likes
- [ ] User avatars with image upload
- [ ] Message search and filtering
- [ ] Admin dashboard for moderation
- [ ] Push notifications
- [ ] Mobile app (React Native)

### Blockchain Improvements
- [ ] Persistent blockchain storage
- [ ] Block validation algorithms
- [ ] Merkle tree implementation
- [ ] Consensus mechanisms

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for providing an excellent backend-as-a-service
- **Vercel** for seamless deployment and hosting
- **shadcn/ui** for beautiful, accessible UI components
- **Next.js team** for the amazing React framework

## 📞 Support

- 📧 **Email**: your-email@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/suryanshrai1/Community-Messaging-App/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/suryanshrai1/Community-Messaging-App/discussions)

---

**⭐ If you found this project helpful, please give it a star!**

**Built with ❤️ by Suryansh Rai using Next.js, Supabase, and TypeScript**
