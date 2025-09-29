import { Button } from "@/components/ui/button"

export default function Step1Experience({ next }:any) {
  const levels = ["Beginner", "Intermediate", "Expert"]

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">What’s your experience level?</h2>
      <div className="flex justify-center gap-4">
        {levels.map((level) => (
          <Button key={level} className="" clicked={() => next({ experienceLevel: level })}>
            {level}
          </Button>
        ))}
      </div>
    </div>
  )
}
