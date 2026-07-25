import { z } from "zod";

export const clothingItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.enum(["tops", "bottoms", "shoes", "outerwear", "accessories"]),
  subcategory: z.string().max(50).optional().or(z.literal("")),
  brand: z.string().max(50).optional().or(z.literal("")),
  colors: z.array(z.string()).max(5).default([]),
  size: z.string().max(20).optional().or(z.literal("")),
  seasons: z.array(z.string()).max(4).default([]),
  occasions: z.array(z.string()).max(5).default([]),
  purchaseDate: z.string().optional().or(z.literal("")),
  purchasePrice: z.coerce.number().min(0).max(10000).optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type ClothingItemInput = z.infer<typeof clothingItemSchema>;

export const CATEGORIES = [
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "shoes", label: "Shoes" },
  { value: "outerwear", label: "Outerwear" },
  { value: "accessories", label: "Accessories" },
] as const;

export const COLORS = [
  "Black", "White", "Gray", "Navy", "Blue", "Red",
  "Green", "Brown", "Beige", "Pink", "Orange", "Yellow",
  "Purple", "Cream", "Olive", "Burgundy",
] as const;

export const SEASONS = ["Spring", "Summer", "Fall", "Winter"] as const;

export const OCCASIONS = [
  "Casual", "Formal", "Work", "Athletic", "Date Night",
] as const;
