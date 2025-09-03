# UStudy - Test Cases Documentation

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Manual Test Cases](#manual-test-cases)
3. [Automated Test Scenarios](#automated-test-scenarios)
4. [User Acceptance Test Cases](#user-acceptance-test-cases)
5. [Security Test Cases](#security-test-cases)
6. [Performance Test Cases](#performance-test-cases)
7. [Integration Test Cases](#integration-test-cases)
8. [Regression Test Cases](#regression-test-cases)

## Testing Overview

The UStudy platform testing strategy covers multiple aspects:
- **Functional Testing**: Core features and user flows
- **Security Testing**: Authentication and authorization
- **Performance Testing**: Load and response times
- **Integration Testing**: Third-party services
- **User Acceptance Testing**: End-to-end user scenarios

### Testing Environment Setup
```bash
# Test environment
DATABASE_URI=postgres://test_user:password@localhost:5432/ustudy_test
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
SMTP_HOST=smtp.mailtrap.io  # Test email service
RAZORPAY_KEY_ID=rzp_test_xxx  # Test payment keys
```

## Manual Test Cases

### 1. User Registration and Authentication

#### TC001: Student Registration
**Objective**: Verify student can register successfully
**Preconditions**: Database is accessible, email service is configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/register` | Registration page loads |
| 2 | Select "Student Registration" tab | Student form is displayed |
| 3 | Fill all required fields | Form accepts valid data |
| 4 | Click "Register" button | OTP verification screen appears |
| 5 | Enter email OTP | Email verification succeeds |
| 6 | Enter phone OTP | Phone verification succeeds |
| 7 | Complete registration | Success message displayed, redirect to login |

**Test Data**:
- Name: "Test Student"
- Email: "test.student@example.com"
- Phone: "+1234567890"
- Country: "India"
- Password: "SecurePass123!"

**Expected Outcome**: ✅ Student account created and verified

#### TC002: University Registration  
**Objective**: Verify university can register successfully

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/register` | Registration page loads |
| 2 | Select "University Registration" tab | University form is displayed |
| 3 | Fill all required fields | Form accepts valid data |
| 4 | Select university template | Template preview shows |
| 5 | Click "Register" button | OTP verification initiated |
| 6 | Complete verification process | University account created |

**Test Data**:
- University Name: "Test University"
- Email: "admin@testuniversity.edu"
- Phone: "+1234567890"
- Website: "https://testuniversity.edu"
- Country: "United States"

**Expected Outcome**: ✅ University account created, pending verification

#### TC003: Student Login
**Objective**: Verify student login functionality

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login page loads |
| 2 | Select "Student" user type | Student login form displayed |
| 3 | Enter valid credentials | Form accepts credentials |
| 4 | Click "Login" button | Authentication processed |
| 5 | Verify redirect | Student dashboard loads |

**Test Credentials**:
- Email: "kavirajan@opendesignsin.com"
- Password: "admin@123"

**Expected Outcome**: ✅ Student logged in, redirected to `/dashboard`

#### TC004: University Login
**Objective**: Verify university login functionality

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login page loads |
| 2 | Select "University" user type | University login form displayed |
| 3 | Enter valid credentials | Form accepts credentials |
| 4 | Click "Login" button | Authentication processed |
| 5 | Verify redirect | University dashboard loads |

**Test Credentials**:
- Email: "kavirajan@opendesignsin.com"
- Password: "eei82QaiezzswVW"

**Expected Outcome**: ✅ University logged in, redirected to `/dashboard`

### 2. Dashboard Functionality

#### TC005: Student Dashboard
**Objective**: Verify student dashboard displays correctly

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as student | Dashboard loads |
| 2 | Check dashboard components | My Courses, Account Details visible |
| 3 | Navigate to My Courses | Enrolled courses displayed |
| 4 | Navigate to Account Details | Profile information shown |
| 5 | Edit profile information | Changes save successfully |

**Expected Outcome**: ✅ Student dashboard fully functional

#### TC006: University Dashboard
**Objective**: Verify university dashboard displays correctly

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as university | Dashboard loads |
| 2 | Check dashboard tabs | Account Details, Content Editor, View Page tabs |
| 3 | Navigate to Account Details | University info displayed |
| 4 | Navigate to Content Editor | Rich text editor loads |
| 5 | Navigate to View Page | University public page preview |

**Expected Outcome**: ✅ University dashboard fully functional

### 3. Course Management

#### TC007: Course Creation (University)
**Objective**: Verify university can create courses

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as university | University dashboard loads |
| 2 | Navigate to course management | Course creation interface |
| 3 | Fill course details | Form accepts course data |
| 4 | Add course content | Rich text editor works |
| 5 | Set pricing | Price information saved |
| 6 | Publish course | Course becomes available |

**Test Data**:
- Title: "Introduction to Computer Science"
- Description: "Basic programming concepts"
- Price: "299.00"
- Duration: "8 weeks"

**Expected Outcome**: ✅ Course created and published

#### TC008: Course Enrollment (Student)
**Objective**: Verify student can enroll in courses

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as student | Student dashboard loads |
| 2 | Browse course catalog | Available courses displayed |
| 3 | Select course | Course details shown |
| 4 | Click "Enroll" | Payment gateway opens |
| 5 | Complete payment | Razorpay payment processes |
| 6 | Verify enrollment | Course appears in "My Courses" |

**Expected Outcome**: ✅ Student enrolled in course successfully

### 4. Admin Panel Testing

#### TC009: Admin Login
**Objective**: Verify admin can access admin panel

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/admin` | Admin login page loads |
| 2 | Enter admin credentials | Form accepts credentials |
| 3 | Click "Login" | Authentication processed |
| 4 | Verify access | Admin dashboard loads |

**Test Credentials**:
- Username: "kavirajan@opendesignsin.com"
- Password: "admin@123"

**Expected Outcome**: ✅ Admin logged in to PayloadCMS

#### TC010: User Management
**Objective**: Verify admin can manage users

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as admin | Admin panel loads |
| 2 | Navigate to Users collection | Users list displayed |
| 3 | Create new user | User creation form |
| 4 | Edit existing user | User edit form |
| 5 | Delete user | Confirmation dialog, user removed |

**Expected Outcome**: ✅ User CRUD operations work correctly

## Automated Test Scenarios

### 1. Unit Tests

#### Authentication Tests
```javascript
describe('Authentication', () => {
  test('should validate student login credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    }
    const result = await authenticateStudent(credentials)
    expect(result.success).toBe(true)
  })

  test('should reject invalid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    }
    const result = await authenticateStudent(credentials)
    expect(result.success).toBe(false)
  })
})
```

#### API Tests
```javascript
describe('API Endpoints', () => {
  test('GET /api/courses should return courses', async () => {
    const response = await fetch('/api/courses')
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(Array.isArray(data.courses)).toBe(true)
  })

  test('POST /api/students/register should create student', async () => {
    const studentData = {
      name: 'Test Student',
      email: 'test@example.com',
      password: 'password123'
    }
    const response = await fetch('/api/students/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    })
    expect(response.status).toBe(201)
  })
})
```

### 2. Integration Tests

#### Database Integration
```javascript
describe('Database Operations', () => {
  test('should create and retrieve student', async () => {
    const studentData = {
      name: 'Test Student',
      email: 'test@example.com',
      country: 'India'
    }
    
    const created = await createStudent(studentData)
    const retrieved = await getStudentById(created.id)
    
    expect(retrieved.name).toBe(studentData.name)
    expect(retrieved.email).toBe(studentData.email)
  })
})
```

#### Payment Integration
```javascript
describe('Payment Processing', () => {
  test('should process course payment', async () => {
    const paymentData = {
      courseId: 'course-123',
      amount: 299.00,
      studentId: 'student-456'
    }
    
    const result = await processPayment(paymentData)
    expect(result.status).toBe('success')
    expect(result.paymentId).toBeDefined()
  })
})
```

## User Acceptance Test Cases

### 1. Student Journey UAT

#### UAT001: Complete Student Registration to Course Enrollment
**Scenario**: New student discovers platform, registers, and enrolls in course

**Steps**:
1. Student visits homepage
2. Browses available courses
3. Decides to register
4. Completes registration process
5. Verifies email and phone
6. Logs in to platform
7. Explores dashboard
8. Selects course to enroll
9. Completes payment
10. Accesses course materials

**Acceptance Criteria**:
- [ ] Registration process completes without errors
- [ ] Email and phone verification work
- [ ] Dashboard loads with appropriate content
- [ ] Payment processing succeeds
- [ ] Course materials are accessible

### 2. University Journey UAT

#### UAT002: University Registration to Course Publishing
**Scenario**: University registers and publishes first course

**Steps**:
1. University visits platform
2. Registers university account
3. Completes verification
4. Accesses university dashboard
5. Customizes university page
6. Creates first course
7. Adds course content and pricing
8. Publishes course
9. Views public university page

**Acceptance Criteria**:
- [ ] University registration completes
- [ ] Dashboard provides all necessary tools
- [ ] Course creation is intuitive
- [ ] Content editor works properly
- [ ] Published course appears in catalog

## Security Test Cases

### 1. Authentication Security

#### SEC001: Password Security
**Objective**: Verify password security measures

| Test Case | Expected Behavior |
|-----------|------------------|
| Weak password rejection | Passwords < 8 chars rejected |
| Password encryption | Passwords stored as hash |
| Session timeout | Sessions expire after inactivity |
| Multiple login attempts | Account locked after failed attempts |

#### SEC002: Access Control
**Objective**: Verify role-based access control

| Test Case | Expected Behavior |
|-----------|------------------|
| Student accessing admin | Access denied |
| University accessing other uni data | Access denied |
| Unauthenticated admin access | Redirect to login |
| Cross-role data access | Permission errors |

### 2. Data Security

#### SEC003: Data Validation
**Objective**: Verify input validation and sanitization

| Test Case | Input | Expected Result |
|-----------|-------|----------------|
| SQL Injection | `'; DROP TABLE students; --` | Input sanitized |
| XSS Attempt | `<script>alert('xss')</script>` | Script tags escaped |
| File Upload | Malicious file | File type validation |
| Email Validation | Invalid email format | Validation error |

#### SEC004: API Security
**Objective**: Verify API endpoint security

| Endpoint | Test | Expected Result |
|----------|------|----------------|
| `/api/students/me` | No auth token | 401 Unauthorized |
| `/api/admin/users` | Student token | 403 Forbidden |
| `/api/universities/123` | Wrong university token | 403 Forbidden |

## Performance Test Cases

### 1. Load Testing

#### PERF001: Course Catalog Loading
**Objective**: Verify course catalog performs under load

| Metric | Target | Test Scenario |
|--------|--------|---------------|
| Page Load Time | < 2 seconds | 100 concurrent users |
| API Response Time | < 500ms | Course list endpoint |
| Database Query Time | < 100ms | Course search queries |
| Memory Usage | < 512MB | Sustained load |

#### PERF002: User Registration Load
**Objective**: Verify registration handles concurrent users

| Metric | Target | Test Scenario |
|--------|--------|---------------|
| Registration Success Rate | > 99% | 50 simultaneous registrations |
| Email Delivery Time | < 30 seconds | OTP email delivery |
| Database Connection Pool | No exhaustion | High registration volume |

### 2. Stress Testing

#### PERF003: Payment Processing
**Objective**: Verify payment system under stress

| Scenario | Load | Expected Result |
|----------|------|----------------|
| Concurrent payments | 20 simultaneous | All payments process |
| Payment gateway timeout | Network delays | Graceful error handling |
| Database locks | High transaction volume | No deadlocks |

## Integration Test Cases

### 1. Third-Party Integrations

#### INT001: Email Service Integration
**Objective**: Verify email service functionality

| Test Case | Expected Behavior |
|-----------|------------------|
| OTP email delivery | Email received within 30 seconds |
| Email template rendering | Correct formatting and content |
| Email delivery failure | Proper error handling |
| Bulk email sending | No rate limit violations |

#### INT002: Razorpay Integration
**Objective**: Verify payment gateway integration

| Test Case | Expected Behavior |
|-----------|------------------|
| Payment initiation | Razorpay modal opens |
| Successful payment | Payment verified and recorded |
| Failed payment | Error handled gracefully |
| Payment webhook | Status updated in database |

### 2. Database Integration

#### INT003: Multi-Collection Operations
**Objective**: Verify complex database operations

| Operation | Test Scenario | Expected Result |
|-----------|---------------|----------------|
| Course enrollment | Create payment + enrollment record | Both records created atomically |
| University deletion | Remove university + courses | Cascade deletion works |
| Student data update | Update across multiple collections | Consistency maintained |

## Regression Test Cases

### 1. Core Functionality Regression

#### REG001: Authentication Regression
**Objective**: Ensure authentication changes don't break existing functionality

**Test Suite**:
- [ ] Student login still works
- [ ] University login still works
- [ ] Admin login still works
- [ ] Password reset still works
- [ ] OTP verification still works
- [ ] Session management still works

#### REG002: Dashboard Regression
**Objective**: Ensure dashboard updates don't break user experience

**Test Suite**:
- [ ] Student dashboard loads correctly
- [ ] University dashboard loads correctly
- [ ] Navigation between tabs works
- [ ] Data updates properly
- [ ] Responsive design maintained

### 2. API Regression

#### REG003: API Endpoint Regression
**Objective**: Ensure API changes maintain backward compatibility

**Test Suite**:
- [ ] All existing endpoints respond correctly
- [ ] Response formats unchanged
- [ ] Authentication requirements maintained
- [ ] Error handling consistent
- [ ] Performance not degraded

## Test Data Management

### Test User Accounts
```json
{
  "students": [
    {
      "email": "test.student1@example.com",
      "password": "TestPass123!",
      "name": "Test Student 1"
    },
    {
      "email": "test.student2@example.com", 
      "password": "TestPass123!",
      "name": "Test Student 2"
    }
  ],
  "universities": [
    {
      "email": "test.university@example.edu",
      "password": "UniPass123!",
      "name": "Test University"
    }
  ],
  "admins": [
    {
      "email": "admin@ustudy.com",
      "password": "AdminPass123!",
      "role": "admin"
    }
  ]
}
```

### Test Course Data
```json
{
  "courses": [
    {
      "title": "Test Course 1",
      "description": "Test course description",
      "price": 99.99,
      "duration": "4 weeks"
    },
    {
      "title": "Test Course 2", 
      "description": "Another test course",
      "price": 199.99,
      "duration": "8 weeks"
    }
  ]
}
```

## Test Reporting

### Test Execution Report Template
```
Test Suite: [Suite Name]
Date: [Execution Date]
Environment: [Test Environment]
Tester: [Tester Name]

Results Summary:
- Total Test Cases: [Number]
- Passed: [Number] 
- Failed: [Number]
- Skipped: [Number]
- Pass Rate: [Percentage]

Failed Test Cases:
[List of failed tests with details]

Performance Metrics:
[Performance test results]

Recommendations:
[Next steps and recommendations]
```

---

**Note**: This test documentation should be updated regularly as new features are added to the platform. All test cases should be executed before major releases to ensure quality and reliability.