# Supabase Storage Setup for Product Images

## Optional Setup Instructions

The ProductForm component now supports both file upload and URL input. By default, it will work with local previews if Supabase storage is not configured.

### To Enable Supabase Storage (Optional):

1. **Create Storage Bucket in Supabase Dashboard:**

   - Go to Storage → Create Bucket
   - Bucket name: `product-images`
   - Set to Public bucket

2. **Set Bucket Policies:**

   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Allow authenticated uploads" ON storage.objects
   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

   -- Allow public access to view files
   CREATE POLICY "Allow public access" ON storage.objects
   FOR SELECT USING (bucket_id = 'product-images');
   ```

3. **File Specifications:**
   - Maximum file size: 5MB per image
   - Maximum images per product: 8
   - Supported formats: JPG, PNG, GIF
   - Images are automatically resized and optimized

### Current Functionality Without Setup:

- ✅ File browser with drag & drop support
- ✅ Image previews with thumbnails
- ✅ File validation (size, type)
- ✅ Multiple image selection
- ✅ Remove individual images
- ✅ Main image indicator
- ✅ Local storage fallback

The form will work perfectly even without Supabase storage setup!
