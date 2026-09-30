import { Utensils, PawPrint, ShoppingBasket, House, Car, HeartPulse, Gamepad2, Package } from "lucide-react";

export const CATEGORIES = [
  { key: "Food & Drink",    icon: Utensils, color: "#F59E0B" },
  { key: "Pet",             icon: PawPrint, color: "#EC4899" },
  { key: "Groceries",       icon: ShoppingBasket, color: "#8B5CF6" },
  { key: "Rent & Bills",    icon: House,    color: "#EF4444" },
  { key: "Transport",       icon: Car,      color: "#3B82F6" },
  { key: "Skin & Health",   icon: HeartPulse, color: "#10B981" },
  { key: "Entertainment",   icon: Gamepad2, color: "#F97316" },
  { key: "Others",          icon: Package,  color: "#6B7280" },
];

export const DEFAULT_CATEGORY = "Others";

// the only category that counts against the daily budget
export const BUDGET_CATEGORY = "Food & Drink";
