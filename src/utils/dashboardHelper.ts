import type { Option } from '@/interfaces/Utils'

const thousandSeparator = (x: { toString: () => string }) => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  } else {
    return 0
  }
}

const upsale = (total_qty: number, sales: number) => {
  let res = total_qty / sales
  res = Number((Math.round(res * 100) / 100).toFixed(2))
  return res
}

const growthPercentile = (current: number, prev: number) => {
  const res = ((current - prev) / prev) * 100
  const d = {
    success: res >= 0 ? true : false,
    result: res < 0 ? (res * -1).toFixed(2) : res.toFixed(2)
  }
  return d
}

const pad = (n: number) => {
  return n < 10 ? '0' + n : n
}

const resizeHelper = (value: number, multiple: number, exclude: number) => {
  let windowSize = window.innerWidth
  // If the window size is below 800, return value directly
  if (windowSize < 800) {
    return value
  }

  // If window size is above 1440, no adjustment is needed
  if (windowSize > 1440) {
    return value
  }

  // When exclude is specified and acts as a lower limit
  if (exclude && windowSize < exclude) {
    windowSize = exclude
    if (windowSize <= 1440 && windowSize > 1280) {
      return value - multiple
    } else if (windowSize <= 1280 && windowSize > 800) {
      return value - multiple * 2
    }
    return value // If below 800, though handled above, this ensures stability
  }

  // When no exclude condition applies, handle default resizing
  if (windowSize <= 1440 && windowSize > 1280) {
    return value - multiple
  } else if (windowSize <= 1280 && windowSize > 800) {
    return value - multiple * 2
  }

  // Default return for other cases
  return value
}

function removeZero(data: Option[]) {
  return data.filter((obj) => obj.value !== 0)
}

export { thousandSeparator, upsale, pad, growthPercentile, resizeHelper, removeZero }
