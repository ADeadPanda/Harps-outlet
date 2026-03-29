import { Refrigerator, WashingMachine, CookingPot, Microwave, Wind, Zap, CircleDot, LayoutGrid } from "lucide-react";

const categories = [
  { value: "all", label: "All Units", icon: LayoutGrid },
  { value: "Refrigerators", label: "Refrigerators", icon: Refrigerator },
  { value: "Washers & Dryers", label: "Washers", icon: WashingMachine },
  { value: "Dishwashers", label: "Dishwashers", icon: CircleDot },
  { value: "Ovens & Ranges", label: "Ovens", icon: CookingPot },
  { value: "Microwaves", label: "Microwaves", icon: Microwave },
  { value: "Air Conditioners", label: "HVAC", icon: Wind },
  { value: "Small Appliances", label: "Small", icon: Zap },
];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 px-3">
        Filter by Category
      </span>
      {categories.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-200 ${
              isActive
                ? "bg-accent text-accent-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <cat.icon className="w-4 h-4 shrink-0" />
            <span className="font-mono text-xs uppercase tracking-wider">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}