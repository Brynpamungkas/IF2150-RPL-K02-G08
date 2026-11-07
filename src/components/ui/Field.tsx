import type { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Pesan galat untuk kolom ini; kolom ditandai merah bila ada. */
  galat?: string;
  opsional?: boolean;
}

/** Kolom form sesuai prototipe: label, input, dan pesan galat. */
export function Field({ label, galat, opsional, id, ...sisa }: FieldProps) {
  const idKolom = id ?? sisa.name;
  return (
    <div className="field">
      <label htmlFor={idKolom}>
        {label}
        {opsional && (
          <>
            {' '}
            <span className="opt">(optional)</span>
          </>
        )}
      </label>
      <input
        id={idKolom}
        className={`inp${galat ? ' err' : ''}`}
        aria-invalid={galat ? true : undefined}
        aria-describedby={galat ? `${idKolom}-err` : undefined}
        {...sisa}
      />
      {galat && (
        <span className="err-msg" id={`${idKolom}-err`}>
          {galat}
        </span>
      )}
    </div>
  );
}
