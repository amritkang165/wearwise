"use server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export interface StylePreferences {
  colors: string[];
  brands: string[];
  fit: string;
  formality: string;
  style: string;
}

export async function getStylePreferences(): Promise<StylePreferences | null> {
  const session = await requireSession();
  const prefs = await prisma.stylePreferences.findUnique({
    where: { userId: session.user.id },
  });
  if (!prefs) return null;
  return {
    colors: prefs.colors,
    brands: prefs.brands,
    fit: prefs.fit ?? "",
    formality: prefs.formality ?? "",
    style: prefs.style ?? "",
  };
}

export async function saveStylePreferences(
  data: StylePreferences
): Promise<StylePreferences> {
  const session = await requireSession();

  const cleaned = {
    colors: data.colors.filter((c) => c.trim()).slice(0, 8),
    brands: data.brands.filter((b) => b.trim()).slice(0, 8),
    fit: data.fit.trim(),
    formality: data.formality.trim(),
    style: data.style.trim(),
  };

  const prefs = await prisma.stylePreferences.upsert({
    where: { userId: session.user.id },
    update: cleaned,
    create: { userId: session.user.id, ...cleaned },
  });

  return {
    colors: prefs.colors,
    brands: prefs.brands,
    fit: prefs.fit ?? "",
    formality: prefs.formality ?? "",
    style: prefs.style ?? "",
  };
}
