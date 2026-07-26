export async function compressImageToBase64(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxDim = 800;
  let w = bitmap.width;
  let h = bitmap.height;

  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((h / w) * maxDim);
      w = maxDim;
    } else {
      w = Math.round((w / h) * maxDim);
      h = maxDim;
    }
  }

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.8 });
  const buffer = await blob.arrayBuffer();
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
}
