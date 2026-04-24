import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export const CreateListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  type: z.enum(['rent', 'sale']),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(3000),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(1).max(20),
  parking: z.boolean(),
  furnished: z.boolean(),
  amenities: z.array(z.string().max(50)).max(20).default([]),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  regularPrice: z.number().positive('Price must be positive'),
  discountedPrice: z.number().positive().optional(),
  offer: z.boolean(),
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
})

export const UpdateListingSchema = CreateListingSchema.partial()

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type CreateListingInput = z.infer<typeof CreateListingSchema>
export type UpdateListingInput = z.infer<typeof UpdateListingSchema>
