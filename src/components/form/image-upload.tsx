import { useCallback, useState } from 'react'
import {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Upload,
  X,
  Star,
  Image as ImageIcon,
  GripVertical,
} from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  control: Control<any>
  errors: FieldErrors<any>
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  name: string
  label?: string
  description?: string
  required?: boolean
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  disabled?: boolean
  primarySelectable?: boolean
}

interface UploadedImage {
  id: string
  file?: File
  url?: string
  isPrimary?: boolean
  preview: string
}

export default function ImageUpload({
  control,
  errors: _errors,
  setValue,
  watch: _watch,
  name,
  label = 'Images',
  description = 'Upload images by dragging and dropping or clicking to select',
  required = false,
  multiple = true,
  maxFiles = 10,
  maxSize = 5, // 5MB default
  disabled = false,
  primarySelectable = true,
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!multiple && acceptedFiles.length > 1) {
        toast.error('Only one image can be uploaded')
        return
      }

      if (images.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`)
        return
      }

      const newImages = acceptedFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && index === 0 && primarySelectable,
      }))

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      setValue(name, updatedImages.map(img => img.file).filter(Boolean), {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    [images, maxFiles, multiple, name, primarySelectable, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxSize: maxSize * 1024 * 1024,
    multiple,
    disabled,
  })

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id)
    
    // If removed image was primary, make the first image primary
    if (primarySelectable && images.find(img => img.id === id)?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true
    }
    
    setImages(updatedImages)
    setValue(name, updatedImages.map(img => img.file).filter(Boolean), {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const setPrimaryImage = (id: string) => {
    if (!primarySelectable) return
    
    const updatedImages = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }))
    setImages(updatedImages)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)

    setImages(newImages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setValue(name, images.map(img => img.file).filter(Boolean), {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer transition-colors',
                  isDragActive && 'border-primary bg-primary/5',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? 'Drop the images here...'
                    : multiple
                    ? `Drag & drop images here, or click to select (max ${maxFiles} files)`
                    : 'Drag & drop an image here, or click to select'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Max file size: {maxSize}MB. Supported formats: PNG, JPG, JPEG, GIF, WEBP
                </p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        'relative group rounded-lg overflow-hidden border',
                        draggedIndex === index && 'opacity-50',
                        image.isPrimary && 'ring-2 ring-primary'
                      )}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={image.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Drag handle */}
                        <div className="absolute top-2 left-2 p-1 bg-black/50 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="h-4 w-4 text-white" />
                        </div>

                        {/* Primary badge */}
                        {primarySelectable && image.isPrimary && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Primary
                          </div>
                        )}

                        {/* Actions */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-2">
                            {primarySelectable && !image.isPrimary && (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="h-7 text-xs"
                                onClick={() => setPrimaryImage(image.id)}
                              >
                                Set Primary
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="h-7 w-7 p-0 ml-auto"
                              onClick={() => removeImage(image.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No images uploaded yet</p>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}