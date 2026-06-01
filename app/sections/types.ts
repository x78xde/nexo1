import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface SectionSummary {
  label: string;
  value: string;
}

export interface SectionRow {
  label: string;
  value: string;
}

export interface SectionPanel {
  title: string;
  description: string;
  rows: SectionRow[];
}

export interface SectionDefinition {
  slug: string;
  href: string;
  label: string;
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  summary: SectionSummary[];
}

export interface SectionModule {
  definition: SectionDefinition;
  Component: ComponentType;
}
