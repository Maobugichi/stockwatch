import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const sectorsList = ["Crypto", "Forex", "Stocks", "Commodities"]

export default function Step4Sectors({ next, data }:any) {
  const [selected, setSelected] = useState(data.sectors || [])

  const toggle = (sector:any) =>
    setSelected((prev:any) =>
      prev.includes(sector) ? prev.filter((s:any) => s !== sector) : [...prev, sector]
    )

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Which sectors are you interested in?</h2>
      <div className="flex flex-col gap-3 items-center">
        {sectorsList.map((sector) => (
          <label key={sector} className="flex items-center gap-2">
            <Checkbox
              checked={selected.includes(sector)}
              onCheckedChange={() => toggle(sector)}
            />
            {sector}
          </label>
        ))}
      </div>
      <Button className="" onClick={() => next({ sectors: selected })} disabled={!selected.length}>
        Continue
      </Button>
    </div>
  )
}
