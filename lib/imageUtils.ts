export function generateBlurDataURL(
  width: number,
  height: number,
  color: string = '#ffffff'
): string {
  // 透明なSVGプレースホルダー（ほぼ見えない）
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}" opacity="0"/>
    </svg>
  `;

  // Node.js環境ではBuffer、ブラウザ環境ではbtoaを使用
  if (typeof Buffer !== 'undefined') {
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  } else {
    const base64 = btoa(svg);
    return `data:image/svg+xml;base64,${base64}`;
  }
}
