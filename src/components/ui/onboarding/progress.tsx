import { motion } from "framer-motion"
import { useEffect } from "react"

type AnimatedProgressProps = {
  step: number
  total: number
}

export default function AnimatedProgress({ step, total }: AnimatedProgressProps) {
  const isComplete = step === total - 1;
  const formSteps = total - 1;
  const percent = isComplete ? 100 : ((step + 1) / formSteps) * 100

  useEffect(() => {
    console.log(`Current step: ${step}, Total: ${total}, Progress: ${percent}%`)
  }, [step, total, percent])

  
  if (isComplete) {
    return null
  }
  return (
    
    <div className="w-full max-w-lg">
      
         
           <div className="relative">
      
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-2 bg-primary rounded-full"
            />
          
            <div className="h-2 w-full rounded-full bg-secondary" />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-right">
            Step {step + 1} of {formSteps}
          </p>
    </div>
  )
}
