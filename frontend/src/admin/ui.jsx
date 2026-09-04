import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-charcoal shadow-sm transition-colors duration-200 focus:border-forest";

export const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="text-sm font-bold text-charcoal">{label}</span>
    <span className="mt-1.5 block">{children}</span>
    {hint && <span className="mt-1 block text-xs text-charcoal/50">{hint}</span>}
  </label>
);

export const TextInput = (props) => <input {...props} className={inputCls} />;
export const TextArea = ({ rows = 3, ...props }) => <textarea rows={rows} {...props} className={inputCls} />;
export const SelectInput = ({ options, ...props }) => (
  <select {...props} className={inputCls}>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

export const Toggle = ({ label, checked, onChange, testId }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    data-testid={testId}
    onClick={() => onChange(!checked)}
    className="flex min-h-12 w-full items-center justify-between gap-4 rounded-xl border border-border bg-white px-4 py-3 shadow-sm"
  >
    <span className="text-sm font-bold text-charcoal">{label}</span>
    <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-forest" : "bg-charcoal/20"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </span>
  </button>
);

export const SaveBar = ({ onSave, saving, saved, error }) => (
  <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-border">
    <button
      type="button"
      data-testid="save-button"
      onClick={onSave}
      disabled={saving}
      className="min-h-12 rounded-full bg-forest px-8 py-3 text-base font-extrabold text-cream shadow-sm transition-colors duration-200 hover:bg-forest-soft disabled:opacity-60"
    >
      {saving ? "Saving…" : "Save Changes"}
    </button>
    {saved && (
      <span role="status" data-testid="save-success" className="text-sm font-bold text-forest">
        Saved — public pages updated
      </span>
    )}
    {error && (
      <span role="alert" data-testid="save-error" className="text-sm font-bold text-red-700">
        {error}
      </span>
    )}
  </div>
);

export const ConfirmDelete = ({ onConfirm, testId }) => {
  const [armed, setArmed] = useState(false);
  if (armed) {
    return (
      <span className="inline-flex items-center gap-2" role="alertdialog" aria-label="Confirm deletion">
        <button
          type="button"
          data-testid={`${testId}-confirm`}
          onClick={() => { onConfirm(); setArmed(false); }}
          className="min-h-10 rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white"
        >
          Confirm delete
        </button>
        <button
          type="button"
          data-testid={`${testId}-cancel`}
          onClick={() => setArmed(false)}
          className="min-h-10 rounded-full bg-charcoal/10 px-4 py-2 text-sm font-bold text-charcoal"
        >
          Cancel
        </button>
      </span>
    );
  }
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={() => setArmed(true)}
      className="min-h-10 rounded-full bg-red-700/10 px-4 py-2 text-sm font-bold text-red-700 transition-colors duration-200 hover:bg-red-700/20"
    >
      Delete
    </button>
  );
};

export const AdminSection = ({ title, description, testId, children }) => (
  <section data-testid={testId} aria-label={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
    <h2 className="text-xl font-extrabold tracking-tight text-forest">{title}</h2>
    {description && <p className="mt-1 text-sm text-charcoal/60">{description}</p>}
    <div className="mt-6 flex flex-col gap-5">{children}</div>
  </section>
);

export const useAdminDomain = (domain, seedFn) => {
  const queryClient = useQueryClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    adminFetch(`/admin/${domain}`)
      .then((res) => active && setData(res.data ?? seedFn()))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await adminFetch(`/admin/${domain}`, { method: "PUT", body: JSON.stringify({ data }) });
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["public", domain] });
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [data, domain, queryClient]);

  return { data, setData, loading, saving, saved, error, save };
};

export const AdminLoading = () => (
  <p data-testid="admin-loading" className="py-16 text-center text-sm font-semibold text-charcoal/50">
    Loading…
  </p>
);
