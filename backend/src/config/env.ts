import dotenv from "dotenv";

dotenv.config();

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === "true";
};

const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? "4000");
  return Number.isFinite(port) ? port : 4000;
};

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "change_this_secret",
  adminUser: process.env.ADMIN_USER ?? "admin",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin123",
  proxmox: {
    host: process.env.PROXMOX_HOST ?? "",
    node: process.env.PROXMOX_NODE ?? "",
    tokenId: process.env.PROXMOX_TOKEN_ID ?? "",
    tokenSecret: process.env.PROXMOX_TOKEN_SECRET ?? "",
    rejectUnauthorized: parseBoolean(process.env.PROXMOX_REJECT_UNAUTHORIZED, false),
  },
} as const;
