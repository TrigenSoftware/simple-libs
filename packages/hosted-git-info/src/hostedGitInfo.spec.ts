import {
  describe,
  it,
  expect
} from 'vitest'
import { parseHostedGitUrl } from './hostedGitInfo.js'
import { samples } from './hostedGitInfo.mock.js'

describe('hosted-git-info', () => {
  describe('parseHostedGitUrl', () => {
    it.each([
      ['git@github.com:acme/acme.github.io', ''],
      ['git@github.com:acme/acme.github.io.git#fix/links', '/tree/fix%2Flinks'],
      ['https://github.com/acme/acme.github.io.git', ''],
      ['git+https://github.com/acme/acme.github.io.git', ''],
      ['https://github.com/acme/acme.github.io/tree/main', '/tree/main'],
      ['github:acme/acme.github.io.git#main', '/tree/main']
    ])('preserves dots in the project name for %s', (url, path) => {
      expect(parseHostedGitUrl(url)).toEqual({
        type: 'github',
        host: 'https://github.com',
        owner: 'acme',
        project: 'acme.github.io',
        url: `https://github.com/acme/acme.github.io${path}`
      })
    })

    it('preserves a dotted project in a GitLab subgroup with a branch', () => {
      expect(parseHostedGitUrl('https://gitlab.com/group/subgroup/repo.js.git#fix/links')).toEqual({
        type: 'gitlab',
        host: 'https://gitlab.com',
        owner: 'group/subgroup',
        project: 'repo.js',
        url: 'https://gitlab.com/group/subgroup/repo.js/tree/fix%2Flinks'
      })
    })

    it('should parse all samples', () => {
      samples.forEach(([url, data]) => {
        expect(parseHostedGitUrl(url)).toEqual(data)
      })
    })
  })
})
