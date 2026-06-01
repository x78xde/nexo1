import { FolderKanban } from "lucide-react";
import ProyectosWorkspace from "../components/ProyectosWorkspace";
import type { SectionDefinition, SectionModule } from "./types";

const definition: SectionDefinition = {
  slug: "proyectos",
  href: "/proyectos",
  label: "Proyectos",
  title: "Panel de proyectos",
  description: "",
  eyebrow: "Proyectos",
  icon: FolderKanban,
  summary: [],
};

function ProyectosSection() {
  return <ProyectosWorkspace />;
}

const sectionModule: SectionModule = {
  definition,
  Component: ProyectosSection,
};

export default sectionModule;
