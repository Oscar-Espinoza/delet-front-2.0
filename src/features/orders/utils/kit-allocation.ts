import type {
  OrderAddress,
  KitAllocationState,
  KitAllocationError,
} from '../types'

export const calculateKitAllocation = (
  totalKits: number,
  addresses: OrderAddress[]
): KitAllocationState => {
  const assignedKits = addresses.reduce(
    (sum, addr) => sum + (addr.assignedKits || 0),
    0
  )

  return {
    totalKits,
    assignedKits,
    availableKits: totalKits - assignedKits,
  }
}

export const validateKitAllocation = (
  totalKits: number,
  addresses: OrderAddress[],
  provideShippingLater: boolean
): KitAllocationError[] => {
  const errors: KitAllocationError[] = []

  if (provideShippingLater) {
    return errors
  }

  const totalAssigned = addresses.reduce(
    (sum, addr) => sum + (addr.assignedKits || 0),
    0
  )

  if (totalAssigned > totalKits) {
    errors.push({
      message: `Cannot assign ${totalAssigned} kits when only ${totalKits} are available`,
      type: 'over_allocation',
    })
  }

  addresses.forEach((addr, index) => {
    const assignedKits = addr.assignedKits || 0

    if (assignedKits < 0) {
      errors.push({
        addressIndex: index,
        message: `Invalid negative kit assignment for address ${index + 1}`,
        type: 'invalid_quantity',
      })
    }
  })

  if (totalAssigned < totalKits && addresses.length > 0) {
    errors.push({
      message: `${totalKits - totalAssigned} kits remain unassigned`,
      type: 'missing_allocation',
    })
  }

  return errors
}

export const redistributeKitsOnAddressRemoval = (
  addresses: OrderAddress[],
  removedIndex: number
): OrderAddress[] => {
  const removedAddress = addresses[removedIndex]
  const kitsToRedistribute = removedAddress.assignedKits || 0

  if (kitsToRedistribute === 0) {
    return addresses.filter((_, index) => index !== removedIndex)
  }

  const remainingAddresses = addresses.filter(
    (_, index) => index !== removedIndex
  )

  if (remainingAddresses.length === 0) {
    return remainingAddresses
  }

  let kitsLeft = kitsToRedistribute
  const updatedAddresses = remainingAddresses.map((addr) => {
    if (kitsLeft <= 0) return addr

    const currentAssigned = addr.assignedKits || 0
    const maxCanTake = addr.quantity - currentAssigned
    const kitsToAssign = Math.min(kitsLeft, maxCanTake)

    kitsLeft -= kitsToAssign

    return {
      ...addr,
      assignedKits: currentAssigned + kitsToAssign,
    }
  })

  return updatedAddresses
}

export const autoAssignKits = (
  totalKits: number,
  addresses: OrderAddress[]
): OrderAddress[] => {
  let kitsLeft = totalKits

  return addresses.map((addr) => {
    if (kitsLeft <= 0) {
      return { ...addr, assignedKits: 0 }
    }

    const kitsToAssign = Math.min(kitsLeft, addr.quantity)
    kitsLeft -= kitsToAssign

    return {
      ...addr,
      assignedKits: kitsToAssign,
    }
  })
}

export const canRemoveAddress = (
  addresses: OrderAddress[],
  indexToRemove: number
): { canRemove: boolean; reason?: string } => {
  const addressToRemove = addresses[indexToRemove]
  const assignedKits = addressToRemove.assignedKits || 0

  if (assignedKits === 0) {
    return { canRemove: true }
  }

  const remainingAddresses = addresses.filter(
    (_, index) => index !== indexToRemove
  )
  const totalCapacity = remainingAddresses.reduce(
    (sum, addr) => sum + (addr.quantity - (addr.assignedKits || 0)),
    0
  )

  if (totalCapacity >= assignedKits) {
    return { canRemove: true }
  }

  return {
    canRemove: false,
    reason: `Cannot redistribute ${assignedKits} kits to remaining addresses (capacity: ${totalCapacity})`,
  }
}
