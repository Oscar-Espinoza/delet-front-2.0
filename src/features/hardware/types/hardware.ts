import { z } from 'zod'

export const HardwareCategorySchema = z.enum([
  'router',
  'tablet',
  'camera',
  'lock',
  'lockbox',
  'keypad',
  'hub',
  'sensor',
])

export const HardwareStatusSchema = z.enum(['active', 'disabled'])

export const OperationalStatusSchema = z.enum(['online', 'offline', 'unknown'])

export const RouterStatusSchema = z.enum(['online', 'offline', 'unknown'])

export const LockVendorSchema = z.enum(['august', 'switchbot', 'yale'])

export const LockboxVendorSchema = z.enum(['igloo', 'puroma', 'master-lock'])

export const ButtonVendorSchema = z.enum(['switchbot'])

export const DropinSchema = z.enum(['twilio', 'agora'])

export const CameraFirmwareSchema = z.enum(['v1', 'v2'])

export const BatteryWarningSchema = z.enum([
  'lock_state_battery_warning_none',
  'lock_state_battery_warning_2week',
  'lock_state_battery_warning_1week',
  'lock_state_battery_warning_2day',
  'keypad_battery_none',
  'keypad_battery_warning',
  'keypad_battery_critical',
])

export const HardwareSchema = z.object({
  _id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  inventoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: HardwareCategorySchema.optional(),
  status: HardwareStatusSchema.default('active'),
  user: z.object({
    _id: z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
  }).optional(),
  kit: z.object({
    _id: z.string(),
    name: z.string().optional(),
  }).optional(),
  account: z.object({
    _id: z.string(),
    name: z.string().optional(),
  }).optional(),
  org: z.object({
    _id: z.string(),
    name: z.string().optional(),
  }).optional(),
  property: z.object({
    _id: z.string(),
    name: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  router: z.object({
    id: z.string().optional(),
    status: RouterStatusSchema.default('unknown'),
  }).optional(),
  lock: z.object({
    id: z.string().optional(),
    vendor: LockVendorSchema.optional(),
  }).optional(),
  lockbox: z.object({
    id: z.string().optional(),
    vendor: LockboxVendorSchema.optional(),
  }).optional(),
  hub: z.object({
    lockId: z.string().optional(),
  }).optional(),
  sensor: z.object({
    lockId: z.string().optional(),
  }).optional(),
  button: z.object({
    id: z.string().optional(),
    time: z.number().optional(),
    vendor: ButtonVendorSchema.optional(),
  }).optional(),
  keypad: z.object({
    id: z.string().optional(),
    vendor: LockVendorSchema.optional(),
  }).optional(),
  tablet: z.object({
    dropin: DropinSchema.optional(),
  }).optional(),
  cameraFirmware: CameraFirmwareSchema.optional(),
  zm: z.object({
    status: z.string().optional(),
    active: z.boolean().default(false),
    monitorId: z.number().optional(),
  }).optional(),
  structure: z.object({
    _id: z.string(),
    name: z.string().optional(),
  }).optional(),
  make: z.string().default('ezvizdirect'),
  accounts: z.array(z.object({
    _id: z.string(),
    name: z.string().optional(),
  })).optional(),
  battery: z.object({
    warningLevel: z.object({
      message: BatteryWarningSchema.optional(),
      lastUpdated: z.string().optional(),
    }).optional(),
    level: z.number().default(100),
  }).optional(),
  operationalStatus: OperationalStatusSchema.default('online'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Hardware = z.infer<typeof HardwareSchema>
export type HardwareCategory = z.infer<typeof HardwareCategorySchema>
export type HardwareStatus = z.infer<typeof HardwareStatusSchema>
export type OperationalStatus = z.infer<typeof OperationalStatusSchema>

export interface HardwareFilters {
  category?: HardwareCategory
  status?: HardwareStatus
  operationalStatus?: OperationalStatus
  search?: string
}

export interface HardwareListResponse {
  data: Hardware[]
  total?: number
  page?: number
  limit?: number
}