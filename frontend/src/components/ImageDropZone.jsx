import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

export default function ImageDropZone({
  value,
  onChange,
  error,
  placeholder = "Drag & drop an image here, or click to select",
  className,
  previewClassName
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

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={clsx(
          `
            cursor-pointer border-2 border-dashed rounded-xl
            flex items-center justify-center
            transition
            w-40
            min-h-[120px]
          `,
          isDragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-400 bg-white",
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
