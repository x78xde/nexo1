"use client";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

const TOKEN_KEY = "nexo_lab_token";

export type BackendStatus = {
  name: string;
  version: string;
  status: string;
};

export type AuthUser = {
  username: string;
  role: "admin";
};

export type LoginResult = {
  token: string;
  user: AuthUser;
};

export type SystemHealth = {
  status: "ok";
  uptime: number;
  timestamp: string;
};

export type SystemMetrics = {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  uptime: number;
};

export type ProxmoxVersion = {
  version: string;
  repoid?: string;
  release?: string;
};

export type ProxmoxNode = {
  id: string;
  status: string;
  node: string;
  type: "node";
  maxcpu?: number;
  cpu?: number;
  maxmem?: number;
  mem?: number;
  maxdisk?: number;
  disk?: number;
};

export type ProxmoxGuest = {
  id: string;
  vmid: number;
  name?: string;
  status?: string;
  node?: string;
  type: "qemu" | "lxc";
  maxcpu?: number;
  cpu?: number;
  maxmem?: number;
  mem?: number;
  maxdisk?: number;
  disk?: number;
  uptime?: number;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
};

type LoginSuccess = {
  success: true;
  token: string;
  user: AuthUser;
};

type LoginFailure = {
  success: false;
  message: string;
};

export class NexoApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NexoApiError";
    this.status = status;
  }
}

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = (): void => {
  window.localStorage.removeItem(TOKEN_KEY);
};

const authHeaders = (): HeadersInit => {
  const token = getStoredToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T;
  return payload;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });

  const payload = await parseJson<ApiSuccess<T> | ApiFailure>(response);

  if (!response.ok || !payload.success) {
    const message = payload.success ? "Error al conectar con Nexo Backend" : payload.message;

    if (response.status === 401) {
      clearStoredToken();
      throw new NexoApiError("Token invalido, volver a iniciar sesion", response.status);
    }

    throw new NexoApiError(message, response.status);
  }

  return payload.data;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const payload = await parseJson<LoginSuccess | LoginFailure>(response);

  if (!response.ok || !payload.success) {
    throw new NexoApiError(
      payload.success ? "Error al conectar con Nexo Backend" : payload.message,
      response.status,
    );
  }

  setStoredToken(payload.token);
  return {
    token: payload.token,
    user: payload.user,
  };
}

export const getBackendStatus = () => request<BackendStatus>("/");
export const getSystemHealth = () => request<SystemHealth>("/api/system/health");
export const getSystemMetrics = () => request<SystemMetrics>("/api/system/metrics");
export const getProxmoxVersion = () => request<ProxmoxVersion>("/api/proxmox/version");
export const getProxmoxNodes = () => request<ProxmoxNode[]>("/api/proxmox/nodes");
export const getProxmoxVMs = () => request<ProxmoxGuest[]>("/api/proxmox/vms");
export const getProxmoxContainers = () => request<ProxmoxGuest[]>("/api/proxmox/containers");
