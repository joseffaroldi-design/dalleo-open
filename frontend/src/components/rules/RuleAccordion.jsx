import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const RuleAccordion = ({ items, testId }) => {
  const [openId, setOpenId] = useState(null);
  return (
    <div data-testid={testId} className="flex flex-col gap-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border"
          >
            <h3>
              <button
                type="button"
                data-testid={`${testId}-trigger-${item.id}`}
                id={`${testId}-trigger-${item.id}`}
                aria-expanded={open}
                aria-controls={`${testId}-panel-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-extrabold text-charcoal transition-colors duration-200 hover:text-forest sm:px-6"
              >
                {item.title}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-forest transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`${testId}-panel-${item.id}`}
              role="region"
              aria-labelledby={`${testId}-trigger-${item.id}`}
              hidden={!open}
              className="px-5 pb-5 text-sm leading-relaxed text-charcoal/70 sm:px-6 sm:text-base"
            >
              {item.body}
            </div>
          </div>
        );
      })}
    </div>
  );
};
