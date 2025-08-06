'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Define lens configurations with gradients, icons, and descriptions
const lensConfigs = {
  analytical: {
    name: 'Analytical',
    icon: '🧠',
    gradient: 'from-blue-400 to-purple-600',
    description: 'Logic, evidence, cause-effect relationships, and structured reasoning'
  },
  character: {
    name: 'Character-Focused',
    icon: '👥',
    gradient: 'from-orange-400 to-red-500',
    description: 'People, relationships, motivations, and character development'
  },
  philosophical: {
    name: 'Philosophical',
    icon: '✨',
    gradient: 'from-purple-500 to-purple-700',
    description: 'Big ideas, ethics, worldview concepts, and deeper meaning'
  },
  creative: {
    name: 'Creative',
    icon: '🎨',
    gradient: 'from-pink-400 via-purple-400 to-indigo-400',
    description: 'Innovation, artistic elements, inspiration, and imaginative connections'
  },
  practical: {
    name: 'Practical',
    icon: '⚙️',
    gradient: 'from-green-400 to-emerald-600',
    description: 'Actionable insights, implementation steps, and how-to guidance'
  },
  emotional: {
    name: 'Emotional',
    icon: '❤️',
    gradient: 'from-pink-400 to-rose-600',
    description: 'Feelings, psychological impact, personal resonance, and emotional intelligence'
  },
  historical: {
    name: 'Historical',
    icon: '📚',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Context, timeline, influence, evolution of ideas over time'
  },
  connective: {
    name: 'Connective',
    icon: '🔗',
    gradient: 'from-gray-400 to-slate-600',
    description: 'Links to other books, cross-connections, and knowledge synthesis'
  }
};

export default function LensButton({ 
  lensKey, 
  isSelected, 
  onToggle, 
  disabled = false 
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = lensConfigs[lensKey];

  if (!config) {
    console.warn(`Unknown lens key: ${lensKey}`);
    return null;
  }

  return (
    <div className="relative">
      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm rounded-lg p-3 max-w-64 shadow-lg"
        >
          <div className="font-semibold mb-1">{config.name}</div>
          <div className="text-gray-300">{config.description}</div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      )}

      {/* Lens Button */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onHoverStart={() => !disabled && setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        onClick={() => !disabled && onToggle(lensKey)}
        disabled={disabled}
        className={`
          relative w-32 h-20 rounded-2xl transition-all duration-300 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isSelected 
            ? 'ring-3 ring-[#2349b4] ring-offset-2 shadow-lg transform scale-[1.02]' 
            : 'ring-1 ring-gray-200 hover:ring-gray-300 shadow-md'
          }
        `}
      >
        {/* Background gradient */}
        <div className={`
          absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient} 
          transition-opacity duration-300
          ${isSelected ? 'opacity-90' : 'opacity-60'}
        `} />
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
          {/* Icon */}
          <motion.div 
            className="text-2xl mb-1"
            animate={{ 
              scale: isSelected ? [1, 1.2, 1] : 1,
              rotate: isSelected ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut"
            }}
          >
            {config.icon}
          </motion.div>
          
          {/* Label */}
          <div className="text-xs font-medium text-center leading-tight">
            {config.name}
          </div>
        </div>

        {/* Selected state indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-[#2349b4] rounded-full flex items-center justify-center shadow-lg"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}

        {/* Hover glow effect */}
        {!disabled && (
          <div className={`
            absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient}
            transition-opacity duration-300 pointer-events-none
            ${isSelected ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}
          `} />
        )}
      </motion.button>
    </div>
  );
}

// Export lens configurations for use in parent components
export { lensConfigs };