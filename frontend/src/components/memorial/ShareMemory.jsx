import { MessageCircleHeart } from "lucide-react";

export const ShareMemory = ({ content }) => (
  <section
    data-testid="share-memory"
    aria-labelledby="share-memory-title"
    className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <div className="rounded-3xl bg-forest-mist p-8 text-center sm:p-12">
      <span
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-forest shadow-sm"
      >
        <MessageCircleHeart className="h-6 w-6" />
      </span>
      <h2
        id="share-memory-title"
        className="mt-6 text-2xl font-extrabold tracking-tight text-forest sm:text-3xl"
      >
        {content.title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-charcoal/70">
        {content.body}
      </p>
    </div>
  </section>
);
