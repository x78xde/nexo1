import { Link2 } from "lucide-react";
import CompartidosWorkspace from "../components/CompartidosWorkspace";
import type { SectionDefinition, SectionModule } from "./types";

const definition: SectionDefinition = {
  slug: "compartidos",
  href: "/compartidos",
  label: "Compartidos",
  title: "Links compartidos",
  description: "",
  eyebrow: "Compartidos",
  icon: Link2,
  summary: [],
};

function CompartidosSection() {
  return <CompartidosWorkspace />;
}

const sectionModule: SectionModule = {
  definition,
  Component: CompartidosSection,
};

export default sectionModule;
