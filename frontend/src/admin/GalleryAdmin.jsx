import { useState } from "react";
import { X } from "lucide-react";
import { SEED } from "@/admin/seedData";
import { ImageUpload } from "@/admin/ImageUpload";
import { itemMedia, isUploadedVideoUrl } from "@/data/gallery";
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

const EMPTY = { id: "", type: "image", src: "", media: [], caption: "", description: "", category: "tournament", year: 2026, aspect: "landscape", alt: "", source: "", order: 99, featured: false, published: true };

const MIXED_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime";

export default function GalleryAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("gallery", SEED.gallery);
  const [editing, setEditing] = useState(null);
  const [urlDraft, setUrlDraft] = useState("");

  if (loading || !data) return <AdminLoading />;

  const commitEdit = () => {
    const media = editing.media ?? [];
    const item = { ...editing, media, src: media[0] ?? null, source: editing.source || null, year: Number(editing.year), order: Number(editing.order) };
    setData((d) => {
      const exists = d.items.some((i) => i.id === item.id);
      return { ...d, items: exists ? d.items.map((i) => (i.id === item.id ? item : i)) : [...d.items, item] };
    });
    setEditing(null);
    setUrlDraft("");
  };

  const mediaList = editing?.media ?? [];
  const appendMedia = (url) => {
    if (!url || mediaList.length >= 12) return;
    setEditing((e) => ({ ...e, media: [...(e.media ?? []), url] }));
  };
  const removeMedia = (idx) => setEditing((e) => ({ ...e, media: e.media.filter((_, j) => j !== idx) }));

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
              <button type="button" data-testid={`edit-gallery-${item.id}`} onClick={() => { setEditing({ ...item, src: item.src ?? "", source: item.source ?? "", media: itemMedia(item) }); setUrlDraft(""); }} className="min-h-10 rounded-full bg-forest-mist px-4 py-2 text-sm font-bold text-forest">
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
              <Field label="Photographer / source label (optional)">
                <TextInput data-testid="gal-source" value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value })} />
              </Field>
            </div>
            <Field label={`Photos & videos (${mediaList.length}/12)`} hint="The first item becomes the card cover. Upload files or paste external URLs.">
              <div className="flex flex-col gap-4">
                {mediaList.length > 0 && (
                  <div data-testid="gal-media-list" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {mediaList.map((url, i) => (
                      <div key={`${url}-${i}`} className="relative">
                        {isUploadedVideoUrl(url) ? (
                          <video src={url} muted playsInline preload="metadata" className="h-20 w-full rounded-lg bg-charcoal object-cover ring-1 ring-border" />
                        ) : (
                          <img src={url} alt={`Media ${i + 1}`} className="h-20 w-full rounded-lg bg-forest-mist object-cover ring-1 ring-border" />
                        )}
                        <button
                          type="button"
                          data-testid={`gal-media-remove-${i}`}
                          aria-label={`Remove media ${i + 1}`}
                          onClick={() => removeMedia(i)}
                          className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-white shadow-sm transition-colors duration-200 hover:bg-red-800"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 rounded bg-gold px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-forest-deep">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-end gap-4">
                  <ImageUpload
                    testId="gal-upload"
                    value=""
                    onChange={appendMedia}
                    previewClass="h-16 w-16"
                    accept={MIXED_ACCEPT}
                    uploadText="Upload photo or video"
                    hint="Photos ≤12 MB · Videos ≤100 MB"
                  />
                  <div className="flex min-w-52 flex-1 items-end gap-2">
                    <TextInput
                      data-testid="gal-media-url"
                      value={urlDraft}
                      onChange={(e) => setUrlDraft(e.target.value)}
                      placeholder="Paste external URL…"
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-charcoal shadow-sm focus:border-forest"
                    />
                    <button
                      type="button"
                      data-testid="gal-media-add-url"
                      onClick={() => { appendMedia(urlDraft.trim()); setUrlDraft(""); }}
                      disabled={!urlDraft.trim() || mediaList.length >= 12}
                      className="min-h-12 shrink-0 rounded-full bg-forest px-5 py-3 text-sm font-extrabold text-cream disabled:opacity-50"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>
            </Field>
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
