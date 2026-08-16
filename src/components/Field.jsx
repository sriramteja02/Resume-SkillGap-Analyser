import { useState } from "react";
export default function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  type = "text",
  children,
}) {
  const [touched, setTouched] = useState(false);
  const leave = (e) => {
    setTouched(true);
    onBlur?.(e);
  };
  return (
    <div className="field">
      <label>{label}</label>
      {children || (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={leave}
          placeholder={placeholder}
        />
      )}{" "}
      {touched && error ? (
        <span className="field-error">{error}</span>
      ) : touched ? (
        <span className="field-ok">✓ Looks good</span>
      ) : null}
    </div>
  );
}
