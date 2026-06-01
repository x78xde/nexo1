import { notFound } from "next/navigation";
import { getSectionModuleBySlug, sectionDefinitions } from "../lib/sections";

export function generateStaticParams() {
  return sectionDefinitions.map((section) => ({
    section: section.slug,
  }));
}

export default async function SectionRoute({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const sectionModule = getSectionModuleBySlug(slug);

  if (!sectionModule) {
    notFound();
  }

  const SectionComponent = sectionModule.Component;

  return <SectionComponent />;
}
