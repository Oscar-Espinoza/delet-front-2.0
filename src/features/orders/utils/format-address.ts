import type { Address } from '@/types/common'

export function formatAddress(address: Address): string {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean)

  return parts.join(', ')
}

export function formatAddressMultiline(address: Address): string[] {
  const lines: string[] = []

  if (address.street) {
    lines.push(address.street)
  }

  const cityStateZip = [
    address.city,
    address.state
      ? `${address.state} ${address.zipCode || ''}`.trim()
      : address.zipCode,
  ]
    .filter(Boolean)
    .join(', ')

  if (cityStateZip) {
    lines.push(cityStateZip)
  }

  if (address.country) {
    lines.push(address.country)
  }

  return lines
}
