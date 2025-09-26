import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "../../admin/ui/button";
import { Label } from "../../admin/ui/label";
import { Badge } from "../../admin/ui/badge";
import { Upload, X, Plus, ImageIcon } from "lucide-react";
import supabase from "../../../supabase";

interface ImageUploadProps {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
  disabled?: boolean;
}

export interface ImageUploadRef {
  uploadAllImages: () => Promise<string[]>;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ imageUrls, onImagesChange, disabled }, ref) => {
    const [uploadingImages, setUploadingImages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };

    // Upload a single file to Supabase storage
    const uploadToSupabase = async (file: File): Promise<string> => {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error } = await supabase.storage
          .from("product_images")
          .upload(fileName, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("product_images").getPublicUrl(fileName);

        return publicUrl;
      } catch (error) {
        console.warn("Upload failed, using local preview:", error);
        return URL.createObjectURL(file); // fallback to blob
      }
    };

    const handleFileSelect = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = Array.from(event.target.files || []);
      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          alert(`${file.name} is not a valid image file`);
          return false;
        }
        if (file.size > maxSizeInBytes) {
          alert(`${file.name} is too large. Max ${maxSizeInMB}MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Limit total images to 8
      const totalImages = imageUrls.length + validFiles.length;
      if (totalImages > 8) {
        alert(
          `You can only upload up to 8 images. You currently have ${imageUrls.length}`
        );
        return;
      }

      setUploadingImages(true);

      try {
        // 1️⃣ Show temporary preview immediately
        const previewUrls = validFiles.map((f) => URL.createObjectURL(f));
        onImagesChange([...imageUrls, ...previewUrls]);

        // 2️⃣ Upload files to Supabase in parallel
        const uploadedUrls = await Promise.all(
          validFiles.map((file) => uploadToSupabase(file))
        );

        // 3️⃣ Replace blob URLs with Supabase public URLs
        const finalUrls = [...imageUrls]; // existing images
        uploadedUrls.forEach((url, index) => {
          finalUrls.push(url);
        });

        onImagesChange(finalUrls);
      } catch (err) {
        console.error("Failed to upload images:", err);
      } finally {
        setUploadingImages(false);
      }

      // Reset input
      event.target.value = "";
    };

    const removeImageUrl = async (index: number) => {
      const urlToRemove = imageUrls[index];
      const newUrls = imageUrls.filter((_, i) => i !== index);
      onImagesChange(newUrls);

      // Delete from Supabase if it’s a permanent URL
      if (urlToRemove.includes("supabase")) {
        try {
          const fileName = urlToRemove.split("/").pop()!;
          const { error } = await supabase.storage
            .from("product_images")
            .remove([fileName]);

          if (error) console.error("Error deleting image:", error);
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }
    };

    // For parent component
    useImperativeHandle(ref, () => ({
      uploadAllImages: async () => imageUrls,
    }));

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Product Images
        </h3>

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            onClick={triggerFileInput}
            variant="outline"
            className="flex-1"
            disabled={uploadingImages || disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadingImages ? "Uploading..." : "Browse Images"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={triggerFileInput}
            disabled={uploadingImages || disabled}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {imageUrls.length > 0 && (
          <div className="space-y-2">
            <Label>Product Images ({imageUrls.length})</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg overflow-hidden aspect-square"
                >
                  <img
                    src={url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImageUrl(index)}
                      className="h-8 w-8 p-0"
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="default"
                        className="text-xs bg-blue-500 text-white"
                      >
                        Main
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
