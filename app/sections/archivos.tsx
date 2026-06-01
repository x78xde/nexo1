import { HardDrive } from "lucide-react";
import ArchivosWorkspace from "../components/ArchivosWorkspace";
import type { SectionDefinition, SectionModule } from "./types";

const definition: SectionDefinition = {
  slug: "archivos",
  href: "/archivos",
  label: "Archivos",
  title: "Gestor de archivos",
  description: "",
  eyebrow: "Archivos",
  icon: HardDrive,
  summary: [],
};

function ArchivosSection() {
  return <ArchivosWorkspace />;
}

const sectionModule: SectionModule = {
  definition,
  Component: ArchivosSection,
};

export default sectionModule;
