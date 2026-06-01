import { Server } from "lucide-react";
import MaquinasVirtualesWorkspace from "../components/MaquinasVirtualesWorkspace";
import type { SectionDefinition, SectionModule } from "./types";

const definition: SectionDefinition = {
  slug: "maquinas-virtuales",
  href: "/maquinas-virtuales",
  label: "Maquinas virtuales",
  title: "Control de maquinas virtuales",
  description: "",
  eyebrow: "Proxmox",
  icon: Server,
  summary: [],
};

function MaquinasVirtualesSection() {
  return <MaquinasVirtualesWorkspace />;
}

const sectionModule: SectionModule = {
  definition,
  Component: MaquinasVirtualesSection,
};

export default sectionModule;
