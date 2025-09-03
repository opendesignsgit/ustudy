# UStudy - Technical Documentation

## Table of Contents
1. [Architecture Deep Dive](#architecture-deep-dive)
2. [Custom Components](#custom-components)
3. [Customized Files](#customized-files)
4. [Access Control System](#access-control-system)
5. [Block System](#block-system)
6. [Authentication Implementation](#authentication-implementation)
7. [Payment Integration](#payment-integration)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [Performance Optimizations](#performance-optimizations)

## Architecture Deep Dive

### Framework Architecture
UStudy is built on a modern, scalable architecture combining:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Next.js App   │  │   React 19      │  │   TypeScript    │ │
│  │   Router        │  │   Components    │  │   Type Safety   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   Content Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   PayloadCMS    │  │   Lexical       │  │   Block         │ │
│  │   Admin Panel   │  │   Editor        │  │   System        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   PostgreSQL    │  │   File Storage  │  │   Session       │ │
│  │   Database      │  │   Media Files   │  │   Management    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Application Structure

```
src/
├── app/                        # Next.js 13+ App Router
│   ├── (authenticated)/        # Protected route group
│   │   └── dashboard/          # Unified dashboard
│   ├── (frontend)/             # Public route group
│   │   ├── courses/            # Course catalog
│   │   ├── universities/       # University profiles
│   │   ├── login/              # Authentication
│   │   └── register/           # User registration
│   └── (payload)/              # CMS admin routes
│       └── admin/              # PayloadCMS admin
├── blocks/                     # Content building blocks
├── collections/                # Data models
├── components/                 # React components
├── access/                     # Permission controls
└── utilities/                  # Helper functions
```

### Route Groups Explanation

#### (authenticated) - Protected Routes
- Requires user authentication
- Redirects to login if not authenticated
- Unified dashboard for both students and universities
- Role-based content rendering

#### (frontend) - Public Routes
- Accessible to all visitors
- SEO optimized for search engines
- Cached for performance
- Progressive enhancement

#### (payload) - CMS Admin Routes
- PayloadCMS admin interface
- Role-based admin access
- Content management interface
- Media management

## Custom Components

### 1. Authentication Components

#### LoginFormModal (`src/components/LoginFormModal/`)
```typescript
// Dual-type authentication modal
interface LoginFormModalProps {
  userType: 'student' | 'university'
  onLogin: (credentials: LoginCredentials) => void
  onSwitchType: (type: string) => void
}
```

**Features**:
- Dual login system (student/university)
- Form validation with react-hook-form
- OTP verification integration
- Error handling and feedback
- Responsive design

#### BeforeLogin (`src/components/BeforeLogin/`)
```typescript
// Pre-login user type selection
interface BeforeLoginProps {
  onSelectType: (type: 'student' | 'university') => void
  currentType: string
}
```

**Features**:
- User type selection interface
- Smooth transitions between login types
- Integrated with authentication flow

### 2. Dashboard Components

#### BeforeDashboard (`src/components/BeforeDashboard/`)
```typescript
// Dashboard content router based on user type
interface BeforeDashboardProps {
  user: Student | University
  userType: string
}
```

**Features**:
- Conditional dashboard rendering
- Role-based component loading
- Unified dashboard experience
- Performance optimized

### 3. Course Components

#### Courses (`src/components/Courses/`)
```typescript
// Course listing and management
interface CoursesProps {
  courses: Course[]
  viewMode: 'grid' | 'list'
  filters: CourseFilters
}
```

**Features**:
- Grid and list view modes
- Advanced filtering system
- Pagination support
- Search functionality
- Responsive design

### 4. University Components

Located in `src/blocks/CoursesComponents/` - Custom blocks for university features:

#### YearsModule
- University program year management
- Course scheduling
- Academic calendar integration

#### RegisterFormBlock
- University-specific registration forms
- Custom field configuration
- Validation rules

### 5. UI Components (`src/components/ui/`)

#### Card Component
```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outline'
  padding: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

#### Custom Form Components
- Enhanced input fields
- Validation feedback
- Accessibility support
- Consistent styling

## Customized Files

### 1. PayloadCMS Configuration (`src/payload.config.ts`)

#### Key Customizations:
```typescript
export default buildConfig({
  // Custom collections
  collections: [
    Users,
    Students,        // Custom student collection
    Universities,    // Custom university collection
    Courses,        // Enhanced course collection
    Countries,      // Location management
    Posts,
    Pages,
    Media,
  ],
  
  // Custom access control
  access: {
    users: authenticated,
    students: ({ req }) => Boolean(req.user),
    universities: canAccessOwnUniversityCourses,
  },
  
  // Rich text editor configuration
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Custom blocks for education content
    ],
  }),
})
```

### 2. Authentication Provider (`src/providers/Auth.tsx`)

#### Multi-Type Authentication:
```typescript
interface AuthContextType {
  user: Student | University | null
  login: (credentials: LoginCredentials, type: 'student' | 'university') => Promise<void>
  logout: () => void
  userType: 'student' | 'university' | null
  isLoggedIn: boolean
}

const login = async (credentials, type = 'student') => {
  let endpoint = '/api/students/login'
  
  if (type === 'university') {
    endpoint = '/api/universities/login'
  }
  
  // Authentication logic
}
```

### 3. Access Control (`src/access/`)

#### Custom Access Controls:

**canAccessOwnUniversityCourses.ts**:
```typescript
export const canAccessOwnUniversityCourses = ({ req: { user } }) => {
  if (user?.collection === 'universities') {
    return {
      university: {
        equals: user.id,
      },
    }
  }
  
  return Boolean(user?.role === 'admin')
}
```

**authenticatedOrPublished.ts**:
```typescript
export const authenticatedOrPublished = ({ req: { user } }) => {
  if (user) return true
  
  return {
    _status: {
      equals: 'published',
    },
  }
}
```

### 4. Custom Collections

#### Students Collection (`src/collections/Students/index.ts`)
```typescript
export const Students: CollectionConfig = {
  slug: 'students',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: true,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      validate: phoneValidation,
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
    },
    // ... additional fields
  ],
}
```

#### Universities Collection (`src/collections/Universities/index.ts`)
```typescript
export const Universities: CollectionConfig = {
  slug: 'universities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'country', 'verified'],
  },
  access: {
    create: anyone,
    read: () => true,
    update: canAccessOwnUniversityCourses,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'university-templates',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
    },
    // ... additional fields
  ],
}
```

## Access Control System

### Role-Based Access Control (RBAC)

#### User Roles:
1. **Admin**: Full platform access
2. **University**: Manage own university and courses
3. **Student**: Access courses and profile
4. **Editor**: Content management permissions

#### Permission Matrix:
```typescript
const permissionMatrix = {
  admin: {
    users: ['create', 'read', 'update', 'delete'],
    courses: ['create', 'read', 'update', 'delete'],
    universities: ['create', 'read', 'update', 'delete'],
    students: ['create', 'read', 'update', 'delete'],
  },
  university: {
    courses: ['create', 'read', 'update'], // own courses only
    universities: ['read', 'update'], // own profile only
    students: ['read'], // enrolled students only
  },
  student: {
    courses: ['read'], // enrolled courses
    students: ['read', 'update'], // own profile only
  },
}
```

### Self-Control Permissions
Universities and students can only manage their own content:

```typescript
const selfControlAccess = ({ req: { user } }) => {
  if (user?.collection === 'universities') {
    return { id: { equals: user.id } }
  }
  if (user?.collection === 'students') {
    return { id: { equals: user.id } }
  }
  return Boolean(user?.role === 'admin')
}
```

## Block System

### Content Building Blocks

#### 1. Banner Block (`src/blocks/Banner/`)
```typescript
export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'type',
      type: 'select',
      options: ['hero', 'announcement', 'promotion'],
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
```

#### 2. Course Components (`src/blocks/CoursesComponents/`)

**YearsModule**: Academic year management
**RegisterFormBlock**: University registration forms

#### 3. Form Block (`src/blocks/Form/`)
```typescript
export const FormBlock: Block = {
  slug: 'form',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.enableIntro),
      },
    },
  ],
}
```

## Authentication Implementation

### Multi-Type Authentication Flow

#### 1. Login Process
```typescript
const handleLogin = async (credentials: LoginCredentials, userType: string) => {
  try {
    const endpoint = userType === 'university' 
      ? '/api/universities/login'
      : '/api/students/login'
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    
    if (response.ok) {
      const { user, token } = await response.json()
      setAuthToken(token)
      setUser(user)
      setUserType(userType)
      router.push('/dashboard')
    }
  } catch (error) {
    handleAuthError(error)
  }
}
```

#### 2. OTP Verification
```typescript
const verifyOTP = async (otp: string, type: 'email' | 'phone') => {
  const response = await fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp, type }),
  })
  
  return response.json()
}
```

#### 3. Session Management
```typescript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  
  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      validateTokenAndGetUser(token)
    }
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Payment Integration

### Razorpay Implementation

#### 1. Payment Processing
```typescript
const processPayment = async (courseId: string, amount: number) => {
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    name: 'UStudy',
    description: `Course Enrollment`,
    order_id: await createRazorpayOrder(amount),
    handler: async (response) => {
      await verifyPayment(response)
      await enrollStudent(courseId)
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone,
    },
  }
  
  const razorpay = new Razorpay(options)
  razorpay.open()
}
```

#### 2. Payment Verification
```typescript
const verifyPayment = async (paymentData) => {
  const response = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  })
  
  return response.json()
}
```

## Database Schema

### Key Tables and Relationships

```sql
-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  country_id UUID REFERENCES countries(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Universities table
CREATE TABLE universities (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  website VARCHAR,
  description TEXT,
  template_id UUID REFERENCES university_templates(id),
  verified BOOLEAN DEFAULT FALSE,
  country_id UUID REFERENCES countries(id)
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  university_id UUID REFERENCES universities(id),
  status VARCHAR DEFAULT 'draft'
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  course_id UUID REFERENCES courses(id),
  payment_status VARCHAR DEFAULT 'pending',
  enrolled_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication Endpoints
- `POST /api/students/login` - Student login
- `POST /api/universities/login` - University login
- `POST /api/students/register` - Student registration
- `POST /api/universities/register` - University registration
- `POST /api/verify-otp` - OTP verification
- `POST /api/logout` - User logout

### Data Endpoints
- `GET /api/courses` - List courses
- `GET /api/universities` - List universities
- `GET /api/students/me` - Current student profile
- `GET /api/universities/me` - Current university profile
- `POST /api/enrollments` - Enroll in course

### Payment Endpoints
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history

## Performance Optimizations

### 1. Next.js Optimizations
- Static Site Generation (SSG) for public pages
- Incremental Static Regeneration (ISR)
- Image optimization with next/image
- Code splitting and lazy loading

### 2. Database Optimizations
- Proper indexing on frequently queried fields
- Query optimization with PayloadCMS
- Connection pooling
- Caching strategies

### 3. Frontend Optimizations
- Component memoization
- Virtual scrolling for large lists
- Progressive loading
- Bundle optimization

### 4. CDN and Caching
- Static asset CDN
- API response caching
- Browser caching headers
- Service worker implementation

---

**Note**: This technical documentation provides detailed insights into the UStudy platform's architecture and implementation. For specific code examples or deeper technical details, refer to the source code in the repository.