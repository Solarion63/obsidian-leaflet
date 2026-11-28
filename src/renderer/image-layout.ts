/** Pure geometry for opt-in image block layout; does not change map coordinates. */
export function imageAspect(width: number, height: number): number | undefined {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return undefined;
    const ratio = width / height;
    return Number.isFinite(ratio) && ratio > 0 ? ratio : undefined;
}

export function aspectHeight(width: number, ratio: number): number | undefined {
    if (!Number.isFinite(width) || !Number.isFinite(ratio) || width <= 0 || ratio <= 0) return undefined;
    const height = Math.round(width / ratio);
    return Number.isFinite(height) && height > 0 ? height : undefined;
}

/** Expand symmetrically around the existing block, within the actual pane content box. */
export function expandedWidth(blockLeft: number, blockWidth: number, paneLeft: number, paneRight: number): number | undefined {
    if (![blockLeft, blockWidth, paneLeft, paneRight].every(Number.isFinite) || blockWidth <= 0 || paneRight <= paneLeft) return undefined;
    const center = blockLeft + blockWidth / 2;
    const available = Math.floor(2 * Math.min(center - paneLeft, paneRight - center));
    return available > 0 ? Math.min(Math.floor(blockWidth + Math.max(0, available - blockWidth)), available) : undefined;
}
