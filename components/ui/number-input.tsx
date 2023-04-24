type Props = BasicProps & {
  value: string | number
  onChange: (value: number) => void
}

export default function NumberInput ({ value, onChange, className, style }: Props) {
  return (
    <span className={className} style={style}>
      <span className="h-8 text-night dark:text-day bg-day dark:bg-night border border-night dark:border-day focus-within:ring-2 ring-blue-500 dark:ring-blue-400 flex">
        <input
          type="number"
          value={String(value)}
          className="w-full px-2 bg-transparent outline-none"
          onChange={ev => onChange(Number(ev.target.value))}
        />
      </span>
    </span>
  )
}
