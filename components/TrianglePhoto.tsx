import Image from "next/image";

/** An uploaded triangle photo, cropped to fill its container. */
export default function TrianglePhoto({
  src,
  alt,
  className = "",
  sizes = "(max-width: 448px) 100vw, 448px",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </span>
  );
}
