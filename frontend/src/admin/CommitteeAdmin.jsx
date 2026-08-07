import { SEED } from "@/admin/seedData";
import { ImageUpload } from "@/admin/ImageUpload";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput, TextArea, SaveBar,
} from "@/admin/ui";

export default function CommitteeAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("committee", SEED.committee);

  if (loading || !data) return <AdminLoading />;

  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const updateMember = (index, patch) =>
    setData((d) => ({ ...d, members: d.members.map((m, i) => (i === index ? { ...m, ...patch } : m)) }));

  return (
    <div data-testid="committee-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">Committee</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Committee &amp; Leadership page content — member photos appear in the circle next to each name on the public Committee page. Leave optional fields empty to hide them.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Page" testId="committee-page-section">
          <Field label="Page title">
            <TextInput
              data-testid="committee-title"
              value={data.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </Field>
          <Field label="Intro">
            <TextArea
              rows={3}
              data-testid="committee-intro"
              value={data.intro}
              onChange={(e) => update({ intro: e.target.value })}
            />
          </Field>
        </AdminSection>

        {data.members.map((m, i) => (
          <AdminSection key={`member-${i}`} title={m.name} testId={`member-editor-${i + 1}`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name">
                <TextInput
                  data-testid={`member-name-${i + 1}`}
                  value={m.name}
                  onChange={(e) => updateMember(i, { name: e.target.value })}
                />
              </Field>
              <Field label="Years (optional)" hint='For example: "2020 – Present"'>
                <TextInput
                  data-testid={`member-years-${i + 1}`}
                  value={m.years ?? ""}
                  onChange={(e) => updateMember(i, { years: e.target.value || null })}
                />
              </Field>
            </div>
            <Field label="Titles — one per line">
              <TextArea
                rows={Math.max(2, m.titles.length + 1)}
                data-testid={`member-titles-${i + 1}`}
                value={m.titles.join("\n")}
                onChange={(e) => updateMember(i, { titles: e.target.value.split("\n").map((t) => t.trim()) })}
              />
            </Field>
            <Field label="Bio (optional)">
              <TextArea
                rows={3}
                data-testid={`member-bio-${i + 1}`}
                value={m.bio ?? ""}
                onChange={(e) => updateMember(i, { bio: e.target.value || null })}
              />
            </Field>
            <Field label="Memory of Brandon (optional)" hint="Shown as a quote on the member's card.">
              <TextArea
                rows={2}
                data-testid={`member-memory-${i + 1}`}
                value={m.memory ?? ""}
                onChange={(e) => updateMember(i, { memory: e.target.value || null })}
              />
            </Field>
            <Field label="Photo (optional)" hint="Shown in the circle next to the name on the Committee page.">
              <ImageUpload
                testId={`member-photo-upload-${i + 1}`}
                value={m.photoUrl ?? ""}
                onChange={(url) => updateMember(i, { photoUrl: url || null })}
                previewClass="h-14 w-14 rounded-full"
              />
            </Field>
          </AdminSection>
        ))}
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
