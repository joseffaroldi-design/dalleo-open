import { SEED } from "@/admin/seedData";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput, TextArea,
  Toggle, SaveBar,
} from "@/admin/ui";

export default function ContentAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("site", SEED.site);

  if (loading || !data) return <AdminLoading />;

  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const updateMilestone = (i, patch) =>
    setData((d) => ({ ...d, milestones: d.milestones.map((m, j) => (j === i ? { ...m, ...patch } : m)) }));

  return (
    <div data-testid="content-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Site Content</h1>
      <p className="mt-1 text-sm text-charcoal/60">Frequently changed public information. No layout or design settings here.</p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Tournament" testId="content-tournament-section">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tournament edition">
              <TextInput data-testid="site-edition" value={data.edition} onChange={(e) => update({ edition: e.target.value })} />
            </Field>
            <Field label="Tournament year">
              <TextInput data-testid="site-year" value={data.year} onChange={(e) => update({ year: e.target.value })} />
            </Field>
            <Field label="Tournament date text">
              <TextInput data-testid="site-date" value={data.dateText} onChange={(e) => update({ dateText: e.target.value })} />
            </Field>
            <Field label="Instagram URL">
              <TextInput data-testid="site-instagram" value={data.instagramUrl} onChange={(e) => update({ instagramUrl: e.target.value })} />
            </Field>
          </div>
          <Field label="Hero subtitle (homepage)">
            <TextInput data-testid="site-hero-subtitle" value={data.heroSubtitle} onChange={(e) => update({ heroSubtitle: e.target.value })} />
          </Field>
          <Field label="Homepage memorial message">
            <TextArea data-testid="site-home-message" value={data.homeMessage} onChange={(e) => update({ homeMessage: e.target.value })} />
          </Field>
        </AdminSection>

        <AdminSection title="Memorial Page" testId="content-memorial-section">
          <Toggle label="Memorial page published" testId="site-memorial-published" checked={data.memorialPublished} onChange={(v) => update({ memorialPublished: v })} />
          <Toggle label="Show Share a Memory section" testId="site-share-memory" checked={data.shareMemoryEnabled} onChange={(v) => update({ shareMemoryEnabled: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Memorial hero title">
              <TextInput data-testid="site-memorial-title" value={data.memorialHeroTitle} onChange={(e) => update({ memorialHeroTitle: e.target.value })} />
            </Field>
            <Field label="Memorial hero subtitle">
              <TextInput data-testid="site-memorial-subtitle" value={data.memorialHeroSubtitle} onChange={(e) => update({ memorialHeroSubtitle: e.target.value })} />
            </Field>
          </div>
          <Field label="Story paragraphs — one per line">
            <TextArea rows={4} data-testid="site-story" value={data.story.join("\n")} onChange={(e) => update({ story: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          </Field>
          {data.milestones.map((m, i) => (
            <div key={i} className="grid grid-cols-1 gap-4 rounded-2xl border border-border p-4 sm:grid-cols-2">
              <Field label={`Milestone ${i + 1} title`}>
                <TextInput data-testid={`milestone-title-${i}`} value={m.title} onChange={(e) => updateMilestone(i, { title: e.target.value })} />
              </Field>
              <Field label={`Milestone ${i + 1} description`}>
                <TextInput data-testid={`milestone-desc-${i}`} value={m.description} onChange={(e) => updateMilestone(i, { description: e.target.value })} />
              </Field>
            </div>
          ))}
          <Field label="Closing message">
            <TextArea data-testid="site-closing" value={data.closingMessage} onChange={(e) => update({ closingMessage: e.target.value })} />
          </Field>
        </AdminSection>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
