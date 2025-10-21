# AgentPro CRM - Deployment Guide

## Overview
This is a complete full-stack real estate CRM application built with:
- **Frontend**: React 19 + Tailwind CSS 4 + Vite
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL/TiDB
- **Authentication**: OAuth 2.0 (Manus or custom)

## Quick Start - Local Development

### Prerequisites
- Node.js 18+ (v22.13.0 recommended)
- npm or pnpm (pnpm v9+ recommended)
- MySQL 8.0+ or compatible database (TiDB, MariaDB)

### Installation

1. **Extract the project**
   ```bash
   unzip realestate-crm-fullstack.zip
   cd realestate-crm
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL=mysql://user:password@localhost:3306/realestate_crm

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this

   # OAuth Configuration (optional - for Manus OAuth)
   VITE_APP_ID=your-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

   # App Configuration
   VITE_APP_TITLE=AgentPro CRM
   VITE_APP_LOGO=https://your-logo-url.com/logo.png

   # Owner Information (optional)
   OWNER_NAME=Your Name
   OWNER_OPEN_ID=your-open-id

   # Optional: Built-in APIs (if using Manus)
   BUILT_IN_FORGE_API_URL=https://api.manus.im
   BUILT_IN_FORGE_API_KEY=your-api-key
   ```

4. **Set up database**
   ```bash
   # Create MySQL database
   mysql -u root -p -e "CREATE DATABASE realestate_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

   # Run migrations
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`

## Production Deployment

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/realestate-crm.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy

3. **Database Setup**
   - Use Vercel's MySQL integration or
   - Use PlanetScale (free MySQL hosting) or
   - Use AWS RDS

### Option 2: Railway

1. **Connect GitHub repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Add MySQL service**
   - Click "Add Service"
   - Select "MySQL"
   - Configure environment variables

3. **Deploy**
   - Railway will auto-deploy on push

### Option 3: Self-Hosted (VPS/Dedicated Server)

#### Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+
- MySQL 8.0+
- Nginx or Apache (reverse proxy)

#### Installation Steps

1. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install MySQL**
   ```bash
   sudo apt-get install -y mysql-server
   sudo mysql_secure_installation
   ```

4. **Clone/Upload project**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/realestate-crm.git
   cd realestate-crm
   ```

5. **Install dependencies**
   ```bash
   pnpm install
   ```

6. **Create .env file**
   ```bash
   nano .env.local
   # Add all environment variables
   ```

7. **Build application**
   ```bash
   pnpm build
   ```

8. **Set up PM2 (process manager)**
   ```bash
   npm install -g pm2
   pm2 start "pnpm start" --name "realestate-crm"
   pm2 startup
   pm2 save
   ```

9. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/realestate-crm
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Enable site and restart Nginx**
    ```bash
    sudo ln -s /etc/nginx/sites-available/realestate-crm /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Set up SSL (Let's Encrypt)**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```

### Option 4: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package.json pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install --frozen-lockfile
   COPY . .
   RUN pnpm build
   EXPOSE 3000
   CMD ["pnpm", "start"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=mysql://root:password@db:3306/realestate_crm
         - JWT_SECRET=your-secret
       depends_on:
         - db
     db:
       image: mysql:8.0
       environment:
         - MYSQL_ROOT_PASSWORD=password
         - MYSQL_DATABASE=realestate_crm
       volumes:
         - db_data:/var/lib/mysql
   volumes:
     db_data:
   ```

3. **Run with Docker**
   ```bash
   docker-compose up -d
   ```

## Database Configuration

### MySQL Connection String Format
```
mysql://username:password@host:port/database_name
```

### Example for different services:
- **Local**: `mysql://root:password@localhost:3306/realestate_crm`
- **PlanetScale**: `mysql://user:password@aws.connect.psdb.cloud/database?sslAccept=strict`
- **AWS RDS**: `mysql://admin:password@mydb.xxxxx.us-east-1.rds.amazonaws.com:3306/realestate_crm`
- **DigitalOcean**: `mysql://doadmin:password@db-mysql-xxx-do-user-xxx.db.ondigitalocean.com:25060/realestate_crm?ssl=true`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Secret key for session signing (min 32 chars) |
| `VITE_APP_TITLE` | No | App title (default: "AgentPro CRM") |
| `VITE_APP_LOGO` | No | Logo URL |
| `VITE_APP_ID` | No | OAuth app ID (if using OAuth) |
| `OAUTH_SERVER_URL` | No | OAuth server URL |
| `VITE_OAUTH_PORTAL_URL` | No | OAuth portal URL |
| `OWNER_NAME` | No | Owner name for notifications |
| `OWNER_OPEN_ID` | No | Owner ID for notifications |
| `BUILT_IN_FORGE_API_URL` | No | API gateway URL |
| `BUILT_IN_FORGE_API_KEY` | No | API gateway key |

## Running the Application

### Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

### Database Migrations
```bash
# Push schema changes
pnpm db:push

# Generate migrations
pnpm db:generate

# View database
pnpm db:studio
```

## Features Included

✅ Complete Real Estate CRM with:
- Contact Management (CRUD + batch import)
- Deal Pipeline (Kanban board with drag-and-drop)
- Property Management
- Task Management (with auto-creation on deal stage change)
- Showing Scheduling
- Offer Tracking
- Document Management
- Vendor Management
- Activity Timeline
- Analytics Dashboard
- Birthday Reminders (with Islamic calendar support)
- Email Templates
- Contact Relationships
- Bulk Operations (select, delete, export)
- Advanced Search & Filtering

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Database Connection Error
- Verify DATABASE_URL is correct
- Check MySQL is running
- Ensure database exists
- Check user permissions

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### OAuth Issues
- Verify VITE_APP_ID is correct
- Check OAuth server URL
- Ensure callback URL is registered

## Backup & Maintenance

### Backup Database
```bash
mysqldump -u username -p database_name > backup.sql
```

### Restore Database
```bash
mysql -u username -p database_name < backup.sql
```

### Update Application
```bash
git pull origin main
pnpm install
pnpm db:push
pnpm build
pm2 restart realestate-crm
```

## Support & Documentation

- **Drizzle ORM**: https://orm.drizzle.team
- **tRPC**: https://trpc.io
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

## License

This project is provided as-is for personal use.

---

**Last Updated**: October 2025
**Version**: 1.0.0

