export const envOrElse = (name, defaultValue) => {
  if (typeof defaultValue == 'function') {
    return process.env[name] !== undefined
      ? process.env[name]
      : defaultValue()
  } else {
    return process.env[name] !== undefined
      ? process.env[name]
      : defaultValue
  }
}
