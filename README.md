# 🏥 Clinic/Hospital Management System - Việt Care

Hệ thống quản lý phòng khám/bệnh viện đa khoa dành cho thị trường Việt Nam.

## 📌 Trạng thái triển khai thực tế

> Tài liệu kiến trúc/PRD hiện mô tả tầm nhìn đầy đủ. Trạng thái code hiện tại đang ở mức nền tảng MVP.

Đã triển khai:
- Đăng nhập Credentials với NextAuth (JWT) + Prisma
- Dashboard cơ bản và lấy số liệu thật từ API
- Bộ API MVP mức tối thiểu (`/api/v1`) cho: roles, users, branches, departments, employees, appointments, cashier sessions
- Seed dữ liệu cơ bản để chạy demo local
- CI cơ bản: lint + build + test
- Layout dùng `font-sans` thay cho Google Fonts để tránh lỗi build trong môi trường CI/dev bị chặn truy cập internet

Đang ưu tiên tiếp theo:
- Hoàn thiện CRUD đầy đủ theo module (detail/update/delete + filter/sort)
- Chuẩn hóa RBAC theo ma trận quyền chi tiết
- Mở rộng test cho API routes và các luồng nghiệp vụ chính

## 🚀 Tính năng chính

### Module Quản lý
- **Tổ chức & Chi nhánh**: Quản lý multi-branch
- **Nhân sự**: Nhân viên, chấm công, nghỉ phép
- **Khách hàng**: Hồ sơ bệnh án điện tử (EMR)
- **Lịch hẹn & Hàng chờ**: Đặt lịch, queue management
- **Dịch vụ & Bảng giá**: Catalog dịch vụ, pricing tiers
- **Thu ngân**: Thanh toán, hóa đơn điện tử
- **Kho & Vật tư**: Inventory, stock tracking
- **Mua sắm**: Purchase requests, orders, suppliers
- **Tài sản**: Asset tracking, maintenance
- **Ticket nội bộ**: IT support, maintenance requests
- **Báo cáo**: Analytics dashboard

### Vai trò người dùng (14 roles)
- Super Admin, System Admin
- Giám đốc chi nhánh, Quản lý vận hành
- Trưởng phòng nhân sự, Nhân viên nhân sự
- Kế toán, Thu ngân, Lễ tân
- Thủ kho, Nhân viên mua hàng
- Quản lý tài sản, CSKH, Trưởng bộ phận

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL 16, Prisma ORM
- **Auth**: NextAuth.js v5 (JWT, Credentials)
- **UI**: Tailwind CSS, shadcn/ui components
- **State**: React Query, Zustand
- **Monorepo**: Turborepo, pnpm workspaces

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18
- pnpm >= 9
- Docker & Docker Compose (cho development)

### 1. Clone và cài đặt dependencies

```bash
# Install pnpm nếu chưa có
npm install -g pnpm

# Cài đặt dependencies
pnpm install
```

### 2. Chạy infrastructure với Docker

```bash
docker-compose up -d
```

Sẽ khởi động:
- PostgreSQL (port 5432)
- Redis (port 6379)
- MinIO S3 (port 9000, console 9001)

### 3. Cấu hình environment

```bash
cp .env.example .env
```

Mặc định đã cấu hình sẵn cho local development.

### 4. Setup database

```bash
# Generate Prisma client
pnpm db:generate

# Chạy migrations
pnpm db:migrate

# Seed dữ liệu mẫu
pnpm db:seed
```

### 5. Chạy development server

```bash
pnpm dev
```

Truy cập: http://localhost:3000

## 🔐 Đăng nhập

Tài khoản admin mặc định:
- **Email**: `admin@vietcare.vn`
- **Password**: `Admin@123`

## 📊 Dữ liệu mẫu

Sau khi seed, hệ thống sẽ có:
- 1 Organization (Việt Care)
- 3 Branches (HN, HCM, ĐN)
- 17 Departments
- 14 Positions
- 15 Roles với 60+ permissions
- 11 Users
- 2000 Customers
- 32 Services
- 30 Inventory items
- 15 Assets
- 300 Appointments
- 100 Internal tickets

## 📁 Cấu trúc project

```
/workspace
├── apps/
│   └── web/                    # Next.js application
├── packages/
│   ├── database/               # Prisma schema & client
│   └── ui/                     # Shared UI components
├── docs/                       # Documentation
│   ├── 01-executive-summary.md
│   ├── 02-prd.md
│   ├── 03-architecture.md
│   └── 04-database-schema.md
├── docker-compose.yml
├── package.json
├── turbo.json
└── README.md
```

## 📝 Commands

```bash
pnpm dev          # Chạy development server
pnpm build        # Build production
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm test         # Run unit tests

pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed sample data
pnpm db:studio    # Open Prisma Studio
```

## 📄 License

MIT License

---

**Phát triển bởi**: Việt Care Team  
**Version**: 1.0.0 MVP
