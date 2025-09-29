import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import ProgressBar from "./progress"
import Step1Experience from "./stepExperience"
import Step2Currency from "./stepCurrency"
import Step3Notifications from "./stepNotifications"
import Step4Sectors from "./stepSectors"
import StepComplete from "./stepComplete"
import { fetchUser , next } from "@/lib/utils"
import StepPreferredMarkets from "./pref-region"

const steps = [
  Step1Experience,
  Step2Currency,
  StepPreferredMarkets,
  Step3Notifications,
  Step4Sectors,
  StepComplete
]

interface User {
  id: string
  onboarded: boolean
  onboarding_step?: number
}

export default function Onboarding() {    
  const [currentStep, setCurrentStep] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    experienceLevel: "",
    currency: "",
    preferredMarkets:[],
    notifications: [],
    sectors: []
  })



  useEffect(() => {
    fetchUser(setUser, setCurrentStep, steps)
  }, [])
  if (!user) return <p>Loading...</p>
 
  const StepComponent = steps[currentStep]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <ProgressBar step={currentStep} total={steps.length} />

      <div className="w-full max-w-lg mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <StepComponent next={(stepData: any) => next(stepData, setFormData, currentStep,steps,user, setCurrentStep , formData)} data={formData}  />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
