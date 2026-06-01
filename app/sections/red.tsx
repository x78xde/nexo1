import { Network } from "lucide-react";
import SectionPage from "../components/SectionPage";
import type { SectionDefinition, SectionModule, SectionPanel } from "./types";

const definition: SectionDefinition = {
  slug: "red",
  href: "/red",
  label: "Red",
  title: "Estado de red",
  description: "Seccion base para IP local, enlace externo y estado del tunnel.",
  eyebrow: "Red",
  icon: Network,
  summary: [
    { label: "IP local", value: "192.168.x.x" },
    { label: "Tunnel", value: "Activo" },
    { label: "Interfaz", value: "vmbr0" },
  ],
};

const panels: SectionPanel[] = [
  {
    title: "Lectura inicial",
    description: "Bloques que tendra la vista de red.",
    rows: [
      { label: "Estado de enlace", value: "Conectado" },
      { label: "Subida", value: "Pendiente" },
      { label: "Bajada", value: "Pendiente" },
    ],
  },
  {
    title: "Diagnostico futuro",
    description: "Espacio para pruebas cuando el backend este listo.",
    rows: [
      { label: "Ping", value: "Pendiente" },
      { label: "DNS", value: "Pendiente" },
      { label: "Cloudflare", value: "Pendiente" },
    ],
  },
];

function RedSection() {
  return <SectionPage section={definition} panels={panels} />;
}

export default {
  definition,
  Component: RedSection,
} satisfies SectionModule;
