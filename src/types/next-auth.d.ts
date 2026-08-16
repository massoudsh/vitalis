import type { UserRole } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

// افزودن role/facilityId به Session و User و JWT (طبق src/lib/auth.ts).
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      facilityId: string;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    facilityId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    facilityId: string;
  }
}
