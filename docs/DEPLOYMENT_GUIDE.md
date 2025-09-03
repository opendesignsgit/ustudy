# UStudy - Deployment & Setup Guide

## Table of Contents
1. [Development Setup](#development-setup)
2. [Production Deployment](#production-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Email Configuration](#email-configuration)
6. [Payment Gateway Setup](#payment-gateway-setup)
7. [Docker Deployment](#docker-deployment)
8. [Troubleshooting](#troubleshooting)

## Development Setup

### Prerequisites
- Node.js 18.20.2 or ≥20.9.0
- PostgreSQL 12+ database
- Git

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/opendesignsgit/ustudy.git
cd ustudy
```

#### 2. Install Dependencies
```bash
npm install
# or
pnpm install --ignore-workspace
```

#### 3. Environment Configuration
Create `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Database Configuration
DATABASE_URI=postgres://username:password@localhost:5432/ustudy_dev

# PayloadCMS Configuration
PAYLOAD_SECRET=your_secure_random_string_here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
CRON_SECRET=your_cron_secret_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateway (Development)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

#### 4. Database Setup
```bash
# Create database
createdb ustudy_dev

# Run PayloadCMS migrations (if any)
npm run payload migrate
```

#### 5. Generate Types
```bash
npm run generate:types
```

#### 6. Start Development Server
```bash
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`

### Development Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Generate PayloadCMS types
npm run generate:types

# Generate import map
npm run generate:importmap
```

## Production Deployment

### Server Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended)
- **Node.js**: 18.20.2 or ≥20.9.0
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 20GB SSD
- **Database**: PostgreSQL 12+

### Deployment Steps

#### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

#### 2. Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE ustudy_prod;
CREATE USER ustudy_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ustudy_prod TO ustudy_user;
\q
```

#### 3. Application Deployment
```bash
# Clone repository
git clone https://github.com/opendesignsgit/ustudy.git
cd ustudy

# Install dependencies
npm install --production

# Create production environment file
cp .env.example .env.production
```

#### 4. Production Environment Configuration
```env
# Production Database
DATABASE_URI=postgres://ustudy_user:secure_password@localhost:5432/ustudy_prod

# Production Configuration
PAYLOAD_SECRET=super_secure_production_secret
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
CRON_SECRET=production_cron_secret

# Production Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=production_email_password

# Production Payment Gateway
RAZORPAY_KEY_ID=rzp_live_your_live_key
RAZORPAY_KEY_SECRET=your_live_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_live_key
```

#### 5. Build and Start Application
```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 6. Nginx Configuration
Create `/etc/nginx/sites-available/ustudy`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ustudy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URI` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `PAYLOAD_SECRET` | PayloadCMS encryption secret | `random_32_char_string` |
| `NEXT_PUBLIC_SERVER_URL` | Public server URL | `https://yourdomain.com` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_USER` | Email username | `noreply@domain.com` |
| `SMTP_PASS` | Email password/app password | `app_password` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_live_xxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | `secret_key` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CRON_SECRET` | Secret for cron jobs | `generated` |
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Node environment | `development` |

### Environment Files

#### Development (.env)
```env
DATABASE_URI=postgres://postgres:admin@123@localhost:5432/ustudy_dev
PAYLOAD_SECRET=7a2c42ca1bdfee8d037dd68e
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
SMTP_HOST=smtp.mailtrap.io
SMTP_USER=test_user
SMTP_PASS=test_pass
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=test_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
```

#### Production (.env.production)
```env
DATABASE_URI=postgres://ustudy_user:secure_password@localhost:5432/ustudy_prod
PAYLOAD_SECRET=super_secure_production_secret_32_chars
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=production_app_password
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=live_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
```

## Database Setup

### PostgreSQL Installation

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Windows
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### Database Configuration

#### Create Database and User
```sql
-- Connect as postgres superuser
sudo -u postgres psql

-- Create database
CREATE DATABASE ustudy_prod;

-- Create user
CREATE USER ustudy_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ustudy_prod TO ustudy_user;

-- Grant schema privileges
\c ustudy_prod
GRANT ALL ON SCHEMA public TO ustudy_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ustudy_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ustudy_user;

-- Exit
\q
```

#### Database Connection Testing
```bash
# Test connection
psql -h localhost -U ustudy_user -d ustudy_prod -W
```

### Database Backup and Restore

#### Backup
```bash
# Full backup
pg_dump -h localhost -U ustudy_user ustudy_prod > backup.sql

# Compressed backup
pg_dump -h localhost -U ustudy_user ustudy_prod | gzip > backup.sql.gz
```

#### Restore
```bash
# From SQL file
psql -h localhost -U ustudy_user -d ustudy_prod < backup.sql

# From compressed file
gunzip -c backup.sql.gz | psql -h localhost -U ustudy_user -d ustudy_prod
```

## Email Configuration

### Gmail Configuration

#### 1. Enable 2-Factor Authentication
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password for the application

#### 2. Environment Configuration
```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
```

### Other Email Providers

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_USER=your_mailgun_username
SMTP_PASS=your_mailgun_password
```

#### Custom SMTP
```env
SMTP_HOST=your.smtp.server.com
SMTP_USER=your_username
SMTP_PASS=your_password
```

### Email Testing

#### Using Mailtrap (Development)
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_password
```

## Payment Gateway Setup

### Razorpay Configuration

#### 1. Create Razorpay Account
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create account or log in
3. Complete KYC verification

#### 2. Get API Keys

##### Test Mode
1. Go to Settings → API Keys
2. Generate Test Keys
3. Use in development environment

##### Live Mode
1. Complete account activation
2. Generate Live Keys
3. Use in production environment

#### 3. Webhook Configuration
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`

#### 4. Environment Configuration
```env
# Test environment
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Production environment
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=live_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

### Testing Payment Integration

#### Test Card Numbers
```
Success: 4111 1111 1111 1111
Failure: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URI=postgres://ustudy:password@db:5432/ustudy
      - PAYLOAD_SECRET=your_secret_here
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=ustudy
      - POSTGRES_USER=ustudy
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy with Docker
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
**Error**: `Error: connect ETIMEDOUT`

**Solution**:
- Check database server is running
- Verify connection string
- Check firewall settings
- Ensure user has proper permissions

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U your_user -d your_database
```

#### 2. Build Failures
**Error**: Various build errors

**Solution**:
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify environment variables

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version
```

#### 3. Email Not Sending
**Error**: SMTP authentication failed

**Solution**:
- Verify SMTP credentials
- Check email provider settings
- Ensure app password is used (Gmail)

```bash
# Test SMTP connection
telnet smtp.gmail.com 587
```

#### 4. Payment Gateway Issues
**Error**: Invalid API key

**Solution**:
- Verify Razorpay keys
- Check test vs live mode
- Ensure webhook URL is correct

#### 5. Permission Errors
**Error**: Access denied errors

**Solution**:
- Check user roles and permissions
- Verify access control configuration
- Clear browser cache and cookies

### Performance Issues

#### Slow Database Queries
1. Enable query logging
2. Add database indexes
3. Optimize slow queries
4. Consider connection pooling

#### High Memory Usage
1. Monitor PM2 processes
2. Check for memory leaks
3. Optimize image sizes
4. Implement caching

#### Slow Page Load Times
1. Enable compression
2. Optimize images
3. Implement CDN
4. Cache static assets

### Monitoring and Logs

#### Application Logs
```bash
# PM2 logs
pm2 logs

# Specific app logs
pm2 logs ustudy

# Real-time logs
pm2 logs --lines 100
```

#### Database Logs
```bash
# PostgreSQL logs (Ubuntu)
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

#### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Backup and Recovery

#### Daily Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/ustudy"
DB_NAME="ustudy_prod"
DB_USER="ustudy_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Application files backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /path/to/ustudy

# Remove old backups (keep 7 days)
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
```

#### Automated Backup with Cron
```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

**Note**: This deployment guide covers standard deployment scenarios. For specific cloud providers (AWS, Azure, GCP) or containerized deployments (Kubernetes), additional configuration may be required.