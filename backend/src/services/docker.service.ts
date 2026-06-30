import Docker from "dockerode";

export type DockerContainerSummary = {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
};

class DockerService {
  private readonly docker = new Docker({ socketPath: "/var/run/docker.sock" });

  async listContainers(): Promise<DockerContainerSummary[]> {
    const containers = await this.docker.listContainers({ all: true });

    return containers.map((container) => ({
      id: container.Id,
      name: container.Names[0]?.replace(/^\//, "") ?? container.Id,
      image: container.Image,
      state: container.State,
      status: container.Status,
    }));
  }

  async startContainer(id: string): Promise<{ id: string; action: "start" }> {
    await this.docker.getContainer(id).start();
    return { id, action: "start" };
  }

  async stopContainer(id: string): Promise<{ id: string; action: "stop" }> {
    await this.docker.getContainer(id).stop();
    return { id, action: "stop" };
  }

  async restartContainer(id: string): Promise<{ id: string; action: "restart" }> {
    await this.docker.getContainer(id).restart();
    return { id, action: "restart" };
  }
}

export const dockerService = new DockerService();
