/// <reference types="astro/client" />
import type { Role } from "$lib/domain/user";

declare global {
  interface ImportMetaEnv {
    readonly DATABASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  namespace App {
    interface Locals {
      user?: {
        userId: number;
        role: Role;
      };
    }
  }
}
