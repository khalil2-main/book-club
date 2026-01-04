import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

export default function ImageDropZone({
  value,
  onChange,
  error,
  placeholder = "Drag & drop an image here, or click to select",
  className,
  previewClassName,
  previewAlign
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles.length) return;
      onChange(acceptedFiles[0]);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
      maxSize: 5 * 1024 * 1024
    });
    const alignmentClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center",
    bottom: "items-end justify-center",
    left: "items-center justify-start",
    right: "items-center justify-end"
  };


  
  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={clsx(
          `
            cursor-pointer rounded-xl
            flex items-center justify-center
            transition
            w-full
            min-h-[120px]
          `,
          alignmentClasses[previewAlign],
          isDragActive
            ? " border-2 border-dashed border-indigo-500 bg-indigo-50 "
            : "border-0 bg-transparent",
          isDragReject && "border-red-500 bg-red-50",
          className
        )}
      >
        <input {...getInputProps()} />

        {value ? (
          <img
            src={value}
            alt="Preview"
            className={clsx(
              "object-cover rounded shadow max-w-full max-h-full",
              previewClassName
            )}
          />
        ) : (
          <p className="text-gray-500 text-center text-sm px-3">
            {isDragActive ? "Drop the image here…" : placeholder}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
