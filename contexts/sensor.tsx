import { createContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useMeasure } from '@react-hookz/web'
import type { Measures } from '@react-hookz/web'

const SensorContext = createContext({
  contentWidth: 0,
})

export function SensorProvider ({ children }: { children: ReactNode }) {
  const [measures = {} as Measures, sensor] = useMeasure<HTMLDivElement>()
  const { width } = measures

  useEffect(
    () => {
      if (sensor.current?.parentElement) {
        sensor.current.parentElement.style.setProperty('--content-width', width ? width + 'px' : null)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width],
  )

  return (
    <SensorContext.Provider value={{ contentWidth: width }}>
      <div ref={sensor} style={{ width: 'auto', height: 0 }}/>
      {children}
    </SensorContext.Provider>
  )
}
