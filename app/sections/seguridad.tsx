import { Shield } from "lucide-react";
import SectionPage from "../components/SectionPage";
import type { SectionDefinition, SectionModule, SectionPanel } from "./types";

const definition: SectionDefinition = {
  slug: "seguridad",
  href: "/seguridad",
  label: "Seguridad",
  title: "Seguridad del panel",
  description: "Vista base para sesiones, acceso externo y medidas de proteccion.",
  eyebrow: "Seguridad",
  icon: Shield,
  summary: [
    { label: "HTTPS", value: "Activo" },
    { label: "Sesiones", value: "Seguras" },
    { label: "Links publicos", value: "Controlados" },
  ],
};

const panels: SectionPanel[] = [
  {
    title: "Puntos sensibles",
    description: "Aspectos que NEXO debe tratar con cuidado.",
    rows: [
      { label: "Token Proxmox", value: "Aislado" },
      { label: "Uploads", value: "Pendiente validar" },
      { label: "Roles", value: "Pendiente" },
    ],
  },
  {
    title: "Controles previstos",
    description: "Base de la primera capa de proteccion.",
    rows: [
      { label: "Login obligatorio", value: "Previsto" },
      { label: "Hash de contrasenas", value: "Previsto" },
      { label: "Auditoria", value: "Prevista" },
    ],
  },
];

function SeguridadSection() {
  return <SectionPage section={definition} panels={panels} />;
}

export default {
  definition,
  Component: SeguridadSection,
} satisfies SectionModule;
