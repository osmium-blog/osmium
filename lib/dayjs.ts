import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function setDefaultTimezone (timezone: string) {
  dayjs.tz.setDefault(timezone)
}

export default dayjs

export function withTimezone (timezone: string) {
  setDefaultTimezone(timezone)
  return dayjs
}
