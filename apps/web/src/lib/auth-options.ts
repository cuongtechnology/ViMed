import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@clinic/database";
import { collectPermissions, parseCredentials } from "./auth-utils";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const parsed = parseCredentials(credentials);
        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message ?? "Thông tin đăng nhập không hợp lệ");
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findFirst({
          where: { email, deletedAt: null },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }

        if (user.status !== "ACTIVE") {
          throw new Error("Tài khoản đã bị khóa");
        }

        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }

        const roles = user.roles.map((userRole: any) => userRole.role.code);
        const permissions = collectPermissions(user.roles as any);

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          phone: user.phone,
          avatar: user.avatarUrl,
          roles,
          permissions,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.roles = token.roles ?? [];
        session.user.permissions = token.permissions ?? [];
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
