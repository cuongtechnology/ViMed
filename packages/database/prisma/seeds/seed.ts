import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function upsertPermission(code: string, module: string, action: string, resource: string, name: string) {
  return prisma.permission.upsert({
    where: { code },
    update: { name, module, action, resource, status: "ACTIVE" },
    create: { code, name, module, action, resource, status: "ACTIVE" },
  });
}

async function main() {
  const adminPasswordHash = await hash("Admin@123", 12);

  const organization = await prisma.organization.upsert({
    where: { code: "VIETCARE" },
    update: {
      name: "Việt Care",
      status: "ACTIVE",
    },
    create: {
      code: "VIETCARE",
      name: "Việt Care",
      email: "admin@vietcare.vn",
      phone: "0900000000",
      status: "ACTIVE",
    },
  });

  const branch = await prisma.branch.upsert({
    where: {
      organizationId_code: {
        organizationId: organization.id,
        code: "HN01",
      },
    },
    update: {
      name: "Chi nhánh Hà Nội",
      status: "ACTIVE",
    },
    create: {
      organizationId: organization.id,
      code: "HN01",
      name: "Chi nhánh Hà Nội",
      address: "Hà Nội",
      status: "ACTIVE",
    },
  });

  const existingDepartment = await prisma.department.findFirst({
    where: { organizationId: organization.id, code: "OPS", deletedAt: null },
  });

  const department =
    existingDepartment ??
    (await prisma.department.create({
      data: {
        organizationId: organization.id,
        branchId: branch.id,
        code: "OPS",
        name: "Vận hành",
        status: "ACTIVE",
      },
    }));

  const role = await prisma.role.upsert({
    where: {
      organizationId_code: {
        organizationId: organization.id,
        code: "SUPER_ADMIN",
      },
    },
    update: {
      name: "Super Admin",
      status: "ACTIVE",
      isSystem: true,
    },
    create: {
      organizationId: organization.id,
      code: "SUPER_ADMIN",
      name: "Super Admin",
      description: "Full access role",
      status: "ACTIVE",
      isSystem: true,
    },
  });

  const permissions = await Promise.all([
    upsertPermission("ROLE_READ", "ORG", "READ", "ROLE", "Xem vai trò"),
    upsertPermission("USER_READ", "ORG", "READ", "USER", "Xem người dùng"),
    upsertPermission("USER_CREATE", "ORG", "CREATE", "USER", "Tạo người dùng"),
    upsertPermission("BRANCH_READ", "ORG", "READ", "BRANCH", "Xem chi nhánh"),
    upsertPermission("BRANCH_CREATE", "ORG", "CREATE", "BRANCH", "Tạo chi nhánh"),
    upsertPermission("DEPARTMENT_READ", "ORG", "READ", "DEPARTMENT", "Xem phòng ban"),
    upsertPermission("DEPARTMENT_CREATE", "ORG", "CREATE", "DEPARTMENT", "Tạo phòng ban"),
    upsertPermission("EMPLOYEE_READ", "HRM", "READ", "EMPLOYEE", "Xem nhân viên"),
    upsertPermission("EMPLOYEE_CREATE", "HRM", "CREATE", "EMPLOYEE", "Tạo nhân viên"),
    upsertPermission("APPOINTMENT_READ", "REC", "READ", "APPOINTMENT", "Xem lịch hẹn"),
    upsertPermission("APPOINTMENT_CREATE", "REC", "CREATE", "APPOINTMENT", "Tạo lịch hẹn"),
    upsertPermission("CASH_SESSION_READ", "FIN", "READ", "CASH_SESSION", "Xem ca thu ngân"),
    upsertPermission("CASH_SESSION_CREATE", "FIN", "CREATE", "CASH_SESSION", "Tạo ca thu ngân"),
  ]);

  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({
      roleId: role.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  const adminUser = await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId: organization.id,
        email: "admin@vietcare.vn",
      },
    },
    update: {
      passwordHash: adminPasswordHash,
      fullName: "Admin Việt Care",
      status: "ACTIVE",
      branchId: branch.id,
      departmentId: department.id,
    },
    create: {
      organizationId: organization.id,
      email: "admin@vietcare.vn",
      username: "admin",
      passwordHash: adminPasswordHash,
      firstName: "Admin",
      lastName: "Việt Care",
      fullName: "Admin Việt Care",
      status: "ACTIVE",
      branchId: branch.id,
      departmentId: department.id,
    },
  });

  await prisma.userRole.createMany({
    data: [
      {
        userId: adminUser.id,
        roleId: role.id,
        branchId: branch.id,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: {
      organizationId: organization.id,
      branchId: branch.id,
      departmentId: department.id,
      firstName: "Admin",
      lastName: "Việt Care",
      fullName: "Admin Việt Care",
      employeeCode: "EMP-ADMIN",
      joinDate: new Date("2024-01-01T00:00:00.000Z"),
      status: "ACTIVE",
    },
    create: {
      userId: adminUser.id,
      organizationId: organization.id,
      branchId: branch.id,
      departmentId: department.id,
      firstName: "Admin",
      lastName: "Việt Care",
      fullName: "Admin Việt Care",
      employeeCode: "EMP-ADMIN",
      joinDate: new Date("2024-01-01T00:00:00.000Z"),
      status: "ACTIVE",
    },
  });

  const customer = await prisma.customer.upsert({
    where: {
      organizationId_customerCode: {
        organizationId: organization.id,
        customerCode: "CUS-0001",
      },
    },
    update: {
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      status: "ACTIVE",
    },
    create: {
      organizationId: organization.id,
      customerCode: "CUS-0001",
      firstName: "A",
      lastName: "Nguyễn Văn",
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      status: "ACTIVE",
    },
  });

  await prisma.appointment.upsert({
    where: {
      organizationId_appointmentNo: {
        organizationId: organization.id,
        appointmentNo: "APT-0001",
      },
    },
    update: {
      branchId: branch.id,
      customerId: customer.id,
      appointmentDate: new Date(),
      startTime: "09:00",
      status: "SCHEDULED",
    },
    create: {
      organizationId: organization.id,
      branchId: branch.id,
      customerId: customer.id,
      appointmentNo: "APT-0001",
      appointmentDate: new Date(),
      startTime: "09:00",
      status: "SCHEDULED",
    },
  });

  const cashSession = await prisma.cashSession.upsert({
    where: {
      branchId_sessionNo: {
        branchId: branch.id,
        sessionNo: "CS-0001",
      },
    },
    update: {
      cashierId: adminUser.id,
      openTime: new Date(),
      status: "OPEN",
    },
    create: {
      branchId: branch.id,
      cashierId: adminUser.id,
      sessionNo: "CS-0001",
      openTime: new Date(),
      openingBalance: 500000,
      status: "OPEN",
    },
  });

  await prisma.invoice.upsert({
    where: {
      organizationId_invoiceNo: {
        organizationId: organization.id,
        invoiceNo: "INV-0001",
      },
    },
    update: {
      branchId: branch.id,
      cashSessionId: cashSession.id,
      customerId: customer.id,
      issueDate: new Date(),
      subtotal: 500000,
      totalAmount: 500000,
      paidAmount: 500000,
      balance: 0,
      status: "PAID",
      paymentStatus: "PAID",
      items: [{ name: "Khám tổng quát", quantity: 1, unitPrice: 500000 }],
    },
    create: {
      organizationId: organization.id,
      branchId: branch.id,
      cashSessionId: cashSession.id,
      customerId: customer.id,
      invoiceNo: "INV-0001",
      issueDate: new Date(),
      subtotal: 500000,
      totalAmount: 500000,
      paidAmount: 500000,
      balance: 0,
      status: "PAID",
      paymentStatus: "PAID",
      items: [{ name: "Khám tổng quát", quantity: 1, unitPrice: 500000 }],
    },
  });

  await prisma.internalTicket.upsert({
    where: {
      organizationId_ticketNo: {
        organizationId: organization.id,
        ticketNo: "TKT-0001",
      },
    },
    update: {
      title: "Kiểm tra máy in quầy lễ tân",
      type: "IT",
      status: "OPEN",
    },
    create: {
      organizationId: organization.id,
      ticketNo: "TKT-0001",
      title: "Kiểm tra máy in quầy lễ tân",
      type: "IT",
      status: "OPEN",
    },
  });

  console.log("✅ Seed completed");
  console.log("Admin account: admin@vietcare.vn / Admin@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
