# MessageBoard - Full-Stack Messaging App with Blockchain

A minimal messaging application built with Next.js, Supabase, and optional blockchain integration. Users can register, authenticate, post messages, and view a public feed with their personalized display names.

## **Project Overview**

This application demonstrates a complete full-stack implementation featuring:

- **User Authentication** via Supabase Auth
- **Message Board System** with public and private feeds
- **User Profile Management** with customizable display names
- **Optional Blockchain Integration** for message hashing and storage
- **Responsive Design** using Tailwind CSS and shadcn/ui components


## **Project Structure**

```plaintext
messaging-app/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   └── blockchain/           # Blockchain endpoints
│   ├── blockchain/               # Blockchain explorer page
│   ├── dashboard/                # User dashboard
│   ├── feed/                     # Public message feed
│   ├── login/                    # Login page
│   ├── profile/                  # Profile management
│   ├── register/                 # Registration page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui components
│   ├── auth-form.tsx             # Authentication form
│   ├── message-form.tsx          # Message submission form
│   ├── message-list.tsx          # Message display component
│   ├── navigation.tsx            # Navigation bar
│   └── profile-form.tsx          # Profile management form
├── contexts/                     # React contexts
│   └── auth-context.tsx          # Authentication state management
├── lib/                          # Utility libraries
│   ├── blockchain.ts             # Blockchain implementation
│   ├── profile-utils.ts          # Profile management utilities
│   └── supabase.ts               # Supabase client configuration
├── scripts/                      # Database setup scripts
│   ├── complete-database-reset.sql
│   └── verify-setup.sql
├── .env.local                    # Environment variables
└── package.json                  # Dependencies and scripts
```

## ️ **Tech Stack**

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Icon library


### Backend & Database

- **Supabase** - Backend-as-a-Service

- PostgreSQL database
- Authentication system
- Row Level Security (RLS)
- Real-time subscriptions



- **Node.js Crypto** - For blockchain hashing


### Additional Features

- **date-fns** - Date formatting and manipulation
- **Simple Blockchain** - In-memory blockchain for demonstration


## ️ **Database Schema**

### Tables

#### `profiles`

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `messages`

```sql
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content VARCHAR(250) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Relationships

- `profiles.id` → `auth.users.id` (One-to-One)
- `messages.user_id` → `profiles.id` (Many-to-One)


## **Authentication Flow**

1. **Registration**: Users create accounts with email/password
2. **Profile Creation**: Automatic profile creation with default display name
3. **Login**: JWT-based authentication via Supabase
4. **Session Management**: Persistent sessions with automatic refresh
5. **Profile Updates**: Users can customize their display names


## **Application Features**

### Core Features

#### 1. **User Authentication**

- Email/password registration and login
- Form validation (email format, 6+ character passwords)
- Automatic profile creation
- Session persistence


#### 2. **Message System**

- Post messages up to 250 characters
- View personal message history
- Public feed for all messages
- Real-time message display


#### 3. **Profile Management**

- Customizable display names
- Profile settings page
- Automatic profile creation for new users


#### 4. **Public Feed**

- View all community messages
- Display author names and timestamps
- Responsive message cards with avatars


### Optional Features

#### 5. **Blockchain Integration**

- SHA-256 message hashing
- In-memory blockchain storage
- Block explorer interface
- Cryptographic chain validation


## **Getting Started**

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Git for version control


### Installation

1. **Clone the repository**


```shellscript
git clone <repository-url>
cd messaging-app
```

2. **Install dependencies**


```shellscript
npm install
```

3. **Set up environment variables**
Create `.env.local` with your Supabase credentials:


```plaintext
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**
Run the database setup script in your Supabase SQL Editor:


```sql
-- Execute scripts/complete-database-reset.sql
```

5. **Start the development server**


```shellscript
npm run dev
```

6. **Open the application**
Navigate to `http://localhost:3000`


## **Configuration**

### Supabase Setup

1. **Create a new Supabase project**
2. **Enable Email Authentication**

1. Go to Authentication > Settings
2. Configure email settings as needed



3. **Run Database Scripts**

1. Execute `scripts/complete-database-reset.sql`
2. Verify with `scripts/verify-setup.sql`



4. **Configure RLS Policies**

1. Policies are automatically created by the setup script
2. Ensure proper permissions for anon and authenticated users





### Environment Variables

| Variable | Description | Required
|-----|-----|-----
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes


## **API Endpoints**

### Authentication

- Handled automatically by Supabase Auth
- Session management via HTTP-only cookies


### Blockchain API

- `GET /api/blockchain` - Retrieve blockchain data
- `POST /api/blockchain/add` - Add new block (internal use)


## **UI Components**

### Custom Components

- **AuthForm** - Login/registration forms with validation
- **MessageForm** - Message composition with character limit
- **MessageList** - Display messages with pagination
- **ProfileForm** - Profile management interface
- **Navigation** - Responsive navigation bar


### shadcn/ui Components Used

- Button, Card, Input, Label, Textarea
- Table (for blockchain explorer)
- Badge (for status indicators)


## **Security Features**

### Authentication Security

- JWT tokens with automatic refresh
- HTTP-only cookies for session storage
- Password hashing via Supabase Auth


### Database Security

- Row Level Security (RLS) enabled
- User-specific data access policies
- Foreign key constraints for data integrity


### Input Validation

- Client-side form validation
- Server-side data validation
- XSS protection via React's built-in escaping


## **Testing the Application**

### Manual Testing Checklist

1. **Authentication**

1. Register new user
2. Login with valid credentials
3. Handle invalid credentials
4. Logout functionality



2. **Profile Management**

1. View profile page
2. Update display name
3. Verify changes in messages



3. **Message System**

1. Post new message
2. View personal messages
3. View public feed
4. Character limit validation



4. **Blockchain (Optional)**

1. View blockchain explorer
2. Verify message hashing
3. Check block relationships





## **Troubleshooting**

### Common Issues

#### Database Connection Errors

- Verify Supabase credentials in `.env.local`
- Check if database tables exist
- Ensure RLS policies are properly configured


#### Authentication Issues

- Confirm email settings in Supabase Auth
- Check for email confirmation requirements
- Verify JWT token handling


#### Profile Creation Failures

- Run the database reset script
- Check trigger function execution
- Manually create profiles if needed


### Debug Commands

```shellscript
# Check database structure
# Run scripts/verify-setup.sql in Supabase

# View application logs
npm run dev

# Check Supabase logs
# Visit your Supabase dashboard > Logs
```

## **Deployment**

### Vercel Deployment (Recommended)

1. **Connect to Vercel**


```shellscript
npm install -g vercel
vercel
```

2. **Set Environment Variables**
Add your Supabase credentials in Vercel dashboard
3. **Deploy**


```shellscript
vercel --prod
```

### Other Platforms

- **Netlify**: Configure build settings for Next.js
- **Railway**: Add environment variables and deploy
- **Self-hosted**: Use `npm run build` and `npm start`


## **Future Enhancements**

### Planned Features

- Real-time message updates
- Message reactions and likes
- User avatars and image uploads
- Message search functionality
- Admin dashboard
- Message moderation
- Push notifications
- Mobile app (React Native)


### Blockchain Enhancements

- Persistent blockchain storage
- Block validation algorithms
- Merkle tree implementation
- Consensus mechanisms


## **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## **License**

This project is open source and available under the [MIT License](LICENSE).

## **Support**

For questions or issues:

1. Check the troubleshooting section
2. Review Supabase documentation
3. Open an issue on GitHub
4. Contact the development team


---

**Built with ❤️ using Next.js and Supabase by Suryansh Rai**