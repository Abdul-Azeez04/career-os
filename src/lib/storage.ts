/**
 * Supabase Storage utilities for file upload, deletion, and listing.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export type StorageBucket = 'avatars' | 'media' | 'resumes'

/**
 * Upload a file to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  path?: string
): Promise<string> {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()

  const fileName = path ?? `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw error

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<void> {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) throw error
}

/**
 * List files in a Supabase Storage bucket.
 */
export async function listFiles(
  bucket: StorageBucket,
  prefix?: string
): Promise<Array<{
  name: string
  url: string
  size: number
  created_at: string
}>> {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(prefix ?? '', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (error) throw error

  return (data ?? [])
    .filter(f => f.name !== '.emptyFolderPlaceholder')
    .map(f => ({
      name: f.name,
      url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${prefix ? `${prefix}/` : ''}${f.name}`,
      size: f.metadata?.size ?? 0,
      created_at: f.created_at ?? '',
    }))
}

/**
 * Get the public URL for a file in Supabase Storage.
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}
