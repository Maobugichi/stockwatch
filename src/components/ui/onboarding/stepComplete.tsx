import { motion } from "framer-motion"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function StepComplete() {

 const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <motion.div
      className="text-center space-y-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold">🎉 All Done!</h2>
      <p className="text-gray-600">Your onboarding is complete. Welcome aboard 🚀, Redirecting to your dashboard…</p>
    </motion.div>
  )
}
