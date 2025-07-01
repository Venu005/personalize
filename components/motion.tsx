import { motion, type MotionProps } from 'framer-motion'

// Define types for different HTML elements with motion props
type MotionDivProps = MotionProps & React.HTMLAttributes<HTMLDivElement>

// Export typed motion components
export const MotionDiv = motion.div as React.FC<MotionDivProps>