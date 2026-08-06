import { useRef, useState } from "react";
import { Loader2, Upload, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({
  label,
  folder,
  value,
  onChange,
  className = "",
}: {
  label: string;
  folder: "listings" | "team" | "blog";
  value: string;
  onChange: (url: string) => void;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [manual, setManual] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!ACCEPTED.includes(file.type)) return toast.error("Use a JPG, PNG or WebP image");
    if (file.size > MAX_BYTES) return toast.error("Image must be under 5 MB");

    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    setUploading(false);
    if (error) return toast.error(error.message);
    onChange(`/api/public/media/${path}`);
    toast.success("Image uploaded");
  };

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <button
          type="button"
          onClick={() => setManual((m) => !m)}
          className="flex items-center gap-1 text-[0.7rem] text-muted-foreground hover:text-foreground"
        >
          <LinkIcon className="h-3 w-3" /> {manual ? "Upload a file" : "Paste a link instead"}
        </button>
      </div>

      {manual ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      ) : value ? (
        <div className="flex items-center gap-3 rounded-md border p-2">
          <img src={value} alt="" className="h-20 w-28 rounded object-cover bg-muted" />
          <div className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{value}</div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-md border p-1.5 text-destructive"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void upload(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed px-4 py-6 text-center text-xs transition ${
            dragOver ? "border-gold bg-gold/5" : "border-input bg-background hover:bg-secondary/40"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
              <span className="text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-gold" />
              <span className="font-medium">Click to upload or drag an image here</span>
              <span className="text-muted-foreground">JPG, PNG or WebP · max 5 MB</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
