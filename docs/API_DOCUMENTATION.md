# UStudy - API Documentation

## Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Student APIs](#student-apis)
4. [University APIs](#university-apis)
5. [Course APIs](#course-apis)
6. [Payment APIs](#payment-apis)
7. [Admin APIs](#admin-apis)
8. [Utility APIs](#utility-apis)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

## API Overview

The UStudy platform provides RESTful APIs for all major functionality. The APIs are built on top of PayloadCMS and Next.js, providing both REST and GraphQL endpoints.

### Base URLs
- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

### API Versioning
Current API version: `v1` (default)
- REST endpoints: `/api/[resource]`
- GraphQL endpoint: `/api/graphql`

### Request/Response Format
- **Content Type**: `application/json`
- **Authentication**: Bearer token in Authorization header
- **Response Format**: JSON with consistent structure

### Common Response Structure
```json
{
  "success": true,
  "data": {}, 
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Authentication

### Authentication Flow
The platform uses JWT-based authentication with role-based access control.

#### Login Request
```http
POST /api/students/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "student@example.com",
      "name": "John Doe",
      "collection": "students"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "exp": 1640995200
  },
  "message": "Login successful"
}
```

#### Using Authentication Token
```http
GET /api/students/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Student APIs

### 1. Student Registration

#### Register New Student
```http
POST /api/students/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "country": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "verified": false
    }
  },
  "message": "Registration successful. Please verify your email and phone."
}
```

### 2. Student Authentication

#### Student Login
```http
POST /api/students/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

#### Student Logout
```http
POST /api/students/logout
Authorization: Bearer {token}
```

#### Refresh Token
```http
POST /api/students/refresh
Authorization: Bearer {refresh_token}
```

### 3. Student Profile Management

#### Get Current Student Profile
```http
GET /api/students/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "country": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "United States",
      "code": "US"
    },
    "enrolledCourses": [
      {
        "id": "course123",
        "title": "Introduction to Programming",
        "status": "enrolled",
        "progress": 45
      }
    ]
  }
}
```

#### Update Student Profile
```http
PATCH /api/students/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

#### Change Password
```http
POST /api/students/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### 4. Student Course Enrollment

#### Get Enrolled Courses
```http
GET /api/students/me/courses
Authorization: Bearer {token}
```

#### Enroll in Course
```http
POST /api/students/me/enroll
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "paymentId": "pay_abc123"
}
```

## University APIs

### 1. University Registration

#### Register New University
```http
POST /api/universities/register
Content-Type: application/json

{
  "name": "Test University",
  "email": "admin@testuniversity.edu",
  "password": "UniPass123!",
  "phone": "+1234567890",
  "website": "https://testuniversity.edu",
  "description": "A premier educational institution",
  "country": "64f1a2b3c4d5e6f7g8h9i0j1",
  "template": "64f1a2b3c4d5e6f7g8h9i0j2"
}
```

### 2. University Authentication

#### University Login
```http
POST /api/universities/login
Content-Type: application/json

{
  "email": "admin@testuniversity.edu",
  "password": "UniPass123!"
}
```

### 3. University Profile Management

#### Get Current University Profile
```http
GET /api/universities/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Test University",
    "email": "admin@testuniversity.edu",
    "website": "https://testuniversity.edu",
    "description": "A premier educational institution",
    "verified": true,
    "template": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Modern University Template"
    },
    "courses": [
      {
        "id": "course123",
        "title": "Computer Science Fundamentals",
        "status": "published",
        "enrollments": 25
      }
    ]
  }
}
```

#### Update University Profile
```http
PATCH /api/universities/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Updated university description",
  "website": "https://newwebsite.edu"
}
```

### 4. University Course Management

#### Get University Courses
```http
GET /api/universities/me/courses
Authorization: Bearer {token}
```

#### Create New Course
```http
POST /api/universities/me/courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Advanced Programming",
  "description": "Learn advanced programming concepts",
  "price": 299.99,
  "duration": "12 weeks",
  "content": {
    "modules": [
      {
        "title": "Module 1",
        "lessons": ["Lesson 1", "Lesson 2"]
      }
    ]
  }
}
```

#### Update Course
```http
PATCH /api/universities/me/courses/{courseId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Course Title",
  "price": 399.99
}
```

#### Delete Course
```http
DELETE /api/universities/me/courses/{courseId}
Authorization: Bearer {token}
```

## Course APIs

### 1. Public Course Listing

#### Get All Courses
```http
GET /api/courses
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 50)
- `search` (string): Search in title and description
- `university` (string): Filter by university ID
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sort` (string): Sort by (title, price, createdAt)
- `order` (string): Sort order (asc, desc)

**Example:**
```http
GET /api/courses?page=1&limit=10&search=programming&minPrice=100&sort=price&order=asc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "title": "Introduction to Programming",
        "description": "Learn programming basics",
        "price": 199.99,
        "duration": "8 weeks",
        "university": {
          "id": "64f1a2b3c4d5e6f7g8h9i0j2",
          "name": "Tech University"
        },
        "enrollmentCount": 150,
        "rating": 4.5,
        "thumbnail": {
          "url": "/media/course-thumbnail.jpg"
        }
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. Course Details

#### Get Single Course
```http
GET /api/courses/{courseId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Introduction to Programming",
    "description": "Comprehensive programming course",
    "price": 199.99,
    "duration": "8 weeks",
    "requirements": ["Basic computer knowledge"],
    "learningOutcomes": ["Understand programming fundamentals"],
    "content": {
      "modules": [
        {
          "title": "Module 1: Basics",
          "lessons": [
            {
              "title": "Introduction",
              "duration": "30 minutes",
              "type": "video"
            }
          ]
        }
      ]
    },
    "university": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Tech University",
      "logo": "/media/university-logo.jpg"
    },
    "instructor": {
      "name": "Dr. John Smith",
      "bio": "Experienced software engineer",
      "avatar": "/media/instructor-avatar.jpg"
    },
    "statistics": {
      "enrollmentCount": 150,
      "completionRate": 85,
      "averageRating": 4.5,
      "reviewCount": 45
    }
  }
}
```

### 3. Course Search

#### Search Courses
```http
GET /api/courses/search?q={query}
```

**Query Parameters:**
- `q` (string): Search query
- `filters` (object): Additional filters

## Payment APIs

### 1. Create Payment Order

#### Create Razorpay Order
```http
POST /api/payments/create-order
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "amount": 199.99,
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_abc123",
    "amount": 19999,
    "currency": "INR",
    "razorpayKeyId": "rzp_live_xxx",
    "courseDetails": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Introduction to Programming"
    }
  }
}
```

### 2. Verify Payment

#### Verify Payment Signature
```http
POST /api/payments/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "razorpay_order_id": "order_abc123",
  "razorpay_payment_id": "pay_def456", 
  "razorpay_signature": "signature_hash",
  "courseId": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentVerified": true,
    "enrollmentId": "64f1a2b3c4d5e6f7g8h9i0j3",
    "paymentId": "pay_def456"
  },
  "message": "Payment verified and enrollment completed"
}
```

### 3. Payment History

#### Get Payment History
```http
GET /api/payments/history
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment123",
        "amount": 199.99,
        "currency": "INR",
        "status": "completed",
        "paymentMethod": "card",
        "course": {
          "id": "course123",
          "title": "Introduction to Programming"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## Admin APIs

### 1. User Management

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `role`: Filter by role (student, university, admin)
- `verified`: Filter by verification status

#### Get User Details
```http
GET /api/admin/users/{userId}
Authorization: Bearer {admin_token}
```

#### Update User
```http
PATCH /api/admin/users/{userId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "verified": true,
  "role": "admin"
}
```

#### Delete User
```http
DELETE /api/admin/users/{userId}
Authorization: Bearer {admin_token}
```

### 2. Course Management

#### Get All Courses (Admin)
```http
GET /api/admin/courses
Authorization: Bearer {admin_token}
```

#### Approve/Reject Course
```http
PATCH /api/admin/courses/{courseId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved", // or "rejected"
  "reason": "Meets quality standards"
}
```

### 3. University Management

#### Get All Universities
```http
GET /api/admin/universities
Authorization: Bearer {admin_token}
```

#### Verify University
```http
PATCH /api/admin/universities/{universityId}/verify
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "verified": true,
  "notes": "Documentation verified"
}
```

### 4. Analytics

#### Get Platform Statistics
```http
GET /api/admin/analytics/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 1250,
    "totalUniversities": 45,
    "totalCourses": 320,
    "totalRevenue": 125000.50,
    "monthlyGrowth": {
      "students": 12.5,
      "courses": 8.3,
      "revenue": 15.2
    }
  }
}
```

## Utility APIs

### 1. Countries

#### Get All Countries
```http
GET /api/countries
```

**Response:**
```json
{
  "success": true,
  "data": {
    "countries": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "United States",
        "code": "US",
        "currency": {
          "name": "US Dollar",
          "code": "USD",
          "symbol": "$"
        },
        "flag": "/media/flags/us.png"
      }
    ]
  }
}
```

### 2. OTP Verification

#### Send OTP
```http
POST /api/otp/send
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "+1234567890",
  "type": "registration" // or "password_reset"
}
```

#### Verify OTP
```http
POST /api/otp/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "type": "email" // or "phone"
}
```

### 3. File Upload

#### Upload Media
```http
POST /api/media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": (binary),
  "alt": "Image description",
  "folder": "course-materials"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "filename": "course-image.jpg",
    "url": "/media/course-image.jpg",
    "mimeType": "image/jpeg",
    "filesize": 1024000,
    "width": 1920,
    "height": 1080
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

### Error Examples

#### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email must be valid"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

#### Authentication Error
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

#### Permission Error
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

## Rate Limiting

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limits by Endpoint Type

| Endpoint Type | Rate Limit | Window |
|---------------|------------|--------|
| Authentication | 5 requests | 15 minutes |
| Registration | 3 requests | 1 hour |
| General API | 100 requests | 15 minutes |
| File Upload | 10 requests | 1 minute |
| Payment | 20 requests | 1 hour |

### Rate Limit Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900
  }
}
```

## GraphQL API

### GraphQL Endpoint
```http
POST /api/graphql
Content-Type: application/json
Authorization: Bearer {token}
```

### Example Query
```graphql
query GetCourses($limit: Int, $where: JSON) {
  Courses(limit: $limit, where: $where) {
    docs {
      id
      title
      description
      price
      university {
        name
        id
      }
    }
    totalDocs
    limit
    page
  }
}
```

### Example Mutation
```graphql
mutation CreateCourse($data: mutationCourseInput!) {
  createCourse(data: $data) {
    id
    title
    description
    price
  }
}
```

---

**Note**: This API documentation should be kept up to date as the platform evolves. For the most current API specifications, refer to the PayloadCMS admin panel's API documentation section.