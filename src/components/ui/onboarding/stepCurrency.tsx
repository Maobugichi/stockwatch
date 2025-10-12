import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function Step2Currency({ next, data }:any) {
  const [currency, setCurrency] = useState(data.currency || "")

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Choose your preferred currency</h2>
      <Select onValueChange={setCurrency} value={currency}>
        <SelectTrigger className="w-48 mx-auto">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="NGN">NGN</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
        </SelectContent>
      </Select>
      <Button className="" onClick={() => next({ currency })} disabled={!currency}>
        Continue
      </Button>
    </div>
  )
}
