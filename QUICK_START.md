# AgentPro CRM - Quick Start Guide

## What You Have

A complete, production-ready Real Estate CRM platform with:
- ✅ Full-stack application (React + Express + MySQL)
- ✅ 12 database tables with complete schema
- ✅ 14 feature modules (Contacts, Deals, Properties, Tasks, etc.)
- ✅ Kanban pipeline with drag-and-drop
- ✅ Analytics dashboard with charts
- ✅ Activity timeline & audit logs
- ✅ Birthday reminders with Islamic calendar support
- ✅ Email templates system
- ✅ Contact relationships mapping
- ✅ Task auto-creation on deal stage changes
- ✅ Bulk operations (import, export, delete)
- ✅ Advanced search & filtering

## File Contents

```
realestate-crm-fullstack.zip (270 KB)
├── realestate-crm/
│   ├── client/                 # React frontend
│   ├── server/                 # Express backend + tRPC API
│   ├── drizzle/                # Database schema & migrations
│   ├── shared/                 # Shared types & constants
│   ├── package.json            # Dependencies
│   ├── vite.config.ts          # Frontend build config
│   ├── tsconfig.json           # TypeScript config
│   ├── drizzle.config.ts       # Database config
│   ├── FEATURES_SUMMARY.md     # Complete feature list
│   └── DEPLOYMENT_GUIDE.md     # Detailed deployment instructions
└── DEPLOYMENT_GUIDE.md         # Copy of deployment guide
```

## 30-Second Setup (Local Development)

```bash
# 1. Extract
unzip realestate-crm-fullstack.zip
cd realestate-crm

# 2. Install
pnpm install
# (or: npm install)

# 3. Create database & .env file
# Create MySQL database: CREATE DATABASE realestate_crm;
# Create .env.local file with DATABASE_URL and JWT_SECRET

# 4. Run migrations
pnpm db:push

# 5. Start
pnpm dev

# 6. Open browser
# http://localhost:3000
```

## Environment Variables (Minimum Required)

Create `.env.local` in the project root:

```env
# Database (REQUIRED)
DATABASE_URL=mysql://root:password@localhost:3306/realestate_crm

# JWT Secret (REQUIRED - generate random string, min 32 chars)
JWT_SECRET=your-super-secret-key-change-this-in-production

# App Title (Optional)
VITE_APP_TITLE=AgentPro CRM
```

## Database Setup

### Option 1: Local MySQL
```bash
# Install MySQL (macOS with Homebrew)
brew install mysql
brew services start mysql

# Create database
mysql -u root -e "CREATE DATABASE realestate_crm CHARACTER SET utf8mb4;"

# Update DATABASE_URL in .env.local
DATABASE_URL=mysql://root@localhost:3306/realestate_crm
```

### Option 2: Docker MySQL
```bash
docker run --name mysql-crm \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=realestate_crm \
  -p 3306:3306 \
  -d mysql:8.0

# Update DATABASE_URL
DATABASE_URL=mysql://root:password@localhost:3306/realestate_crm
```

### Option 3: Cloud Database
- **PlanetScale**: Free MySQL hosting (https://planetscale.com)
- **AWS RDS**: Managed MySQL (https://aws.amazon.com/rds)
- **DigitalOcean**: Managed databases (https://www.digitalocean.com)

## Available Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)

# Database
pnpm db:push          # Push schema changes to database
pnpm db:generate      # Generate migration files
pnpm db:studio        # Open Drizzle Studio (visual DB editor)

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

## Deployment Options

### Quick Deploy (Recommended)

**Vercel** (Easiest - Free tier available)
1. Push code to GitHub
2. Go to vercel.com → Import project
3. Set environment variables
4. Deploy (automatic on every push)

**Railway** (Also easy - Free tier)
1. Connect GitHub repository
2. Add MySQL service
3. Set environment variables
4. Deploy

### Self-Hosted
See `DEPLOYMENT_GUIDE.md` for:
- VPS/Dedicated Server setup
- Docker deployment
- Nginx configuration
- SSL/HTTPS setup

## Key Features to Explore

### 1. Dashboard
- Overview of contacts, deals, properties
- Upcoming showings & tasks
- Birthday reminders
- Quick action buttons

### 2. Contacts Module
- Create/edit/delete contacts
- Batch import CSV
- Birthday & Islamic calendar tracking
- Contact relationships (spouse, co-buyer, etc.)
- Advanced search & filtering

### 3. Pipeline (Kanban Board)
- Visual deal pipeline
- Drag-and-drop deals between stages
- Auto-creates tasks when stage changes
- Real-time updates

### 4. Analytics
- Deal conversion rates
- Lead source analysis
- Pipeline value by stage
- Commission tracking

### 5. Activity Timeline
- Complete audit log of all interactions
- Filter by entity type & activity
- Track every change

### 6. Email Templates
- Pre-written templates
- Personalization support
- Categories (follow-up, listing, offer, etc.)

## Default Credentials

The system uses OAuth by default. To bypass OAuth for testing:

1. Edit `server/_core/oauth.ts` to allow test mode
2. Or set up OAuth with a provider (Google, Manus, etc.)

## Common Issues & Solutions

### "Cannot find module" errors
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database connection error
- Check DATABASE_URL is correct
- Verify MySQL is running
- Ensure database exists: `mysql -u root -e "SHOW DATABASES;"`

### Port 3000 already in use
```bash
# Find process
lsof -i :3000
# Kill it
kill -9 <PID>
```

### Build errors
```bash
pnpm clean
pnpm install
pnpm build
```

## File Structure Overview

```
realestate-crm/
├── client/src/
│   ├── pages/           # Page components (Dashboard, Contacts, Deals, etc.)
│   ├── components/      # Reusable UI components
│   ├── App.tsx          # Main app with routing
│   └── main.tsx         # Entry point
├── server/
│   ├── routers.ts       # tRPC API endpoints
│   ├── db.ts            # Database queries
│   └── _core/           # Framework internals
├── drizzle/
│   ├── schema.ts        # Database table definitions
│   └── migrations/      # SQL migration files
└── package.json         # Project dependencies
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS 4, Vite |
| Backend | Express 4, tRPC 11, Node.js |
| Database | MySQL 8.0 / TiDB |
| ORM | Drizzle ORM |
| Auth | OAuth 2.0 (configurable) |
| UI Components | shadcn/ui |

## Next Steps

1. **Extract & Setup** (5 min)
   - Unzip file
   - Install dependencies
   - Create database

2. **Run Locally** (2 min)
   - `pnpm dev`
   - Open http://localhost:3000

3. **Explore Features** (15 min)
   - Create test contacts
   - Create test deals
   - Try Kanban pipeline
   - Check analytics

4. **Customize** (as needed)
   - Update branding (logo, colors)
   - Modify deal stages
   - Add custom fields
   - Configure email templates

5. **Deploy** (30 min)
   - Choose hosting (Vercel, Railway, VPS)
   - Set up production database
   - Configure environment variables
   - Deploy!

## Support Resources

- **Drizzle ORM Docs**: https://orm.drizzle.team
- **tRPC Docs**: https://trpc.io
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Express.js**: https://expressjs.com

## Database Schema

The system includes 12 tables:
- `users` - User accounts
- `contacts` - Leads & clients
- `deals` - Transactions
- `properties` - Listings
- `tasks` - To-do items
- `showings` - Property viewings
- `offers` - Purchase/sale offers
- `documents` - Contracts & files
- `vendors` - Service providers
- `activities` - Task/activity log
- `contactRelationships` - Contact links
- `emailTemplates` - Email templates

All tables have proper indexes, foreign keys, and timestamps.

## Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set DATABASE_URL to production database
- [ ] Configure OAuth (or disable for internal use)
- [ ] Set up HTTPS/SSL
- [ ] Configure backups
- [ ] Set up monitoring/logging
- [ ] Test all features
- [ ] Create admin account
- [ ] Document custom configurations

## License & Support

This is a complete, self-contained application. You own the code and can:
- ✅ Modify as needed
- ✅ Deploy anywhere
- ✅ Extend with custom features
- ✅ Use for commercial purposes

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Status**: Production Ready ✅

