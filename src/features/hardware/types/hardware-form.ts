import { z } from 'zod'
import {
  HardwareCategorySchema,
  HardwareStatusSchema,
  LockVendorSchema,
  LockboxVendorSchema,
  ButtonVendorSchema,
  DropinSchema,
  CameraFirmwareSchema,
} from './hardware'

// Form schema for creating/editing hardware
export const hardwareFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  notes: z.string().optional(),
  inventoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: HardwareCategorySchema.optional(),
  status: HardwareStatusSchema.optional(),
  userId: z.string().optional(),
  kitId: z.string().optional(),
  accountId: z.string().optional(),
  orgId: z.string().optional(),
  propertyId: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  structureId: z.string().optional(),
  make: z.string().optional(),
  // Category-specific fields
  routerId: z.string().optional(),
  routerStatus: z.enum(['online', 'offline', 'unknown']).optional(),
  lockId: z.string().optional(),
  lockVendor: LockVendorSchema.optional(),
  lockboxId: z.string().optional(),
  lockboxVendor: LockboxVendorSchema.optional(),
  hubLockId: z.string().optional(),
  sensorLockId: z.string().optional(),
  buttonId: z.string().optional(),
  buttonTime: z.number().optional(),
  buttonVendor: ButtonVendorSchema.optional(),
  keypadId: z.string().optional(),
  keypadVendor: LockVendorSchema.optional(),
  tabletDropin: DropinSchema.optional(),
  cameraFirmware: CameraFirmwareSchema.optional(),
})

export type HardwareFormData = z.infer<typeof hardwareFormSchema>
