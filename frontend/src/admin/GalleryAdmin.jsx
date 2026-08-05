import { useState } from "react";
import { SEED } from "@/admin/seedData";
import { ImageUpload } from "@/admin/ImageUpload";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput, TextArea,
  SelectInput, Toggle, SaveBar, ConfirmDelete,
} from "@/admin/ui";

const CATEGORY_OPTIONS = [
  { value: "tournament", label: "Tournament" },
  { value: "draft-night", label: "Draft Night" },
  { value: "teams", label: "Teams" },
  { value: "awards", label: "Awards" },
  { value: "memories", label: "Memories" },
];

const TYPE_OPTIONS = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

const ASPECT_OPTIONS = [
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
  { value: "square", label: "Square" },
];

const EMPTY = { id: "", type: "image", src: "", caption: "", description: "", category: "tournament", year: 2026, aspect: "landscape", alt: "", source: "", order: 99, featured: false, published: true };

export default function GalleryAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("gallery", SEED.gallery);
  const [editing, setEditing] = useState(null);

  if (loading || !data) return <AdminLoading />;

  const commitEdit = () => {
    const item = { ...editing, src: editing.src || null, source: editing.source || null, year: Number(editing.year), order: Number(editing.order) };
    setData((d) => {
      const exists = d.items.some((i) => i.id === item.id);
      return { ...d, items: exists ? d.items.map((i) => (i.id === item.id ? item : i)) : [...d.items, item] };
    });
    setEditing(null);
  };

  const sorted = [...data.items].sort((a, b) => a.order - b.order);

  return (
    <div data-testid="gallery-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Gallery</h1>
      <p className="mt-1 text-sm text-charcoal/60">Manage media records. Use a source URL for real photos; leave it empty for a placeholder tile.</p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Publication" testId="gallery-publish-section">
          <Toggle label="Gallery published" testId="gallery-published" checked={data.published} onChange={(v) => setData((d) => ({ ...d, published: v }))} />
        </AdminSection>

        <AdminSection title="Media Items" testId="gallery-items-section">
          {sorted.map((item) => (
            <div key={item.id} data-testid={`gallery-row-${item.id}`} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4">
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-charcoal">
                  #{item.order} · {item.caption}
                  {item.featured && <span className="ml-2 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-forest-deep">Featured</span>}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-charcoal/50">
                  {item.type} · {item.category} · {item.year} · {item.published ? "Published" : "Hidden"}
                </p>
              </div>
              <button type="button" data-testid={`edit-gallery-${item.id}`} onClick={() => setEditing({ ...item, src: item.src ?? "", source: item.source ?? "" })} className="min-h-10 rounded-full bg-forest-mist px-4 py-2 text-sm font-bold text-forest">
                Edit
              </button>
              <ConfirmDelete testId={`delete-gallery-${item.id}`} onConfirm={() => setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== item.id) }))} />
            </div>
          ))}
          <button type="button" data-testid="add-gallery-item" onClick={() => setEditing({ ...EMPTY, id: `g${Date.now()}` })} className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream">
            Add Media Item
          </button>
        </AdminSection>

        {editing && (
          <AdminSection title={data.items.some((i) => i.id === editing.id) ? "Edit Media Item" : "New Media Item"} testId="gallery-editor">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Caption">
                <TextInput data-testid="gal-caption" value={editing.caption} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} />
              </Field>
              <Field label="Category">
                <SelectInput data-testid="gal-category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} options={CATEGORY_OPTIONS} />
              </Field>
              <Field label="Media type">
                <SelectInput data-testid="gal-type" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} options={TYPE_OPTIONS} />
              </Field>
              <Field label="Year">
                <TextInput type="number" data-testid="gal-year" value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
              </Field>
              <Field label="Aspect">
                <SelectInput data-testid="gal-aspect" value={editing.aspect} onChange={(e) => setEditing({ ...editing, aspect: e.target.value })} options={ASPECT_OPTIONS} />
              </Field>
              <Field label="Display order" hint="Lower numbers show first.">
                <TextInput type="number" data-testid="gal-order" value={editing.order} onChange={(e) => setEditing({ ...editing, order: e.target.value })} />
              </Field>
              <Field label="Source URL (optional)">
                <TextInput data-testid="gal-src" value={editing.src} onChange={(e) => setEditing({ ...editing, src: e.target.value })} placeholder="https://…" />
              </Field>
              <Field label={editing.type === "video" ? "Or upload a video" : "Or upload a photo"}>
                <ImageUpload
                  testId="gal-upload"
                  value={editing.src ?? ""}
                  onChange={(url) => setEditing({ ...editing, src: url })}
                  previewClass="h-24 w-32"
                  accept={editing.type === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/gif"}
                  hint={editing.type === "video" ? "MP4/WebM/MOV up to 100 MB — plays right in the gallery." : "JPEG/PNG/WebP/GIF up to 12 MB."}
                />
              </Field>
              <Field label="Photographer / source label (optional)">
                <TextInput data-testid="gal-source" value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value })} />
              </Field>
            </div>
            <Field label="Description">
              <TextArea data-testid="gal-description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Field label="Alternative text">
              <TextInput data-testid="gal-alt" value={editing.alt} onChange={(e) => setEditing({ ...editing, alt: e.target.value })} />
            </Field>
            <Toggle label="Featured memory" testId="gal-featured" checked={editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
            <Toggle label="Published" testId="gal-item-published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            <div className="flex gap-3">
              <button
                type="button"
                data-testid="gal-apply"
                onClick={commitEdit}
                disabled={!editing.caption || !editing.description || !editing.alt}
                className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream disabled:opacity-50"
              >
                Apply
              </button>
              <button type="button" data-testid="gal-cancel" onClick={() => setEditing(null)} className="min-h-12 rounded-full bg-charcoal/10 px-6 py-3 text-sm font-bold text-charcoal">
                Cancel
              </button>
            </div>
          </AdminSection>
        )}
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
