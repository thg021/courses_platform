"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
};

export function FileUpload({
    onChange,
    endpoint
}: FileUploadProps) {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log("res", res)
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                console.log("error", error)
                toast.error(`${error?.message}`);
            }}
        />
    )
}