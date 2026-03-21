"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageDropZoneProps {
  label: string;
  type: "main" | "thumb";
  lureId: string;
  currentImageUrl?: string;
  onUploaded?: (url: string) => void;
}

export default function ImageDropZone({
  label,
  type,
  lureId,
  currentImageUrl,
  onUploaded,
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!lureId) {
      setError("lure_idが未設定です。先にルアーを保存してください。");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lureId", lureId);
    formData.append("type", type);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "アップロードに失敗しました");
      }

      const data = await res.json();
      setPreviewUrl(data.url);
      onUploaded?.(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  }, [lureId, type, onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="py-8 text-gray-500 text-sm">アップロード中...</div>
        ) : displayUrl ? (
          <div className="relative">
            <Image
              src={displayUrl}
              alt={label}
              width={200}
              height={150}
              className="mx-auto object-contain"
              style={{ maxHeight: "150px" }}
              unoptimized
            />
            <div className="mt-2 text-xs text-gray-500">
              クリックまたはドラッグ&ドロップで変更
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="text-gray-400 text-sm">
              画像をドラッグ&ドロップ
            </div>
            <div className="text-gray-400 text-xs mt-1">
              またはクリックして選択
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}

      <div className="text-xs text-gray-400 mt-1">
        ファイル名: {lureId ? `${lureId}_${type}.png` : "lure_id未設定"}
      </div>
    </div>
  );
}
