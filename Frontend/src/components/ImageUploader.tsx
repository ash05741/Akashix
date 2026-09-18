import React, { useState } from 'react';
import { UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploaderProps {
    label: string;
    folder: 'workspaces' | 'avatars';
    currentImage?: string | null;
    onUploadSuccess: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    label,
    folder,
    currentImage,
    onUploadSuccess
}) => {
    const { uploadImage, isUploading } = useImageUpload();
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optional: Block files larger than 5MB
        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg('File must be under 5MB');
            return;
        }

        // Instantly show local preview for a snappy UI
        setPreview(URL.createObjectURL(file));
        setErrorMsg(null);

        try {
            const permanentUrl = await uploadImage(file, folder);
            onUploadSuccess(permanentUrl);
        } catch (err) {
            setErrorMsg('Upload failed. Try again.');
            setPreview(currentImage || null); // revert on failure
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                {label}
            </label>

            <div className="flex items-center gap-4">
                {/* Thumbnail Preview */}
                <div className="w-16 h-16 rounded-2xl bg-[#081B21] border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-[#d9a05b] opacity-60" />
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-[#081B21]/80 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-[#d9a05b]" />
                        </div>
                    )}
                </div>

                {/* Upload Action */}
                <div className="flex-1">
                    <input
                        type="file"
                        id={`file-upload-${folder}`}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    <label
                        htmlFor={`file-upload-${folder}`}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm font-mono
              ${isUploading
                                ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:border-[#d9a05b] hover:text-[#d9a05b]'
                            }
            `}
                    >
                        {isUploading ? (
                            <>Processing...</>
                        ) : preview ? (
                            <>Replace Image</>
                        ) : (
                            <><UploadCloud className="w-4 h-4" /> Select File</>
                        )}
                    </label>
                    {errorMsg && (
                        <p className="text-[10px] text-red-500 mt-1 uppercase font-mono">{errorMsg}</p>
                    )}
                </div>
            </div>
        </div>
    );
};