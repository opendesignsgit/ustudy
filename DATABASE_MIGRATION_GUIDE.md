# Database Schema Migration and Deployment Guide

This document outlines the database schema fixes implemented to resolve the PayloadCMS collection errors.

## Issues Addressed

### 1. Missing Database Columns
- **Problem**: Application was throwing "column does not exist" errors for:
  - `phone` column in universities table
  - `universities_id` column in relationship tables
  - Missing authentication columns for Universities and Students collections

- **Solution**: Created comprehensive migration `20250115_114256_ensure_complete_schema.ts` that:
  - Adds all missing columns with proper data types
  - Creates relationship tables for Students' interested/browsed courses
  - Adds authentication fields for Universities and Students
  - Ensures proper foreign key constraints and indexes

### 2. Missing University Templates Table
- **Problem**: "relation 'university_templates' does not exist"
- **Solution**: Migration creates the table with proper structure and relationships

### 3. Static Generation Database Dependencies
- **Problem**: Build process failing due to database connection requirements during static generation
- **Solution**: Added error handling in all `generateStaticParams` functions to gracefully handle database unavailability

## Migration Details

### New Tables Created:
- `university_templates` - For university website templates
- `students_interested_courses` - Many-to-many relationship for student course interests
- `students_browsed_courses` - Many-to-many relationship for student course browsing history

### Columns Added:
#### Universities Table:
- Authentication: `password`, `salt`, `hash`, `login_attempts`, `lock_until`, `reset_password_token`, `reset_password_expiration`
- Relationships: `logo_id`, `secondary_logo_id`, `university_image_id`, `country_id`
- Core fields: `email`, `phone`, `template_id`, `website_url`, `description`, `content`, `is_active`
- Timestamps: `created_at`, `updated_at`

#### Students Table:
- Authentication: `password`, `salt`, `hash`, `login_attempts`, `lock_until`, `reset_password_token`, `reset_password_expiration`
- Relationships: `profile_pic_id`
- Timestamps: `created_at`, `updated_at`

### Indexes and Constraints:
- Unique constraints on email and phone fields
- Foreign key relationships with proper cascade rules
- Performance indexes on frequently queried columns

## Deployment Instructions

### 1. Production Deployment
```bash
# Run migrations
npm run payload migrate

# Or manually run specific migration
npm run payload migrate:up 20250115_114256_ensure_complete_schema
```

### 2. Development Setup
```bash
# Set up local database
createdb ueducate_dev

# Update .env.local with local database URI
DATABASE_URI=postgres://username:password@localhost:5432/ueducate_dev

# Run migrations
npm run payload migrate

# Generate types
npm run generate:types

# Start development server
npm run dev
```

### 3. Build Process
The application now handles database connectivity gracefully during build:
- Static generation will skip when database is unavailable
- Fallback values prevent build failures
- Runtime database calls work normally in production

## Collection Relationships

### Universities
- Has many Courses
- Belongs to Country
- Has optional UniversityTemplate
- Has Media relationships for logos and images

### Students
- Has authentication enabled
- Can have interested courses (many-to-many)
- Can have browsed courses (many-to-many)
- Has optional profile picture

### Courses
- Belongs to University
- Can have sub-university relationship
- Has various metadata relationships (departments, study areas, etc.)

### Bookings
- Links Student to Course
- Tracks enrollment and payment information

## Verification Steps

After deployment, verify:

1. **Admin Access**: All collections are accessible in PayloadCMS admin
2. **Relationships**: University-Course, Student-Course relationships work
3. **Authentication**: Universities and Students can login
4. **API Endpoints**: All collection APIs respond correctly
5. **Static Pages**: University template pages render correctly

## Troubleshooting

### Common Issues:
1. **Migration Fails**: Check database permissions and connection
2. **Foreign Key Errors**: Ensure referenced tables exist before running migration
3. **Build Failures**: Verify environment variables and database connectivity
4. **Type Errors**: Run `npm run generate:types` after schema changes

### Environment Variables Required:
```
DATABASE_URI=postgres://user:pass@host:port/dbname
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=your-domain
```

## Rollback Instructions

If issues occur, rollback the migration:
```bash
npm run payload migrate:down 20250115_114256_ensure_complete_schema
```

Note: Rollback will not drop columns to prevent data loss. Manual cleanup may be required.