const CLOUDINARY_UPLOAD = "https://res.cloudinary.com/";
const UPLOAD_SEGMENT = "/image/upload/";

/**
 * Cloudinary delivery URL for one width: f_auto picks AVIF/WebP, q_auto picks the quality, c_limit never enlarges
 * the original. A URL that already carries a transformation, or is not an uploaded Cloudinary image, is returned as is.
 */
export function cloudinaryUrl(src: string, width: number): string {
    if (!src.startsWith(CLOUDINARY_UPLOAD)) return src;
    const at = src.indexOf(UPLOAD_SEGMENT);
    if (at === -1) return src;
    const head = src.slice(0, at + UPLOAD_SEGMENT.length);
    const rest = src.slice(at + UPLOAD_SEGMENT.length);
    // after /upload/ comes either a version (v123/…) or the public ID; anything else is an existing transformation
    const first = rest.split("/")[0];
    if (!/^v\d+$/.test(first) && first !== "haitech") return src;
    return `${head}f_auto,q_auto,c_limit,w_${width}/${rest}`;
}

/** next/image loader (images.loaderFile): Cloudinary resizes and re-encodes, so the app server never has to. */
export default function cloudinaryLoader({ src, width }: { src: string; width: number; quality?: number }): string {
    if (src.startsWith("/")) return `${src}?w=${width}`; // a file in public/ (the placeholder): served as it is
    return cloudinaryUrl(src, width);
}
