import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Reusable animated page header for dashboards, course views, and static pages.
 */
export const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  actions = null,
  align = 'left',
  className = '',
  titleClassName = 'text-3xl sm:text-4xl font-serif font-bold text-[#17231E]',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isCentered = align === 'center';

  const containerVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.02 },
        },
      };

  const itemVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
      };

  return (
    <motion.div
      variants={containerVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      className={`${
        actions
          ? 'flex flex-col sm:flex-row sm:items-end justify-between gap-4'
          : isCentered
            ? 'text-center'
            : ''
      } ${className}`}
    >
      <div className={isCentered && !actions ? 'mx-auto' : ''}>
        {eyebrow ? (
          <motion.p
            variants={itemVariants}
            className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-1.5"
          >
            {eyebrow}
          </motion.p>
        ) : null}
        <motion.h1 variants={itemVariants} className={titleClassName}>
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            variants={itemVariants}
            className={`text-[#737A75] text-base sm:text-lg mt-1.5 ${
              isCentered && !actions ? 'max-w-2xl mx-auto' : ''
            }`}
          >
            {subtitle}
          </motion.p>
        ) : null}
      </div>
      {actions ? (
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
          {actions}
        </motion.div>
      ) : null}
    </motion.div>
  );
};

/**
 * Reusable scroll-triggered section heading for multi-section pages.
 */
export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className = '',
  titleClassName = 'text-2xl sm:text-3xl font-serif font-bold text-[#17231E]',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isCentered = align === 'center';

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`${isCentered ? 'text-center' : ''} ${className}`}
    >
      {eyebrow ? (
        <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-2">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={titleClassName}>{title}</h2>
      {subtitle ? (
        <p
          className={`text-[#737A75] mt-2 ${
            isCentered ? 'max-w-2xl mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
};

export default PageHeader;
