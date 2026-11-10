interface AksiMuatLagiProps {
  memuatLagi: boolean;
  galat: string | null;
  onMuatLagi: () => void;
}


export function AksiMuatLagi({
  memuatLagi,
  galat,
  onMuatLagi,
}: AksiMuatLagiProps) {
  return (
    <>
      {galat && (
        <p className="small" role="alert">
          {galat}
        </p>
      )}
      <button
        type="button"
        className="btn btn-ghost"
        onClick={onMuatLagi}
        disabled={memuatLagi}
      >
        {memuatLagi ? 'Loading…' : galat ? 'Try again' : 'Show more'}
      </button>
    </>
  );
}
