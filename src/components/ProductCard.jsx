import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ appliance, index = 0 }) {
  const isFeatured = appliance.featured || index % 5 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`group ${isFeatured ? "col-span-2 row-span-2" : "col-span-1"}`}
    >
      <Link to={`/product/${appliance.id}`} className="block">
        <div className="relative bg-card border border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] hover:shadow-[6px_6px_0px_0px_hsl(var(--accent))] transition-all duration-300 overflow-hidden">
          {/* Image */}
          <div className={`relative bg-secondary overflow-hidden ${isFeatured ? "aspect-[4/5]" : "aspect-square"}`}>
            {appliance.images && appliance.images.length > 0 ? (
              <img
                src={appliance.images[0]}
                alt={appliance.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">No Image</span>
              </div>
            )}
            {/* Category Tag */}
            <div className="absolute top-3 left-3">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
                {appliance.category}
              </span>
            </div>
            {/* Dimensions Overlay */}
            {(appliance.dimensions_height || appliance.dimensions_width) && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-mono text-[10px] bg-background/90 backdrop-blur-sm text-foreground px-2 py-1 border border-border">
                  {appliance.dimensions_height && `H:${appliance.dimensions_height}"`}
                  {appliance.dimensions_width && ` W:${appliance.dimensions_width}"`}
                  {appliance.dimensions_depth && ` D:${appliance.dimensions_depth}"`}
                </span>
              </div>
            )}
          </div>
          {/* Info */}
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-foreground tracking-tight truncate text-sm">
                  {appliance.name}
                </h3>
                {appliance.brand && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    {appliance.brand}
                  </p>
                )}
              </div>
              <span className="font-heading font-bold text-accent text-lg shrink-0">
                ${appliance.price?.toLocaleString()}
              </span>
            </div>
            {appliance.model_number && (
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                MOD. {appliance.model_number}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}