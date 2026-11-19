import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Reusable Cortex LMS page loader supporting fullscreen boot overlays and inline Suspense/data states.
 */
const PageLoader = ({
  fullscreen = false,
  message = 'Loading Cortex...',
  submessage = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerClass = fullscreen
    ? 'fixed inset-0 z-[70] flex items-center justify-center bg-[#F8F7F2]/95 backdrop-blur-sm px-6'
    : 'min-h-[60vh] flex items-center justify-center bg-[#F8F7F2] px-6 py-12';

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={message}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={containerClass}
    >
      <div className="flex flex-col items-center text-center max-w-xs">
        <div className="relative flex items-center justify-center w-16 h-16 mb-5">
          <span className="absolute inset-0 rounded-full border-2 border-[#DCE4DF]" />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#064E3B] border-r-[#10B981]/70"
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 1, repeat: Infinity, ease: 'linear' }
            }
          />
          <motion.span
            className="text-lg font-serif font-bold text-[#17231E] tracking-tight select-none"
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.04, 1] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            C<span className="text-[#D6B56D]">.</span>
          </motion.span>
        </div>

        <p className="text-base font-serif font-bold text-[#17231E] tracking-tight mb-1">
          CORTEX<span className="text-[#D6B56D]">.</span>
        </p>
        <p className="text-sm font-medium text-[#737A75]">{message}</p>
        {submessage ? (
          <p className="text-xs text-[#737A75]/80 mt-1">{submessage}</p>
        ) : null}
      </div>
    </motion.div>
  );
};

/**
 * Visible top progress bar and compact branded transition indicator shown on route changes.
 */
export const RouteProgressBar = ({ active }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-progress"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="fixed top-0 left-0 right-0 z-[90] pointer-events-none"
        >
          <div className="h-[3px] w-full bg-[#DCE4DF]/70 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#064E3B] via-[#10B981] to-[#D6B56D] shadow-[0_0_12px_rgba(16,185,129,0.55)] origin-left"
              initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.1 }
                  : { duration: 0.36, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-3 w-fit flex items-center gap-2 bg-[#FDFCF8]/95 backdrop-blur-md border border-[#DCE4DF] shadow-md rounded-full px-3.5 py-1.5"
          >
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#064E3B] border-t-transparent animate-spin" />
            <span className="text-xs font-semibold tracking-tight text-[#17231E]">
              CORTEX<span className="text-[#D6B56D]">.</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
