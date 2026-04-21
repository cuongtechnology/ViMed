# System Architecture

## Clinic/Hospital Internal Management System - Vietnam Edition

---

## 0. Lưu ý trạng thái kiến trúc

- Tài liệu này mô tả kiến trúc mục tiêu đầy đủ cho sản phẩm.
- Ở thời điểm hiện tại, codebase đã có nền tảng: auth, dashboard, Prisma schema lớn, seed cơ bản và nhóm API MVP `/api/v1` cho module trọng tâm.
- Các thành phần nâng cao (workflow phức tạp, tích hợp ngoài, quan sát hệ thống đầy đủ) đang nằm trong roadmap tiếp theo.

---

## 1. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Web App   │  │  Mobile Web │  │   Admin Dashboard       │  │
│  │  (Next.js)  │  │  (Responsive)│ │   (Next.js)             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Next.js API Routes (App Router)                │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐   │   │
│  │  │   Auth     │  │   Middleware│  │  Rate Limiting   │   │   │
│  │  │   Handler  │  │   (RBAC)    │  │  & CORS          │   │   │
│  │  └────────────┘  └────────────┘  └──────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │   Auth     │ │  User Mgmt │ │  Branch    │ │ Employee   │   │
│  │   Service  │ │  Service   │ │  Service   │ │ Service    │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ Customer   │ │Appointment │ │  Cashier   │ │ Inventory  │   │
│  │ Service    │ │ Service    │ │  Service   │ │ Service    │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │Procurement │ │   Asset    │ │  Ticket    │ │ Reporting  │   │
│  │ Service    │ │  Service   │ │  Service   │ │ Service    │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Prisma ORM                            │   │
│  │         (Type-safe database client)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database Layer                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  PostgreSQL 16                           │   │
│  │            (Primary Data Store)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   Supporting Services                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │   Redis    │ │File Storage│ │  Job Queue │ │  Logging   │   │
│  │  (Cache)   │ │   (S3)     │ │  (BullMQ)  │ │  Service   │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Frontend Architecture

```
apps/web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth routes group
│   │   │   ├── login/
│   │   │   └── logout/
│   │   ├── (dashboard)/          # Protected routes
│   │   │   ├── layout.tsx        # Dashboard layout
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── branches/
│   │   │   ├── departments/
│   │   │   ├── employees/
│   │   │   ├── customers/
│   │   │   ├── appointments/
│   │   │   ├── cashier/
│   │   │   ├── inventory/
│   │   │   ├── procurement/
│   │   │   ├── assets/
│   │   │   ├── tickets/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   └── api/                  # API routes
│   │       ├── auth/
│   │       ├── trpc/
│   │       └── webhooks/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/               # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   └── breadcrumb.tsx
│   │   ├── forms/                # Reusable form components
│   │   ├── tables/               # Data table components
│   │   ├── charts/               # Chart components
│   │   └── modules/              # Module-specific components
│   │       ├── auth/
│   │       ├── branches/
│   │       ├── employees/
│   │       └── ...
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   ├── utils.ts              # Utility functions
│   │   ├── validators.ts         # Zod schemas
│   │   └── constants.ts          # App constants
│   ├── hooks/                    # Custom React hooks
│   ├── stores/                   # State management
│   ├── types/                    # TypeScript types
│   └── styles/                   # Global styles
├── public/
├── next.config.js
├── tailwind.config.js
└── package.json
```

### 2.2 Backend Structure

```
packages/database/
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Migration files
│   └── seeds/                    # Seed data
├── src/
│   ├── client.ts                 # Prisma client export
│   └── index.ts
└── package.json

apps/web/src/app/api/
├── auth/
│   ├── [...nextauth]/route.ts    # NextAuth handler
│   └── register/route.ts
├── users/
│   ├── route.ts                  # GET list, POST create
│   ├── [id]/route.ts             # GET, PUT, DELETE
│   └── [id]/roles/route.ts
├── branches/
│   ├── route.ts
│   └── [id]/route.ts
├── employees/
│   ├── route.ts
│   └── [id]/route.ts
├── customers/
│   ├── route.ts
│   └── [id]/route.ts
├── appointments/
│   ├── route.ts
│   └── [id]/route.ts
├── services/
│   ├── route.ts
│   └── [id]/route.ts
├── cashier/
│   ├── sessions/
│   ├── invoices/
│   └── payments/
├── inventory/
│   ├── items/
│   ├── warehouses/
│   └── transactions/
├── procurement/
│   ├── requests/
│   ├── orders/
│   └── suppliers/
├── assets/
│   ├── route.ts
│   └── [id]/maintenances/
├── tickets/
│   ├── route.ts
│   └── [id]/comments/
├── reports/
│   ├── revenue/
│   ├── customers/
│   └── inventory/
└── audit-logs/
    └── route.ts
```

---

## 3. Data Flow

### 3.1 Authentication Flow

```
User → Login Form → POST /api/auth/signin
                    ↓
              NextAuth Handler
                    ↓
              Validate Credentials
                    ↓
              Generate JWT + Refresh Token
                    ↓
              Set HTTP-only Cookies
                    ↓
              Redirect to Dashboard
```

### 3.2 API Request Flow

```
Client Request
      ↓
CORS Middleware
      ↓
Auth Middleware (verify JWT)
      ↓
RBAC Middleware (check permissions)
      ↓
Route Handler
      ↓
Service Layer (business logic)
      ↓
Prisma (data access)
      ↓
PostgreSQL
      ↓
Response → Client
```

### 3.3 Audit Logging Flow

```
Action Triggered
      ↓
Audit Middleware
      ↓
Capture: User, Action, Entity, Timestamp, IP, Details
      ↓
Async Write to audit_logs table
      ↓
Continue Request
```

---

## 4. Security Architecture

### 4.1 Authentication

- **Provider**: NextAuth.js v5 with JWT strategy
- **Tokens**: 
  - Access token: 15 minutes
  - Refresh token: 7 days
- **Storage**: HTTP-only cookies
- **MFA**: TOTP for admin roles (Phase 2)

### 4.2 Authorization

- **Model**: RBAC (Role-Based Access Control)
- **Permissions**: Granular CRUD + special actions
- **Enforcement**: Middleware + route guards

### 4.3 Data Protection

- **In Transit**: TLS 1.3
- **At Rest**: AES-256 encryption for sensitive fields
- **Passwords**: bcrypt with salt rounds 12
- **PII**: Masking on UI, encrypted storage

### 4.4 Session Management

- **Timeout**: 30 minutes idle
- **Concurrent**: Max 3 sessions per user
- **Device Tracking**: Log device fingerprint
- **Force Logout**: Admin capability

---

## 5. Deployment Architecture

### 5.1 Development

```yaml
# docker-compose.dev.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/clinic_dev
      - NEXTAUTH_SECRET=dev-secret
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=clinic_dev
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### 5.2 Production

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│                    (nginx/ALB)                          │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   App 1     │ │   App 2     │ │   App 3     │
│  (Next.js)  │ │  (Next.js)  │ │  (Next.js)  │
└─────────────┘ └─────────────┘ └─────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  PostgreSQL │ │   Redis     │ │  S3/MinIO   │
│  (Primary)  │ │  (Cache)    │ │  (Files)    │
└─────────────┘ └─────────────┘ └─────────────┘
```

---

## 6. Scalability Strategy

### 6.1 Horizontal Scaling

- Stateless application servers
- Shared session store (Redis)
- Database connection pooling
- Read replicas for reporting

### 6.2 Caching Strategy

- **L1**: React Query (client-side)
- **L2**: Redis (server-side)
- **Cached**: 
  - User permissions
  - Branch/department lists
  - Service catalogs
  - Price lists

### 6.3 Database Optimization

- Indexes on frequently queried columns
- Partitioning for audit_logs (by month)
- Connection pooling (PgBouncer)
- Query optimization with EXPLAIN

---

## 7. Monitoring & Observability

### 7.1 Logging

- **Format**: JSON structured logging
- **Levels**: ERROR, WARN, INFO, DEBUG
- **Aggregation**: ELK stack or Loki
- **Retention**: 90 days

### 7.2 Metrics

- **Application**: Response time, error rate, throughput
- **Database**: Query time, connections, locks
- **Infrastructure**: CPU, memory, disk I/O
- **Tool**: Prometheus + Grafana

### 7.3 Alerting

- **Channels**: Email, Slack, SMS
- **Triggers**: 
  - Error rate > 1%
  - Response time p95 > 1s
  - Database connections > 80%
  - Disk usage > 85%

### 7.4 Error Tracking

- **Service**: Sentry self-hosted
- **Features**: 
  - Source maps
  - User context
  - Release tracking
  - Performance monitoring

---

## 8. Backup & Recovery

### 8.1 Backup Strategy

- **Database**: Daily full backup + hourly WAL
- **Files**: Real-time sync to S3
- **Config**: Version controlled in Git
- **Retention**: 30 days daily, 12 months monthly

### 8.2 Recovery Procedures

- **RTO**: < 4 hours
- **RPO**: < 1 hour
- **DR Site**: Optional for enterprise
- **Testing**: Quarterly recovery drills

---

## 9. Integration Points

### 9.1 External Systems

```
┌─────────────────────────────────────────────────────────┐
│                  Internal System                        │
└─────────────────────────────────────────────────────────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│E-Invoice │  │   SMS    │  │ Payment  │  │  Zalo    │
│  API     │  │ Gateway  │  │ Gateway  │  │   OA     │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

### 9.2 API Design Principles

- RESTful conventions
- Versioned endpoints (`/api/v1/...`)
- Consistent response format
- Pagination for lists
- Filtering & sorting
- Rate limiting
- API documentation (OpenAPI/Swagger)

---

## 10. Technology Decisions Rationale

### Why Next.js over Separate Frontend/Backend?

1. **Simplified deployment**: Single codebase, single deployment
2. **Type safety**: End-to-end TypeScript
3. **Performance**: Server-side rendering, edge functions
4. **Developer experience**: Fast refresh, unified tooling
5. **Cost**: Reduced infrastructure complexity

### Why PostgreSQL?

1. **Reliability**: ACID compliance
2. **Features**: JSONB, full-text search, window functions
3. **Ecosystem**: Excellent Prisma support
4. **Scalability**: Read replicas, partitioning
5. **Vietnam context**: Widely used, easy to find expertise

### Why Prisma?

1. **Type safety**: Auto-generated types from schema
2. **Developer experience**: Intuitive API
3. **Migrations**: Built-in migration system
4. **Relations**: Easy handling of complex relations
5. **Performance**: Query optimization

### Why NextAuth.js?

1. **Security**: Battle-tested, regularly audited
2. **Flexibility**: Multiple providers, custom strategies
3. **Integration**: Seamless Next.js integration
4. **Features**: Sessions, JWT, callbacks
5. **Community**: Large community, good documentation
