import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.config({
    ignorePatterns: ['src/generated/**/*', 'node_modules'],
    root: true,
    extends: [
      'next',
      'next/core-web-vitals',
      'prettier',
      'plugin:@tanstack/query/recommended'
    ],
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'react/display-name': 0
    }
  })
]

export default eslintConfig
