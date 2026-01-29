function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportSvg(svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  download(blob, "diagram.svg");
}

export function exportPng(svg: string, scale: number) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const svgEl = doc.documentElement;

  const svgNode = svgEl as unknown as SVGSVGElement;
  const width =
    parseFloat(svgEl.getAttribute("width") || "0") ||
    svgNode.viewBox?.baseVal?.width ||
    800;
  const height =
    parseFloat(svgEl.getAttribute("height") || "0") ||
    svgNode.viewBox?.baseVal?.height ||
    600;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  const img = new Image();
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (blob) download(blob, `diagram@${scale}x.png`);
    }, "image/png");
  };

  img.src = url;
}
