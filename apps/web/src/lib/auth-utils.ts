import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type UserRoleWithPermissions = {
  role: {
    code: string;
    rolePermissions: Array<{
      permission: {
        code: string;
      };
    }>;
  };
};

export function collectPermissions(roles: UserRoleWithPermissions[]): string[] {
  return Array.from(
    new Set(
      roles.flatMap((userRole) =>
        userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.code),
      ),
    ),
  );
}

export function parseCredentials(credentials: unknown) {
  return credentialsSchema.safeParse(credentials);
}
