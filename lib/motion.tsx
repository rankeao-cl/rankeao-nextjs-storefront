"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

// ============================================
// Animation Variants
// ============================================

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// ============================================
// Animated Components
// ============================================

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

export const FadeUp = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUp}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeUp.displayName = "FadeUp";

export const FadeIn = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={fadeIn}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = "FadeIn";

export const ScaleIn = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={scaleIn}
      {...props}
    >
      {children}
    </motion.div>
  )
);
ScaleIn.displayName = "ScaleIn";

interface StaggerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  fast?: boolean;
}

export const Stagger = forwardRef<HTMLDivElement, StaggerProps>(
  ({ children, fast = false, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fast ? staggerContainerFast : staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  )
);
Stagger.displayName = "Stagger";

export const StaggerChild = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div ref={ref} variants={fadeUp} {...props}>
      {children}
    </motion.div>
  )
);
StaggerChild.displayName = "StaggerChild";

// ============================================
// Interactive Animations
// ============================================

interface HoverScaleProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  scale?: number;
}

export const HoverScale = forwardRef<HTMLDivElement, HoverScaleProps>(
  ({ children, scale = 1.02, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
HoverScale.displayName = "HoverScale";

interface HoverLiftProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  y?: number;
}

export const HoverLift = forwardRef<HTMLDivElement, HoverLiftProps>(
  ({ children, y = -6, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ y }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
HoverLift.displayName = "HoverLift";

// ============================================
// Page Transitions
// ============================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -12,
    transition: { duration: 0.25, ease: "easeIn" }
  },
};

interface PageTransitionProps extends HTMLMotionProps<"main"> {
  children: ReactNode;
}

export const PageTransition = forwardRef<HTMLElement, PageTransitionProps>(
  ({ children, className, ...props }, ref) => (
    <motion.main
      ref={ref}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.main>
  )
);
PageTransition.displayName = "PageTransition";

// ============================================
// Carousel/Crossfade Animation
// ============================================

export const crossfade: Variants = {
  enter: {
    opacity: 0,
    scale: 1.02,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

// ============================================
// Utility Hook for Reduced Motion
// ============================================

export { useReducedMotion } from "framer-motion";
