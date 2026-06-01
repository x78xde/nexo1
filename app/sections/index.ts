import { LayoutDashboard } from "lucide-react";
import archivosSection from "./archivos";
import compartidosSection from "./compartidos";
import configuracionSection from "./configuracion";
import contenedoresSection from "./contenedores";
import logsSection from "./logs";
import maquinasVirtualesSection from "./maquinas-virtuales";
import metricasSection from "./metricas";
import proyectosSection from "./proyectos";
import redSection from "./red";
import seguridadSection from "./seguridad";
import usuariosSection from "./usuarios";
import type { NavigationItem, SectionModule } from "./types";

const sectionModules: SectionModule[] = [
  archivosSection,
  compartidosSection,
  proyectosSection,
  maquinasVirtualesSection,
  contenedoresSection,
  metricasSection,
  logsSection,
  redSection,
  usuariosSection,
  seguridadSection,
  configuracionSection,
];

export const dashboardItem: NavigationItem = {
  href: "/",
  label: "Inicio",
  icon: LayoutDashboard,
  title: "Vista general",
  description: "Resumen del servidor, almacenamiento y actividad principal.",
};

export const sectionDefinitions = sectionModules.map((module) => module.definition);

export const primaryNavigation: NavigationItem[] = [
  dashboardItem,
  ...sectionModules
    .filter((module) =>
      [
        "archivos",
        "compartidos",
        "proyectos",
        "maquinas-virtuales",
        "contenedores",
        "metricas",
        "logs",
      ].includes(module.definition.slug),
    )
    .map((module) => {
      const { href, label, icon, title, description } = module.definition;
      return { href, label, icon, title, description };
    }),
];

export const secondaryNavigation: NavigationItem[] = sectionModules
  .filter((module) =>
    ["red", "usuarios", "seguridad", "configuracion"].includes(module.definition.slug),
  )
  .map((module) => {
    const { href, label, icon, title, description } = module.definition;
    return { href, label, icon, title, description };
  });

export const allNavigationItems: NavigationItem[] = [
  dashboardItem,
  ...sectionModules.map((module) => {
    const { href, label, icon, title, description } = module.definition;
    return { href, label, icon, title, description };
  }),
];

export function getNavigationByPath(pathname: string): NavigationItem {
  return allNavigationItems.find((item) => item.href === pathname) ?? dashboardItem;
}

export function getSectionModuleBySlug(slug: string) {
  return sectionModules.find((module) => module.definition.slug === slug);
}
