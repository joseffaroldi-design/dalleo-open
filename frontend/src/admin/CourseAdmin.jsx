import { SEED } from "@/admin/seedData";
import { TopicList } from "@/admin/RulesAdmin";
import {
  useAdminDomain, AdminSection, AdminLoading, Field, TextInput,
  Toggle, SaveBar,
} from "@/admin/ui";

export default function CourseAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useAdminDomain("course", SEED.course);

  if (loading || !data) return <AdminLoading />;

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  return (
    <div data-testid="course-admin">
      <h1 className="text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">The Course</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Course identity and good-to-know notes shown on the public Course page and linked from the Schedule. The 18-hole scorecard uses the pars from the Scoring section.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <AdminSection title="Publication" testId="course-publish-section">
          <Toggle
            label="Course page visible on the public site"
            testId="course-published"
            checked={data.published}
            onChange={(v) => update({ published: v })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Course name">
              <TextInput
                data-testid="course-name"
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </Field>
            <Field label="Location (optional)" hint="City, address, or directions note.">
              <TextInput
                data-testid="course-location"
                value={data.location}
                onChange={(e) => update({ location: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Facts line" hint="Shown on the Course page, Schedule card, and leaderboard.">
            <TextInput
              data-testid="course-label"
              value={data.label}
              onChange={(e) => update({ label: e.target.value })}
              placeholder="Black Tees · Par 72 · 7,092 Yards · Rating 74.3 · Slope 135"
            />
          </Field>
        </AdminSection>

        <TopicList
          title="Good to Know"
          items={data.goodToKnow}
          onChange={(v) => update({ goodToKnow: v })}
          testId="course-good-to-know-list"
        />
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
