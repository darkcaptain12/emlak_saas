import type { PackageType } from '@/types'
import { PACKAGE_CONFIGS } from './config/packages'

export type PropertyLimitStatus = 'ok' | 'warning' | 'full'

function resolveConfig(packageType: PackageType | null | undefined) {
  return PACKAGE_CONFIGS[packageType ?? 'pack1'] ?? PACKAGE_CONFIGS['pack1']
}

export function getPackageLimits(packageType: PackageType) {
  return resolveConfig(packageType)
}

export function canCreateProperty(packageType: PackageType, currentCount: number): boolean {
  const config = resolveConfig(packageType)
  if (config.propertyLimit === null) return true
  return currentCount < config.propertyLimit
}

export function isPropertyLimitReached(packageType: PackageType, currentCount: number): boolean {
  return !canCreateProperty(packageType, currentCount)
}

export function getPropertyLimitStatus(
  packageType: PackageType,
  currentCount: number
): PropertyLimitStatus {
  const config = resolveConfig(packageType)
  if (config.propertyLimit === null) return 'ok'
  if (currentCount >= config.propertyLimit) return 'full'
  if (currentCount >= config.propertyLimit * 0.8) return 'warning'
  return 'ok'
}

export function canAccessAdvancedDashboard(packageType: PackageType): boolean {
  return packageType === 'pack2' || packageType === 'pack3'
}

export function canAccessPremiumAnalytics(packageType: PackageType): boolean {
  return packageType === 'pack3'
}

export function getUserPackageCapabilities(packageType: PackageType) {
  const config = resolveConfig(packageType)
  return {
    propertyLimit: config.propertyLimit,
    canAccessAdvancedDashboard: canAccessAdvancedDashboard(packageType),
    canAccessPremiumAnalytics: canAccessPremiumAnalytics(packageType),
    canUseMultipleUsers: packageType === 'pack3',
  }
}

export function isPackageUpgradable(current: PackageType): boolean {
  return current !== 'pack3'
}

export function isPackageDowngradable(current: PackageType): boolean {
  return current !== 'pack1'
}

export function getNextPackage(current: PackageType): PackageType | null {
  if (current === 'pack1') return 'pack2'
  if (current === 'pack2') return 'pack3'
  return null
}

export function getPrevPackage(current: PackageType): PackageType | null {
  if (current === 'pack3') return 'pack2'
  if (current === 'pack2') return 'pack1'
  return null
}

// Kiralık Yönetim İzinleri (Rental Management Permissions)

export function canManageRentals(packageType: PackageType): boolean {
  return packageType === 'pack1' || packageType === 'pack2' || packageType === 'pack3'
}

export function canTrackPayments(packageType: PackageType): boolean {
  return packageType === 'pack2' || packageType === 'pack3'
}

export function canManageDocuments(packageType: PackageType): boolean {
  return packageType === 'pack3'
}

export function canCommunicate(packageType: PackageType): boolean {
  return packageType === 'pack3'
}

export function canMultiTenant(packageType: PackageType): boolean {
  return packageType === 'pack3'
}
