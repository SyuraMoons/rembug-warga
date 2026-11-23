"use client";

import { QRCodeSVG } from "qrcode.react";

export function BoothQR({ url, size = 160 }: { url: string; size?: number }) {
  return (
    <div className="inline-flex flex-col items-center gap-2 rounded-lg bg-white p-4 ring-1 ring-slate-200">
      <QRCodeSVG value={url} size={size} fgColor="#1e338a" level="M" marginSize={1} title="Kode QR ke Rembug Warga" />
      <span className="max-w-[14rem] break-all text-center text-xs font-semibold text-slate-600">{url.replace(/^https?:\/\//, "")}</span>
    </div>
  );
}
