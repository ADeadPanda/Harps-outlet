export default function SpecTable({ appliance }) {
  const specs = [
    { label: "Brand", value: appliance.brand },
    { label: "Model Number", value: appliance.model_number },
    { label: "Category", value: appliance.category },
    { label: "Condition", value: appliance.condition },
    { label: "Color", value: appliance.color },
    { label: "Height", value: appliance.dimensions_height ? `${appliance.dimensions_height}"` : null },
    { label: "Width", value: appliance.dimensions_width ? `${appliance.dimensions_width}"` : null },
    { label: "Depth", value: appliance.dimensions_depth ? `${appliance.dimensions_depth}"` : null },
    { label: "Weight", value: appliance.weight ? `${appliance.weight} lbs` : null },
    { label: "Wattage", value: appliance.wattage ? `${appliance.wattage}W` : null },
    { label: "Energy Rating", value: appliance.energy_rating },
  ].filter((s) => s.value);

  if (specs.length === 0) return null;

  return (
    <div>
      <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
        Technical Specifications
      </h2>
      <div className="border border-border">
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex items-center ${i !== specs.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="w-1/3 p-4 bg-secondary/50">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {spec.label}
              </span>
            </div>
            <div className="w-2/3 p-4">
              <span className="font-mono text-sm text-foreground">{spec.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}