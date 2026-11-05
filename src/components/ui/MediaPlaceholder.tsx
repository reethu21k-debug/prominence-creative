// Clearly marked stand-in. Replace with a Cloudinary image or video poster.
export default function MediaPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`relative flex items-end overflow-hidden bg-bg-3 ${className}`} role="img" aria-label={`Placeholder: ${label}`}>
      <p className="micro relative p-4">Placeholder / {label}</p>
    </div>
  );
}
