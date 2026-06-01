import { SquareTerminal } from "lucide-react";
import ContenedoresWorkspace from "../components/ContenedoresWorkspace";
import type { SectionDefinition, SectionModule } from "./types";

const definition: SectionDefinition = {
  slug: "contenedores",
  href: "/contenedores",
  label: "Contenedores",
  title: "Servicios y contenedores",
  description: "",
  eyebrow: "Contenedores",
  icon: SquareTerminal,
  summary: [],
};

function ContenedoresSection() {
  return <ContenedoresWorkspace />;
}

const sectionModule: SectionModule = {
  definition,
  Component: ContenedoresSection,
};

export default sectionModule;
