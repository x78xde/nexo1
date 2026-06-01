import { Users } from "lucide-react";
import SectionPage from "../components/SectionPage";
import type { SectionDefinition, SectionModule, SectionPanel } from "./types";

const definition: SectionDefinition = {
  slug: "usuarios",
  href: "/usuarios",
  label: "Usuarios",
  title: "Usuarios y roles",
  description: "Panel base para administrar cuentas, permisos y estado de acceso.",
  eyebrow: "Usuarios",
  icon: Users,
  summary: [
    { label: "Activos", value: "3" },
    { label: "Admins", value: "1" },
    { label: "Invitados", value: "1" },
  ],
};

const panels: SectionPanel[] = [
  {
    title: "Cuentas visibles",
    description: "Lectura minima del estado por usuario.",
    rows: [
      { label: "Lalo", value: "Admin" },
      { label: "Paulo", value: "Usuario" },
      { label: "Invitado", value: "Solo lectura" },
    ],
  },
  {
    title: "Acciones previstas",
    description: "Operaciones administrativas para esta seccion.",
    rows: [
      { label: "Crear usuario", value: "Pendiente" },
      { label: "Cambiar rol", value: "Pendiente" },
      { label: "Desactivar", value: "Pendiente" },
    ],
  },
];

function UsuariosSection() {
  return <SectionPage section={definition} panels={panels} />;
}

export default {
  definition,
  Component: UsuariosSection,
} satisfies SectionModule;
