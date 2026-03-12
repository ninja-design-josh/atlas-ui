"use client";

import * as React from "react";

export type ControlDef =
  | { prop: string; type: "enum";    options: string[]; default: string  }
  | { prop: string; type: "boolean";                    default: boolean }
  | { prop: string; type: "string";                     default: string  };

export type ControlValues = Record<string, string | boolean>;

interface PropsEditorProps {
  controls: ControlDef[];
  values: ControlValues;
  onChange: (prop: string, value: string | boolean) => void;
}

export function PropsEditor({ controls, values, onChange }: PropsEditorProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-surface-subtle border-t border-border rounded-b-sm">
      {controls.map((ctrl) => (
        <div key={ctrl.prop} className="flex flex-col gap-1 min-w-[120px]">
          <label className="text-[10px] font-medium uppercase tracking-widest text-text-secondary">
            {ctrl.prop}
          </label>
          {ctrl.type === "enum" && (
            <select
              value={values[ctrl.prop] as string}
              onChange={(e) => onChange(ctrl.prop, e.target.value)}
              className="h-7 rounded-sm border border-border bg-surface px-2 text-xs text-text-primary focus:outline-none focus:border-blue-100"
            >
              {ctrl.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          {ctrl.type === "boolean" && (
            <input
              type="checkbox"
              checked={values[ctrl.prop] as boolean}
              onChange={(e) => onChange(ctrl.prop, e.target.checked)}
              className="h-4 w-4 rounded border-border accent-blue-100"
            />
          )}
          {ctrl.type === "string" && (
            <input
              type="text"
              value={values[ctrl.prop] as string}
              onChange={(e) => onChange(ctrl.prop, e.target.value)}
              className="h-7 rounded-sm border border-border bg-surface px-2 text-xs text-text-primary focus:outline-none focus:border-blue-100"
            />
          )}
        </div>
      ))}
    </div>
  );
}

/** Returns an initial values object from a ControlDef array */
export function initControlValues(controls: ControlDef[]): ControlValues {
  return Object.fromEntries(controls.map((c) => [c.prop, c.default]));
}
