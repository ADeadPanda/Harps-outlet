import db from "@/lib/localDB";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

import { Upload as UploadIcon, X, Loader2, ArrowLeft, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LivePreview from "../components/LivePreview";

const categories = ["Refrigerators", "Washers & Dryers", "Dishwashers", "Ovens & Ranges", "Microwaves", "Air Conditioners", "Small Appliances", "Other"];
const conditions = ["New", "Refurbished", "Used - Like New", "Used - Good", "Used - Fair"];
const energyRatings = ["A+++", "A++", "A+", "A", "B", "C", "D"];

export default function Upload() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Access Denied</span>
        <p className="font-mono text-sm text-muted-foreground">Admin role required.</p>
        <Link to="/" className="font-mono text-xs uppercase tracking-wider text-accent hover:underline">Return to Gallery</Link>
      </div>
    );
  }
  const [imageFiles, setImageFiles] = useState([]);
  const [form, setForm] = useState({
    name: "", category: "", price: "", description: "", brand: "",
    model_number: "", dimensions_height: "", dimensions_width: "",
    dimensions_depth: "", wattage: "", energy_rating: "", color: "",
    weight: "", condition: "", featured: false,
  });

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast.error("Please fill in name, category, and price");
      return;
    }
    setSaving(true);

    const uploadedUrls = [];
    for (const file of imageFiles) {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      uploadedUrls.push(file_url);
    }

    const data = {
      ...form,
      price: Number(form.price),
      dimensions_height: form.dimensions_height ? Number(form.dimensions_height) : undefined,
      dimensions_width: form.dimensions_width ? Number(form.dimensions_width) : undefined,
      dimensions_depth: form.dimensions_depth ? Number(form.dimensions_depth) : undefined,
      wattage: form.wattage ? Number(form.wattage) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      images: uploadedUrls,
    };

    // Clean undefined
    Object.keys(data).forEach((k) => {
      if (data[k] === undefined || data[k] === "") delete data[k];
    });

    await db.entities.Appliance.create(data);
    toast.success("Appliance added successfully");
    setSaving(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border px-6 lg:px-16 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate("/")} className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Gallery
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
            Inventory Architect
          </span>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Add Appliance
          </h1>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Form */}
        <div className="flex-1 p-6 lg:p-16 lg:border-r border-border">
          <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
            {/* Essential Info */}
            <FormSection title="Essential Information">
              <FormField label="Appliance Name" required>
                <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. French Door Refrigerator" className="form-input-style" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Category" required>
                  <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className="form-input-style">
                    <option value="">Select</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Price ($)" required>
                  <input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="0.00" className="form-input-style" />
                </FormField>
              </div>
              <FormField label="Description">
                <textarea rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe the appliance..." className="form-input-style resize-none" />
              </FormField>
            </FormSection>

            {/* Images */}
            <FormSection title="Product Images">
              <div className="grid grid-cols-3 gap-3">
                {imageFiles.map((file, i) => (
                  <div key={i} className="relative aspect-square bg-secondary border border-border overflow-hidden group">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-foreground/80 text-background p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Add</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />
                </label>
              </div>
            </FormSection>

            {/* Details */}
            <FormSection title="Product Details">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Brand">
                  <input type="text" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} placeholder="e.g. Samsung" className="form-input-style" />
                </FormField>
                <FormField label="Model Number">
                  <input type="text" value={form.model_number} onChange={(e) => updateField("model_number", e.target.value)} placeholder="e.g. RF28R7551SR" className="form-input-style" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Condition">
                  <select value={form.condition} onChange={(e) => updateField("condition", e.target.value)} className="form-input-style">
                    <option value="">Select</option>
                    {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Color">
                  <input type="text" value={form.color} onChange={(e) => updateField("color", e.target.value)} placeholder="e.g. Stainless Steel" className="form-input-style" />
                </FormField>
              </div>
            </FormSection>

            {/* Specs */}
            <FormSection title="Technical Specs">
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Height (in)">
                  <input type="number" value={form.dimensions_height} onChange={(e) => updateField("dimensions_height", e.target.value)} className="form-input-style" />
                </FormField>
                <FormField label="Width (in)">
                  <input type="number" value={form.dimensions_width} onChange={(e) => updateField("dimensions_width", e.target.value)} className="form-input-style" />
                </FormField>
                <FormField label="Depth (in)">
                  <input type="number" value={form.dimensions_depth} onChange={(e) => updateField("dimensions_depth", e.target.value)} className="form-input-style" />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Wattage">
                  <input type="number" value={form.wattage} onChange={(e) => updateField("wattage", e.target.value)} className="form-input-style" />
                </FormField>
                <FormField label="Weight (lbs)">
                  <input type="number" value={form.weight} onChange={(e) => updateField("weight", e.target.value)} className="form-input-style" />
                </FormField>
                <FormField label="Energy Rating">
                  <select value={form.energy_rating} onChange={(e) => updateField("energy_rating", e.target.value)} className="form-input-style">
                    <option value="">Select</option>
                    {energyRatings.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </FormField>
              </div>
            </FormSection>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="w-4 h-4 accent-amber-500" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Mark as Featured</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-4 font-mono text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
              {saving ? "Uploading..." : "Publish to Gallery"}
            </button>
          </form>
        </div>

        {/* Live Preview - Desktop */}
        <div className="hidden lg:block w-96 p-10">
          <LivePreview data={form} images={imageFiles} />
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div>
      <h2 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, required = false, children }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}