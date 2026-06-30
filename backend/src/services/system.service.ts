import os from "node:os";
import si from "systeminformation";

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

class SystemService {
  getHealth(): SystemHealth {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  async getMetrics(): Promise<SystemMetrics> {
    const [load, memory] = await Promise.all([si.currentLoad(), si.mem()]);

    return {
      cpu: {
        usage: Math.round(load.currentLoad),
        cores: os.cpus().length,
      },
      memory: {
        total: memory.total,
        used: memory.used,
        free: memory.free,
        usage: memory.total > 0 ? Math.round((memory.used / memory.total) * 100) : 0,
      },
      uptime: os.uptime(),
    };
  }

  getDisks(): Promise<si.Systeminformation.FsSizeData[]> {
    return si.fsSize();
  }

  getNetwork(): Promise<si.Systeminformation.NetworkStatsData[]> {
    return si.networkStats();
  }
}

export const systemService = new SystemService();
