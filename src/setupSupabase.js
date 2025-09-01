// setupSupabase.js
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const supabase = createClient(
  "https://<project>.supabase.co",
  "<your-anon-key>"
);

// Create products bucket
async function createBucket() {
  const { data, error } = await supabase.storage.createBucket("products", {
    public: true,
  });
  if (error) {
    console.error("Error creating bucket:", error);
  } else {
    console.log("Bucket created:", data);
  }
  return data;
}

// Bulk upload images
async function bulkUploadImages(folderPath, bucketName) {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(file, await fs.readFile(filePath), {
          contentType: "image/jpeg",
        });
      if (error) {
        console.error(`Error uploading ${file}:`, error);
      } else {
        console.log(`Uploaded ${file}`);
      }
    }
  } catch (err) {
    console.error("Error reading folder:", err);
  }
}

// Update products table with image URLs
async function updateProductImages() {
  const products = [
    {
      id: "11111111-1111-1111-1111-000000000001",
      imageFilenames: ["iphone15_1.jpg", "iphone15_2.jpg", "iphone15_3.jpg"],
    },
    {
      id: "11111111-1111-1111-1111-000000000002",
      imageFilenames: [
        "galaxy_s24_1.jpg",
        "galaxy_s24_2.jpg",
        "galaxy_s24_3.jpg",
      ],
    },
    // Add entries for all 30 products with their respective image filenames
  ];

  for (const product of products) {
    const imageUrls = product.imageFilenames.map(
      (filename) =>
        `https://<project>.supabase.co/storage/v1/object/public/products/${filename}`
    );
    const { error } = await supabase
      .from("products")
      .update({ images: imageUrls })
      .eq("id", product.id);
    if (error) {
      console.error(`Error updating product ${product.id}:`, error);
    } else {
      console.log(`Updated images for product ${product.id}`);
    }
  }
}

async function main() {
  await createBucket();
  await bulkUploadImages("./images/products", "products");
  await updateProductImages();
}

main();
