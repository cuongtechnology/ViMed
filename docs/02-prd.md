# Product Requirements Document (PRD)

## Clinic/Hospital Internal Management System - Vietnam Edition

**Version**: 1.0  
**Date**: 2024  
**Status**: Draft

---

## 1. Giới thiệu sản phẩm

### 1.1 Mục đích
Xây dựng hệ thống quản trị nội bộ cho phòng khám/bệnh viện đa khoa tại Việt Nam, tập trung vào vận hành hành chính và quản lý doanh nghiệp.

### 1.2 Phạm vi
- **IN SCOPE**: Quản trị tổ chức, nhân sự, lễ tân, CRM, thu ngân, kho, mua sắm, tài sản, workflow nội bộ, báo cáo
- **OUT OF SCOPE**: Hồ sơ bệnh án, kê đơn, chẩn đoán, cận lâm sàng, bảo hiểm y tế chuyên môn

### 1.3 Đối tượng sử dụng
| Vai trò | Mô tả | Số lượng ước tính |
|---------|-------|-------------------|
| Super Admin | Quản trị toàn hệ thống | 1-3 |
| Branch Director | Giám đốc chi nhánh | 1-5 |
| Operations Manager | Quản lý vận hành | 1-10 |
| HR Manager | Quản lý nhân sự | 1-5 |
| Receptionist | Lễ tân tiếp nhận | 5-50 |
| Cashier | Thu ngân | 5-30 |
| Accountant | Kế toán | 2-10 |
| Warehouse Manager | Quản lý kho | 1-10 |
| Procurement Officer | Nhân viên mua sắm | 1-10 |
| Asset Manager | Quản lý thiết bị | 1-5 |
| Customer Service | Chăm sóc khách hàng | 5-30 |
| Department Head | Trưởng bộ phận | 5-30 |
| Staff | Nhân viên nội bộ | 50-500 |

---

## 2. Yêu cầu chức năng

### 2.1 Quản trị tổ chức (ORG)

#### ORG-001: Quản lý công ty/tập đoàn
- **Mô tả**: Tạo và quản lý thông tin công ty mẹ
- **Fields**: Tên công ty, mã số thuế, địa chỉ, điện thoại, email, logo, người đại diện
- **Permissions**: Super Admin only

#### ORG-002: Quản lý chi nhánh
- **Mô tả**: Tạo và quản lý nhiều chi nhánh/cơ sở
- **Fields**: Tên chi nhánh, mã chi nhánh, địa chỉ, điện thoại, email, giờ làm việc, trạng thái
- **Rules**: 
  - Mã chi nhánh phải duy nhất
  - 1 công ty có nhiều chi nhánh
  - Hỗ trợ inactive/active

#### ORG-003: Quản lý phòng ban
- **Mô tả**: Tổ chức cơ cấu phòng ban trong chi nhánh
- **Fields**: Tên phòng ban, mã phòng ban, chi nhánh thuộc về, trưởng bộ phận, mô tả
- **Rules**: 
  - Cấu trúc cây (parent-child)
  - 1 chi nhánh có nhiều phòng ban

#### ORG-004: Quản lý chức danh
- **Mô tả**: Định nghĩa các vị trí/chức danh trong tổ chức
- **Fields**: Tên chức danh, mã chức danh, cấp bậc, mô tả công việc
- **Rules**: Áp dụng chung cho toàn hệ thống

#### ORG-005: Quản lý người dùng
- **Mô tả**: Tạo và quản lý tài khoản đăng nhập
- **Fields**: Username, email, password hash, chi nhánh, phòng ban, vai trò, trạng thái
- **Rules**:
  - Email phải duy nhất
  - Hỗ trợ multi-role
  - MFA cho admin

#### ORG-006: Quản lý nhóm quyền
- **Mô tả**: Định nghĩa roles và permissions
- **Fields**: Tên role, mô tả, danh sách permissions
- **Permissions**: CRUD trên từng module, approve, export, view_sensitive

### 2.2 Nhân sự nội bộ (HRM)

#### HRM-001: Hồ sơ nhân viên
- **Mô tả**: Lưu trữ thông tin nhân viên
- **Fields**: 
  - Thông tin cá nhân: Họ tên, ngày sinh, giới tính, CCCD/CMND, quê quán
  - Liên hệ: Địa chỉ, điện thoại, email
  - Công việc: Chi nhánh, phòng ban, chức danh, ngày vào làm
  - Học vấn: Trình độ, trường, chuyên ngành
  - Giấy tờ: Upload bằng cấp, chứng chỉ
- **Rules**: 
  - 1 user có thể linked với 1 employee
  - Hỗ trợ soft delete

#### HRM-002: Hợp đồng lao động
- **Mô tả**: Quản lý hợp đồng lao động
- **Fields**: Loại hợp đồng (chính thức, thử việc, thời vụ, CTV), ngày bắt đầu, ngày kết thúc, mức lương, ghi chú
- **Rules**:
  - 1 nhân viên có nhiều hợp đồng theo thời gian
  - Cảnh báo trước 30 ngày hết hạn

#### HRM-003: Ca làm việc
- **Mô tả**: Định nghĩa các ca làm việc
- **Fields**: Tên ca, giờ bắt đầu, giờ kết thúc, ngày áp dụng, chi nhánh
- **Types**: 
  - Hành chính: 8:00-17:00
  - Sáng: 7:00-12:00
  - Chiều: 13:00-17:00
  - Tối: 17:00-21:00
  - Đêm: 21:00-7:00
  - Trực 24h

#### HRM-004: Lịch làm việc
- **Mô tả**: Phân công lịch làm cho nhân viên
- **Fields**: Nhân viên, ca làm, ngày làm, chi nhánh, ghi chú
- **Rules**:
  - Xem theo tuần/tháng
  - Kéo thả để phân ca
  - Import từ Excel

#### HRM-005: Chấm công
- **Mô tả**: Ghi nhận chấm công ra/vào
- **Fields**: Nhân viên, thời gian check-in, check-out, loại (normal, overtime, leave), ghi chú
- **Integration**: Có thể tích hợp máy chấm công ngoài

#### HRM-006: Nghỉ phép
- **Mô tả**: Quy trình xin nghỉ phép
- **Fields**: Loại nghỉ (phép năm, ốm, việc riêng, không lương), ngày bắt đầu, ngày kết thúc, lý do, người phê duyệt, trạng thái
- **Workflow**: Submit → Manager approve → HR confirm

#### HRM-007: Tăng ca / Đổi ca
- **Mô tả**: Đăng ký tăng ca hoặc đổi ca
- **Fields**: Loại yêu cầu, nhân viên, ngày giờ, lý do, người phê duyệt, trạng thái

#### HRM-008: Đánh giá KPI
- **Mô tả**: Đánh giá hiệu suất định kỳ
- **Fields**: Chu kỳ đánh giá, tiêu chí, điểm số, nhận xét, người đánh giá

### 2.3 Lễ tân / Tiếp nhận (REC)

#### REC-001: Hồ sơ khách hàng
- **Mô tả**: Tạo hồ sơ hành chính cho người đến khám
- **Fields**:
  - Thông tin cá nhân: Họ tên, ngày sinh, giới tính, CCCD (optional)
  - Liên hệ: Điện thoại, email, địa chỉ
  - Ghi chú hành chính: Ngôn ngữ ưu tiên, lưu ý đặc biệt
- **Rules**:
  - Tìm kiếm không dấu
  - Merge duplicate customers
  - Không lưu thông tin bệnh án

#### REC-002: Đặt lịch hẹn
- **Mô tả**: Đặt lịch hẹn trước cho khách
- **Fields**: 
  - Khách hàng, chi nhánh, dịch vụ quan tâm
  - Ngày giờ hẹn, quầy/khu vực
  - Nguồn đặt (phone, walk-in, website, Zalo)
  - Trạng thái (confirmed, cancelled, no-show, completed)
  - Ghi chú
- **Rules**:
  - Check conflict lịch
  - Gửi reminder (SMS/Zalo nếu tích hợp)
  - Tỷ lệ no-show tracking

#### REC-003: Check-in
- **Mô tả**: Ghi nhận khách đến
- **Flow**: 
  1. Tìm khách theo SĐT/tên
  2. Chọn dịch vụ cần làm
  3. In phiếu số thứ tự
  4. Cập nhật trạng thái appointment

#### REC-004: Hàng chờ / Queue
- **Mô tả**: Quản lý số thứ tự và hàng chờ
- **Fields**: Số thứ tự, khách hàng, dịch vụ, quầy, thời gian lấy số, thời gian gọi, trạng thái
- **Display**: Màn hình hiển thị số gọi (tích hợp TV display)

#### REC-005: Phiếu tiếp nhận
- **Mô tả**: In phiếu tiếp nhận hành chính
- **Template**: Logo, thông tin khách, dịch vụ, ngày giờ, mã phiếu

### 2.4 CRM / Chăm sóc khách hàng (CRM)

#### CRM-001: Quản lý Lead
- **Mô tả**: Theo dõi khách hàng tiềm năng
- **Fields**: Nguồn lead, thông tin liên hệ, nhu cầu, trạng thái, người phụ trách
- **Sources**: Website, Facebook, Zalo, Phone, Walk-in, Referral

#### CRM-002: Lịch sử liên hệ
- **Mô tả**: Ghi chép lịch sử tương tác
- **Fields**: Loại liên hệ (call, SMS, email, meeting), nội dung, thời gian, người thực hiện, kết quả

#### CRM-003: Nhắc việc
- **Mô tả**: Reminder gọi lại/follow-up
- **Fields**: Khách hàng, loại nhắc, thời gian nhắc, nội dung, đã hoàn thành

#### CRM-004: Khiếu nại / Ticket
- **Mô tả**: Tiếp nhận và xử lý khiếu nại
- **Fields**: 
  - Khách hàng, loại khiếu nại, mức độ nghiêm trọng
  - Nội dung, người tiếp nhận, người xử lý
  - SLA deadline, trạng thái, phản hồi
- **Workflow**: Receive → Assign → Resolve → Close

#### CRM-005: CSKH sau dịch vụ
- **Mô tả**: Follow-up sau khi sử dụng dịch vụ
- **Triggers**: Tự động tạo task sau appointment completed
- **Templates**: Kịch bản gọi/email theo loại dịch vụ

#### CRM-006: Dashboard nguồn khách
- **Mô tả**: Báo cáo hiệu quả các kênh marketing
- **Metrics**: Lead by source, conversion rate, cost per acquisition

### 2.5 Dịch vụ & Bảng giá (SVC)

#### SVC-001: Danh mục dịch vụ
- **Mô tả**: Quản lý danh sách dịch vụ cung cấp
- **Fields**: 
  - Mã dịch vụ, tên dịch vụ, mô tả
  - Nhóm dịch vụ, đơn vị tính
  - Thời gian thực hiện ước tính
  - Trạng thái (active/inactive)
- **Categories**: Khám, Xét nghiệm, Chẩn đoán hình ảnh, Thủ thuật, Tiêm chủng, v.v.

#### SVC-002: Nhóm dịch vụ
- **Mô tả**: Phân loại dịch vụ theo nhóm
- **Structure**: Cây phân cấp (parent-child)

#### SVC-003: Bảng giá
- **Mô tả**: Định nghĩa bảng giá theo chi nhánh
- **Fields**: 
  - Tên bảng giá, chi nhánh áp dụng
  - Ngày hiệu lực, ngày hết hạn
  - Trạng thái (draft/published/archived)
- **Rules**: 
  - 1 chi nhánh có thể có nhiều bảng giá
  - Chỉ 1 bảng giá active tại 1 thời điểm

#### SVC-004: Giá dịch vụ
- **Mô tả**: Giá cụ thể cho từng dịch vụ
- **Fields**: Dịch vụ, giá gốc, giá khuyến mãi (nếu có), ghi chú
- **Rules**: Giá tính theo VND

#### SVC-005: Khuyến mãi / Combo
- **Mô tả**: Chính sách giá đặc biệt
- **Types**: 
  - Giảm % hoặc số tiền cố định
  - Combo nhiều dịch vụ
  - Voucher code
  - Giá theo đối tượng (member, employee, corporate)

### 2.6 Thu ngân / Tài chính (FIN)

#### FIN-001: Ca thu ngân
- **Mô tả**: Mở ca làm việc cho thu ngân
- **Fields**: 
  - Nhân viên, chi nhánh, quầy
  - Thời gian mở ca, tiền quỹ đầu ca
  - Thời gian đóng ca, tiền quỹ cuối ca
  - Trạng thái (open/closed)

#### FIN-002: Lập phiếu thu
- **Mô tả**: Ghi nhận thanh toán của khách
- **Fields**:
  - Mã phiếu, khách hàng, chi nhánh
  - Danh sách dịch vụ/sản phẩm
  - Tổng tiền, giảm giá, VAT (nếu có)
  - Phương thức thanh toán (cash, transfer, QR, card)
  - Ghi chú
- **Rules**:
  - Self-incrementing invoice number
  - Cannot edit after finalized
  - Audit log đầy đủ

#### FIN-003: Hoàn tiền / Điều chỉnh
- **Mô tả**: Xử lý hoàn tiền hoặc điều chỉnh hóa đơn
- **Fields**: Hóa đơn gốc, lý do, số tiền hoàn, người phê duyệt
- **Workflow**: Request → Manager approve → Process

#### FIN-004: Công nợ
- **Mô tả**: Quản lý công nợ khách hàng (nếu có)
- **Fields**: Khách hàng, số nợ, hạn thanh toán, lịch sử trả nợ

#### FIN-005: Đối soát cuối ca
- **Mô tả**: Tổng kết ca thu ngân
- **Fields**: 
  - Tổng tiền thu theo phương thức
  - Tiền chênh lệch (so với system)
  - Ghi chú, người kiểm tra
- **Output**: Báo cáo đối soát in được

#### FIN-006: Xuất chứng từ
- **Mô tả**: In hóa đơn/biên nhận
- **Formats**: PDF, thermal printer
- **Integration**: Sẵn sàng kết nối hóa đơn điện tử

### 2.7 Kho vật tư (INV)

#### INV-001: Danh mục hàng hóa
- **Mô tả**: Quản lý vật tư, tiêu hao
- **Fields**:
  - Mã hàng, tên hàng, mô tả
  - Nhóm hàng, đơn vị tính
  - Tồn tối thiểu, tồn tối đa
  - Đơn giá tham khảo
  - Hạn dùng (nếu có)
- **Types**: Vật tư tiêu hao, Dụng cụ, Văn phòng phẩm

#### INV-002: Quản lý kho
- **Mô tả**: Định nghĩa các kho
- **Fields**: Tên kho, mã kho, chi nhánh, địa chỉ, người phụ trách
- **Rules**: 1 chi nhánh có nhiều kho

#### INV-003: Nhập kho
- **Mô tả**: Ghi nhận nhập hàng
- **Fields**: 
  - Phiếu nhập, kho nhập, nhà cung cấp
  - Danh sách hàng: mã, số lượng, đơn giá, thành tiền
  - Số lô, hạn dùng (nếu có)
  - Người nhập, thời gian
- **Source**: Mua hàng, điều chuyển, kiểm kê tăng

#### INV-004: Xuất kho
- **Mô tả**: Ghi nhận xuất hàng
- **Fields**: 
  - Phiếu xuất, kho xuất, mục đích
  - Danh sách hàng: mã, số lượng
  - Người nhận, bộ phận nhận
  - Người xuất, thời gian
- **Purposes**: Cấp phát nội bộ, bán hàng, điều chuyển, hỏng/mất

#### INV-005: Điều chuyển kho
- **Mô tả**: Chuyển hàng giữa các kho
- **Fields**: Kho đi, kho đến, danh sách hàng, người yêu cầu, người duyệt

#### INV-006: Kiểm kê
- **Mô tả**: Kiểm kê định kỳ
- **Fields**: 
  - Đợt kiểm kê, kho, thời gian
  - Thực tế vs Sổ sách
  - Chênh lệch, điều chỉnh
  - Người kiểm kê, người duyệt

#### INV-007: Cảnh báo tồn
- **Mô tả**: Alert khi tồn dưới mức tối thiểu
- **Triggers**: Real-time khi xuất/nhập
- **Notifications**: In-app, email

### 2.8 Mua sắm (PROC)

#### PROC-001: Đề nghị mua hàng
- **Mô tả**: Nhân viên đề nghị mua vật tư
- **Fields**: 
  - Người đề nghị, bộ phận, chi nhánh
  - Danh sách hàng cần mua: tên, số lượng, mô tả, lý do
  - Ngày cần hàng, ghi chú
  - Trạng thái (draft/submitted/approved/rejected)

#### PROC-002: Phê duyệt mua hàng
- **Mô tả**: Workflow phê duyệt nhiều cấp
- **Levels**:
  - Level 1: Trưởng bộ phận (< 5 triệu)
  - Level 2: Quản lý chi nhánh (< 20 triệu)
  - Level 3: Giám đốc vùng (> 20 triệu)
- **Fields**: Cấp phê duyệt, người duyệt, quyết định, ghi chú

#### PROC-003: Yêu cầu báo giá
- **Mô tả**: Gửi RFQ cho nhà cung cấp
- **Fields**: Danh sách hàng, NCC nhận RFQ, deadline trả lời

#### PROC-004: So sánh báo giá
- **Mô tả**: Tổng hợp và so sánh báo giá từ NCC
- **Fields**: NCC, đơn giá, thời gian giao, điều khoản thanh toán, ghi chú
- **Output**: Bảng so sánh, đề xuất chọn NCC

#### PROC-005: Đơn mua hàng (PO)
- **Mô tả**: Tạo PO gửi NCC
- **Fields**: 
  - Mã PO, NCC, chi nhánh
  - Danh sách hàng: số lượng, đơn giá, thành tiền
  - Ngày giao hàng, địa chỉ giao
  - Điều khoản thanh toán
  - Trạng thái (sent/confirmed/partially received/completed/cancelled)

#### PROC-006: Theo dõi NCC
- **Mô tả**: Quản lý thông tin nhà cung cấp
- **Fields**: Tên NCC, mã số thuế, địa chỉ,联系人, điện thoại, email, hạng mục cung cấp, đánh giá

### 2.9 Tài sản / Thiết bị (AST)

#### AST-001: Danh mục tài sản
- **Mô tả**: Quản lý tài sản cố định
- **Fields**:
  - Mã tài sản, tên tài sản, mô tả
  - Serial, model, manufacturer
  - Loại tài sản, nhóm tài sản
  - Nguyên giá, ngày mua, NCC
  - Chi nhánh, bộ phận, vị trí
  - Trạng thái (available/in_use/maintenance/disposed)

#### AST-002: Phân bổ tài sản
- **Mô tả**: Gán tài sản cho nhân sự/bộ phận
- **Fields**: Tài sản, người giữ, bộ phận, ngày bàn giao, biên bản bàn giao
- **History**: Theo dõi lịch sử chuyển giao

#### AST-003: Bảo hành
- **Mô tả**: Theo dõi thông tin bảo hành
- **Fields**: 
  - Tài sản, NCC bảo hành
  - Ngày bắt đầu, ngày kết thúc
  - Điều kiện bảo hành, liên hệ
- **Alerts**: Cảnh báo trước 30 ngày hết bảo hành

#### AST-004: Bảo trì
- **Mô tả**: Kế hoạch bảo trì định kỳ
- **Fields**:
  - Tài sản, loại bảo trì (định kỳ/đột xuất)
  - Ngày dự kiến, tần suất
  - Nhà cung cấp dịch vụ
  - Chi phí ước tính
  - Trạng thái

#### AST-005: Nhật ký sửa chữa
- **Mô tả**: Ghi chép lịch sử sửa chữa
- **Fields**: 
  - Tài sản, ngày sửa, mô tả sự cố
  - Biện pháp xử lý, chi phí
  - Người/nhà cung cấp thực hiện
  - Kết quả

### 2.10 Công việc nội bộ (TSK)

#### TSK-001: Giao việc
- **Mô tả**: Phân công công việc
- **Fields**: 
  - Tiêu đề, mô tả, độ ưu tiên
  - Người giao, người nhận
  - Deadline, trạng thái
  - Checklist con (optional)

#### TSK-002: Ticket nội bộ
- **Mô tả**: Tạo ticket giữa các phòng ban
- **Fields**:
  - Loại ticket (IT, HR, Admin, Maintenance)
  - Người tạo, bộ phận xử lý
  - Tiêu đề, mô tả, đính kèm
  - SLA, độ ưu tiên
  - Trạng thái (open/in_progress/resolved/closed)

#### TSK-003: Comment / Attachments
- **Mô tả**: Thảo luận và đính kèm file
- **Features**: 
  - Comment thread
  - Upload files (PDF, images, docs)
  - Mention users

#### TSK-004: Phê duyệt đề xuất
- **Mô tả**: Workflow phê duyệt nội bộ
- **Types**: Đề xuất mua, đề xuất nghỉ, đề xuất chi, v.v.
- **Flow**: Configurable approval chain

#### TSK-005: Thông báo nội bộ
- **Mô tả**: Gửi announcement
- **Fields**: Tiêu đề, nội dung, phạm vi gửi (toàn cty/chi nhánh/phòng ban)
- **Delivery**: In-app notification, email optional

### 2.11 Báo cáo / Dashboard (RPT)

#### RPT-001: Dashboard tổng quan
- **Roles**: Khác nhau theo vai trò
- **Widgets**:
  - KPIs chính (doanh thu, số khách, tồn kho, tickets)
  - Charts (xu hướng, so sánh)
  - Alerts & notifications
  - Quick actions

#### RPT-002: Báo cáo doanh thu
- **Filters**: Thời gian, chi nhánh, dịch vụ, nguồn khách
- **Metrics**: 
  - Tổng doanh thu
  - Theo ngày/tuần/tháng
  - Theo chi nhánh
  - Theo dịch vụ
  - Theo phương thức thanh toán
- **Export**: Excel, PDF

#### RPT-003: Báo cáo khách hàng
- **Metrics**:
  - Số lượng khách mới/cũ
  - Lượt hẹn, tỷ lệ no-show
  - Nguồn khách hiệu quả
  - Top khách hàng

#### RPT-004: Báo cáo nhân sự
- **Metrics**:
  - Số lượng theo phòng ban
  - Chấm công, nghỉ phép
  - Hiệu suất làm việc

#### RPT-005: Báo cáo kho
- **Metrics**:
  - Tồn kho hiện tại
  - Vật tư sắp hết
  - Nhập/xuất theo thời gian
  - Giá trị tồn kho

#### RPT-006: Báo cáo mua sắm
- **Metrics**:
  - Chi tiêu theo NCC
  - Thời gian xử lý PO
  - Tỷ lệ giao hàng đúng hạn

#### RPT-007: Báo cáo tài sản
- **Metrics**:
  - Tài sản theo chi nhánh
  - Sắp hết bảo hành
  - Lịch sử bảo trì
  - Tỷ lệ sẵn sàng

#### RPT-008: Audit Log
- **Mô tả**: Nhật ký hoạt động hệ thống
- **Fields**: User, action, entity, timestamp, IP, details
- **Filters**: Time range, user, action type, entity

---

## 3. Yêu cầu phi chức năng

### 3.1 Hiệu năng
- **Response time**: < 500ms cho 95% requests
- **Page load**: < 3s cho trang dashboard
- **Concurrent users**: Hỗ trợ 50-200 concurrent
- **Data volume**: Xử lý tốt với 100K+ records/table

### 3.2 Bảo mật
- **Authentication**: JWT + refresh token, MFA cho admin
- **Authorization**: RBAC chi tiết
- **Data encryption**: TLS in transit, AES-256 at rest
- **Audit logging**: 100% sensitive actions logged
- **Session management**: Timeout, device tracking
- **Password policy**: Min 8 chars, complexity required

### 3.3 Khả dụng
- **Uptime**: 99.5% (business hours)
- **Backup**: Daily automated backup
- **Recovery**: RTO < 4h, RPO < 1h
- **Monitoring**: Real-time alerts

### 3.4 Khả năng mở rộng
- **Multi-branch**: Dễ thêm chi nhánh mới
- **Modular**: Thêm module không ảnh hưởng现有
- **API-first**: Sẵn sàng tích hợp bên thứ 3

### 3.5 UX/UI
- **Language**: Tiếng Việt mặc định
- **Responsive**: Desktop + tablet + mobile
- **Accessibility**: WCAG 2.1 AA compliant
- **Dark mode**: Optional

---

## 4. Ràng buộc kỹ thuật

### 4.1 Stack
- Frontend: Next.js 14+, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: PostgreSQL 16+
- ORM: Prisma
- Auth: NextAuth.js v5
- Hosting: Docker-compatible

### 4.2 Localization
- **Timezone**: Asia/Ho_Chi_Minh (UTC+7)
- **Date format**: dd/MM/yyyy
- **Time format**: 24h (HH:mm)
- **Currency**: VND (₫), format: 1.000.000 ₫
- **Phone**: +84 format
- **Address**: Tỉnh/Thành - Quận/Huyện - Phường/Xã

### 4.3 Compliance
- **Data privacy**: Tuân thủ Luật An ninh mạng VN
- **Consent**: Ghi nhận consent xử lý dữ liệu cá nhân
- **Retention**: Chính sách lưu trữ dữ liệu

---

## 5. Tiêu chí chấp nhận

### 5.1 MVP (Phase 1)
- [ ] Đăng nhập/phân quyền hoạt động
- [ ] CRUD chi nhánh/phòng ban/người dùng
- [ ] Hồ sơ nhân viên cơ bản
- [ ] Đặt lịch hẹn + check-in
- [ ] Phiếu thu + đối soát ca
- [ ] Kho: nhập/xuất/cảnh báo tồn
- [ ] Dashboard cơ bản
- [ ] Audit log

### 5.2 Phase 2
- [ ] CRM đầy đủ
- [ ] Mua sắm workflow
- [ ] Tài sản + bảo trì
- [ ] Ticket nội bộ
- [ ] Báo cáo nâng cao
- [ ] Export Excel/PDF

### 5.3 Phase 3
- [ ] Mobile app (optional)
- [ ] Advanced analytics
- [ ] Integration partners (e-invoice, SMS, payment)
- [ ] Multi-language EN/VN
- [ ] Advanced workflow engine

---

## 6. Phụ lục

### 6.1 Glossary
- **Chi nhánh**: Branch/Facility
- **Phòng ban**: Department
- **Lễ tân**: Receptionist
- **Thu ngân**: Cashier
- **Vật tư tiêu hao**: Consumables
- **No-show**: Khách hẹn không đến

### 6.2 Tham chiếu
- Luật Khám chữa bệnh Việt Nam
- Thông tư về lưu trữ hồ sơ y tế
- Chuẩn bảo mật OWASP Top 10
