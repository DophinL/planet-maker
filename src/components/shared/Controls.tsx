import type { InputHTMLAttributes, ReactNode } from "react";

export function PanelSection({
  title,
  description,
  action,
  children
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel-section">
      <div className="section-heading">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function RangeField({
  label,
  valueLabel,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  valueLabel?: string;
}) {
  return (
    <label className="range-field">
      <span>
        {label}
        <output>{valueLabel ?? props.value}</output>
      </span>
      <input type="range" {...props} />
    </label>
  );
}

export function SwitchField({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="switch-field">
      <span>
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty-state">{children}</div>;
}
