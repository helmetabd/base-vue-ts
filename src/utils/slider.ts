// Type for the target element
type HTMLElementOrNull = HTMLElement | null

const slideUp = (target: HTMLElementOrNull, duration: number = 500): void => {
  if (!target) return

  target.style.transitionProperty = 'height, margin, padding'
  target.style.transitionDuration = `${duration}ms`
  target.style.boxSizing = 'border-box'
  target.style.height = `${target.offsetHeight}px`
  target.offsetHeight // force reflow
  target.style.overflow = 'hidden'
  target.style.height = '0'
  target.style.paddingTop = '0'
  target.style.paddingBottom = '0'
  target.style.marginTop = '0'
  target.style.marginBottom = '0'

  window.setTimeout((): void => {
    target!.style.display = 'none'
    target!.style.removeProperty('height')
    target!.style.removeProperty('padding-top')
    target!.style.removeProperty('padding-bottom')
    target!.style.removeProperty('margin-top')
    target!.style.removeProperty('margin-bottom')
    target!.style.removeProperty('overflow')
    target!.style.removeProperty('transition-duration')
    target!.style.removeProperty('transition-property')
  }, duration)
}

const slideDown = (target: HTMLElementOrNull, duration: number = 500): void => {
  if (!target) return

  target.style.removeProperty('display')
  let display = window.getComputedStyle(target).display

  if (display === 'none') display = 'flex'

  target.style.display = display

  const height = target.offsetHeight
  target.style.overflow = 'hidden'
  target.style.height = '0'
  target.style.paddingTop = '0'
  target.style.paddingBottom = '0'
  target.style.marginTop = '0'
  target.style.marginBottom = '0'
  target.offsetHeight // force reflow
  target.style.boxSizing = 'border-box'
  target.style.transitionProperty = 'height, margin, padding'
  target.style.transitionDuration = `${duration}ms`
  target.style.height = `${height}px`

  target.style.removeProperty('padding-top')
  target.style.removeProperty('padding-bottom')
  target.style.removeProperty('margin-top')
  target.style.removeProperty('margin-bottom')

  window.setTimeout((): void => {
    target!.style.removeProperty('height')
    target!.style.removeProperty('overflow')
    target!.style.removeProperty('transition-duration')
    target!.style.removeProperty('transition-property')
  }, duration)
}

export const slideToggle = (target: HTMLElementOrNull, duration: number = 500): void => {
  if (!target) return

  if (window.getComputedStyle(target).display === 'none') {
    slideDown(target, duration)
  } else {
    slideUp(target, duration)
  }
}
