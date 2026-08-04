import { useState } from "react";
import { SEED } from "@/admin/seedData";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput, TextArea,
  SelectInput, Toggle, SaveBar, ConfirmDelete,
} from "@/admin/ui";

const EMPTY = { id: "", title: "", message: "", date: "", priority: "normal", published: false };

export default function AnnouncementsAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("announcements", SEED.announcements);
  const [editing, setEditing] = useState(null);

  if (loading || !data) return <AdminLoading />;

  const startEdit = (item) => setEditing({ ...item });
  const startNew = () => setEditing({ ...EMPTY, id: `a${Date.now()}` });
  const commitEdit = () => {
    setData((d) => {
      const exists = d.items.some((i) => i.id === editing.id);
      return { ...d, items: exists ? d.items.map((i) => (i.id === editing.id ? editing : i)) : [...d.items, editing] };
    });
    setEditing(null);
  };

  return (
    <div data-testid="announcements-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Announcements</h1>
      <p className="mt-1 text-sm text-charcoal/60">Published announcements appear on the homepage.</p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Current Announcements" testId="announcements-list-section">
          {data.items.length === 0 && <p className="text-sm text-charcoal/50">No announcements yet.</p>}
          {data.items.map((item) => (
            <div key={item.id} data-testid={`announcement-row-${item.id}`} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4">
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-charcoal">{item.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-charcoal/50">
                  {item.date} · {item.priority === "important" ? "Important" : "Normal"} ·{" "}
                  {item.published ? "Published" : "Hidden"}
                </p>
              </div>
              <button
                type="button"
                data-testid={`edit-${item.id}`}
                onClick={() => startEdit(item)}
                className="min-h-10 rounded-full bg-forest-mist px-4 py-2 text-sm font-bold text-forest"
              >
                Edit
              </button>
              <ConfirmDelete
                testId={`delete-${item.id}`}
                onConfirm={() => setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== item.id) }))}
              />
            </div>
          ))}
          <button
            type="button"
            data-testid="add-announcement"
            onClick={startNew}
            className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream"
          >
            Add Announcement
          </button>
        </AdminSection>

        {editing && (
          <AdminSection title={data.items.some((i) => i.id === editing.id) ? "Edit Announcement" : "New Announcement"} testId="announcement-editor">
            <Field label="Title">
              <TextInput data-testid="ann-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Short message">
              <TextArea data-testid="ann-message" value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} />
            </Field>
            <Field label="Date label" hint='For example: "July 10, 2026"'>
              <TextInput data-testid="ann-date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
            </Field>
            <Field label="Priority">
              <SelectInput
                data-testid="ann-priority"
                value={editing.priority}
                onChange={(e) => setEditing({ ...editing, priority: e.target.value })}
                options={[{ value: "normal", label: "Normal" }, { value: "important", label: "Important" }]}
              />
            </Field>
            <Toggle label="Published (visible on homepage)" testId="ann-published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            <div className="flex gap-3">
              <button
                type="button"
                data-testid="ann-apply"
                onClick={commitEdit}
                disabled={!editing.title || !editing.message || !editing.date}
                className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream disabled:opacity-50"
              >
                Apply
              </button>
              <button type="button" data-testid="ann-cancel" onClick={() => setEditing(null)} className="min-h-12 rounded-full bg-charcoal/10 px-6 py-3 text-sm font-bold text-charcoal">
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
