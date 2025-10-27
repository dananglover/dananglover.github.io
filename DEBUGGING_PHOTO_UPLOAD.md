# Debugging Photo Upload Issues

## Problem

When you try to upload photos for places (create or edit), you don't see any upload requests in the browser's Network tab (DevTools).

## Solution Steps

### 1. Open Browser Console

1. Press `F12` (or `Cmd+Option+I` on Mac) to open DevTools
2. Go to the **Console** tab
3. Keep it open while testing photo upload

### 2. Test Photo Upload

1. Navigate to "Places" → "Add New Place" (or edit an existing place)
2. Fill in all required fields
3. **Select a photo** using the file picker
4. Click "Create Place" (or "Update Place")
5. **Check the Console tab** for logs

### 3. What to Look For

You should see logs in this order:

```
Files selected: [{name: "photo.jpg", size: 123456, type: "image/jpeg"}]
```

```
Submitting form... {name: "Place Name", photoCount: 1, photos: [...], userId: "..."}
```

```
PlaceService.createPlace called with: {photoCount: 1, photos: [...]}
```

```
Validations passed, calling repository...
```

```
PlaceRepository.createPlace - Received data: {photoCount: 1, photos: [...]}
```

```
Uploading photo: photo.jpg Size: 123456
```

```
Uploading to Supabase storage with filename: 1234567890-abc123.jpg
```

```
Photo uploaded successfully, getting public URL...
```

```
Public URL: https://[your-project].supabase.co/storage/v1/object/public/place-photos/...
```

### 4. Common Issues

#### If you see "Files selected" but "photoCount: 0" when submitting

**Problem**: Files are being lost from form state.

**Solution**: This is a React state issue. Check if you're accidentally resetting the form.

#### If you see an error about "bucket not found" or "permission denied"

**Problem**: Supabase storage not set up properly.

**Solution**: 
1. Follow the `SUPABASE_STORAGE_SETUP.md` guide
2. Create the `place-photos` bucket in Supabase dashboard
3. Make sure it's marked as **public**
4. Run the storage policies SQL from `database_policies.sql`

#### If you don't see "Files selected" at all

**Problem**: File input is not firing the change event.

**Check**:
1. Make sure you're actually selecting files (not just clicking the button)
2. Try refreshing the page
3. Check if there are JavaScript errors in the console

#### If photos are reaching repository but upload fails

**Check the console error message**:
- `"bucket not found"` → Bucket needs to be created
- `"new row violates row-level security policy"` → Storage policies need to be set up
- `"The resource already exists"` → Try again (timing issue)
- `"request entity too large"` → Photo is too big (should be max 10MB)

### 5. Network Tab

The upload to Supabase Storage will show as:
- **Method**: POST
- **URL**: `https://[your-project].supabase.co/storage/v1/object/place-photos/...`
- **Type**: `fetch` or `xhr`

If you don't see this request in the Network tab:
1. The photos aren't reaching the upload code
2. Check the console logs to see where they're getting lost

### 6. Quick Test

Run this in the browser console on the create place page:

```javascript
// Check if formData has photos
console.log('Current form state:', window.__PLACE_FORM_DEBUG);
```

Actually, the console logs we added will show you exactly what's in formData.

### 7. Manual Storage Test

To verify Supabase Storage is working:

1. Go to your Supabase dashboard
2. Storage → place-photos bucket
3. Try uploading a file manually
4. If that works, the issue is in the app code
5. If that fails, the bucket/policies aren't set up correctly

### 8. Still Having Issues?

Share the console output with me. The logs will tell us exactly where the photos are getting lost in the flow.

## What to Report

If you're still having issues, please share:

1. The console output (all the logs you see)
2. The Network tab (filter by "place-photos" to see if any requests are made)
3. Any error messages
4. What browser you're using
5. Whether you're able to manually upload files to the Supabase Storage dashboard

