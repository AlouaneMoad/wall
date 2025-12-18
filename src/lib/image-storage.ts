import { supabase } from '@/lib/supabase'

export class ImageStorageService {
  private static BUCKET_NAME = 'menu-images'

  static async uploadMenuImage(
    file: File,
    menuItemId: string
  ): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${menuItemId}.${fileExt}`
      const filePath = `${this.BUCKET_NAME}/${fileName}`

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        })

      if (error) throw error

      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  static async deleteMenuImage(fileUrl: string): Promise<boolean> {
    try {
      const filePath = fileUrl.split(`${this.BUCKET_NAME}/`)[1]
      if (!filePath) return false

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath])

      return !error
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  static getPlaceholderImageUrl(itemName: string): string {
    // Generate a placeholder image URL based on item name
    const encodedName = encodeURIComponent(itemName)
    return `https://via.placeholder.com/400x300/6366f1/ffffff?text=${encodedName}`
  }
}

export const imageStorageService = ImageStorageService