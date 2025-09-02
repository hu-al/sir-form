import { ChangeEvent } from "react";

type MyInputProps = {
  id: string;
  label?: string;
  error?: string | null;
  value: string | null;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
};

const MyInput = ({
  id,
  label,
  error,
  value,
  onChange,
  ...rest
}: MyInputProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {label || "no label"}
      <input id={id} value={value || ""} onChange={onChange} {...rest} />
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
};

export default MyInput;
