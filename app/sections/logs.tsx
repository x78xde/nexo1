import { Logs } from "lucide-react";
import SectionPage from "../components/SectionPage";
import type { SectionDefinition, SectionModule, SectionPanel } from "./types";

const definition: SectionDefinition = {
  slug: "logs",
  href: "/logs",
  label: "Logs",
  title: "Registro de eventos",
  description: "Base para auditoria, errores del sistema y acciones de usuario.",
  eyebrow: "Logs",
  icon: Logs,
  summary: [
    { label: "Eventos hoy", value: "28" },
    { label: "Errores", value: "1" },
    { label: "Advertencias", value: "3" },
  ],
};

const panels: SectionPanel[] = [
  {
    title: "Fuentes de log",
    description: "Primeros canales que se van a consolidar aqui.",
    rows: [
      { label: "Sistema", value: "Previsto" },
      { label: "NEXO", value: "Previsto" },
      { label: "Proxmox", value: "Previsto" },
    ],
  },
  {
    title: "Filtros previstos",
    description: "Herramientas base para buscar eventos importantes.",
    rows: [
      { label: "Por fecha", value: "Pendiente" },
      { label: "Por usuario", value: "Pendiente" },
      { label: "Por modulo", value: "Pendiente" },
    ],
  },
];

function LogsSection() {
  return <SectionPage section={definition} panels={panels} />;
}

export default {
  definition,
  Component: LogsSection,
} satisfies SectionModule;
