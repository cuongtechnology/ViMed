import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@clinic/database";
import { compare } from "bcryptjs";

const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập email và mật khẩu");
        }

        const emailSchema = z.string().email();
        const parsedEmail = emailSchema.safeParse(credentials.email);
        
        if (!parsedEmail.success) {
          throw new Error("Email không hợp lệ");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
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

        if (!user || !user.password) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }

        if (user.status !== "ACTIVE") {
          throw new Error("Tài khoản đã bị khóa");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }

        // Extract permissions from roles
        const permissions = Array.from(
          new Set(
            user.roles.flatMap((ur) =>
              ur.role.rolePermissions.map((rp) => rp.permission.code)
            )
          )
        );

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          roles: user.roles.map((ur) => ur.role.code),
          permissions,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
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
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
