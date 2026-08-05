import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { getToken } from "@/lib/api";

// Reusable photo upload for admin editors. Uploads to object storage via
// /api/admin/uploads and calls onChange with the public /api/files URL.
export const ImageUpload = ({ label, hint, value, onChange, testId, previewClass = "h-24 w-24", accept = "image/jpeg,image/png,image/webp,image/gif" }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const isVideo = value ? /\.(mp4|webm|mov)(\?|$)/i.test(value) : accept.startsWith("video");

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/uploads`, {
        method: "POST",
        headers: { ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
        body: form,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body.detail === "string" ? body.detail : "Upload failed");
      }
      onChange(body.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {label && <span className="text-sm font-bold text-charcoal">{label}</span>}
      <div className="mt-1.5 flex items-center gap-4">
        {value && isVideo ? (
          <video
            src={value}
            muted
            playsInline
            preload="metadata"
            data-testid={`${testId}-preview`}
            className={`rounded-xl bg-charcoal object-cover ring-1 ring-border ${previewClass}`}
          />
        ) : value ? (
          <img
            src={value}
            alt={label ?? "Uploaded photo"}
            data-testid={`${testId}-preview`}
            className={`rounded-xl bg-forest-mist object-cover ring-1 ring-border ${previewClass}`}
          />
        ) : (
          <span
            aria-hidden="true"
            className={`flex items-center justify-center rounded-xl bg-forest-mist text-forest/40 ring-1 ring-dashed ring-forest/20 ${previewClass}`}
          >
            <ImagePlus className="h-7 w-7" />
          </span>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            data-testid={testId}
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="min-h-11 rounded-full bg-forest px-5 py-2.5 text-sm font-extrabold text-cream transition-colors duration-200 hover:bg-forest-soft disabled:opacity-50"
          >
            {busy ? "Uploading…" : value ? (isVideo ? "Replace video" : "Replace photo") : isVideo ? "Upload video" : "Upload photo"}
          </button>
          {value && (
            <button
              type="button"
              data-testid={`${testId}-remove`}
              onClick={() => onChange("")}
              className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full bg-charcoal/10 px-4 py-1.5 text-xs font-bold text-charcoal transition-colors duration-200 hover:bg-charcoal/15"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-xs font-semibold text-charcoal/45">{hint}</p>}
      {error && (
        <p role="alert" data-testid={`${testId}-error`} className="mt-1.5 text-sm font-bold text-red-700">
          {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={upload}
        aria-label={label ?? "Upload media"}
      />
    </div>
  );
};
