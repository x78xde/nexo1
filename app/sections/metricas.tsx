import { Gauge } from "lucide-react";
import SectionPage from "../components/SectionPage";
import type { SectionDefinition, SectionModule, SectionPanel } from "./types";

const definition: SectionDefinition = {
  slug: "metricas",
  href: "/metricas",
  label: "Metricas",
  title: "Metricas del sistema",
  description: "Seccion base para CPU, memoria, red, disco y carga del nodo.",
  eyebrow: "Metricas",
  icon: Gauge,
  summary: [
    { label: "CPU", value: "27%" },
    { label: "RAM", value: "8.6 / 16 GB" },
    { label: "Red", value: "168 Mbps" },
  ],
};

const panels: SectionPanel[] = [
  {
    title: "Fuentes de datos",
    description: "Donde se conectara el backend cuando toque integrarlo.",
    rows: [
      { label: "Host Proxmox", value: "Pendiente de API" },
      { label: "VM NEXO", value: "Lista" },
      { label: "Disco", value: "Listo para lectura" },
    ],
  },
  {
    title: "Frecuencia objetivo",
    description: "Referencia de refresco para la lectura en tiempo casi real.",
    rows: [
      { label: "CPU / RAM", value: "3 s" },
      { label: "Red", value: "3 s" },
      { label: "Disco", value: "10 s" },
    ],
  },
];

function MetricasSection() {
  return <SectionPage section={definition} panels={panels} />;
}

export default {
  definition,
  Component: MetricasSection,
} satisfies SectionModule;
