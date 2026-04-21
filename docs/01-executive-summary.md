# Executive Summary

## Clinic/Hospital Internal Management System - Vietnam Edition

### Tầm nhìn sản phẩm
Hệ thống quản trị nội bộ toàn diện dành cho phòng khám và bệnh viện đa khoa tại Việt Nam, tập trung vào vận hành hành chính và quản lý doanh nghiệp mà không can thiệp vào chuyên môn y tế.

### Giá trị cốt lõi
- **Tập trung vận hành**: Quản lý nhân sự, ca làm, lịch trực, kho vật tư, mua sắm, tài sản, thu ngân hành chính
- **Phù hợp Việt Nam**: Ngôn ngữ, định dạng, quy trình nghiệp vụ đặc thù
- **Multi-branch**: Hỗ trợ chuỗi phòng khám nhiều chi nhánh
- **Bảo mật & Audit**: Theo dõi đầy đủ mọi hoạt động nhạy cảm
- **Dễ triển khai**: Có thể deploy on-premise hoặc cloud

### Phạm vi hệ thống
✅ **Bao gồm**:
- Quản trị tổ chức (công ty, chi nhánh, phòng ban)
- Nhân sự nội bộ (hồ sơ, hợp đồng, ca làm, chấm công)
- Lễ tân / Tiếp nhận (đặt lịch, check-in, hàng chờ)
- CRM / Chăm sóc khách hàng
- Dịch vụ & Bảng giá hành chính
- Thu ngân / Tài chính hành chính
- Kho vật tư / Tiêu hao
- Mua sắm / Procurement
- Tài sản / Thiết bị
- Công việc nội bộ / Workflow
- Báo cáo / Dashboard

❌ **Loại trừ**:
- Hồ sơ bệnh án điện tử
- Kê đơn, chỉ định, chẩn đoán
- Cận lâm sàng, PACS, LIS
- ICD, phác đồ điều trị
- Bảo hiểm y tế chuyên môn

### Stack công nghệ
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes (App Router)
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **State**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Deployment**: Docker + Docker Compose

### Đối tượng sử dụng
- Super Admin / System Admin
- Ban giám đốc / Quản lý vận hành
- Nhân sự / Kế toán / Thu ngân
- Lễ tân / Tiếp nhận
- Chăm sóc khách hàng
- Quản lý kho / Mua sắm / Thiết bị
- Trưởng bộ phận / Nhân viên nội bộ

### Mục tiêu MVP
Sau 8-10 tuần phát triển:
- Đăng nhập phân quyền đầy đủ
- Quản lý chi nhánh/phòng ban/người dùng
- Hồ sơ nhân viên cơ bản
- Đặt lịch hẹn và check-in
- Thu ngân hành chính
- Quản lý kho vật tư cơ bản
- Dashboard tổng quan
- Audit log đầy đủ

### Chỉ số thành công
- Thời gian triển khai < 2 tuần cho 1 chi nhánh mới
- Giảm 50% thời gian đối soát cuối ngày
- Cảnh báo tồn kho chính xác 95%+
- 100% giao dịch nhạy cảm được audit
- Hỗ trợ 300-1000 người dùng nội bộ
- 50-200 concurrent users
