import { useState } from "react";
import { SEED } from "@/admin/seedData";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput, TextArea,
  SelectInput, Toggle, SaveBar, ConfirmDelete,
} from "@/admin/ui";

const DAY_OPTIONS = [
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "happening-now", label: "Happening Now" },
  { value: "completed", label: "Completed" },
  { value: "delayed", label: "Delayed" },
  { value: "updated", label: "Updated" },
];

const toSortKey = (time) => {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "00:00";
  let h = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${match[2]}`;
};

const EMPTY = { id: "", day: "friday", time: "", sortKey: "00:00", title: "", description: "", location: "", status: "upcoming", note: "", isCurrent: false };

export default function ScheduleAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("schedule", SEED.schedule);
  const [editing, setEditing] = useState(null);

  if (loading || !data) return <AdminLoading />;

  const commitEdit = () => {
    const event = { ...editing, sortKey: toSortKey(editing.time), note: editing.note || null };
    setData((d) => {
      let events = d.events.some((e) => e.id === event.id)
        ? d.events.map((e) => (e.id === event.id ? event : e))
        : [...d.events, event];
      if (event.isCurrent) events = events.map((e) => (e.id === event.id ? e : { ...e, isCurrent: false }));
      return { ...d, events };
    });
    setEditing(null);
  };

  const sorted = [...data.events].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return (
    <div data-testid="schedule-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Schedule</h1>
      <p className="mt-1 text-sm text-charcoal/60">Manage weekend events. One event can be marked as happening now.</p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Publication" testId="schedule-publish-section">
          <Toggle label="Schedule published" testId="schedule-published" checked={data.published} onChange={(v) => setData((d) => ({ ...d, published: v }))} />
        </AdminSection>

        {DAY_OPTIONS.map(({ value, label }) => (
          <AdminSection key={value} title={label} testId={`schedule-day-${value}`}>
            {sorted.filter((e) => e.day === value).map((event) => (
              <div key={event.id} data-testid={`event-row-${event.id}`} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-charcoal">
                    {event.time} — {event.title}
                    {event.isCurrent && <span className="ml-2 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-forest-deep">Current</span>}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-charcoal/50">{event.location} · {event.status}</p>
                </div>
                <button type="button" data-testid={`edit-event-${event.id}`} onClick={() => setEditing({ ...event, note: event.note ?? "" })} className="min-h-10 rounded-full bg-forest-mist px-4 py-2 text-sm font-bold text-forest">
                  Edit
                </button>
                <ConfirmDelete testId={`delete-event-${event.id}`} onConfirm={() => setData((d) => ({ ...d, events: d.events.filter((e) => e.id !== event.id) }))} />
              </div>
            ))}
            <button type="button" data-testid={`add-event-${value}`} onClick={() => setEditing({ ...EMPTY, id: `e${Date.now()}`, day: value })} className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream">
              Add {label} Event
            </button>
          </AdminSection>
        ))}

        {editing && (
          <AdminSection title={data.events.some((e) => e.id === editing.id) ? "Edit Event" : "New Event"} testId="event-editor">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Day">
                <SelectInput data-testid="event-day" value={editing.day} onChange={(e) => setEditing({ ...editing, day: e.target.value })} options={DAY_OPTIONS} />
              </Field>
              <Field label="Start time" hint='Format: "5:00 PM"'>
                <TextInput data-testid="event-time" value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
              </Field>
              <Field label="Title">
                <TextInput data-testid="event-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </Field>
              <Field label="Location">
                <TextInput data-testid="event-location" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
              </Field>
              <Field label="Status">
                <SelectInput data-testid="event-status" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} options={STATUS_OPTIONS} />
              </Field>
              <Field label="Note (optional)">
                <TextInput data-testid="event-note" value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} />
              </Field>
            </div>
            <Field label="Description">
              <TextArea data-testid="event-description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Toggle label="This is the current event (Happening Now)" testId="event-current" checked={editing.isCurrent} onChange={(v) => setEditing({ ...editing, isCurrent: v })} />
            <div className="flex gap-3">
              <button
                type="button"
                data-testid="event-apply"
                onClick={commitEdit}
                disabled={!editing.time || !editing.title || !editing.description || !editing.location}
                className="min-h-12 rounded-full bg-forest px-6 py-3 text-sm font-extrabold text-cream disabled:opacity-50"
              >
                Apply
              </button>
              <button type="button" data-testid="event-cancel" onClick={() => setEditing(null)} className="min-h-12 rounded-full bg-charcoal/10 px-6 py-3 text-sm font-bold text-charcoal">
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
