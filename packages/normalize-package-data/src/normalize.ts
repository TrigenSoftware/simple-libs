import { parseHostedGitUrl } from '@simple-libs/hosted-git-info'
import cleanSemver from 'semver/functions/clean.js'
import validSemver from 'semver/functions/valid.js'
import type {
  NormalizedPackageData,
  PackageBugs,
  PackageData,
  PackageRepository
} from './types.js'
import {
  hasProtocol,
  isEmail
} from './utils.js'

function normalizeName(name: PackageData['name']): NormalizedPackageData['name'] {
  return name
    ? String(name).trim()
    : ''
}

function normalizeVersion(version: PackageData['version']): NormalizedPackageData['version'] {
  if (!version) {
    return ''
  }

  if (validSemver(version, true)) {
    return cleanSemver(version, true) || version
  }

  return version
}

function normalizeRepository(repository: PackageData['repository']): NormalizedPackageData['repository'] {
  if (!repository) {
    return repository === null
      ? null
      : undefined
  }

  const normalizedRepository: PackageRepository = typeof repository === 'string'
    ? {
      type: 'git',
      url: repository
    }
    : {
      ...repository
    }

  if (!normalizedRepository.url) {
    return normalizedRepository
  }

  const hosted = parseHostedGitUrl(normalizedRepository.url)

  if (hosted) {
    normalizedRepository.url = hosted.url
  }

  return normalizedRepository
}

function normalizeBugs(
  bugs: PackageData['bugs'],
  repository: NormalizedPackageData['repository']
): NormalizedPackageData['bugs'] {
  if (!bugs && repository?.url) {
    const hosted = parseHostedGitUrl(repository.url)

    if (hosted?.type && hosted.project) {
      return {
        url: `${hosted.url}/issues`
      }
    }

    return bugs === null
      ? null
      : undefined
  }

  if (!bugs) {
    return bugs === null
      ? null
      : undefined
  }

  if (typeof bugs === 'string') {
    if (isEmail(bugs)) {
      return {
        email: bugs
      }
    }

    if (hasProtocol(bugs)) {
      return {
        url: bugs
      }
    }

    return undefined
  }

  const normalizedBugs: PackageBugs = {
    ...bugs
  }

  if (!normalizedBugs.email && !normalizedBugs.url) {
    return undefined
  }

  return normalizedBugs
}

function normalizeHomepage(
  homepage: PackageData['homepage'],
  repository: NormalizedPackageData['repository']
): NormalizedPackageData['homepage'] {
  if (!homepage && repository?.url) {
    const hosted = parseHostedGitUrl(repository.url)

    if (hosted?.type && hosted.project) {
      return `${hosted.url}#readme`
    }

    return homepage
  }

  if (!homepage) {
    return homepage
  }

  if (typeof homepage !== 'string') {
    return undefined
  }

  if (!hasProtocol(homepage)) {
    return `http://${homepage}`
  }

  return homepage
}

/**
 * Normalizes package metadata into the shape expected by npm-style package data.
 *
 * The input object is not mutated. Unknown fields are preserved, while known
 * fields such as `name`, `version`, `repository`, `bugs`, and `homepage` are
 * normalized when possible.
 *
 * @param pkg - Package metadata to normalize.
 * @returns Normalized package metadata.
 */
export function normalizePackageData(pkg: PackageData): NormalizedPackageData {
  const repository = normalizeRepository(pkg.repository)
  const bugs = normalizeBugs(pkg.bugs, repository)
  const homepage = normalizeHomepage(pkg.homepage, repository)
  const normalizedPackage: NormalizedPackageData = {
    ...pkg,
    name: normalizeName(pkg.name),
    version: normalizeVersion(pkg.version),
    repository,
    bugs,
    homepage
  }

  if (typeof bugs === 'undefined') {
    delete normalizedPackage.bugs
  }

  if (typeof homepage === 'undefined') {
    delete normalizedPackage.homepage
  }

  return normalizedPackage
}
