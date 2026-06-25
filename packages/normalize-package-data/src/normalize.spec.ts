import {
  describe,
  expect,
  it
} from 'vitest'
import { normalizePackageData } from './normalize.js'
import type { PackageData } from './types.js'

describe('normalize-package-data', () => {
  it('should not mutate package data', () => {
    const pkg: PackageData = {
      name: ' package ',
      version: 'v1.2.3',
      repository: {
        type: 'git',
        url: 'git+https://github.com/conventional-changelog/conventional-changelog.git'
      },
      bugs: 'https://github.com/conventional-changelog/conventional-changelog/issues',
      homepage: 'example.com'
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized).not.toBe(pkg)
    expect(normalized.repository).not.toBe(pkg.repository)
    expect(pkg).toEqual({
      name: ' package ',
      version: 'v1.2.3',
      repository: {
        type: 'git',
        url: 'git+https://github.com/conventional-changelog/conventional-changelog.git'
      },
      bugs: 'https://github.com/conventional-changelog/conventional-changelog/issues',
      homepage: 'example.com'
    })
  })

  it('should normalize package name', () => {
    const pkg = {
      name: ' package '
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized.name).toBe('package')
  })

  it('should normalize package version', () => {
    const pkg = {
      version: 'v1.2.3'
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized.version).toBe('1.2.3')
  })

  it('should normalize string repository', () => {
    const pkg: PackageData = {
      repository: 'conventional-changelog/conventional-changelog'
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized.repository).toEqual({
      type: 'git',
      url: 'https://github.com/conventional-changelog/conventional-changelog'
    })
  })

  it('should normalize repository url', () => {
    const pkg: PackageData = {
      repository: {
        type: 'git',
        url: 'git+https://github.com/conventional-changelog/conventional-changelog.git'
      }
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized.repository).toEqual({
      type: 'git',
      url: 'https://github.com/conventional-changelog/conventional-changelog'
    })
  })

  it('should normalize bugs from a hosted repository', () => {
    const pkg: PackageData = {
      repository: 'conventional-changelog/conventional-changelog'
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized.bugs).toEqual({
      url: 'https://github.com/conventional-changelog/conventional-changelog/issues'
    })
  })

  it('should normalize string bugs', () => {
    const pkg: PackageData = {
      bugs: 'https://github.com/conventional-changelog/conventional-changelog/issues'
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized.bugs).toEqual({
      url: 'https://github.com/conventional-changelog/conventional-changelog/issues'
    })
  })

  it('should normalize homepage from a hosted repository', () => {
    const pkg: PackageData = {
      repository: 'conventional-changelog/conventional-changelog'
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized.homepage).toBe('https://github.com/conventional-changelog/conventional-changelog#readme')
  })

  it('should normalize homepage protocol', () => {
    const pkg = {
      homepage: 'example.com'
    }
    const normalized = normalizePackageData(pkg)

    expect(normalized.homepage).toBe('http://example.com')
  })
})
