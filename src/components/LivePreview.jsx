export default function LivePreview({ data, images }) {
  const previewImage = images.length > 0 ? URL.createObjectURL(images[0]) : null;

  return (
    <div className="sticky top-8">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
        Live Preview
      </span>
      <div className="bg-card border border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] overflow-hidden">
        {/* Image Preview */}
        <div className="aspect-square bg-secondary overflow-hidden relative">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Upload Image →
              </span>
            </div>
          )}
          {data.category && (
            <div className="absolute top-3 left-3">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
                {data.category}
              </span>
            </div>
          )}
        </div>
        {/* Info Preview */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-heading font-semibold text-foreground tracking-tight text-sm">
                {data.name || "Appliance Name"}
              </h3>
              {data.brand && (
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  {data.brand}
                </p>
              )}
            </div>
            <span className="font-heading font-bold text-accent text-lg">
              ${data.price ? Number(data.price).toLocaleString() : "0"}
            </span>
          </div>
          {data.model_number && (
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              MOD. {data.model_number}
            </p>
          )}
          {/* Specs Preview */}
          {(data.dimensions_height || data.wattage || data.energy_rating) && (
            <div className="pt-2 mt-2 border-t border-border">
              <div className="grid grid-cols-3 gap-2">
                {data.dimensions_height && (
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">Height</span>
                    <span className="font-mono text-xs text-foreground">{data.dimensions_height}"</span>
                  </div>
                )}
                {data.wattage && (
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">Watts</span>
                    <span className="font-mono text-xs text-foreground">{data.wattage}W</span>
                  </div>
                )}
                {data.energy_rating && (
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">Energy</span>
                    <span className="font-mono text-xs text-foreground">{data.energy_rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}