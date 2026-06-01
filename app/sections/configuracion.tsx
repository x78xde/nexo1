import { Settings } from "lucide-react";
import SectionPage from "../components/SectionPage";
import type { SectionDefinition, SectionModule, SectionPanel } from "./types";

const definition: SectionDefinition = {
  slug: "configuracion",
  href: "/configuracion",
  label: "Configuracion",
  title: "Configuracion general",
  description: "Lugar base para variables del sistema, limites y acceso a Proxmox.",
  eyebrow: "Configuracion",
  icon: Settings,
  summary: [
    { label: "Servidor", value: "NEXO" },
    { label: "Subida maxima", value: "Pendiente" },
    { label: "Tema", value: "Oscuro" },
  ],
};

const panels: SectionPanel[] = [
  {
    title: "Parametros previstos",
    description: "Configuraciones base del panel.",
    rows: [
      { label: "IP Proxmox", value: "Pendiente" },
      { label: "Ruta datos", value: "/data/nexo" },
      { label: "Links publicos", value: "Permitidos" },
    ],
  },
  {
    title: "Ajustes futuros",
    description: "Piezas que se iran moviendo aqui conforme crezca la app.",
    rows: [
      { label: "Backups", value: "Pendiente" },
      { label: "Limites por usuario", value: "Pendiente" },
      { label: "Tiempos por defecto", value: "Pendiente" },
    ],
  },
];

function ConfiguracionSection() {
  return <SectionPage section={definition} panels={panels} />;
}

export default {
  definition,
  Component: ConfiguracionSection,
} satisfies SectionModule;
