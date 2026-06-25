export function isEmail(value: string) {
  return value.includes('@') && value.indexOf('@') < value.lastIndexOf('.')
}

export function hasProtocol(value: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(value)
}
