import https from "node:https";
import axios, { type AxiosInstance } from "axios";
import { env } from "../config/env.js";

export type ProxmoxResource = {
  id?: string;
  vmid?: number;
  name?: string;
  node?: string;
  type?: string;
  status?: string;
  [key: string]: unknown;
};

type ProxmoxResponse<T> = {
  data: T;
};

type ProxmoxAction = "start" | "stop" | "reboot";
type ProxmoxGuestType = "qemu" | "lxc";

class ProxmoxService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.proxmox.host,
      headers: {
        Authorization: `PVEAPIToken=${env.proxmox.tokenId}=${env.proxmox.tokenSecret}`,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: env.proxmox.rejectUnauthorized,
      }),
      timeout: 15000,
    });
  }

  private async get<T>(path: string): Promise<T> {
    const response = await this.client.get<ProxmoxResponse<T>>(path);
    return response.data.data;
  }

  private async post<T>(path: string): Promise<T> {
    const response = await this.client.post<ProxmoxResponse<T>>(path);
    return response.data.data;
  }

  getVersion(): Promise<unknown> {
    return this.get("/api2/json/version");
  }

  getNodes(): Promise<unknown[]> {
    return this.get("/api2/json/nodes");
  }

  getClusterStatus(): Promise<unknown[]> {
    return this.get("/api2/json/cluster/status");
  }

  getStorage(): Promise<unknown[]> {
    return this.get(`/api2/json/nodes/${env.proxmox.node}/storage`);
  }

  getResources(): Promise<ProxmoxResource[]> {
    return this.get("/api2/json/cluster/resources");
  }

  async getVirtualMachines(): Promise<ProxmoxResource[]> {
    const resources = await this.getResources();
    return resources.filter((resource) => resource.type === "qemu");
  }

  async getContainers(): Promise<ProxmoxResource[]> {
    const resources = await this.getResources();
    return resources.filter((resource) => resource.type === "lxc");
  }

  runVirtualMachineAction(vmid: string, action: ProxmoxAction): Promise<unknown> {
    return this.runGuestAction("qemu", vmid, action);
  }

  runContainerAction(vmid: string, action: ProxmoxAction): Promise<unknown> {
    return this.runGuestAction("lxc", vmid, action);
  }

  private runGuestAction(
    guestType: ProxmoxGuestType,
    vmid: string,
    action: ProxmoxAction,
  ): Promise<unknown> {
    return this.post(
      `/api2/json/nodes/${env.proxmox.node}/${guestType}/${vmid}/status/${action}`,
    );
  }
}

export const proxmoxService = new ProxmoxService();
