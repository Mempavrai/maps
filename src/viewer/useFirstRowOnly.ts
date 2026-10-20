import { onBeforeUnmount, watch, type Ref } from 'vue'
import { useElementSize } from '../core/interaction/useElementSize'

export function useFirstRowOnly(
  listRef: Readonly<Ref<HTMLElement | null>>,
  boundsRef: Readonly<Ref<HTMLElement | null>>,
): void {
  const listSize = useElementSize(listRef)
  const boundsSize = useElementSize(boundsRef)
  let frame = 0

  function hideWrappedItems(): void {
    const items = [...(listRef.value?.children ?? [])] as HTMLElement[]
    items.forEach((item) => (item.hidden = false))
    const tops = items.map((item) => item.offsetTop)
    items.forEach((item, index) => (item.hidden = tops[index] !== tops[0]))
  }

  watch([listSize, boundsSize], () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(hideWrappedItems)
  })

  onBeforeUnmount(() => cancelAnimationFrame(frame))
}
