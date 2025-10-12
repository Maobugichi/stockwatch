import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const options = ["Email", "SMS", "Push"]

export default function Step3Notifications({ next, data }:any) {
  const [selected, setSelected] = useState(data.notifications || [])

  const toggle = (opt:any) =>
    setSelected((prev:any) =>
      prev.includes(opt) ? prev.filter((s:any) => s !== opt) : [...prev, opt]
    )

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">How do you want notifications?</h2>
      <div className="flex flex-col gap-3 items-center">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <Checkbox
              checked={selected.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
      <Button className="" onClick={() => next({ notifications: selected })} disabled={!selected.length}>
        Continue
      </Button>
    </div>
  )
}
