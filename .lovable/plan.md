# Upload images directly in the admin dashboard

Right now the admin forms for listings, team members, and blog posts ask for an image URL. Admins will instead pick a file from their device (or drag it in), see it upload with a preview, and have it saved automatically.

## What changes

**New image upload control** used in three places:
- Listing form — cover image
- Team member form — staff photo
- Blog post form — cover image

Behaviour:
- Click to choose a file, or drag and drop onto the box
- Accepts JPG, PNG, WebP; max 5 MB per image
- Shows a thumbnail preview once uploaded, with a "Remove" button to clear it
- Shows an upload progress/spinner state and a clear error message if the upload fails
- Existing images keep working — anything already saved shows as the current preview
- A small "paste a link instead" toggle stays available as a fallback, so nothing you already have breaks

## Where the files live

Images go into a public media library in your own backend storage, organised in folders (`listings/`, `team/`, `blog/`). Only signed-in admins/editors can upload, replace, or delete; visitors can only view them. Filenames are randomised so two uploads with the same name never clash.

## Technical notes

- Migration: create a public storage bucket `media`, plus policies on `storage.objects` — public read for that bucket; insert/update/delete restricted to `public.has_role(auth.uid(), 'admin')` or `'editor'`.
- New component `src/components/admin/image-upload.tsx`: uploads via the browser Supabase client to `media/<folder>/<uuid>.<ext>`, returns the public URL, and calls `onChange(url)`.
- Wire it into the three forms in `src/routes/_authenticated/admin.tsx`, replacing the plain `Input` for `cover_image_url` and `photo_url`. Field names and database columns stay the same, so all public pages continue to work unchanged.
- Client-side validation of file type and size before upload.
