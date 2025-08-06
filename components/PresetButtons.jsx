'use client';

import { motion } from 'framer-motion';

// Define preset configurations
const presets = [
  {
    id: 'deep-thinker',
    name: 'Deep Thinker',
    icon: '🤔',
    description: 'Perfect for complex ideas and philosophical exploration',
    gradient: 'from-purple-500 to-indigo-600',
    modes: {
      analytical: 0.7,
      philosophical: 1.0,
      historical: 0.3
    },
    tags: ['Analysis', 'Big Ideas', 'Context']
  },
  {
    id: 'people-person',
    name: 'People Person',
    icon: '💝',
    description: 'Focus on relationships, emotions, and human connections',
    gradient: 'from-pink-500 to-rose-600',
    modes: {
      character: 1.0,
      emotional: 0.7,
      connective: 0.3
    },
    tags: ['Characters', 'Emotions', 'Relationships']
  },
  {
    id: 'action-oriented',
    name: 'Action Oriented',
    icon: '🚀',
    description: 'Actionable insights and creative implementation',
    gradient: 'from-green-500 to-emerald-600',
    modes: {
      practical: 1.0,
      creative: 0.7,
      analytical: 0.3
    },
    tags: ['How-to', 'Creative', 'Results']
  }
];

export default function PresetButtons({ 
  onPresetSelect, 
  selectedPreset = null,
  className = '',
  layout = 'horizontal' // 'horizontal' or 'vertical'
}) {
  
  const containerClasses = layout === 'horizontal' 
    ? 'flex flex-col sm:flex-row gap-4 justify-center'
    : 'flex flex-col gap-4';

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Quick Start Presets
        </h3>
        <p className="text-sm text-gray-600">
          Choose a reading style that matches your goals, or customize your own below
        </p>
      </div>

      {/* Preset Buttons */}
      <div className={containerClasses}>
        {presets.map((preset, index) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPresetSelect(preset)}
            className={`
              relative group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              ${selectedPreset?.id === preset.id
                ? 'border-[#2349b4] bg-[#2349b4]/5 shadow-lg ring-2 ring-[#2349b4]/20'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }
              ${layout === 'horizontal' ? 'flex-1 min-w-0' : 'w-full'}
            `}
          >
            {/* Background gradient overlay */}
            <div className={`
              absolute inset-0 rounded-2xl bg-gradient-to-br ${preset.gradient} 
              opacity-0 transition-opacity duration-300
              ${selectedPreset?.id === preset.id ? 'opacity-5' : 'group-hover:opacity-3'}
            `} />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon and Title */}
              <div className="flex items-center justify-center mb-4">
                <div className={`
                  w-12 h-12 rounded-xl bg-gradient-to-br ${preset.gradient} 
                  flex items-center justify-center text-2xl text-white shadow-lg
                  ${selectedPreset?.id === preset.id ? 'scale-110' : 'group-hover:scale-105'}
                  transition-transform duration-300
                `}>
                  {preset.icon}
                </div>
              </div>

              <h4 className="font-semibold text-gray-800 text-lg mb-2 text-center">
                {preset.name}
              </h4>

              <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
                {preset.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center">
                {preset.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300
                      ${selectedPreset?.id === preset.id
                        ? 'bg-[#2349b4]/10 text-[#2349b4]'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Selected indicator */}
              {selectedPreset?.id === preset.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#2349b4] rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom option hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <p className="text-sm text-gray-500">
          Want more control? Customize individual reading lenses below 👇
        </p>
      </motion.div>
    </div>
  );
}

// Compact version for smaller spaces
export function CompactPresetButtons({ 
  onPresetSelect, 
  selectedPreset = null,
  className = ''
}) {
  return (
    <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
      {presets.map((preset) => (
        <motion.button
          key={preset.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPresetSelect(preset)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${selectedPreset?.id === preset.id
              ? `bg-gradient-to-r ${preset.gradient} text-white shadow-md`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <span>{preset.icon}</span>
          <span>{preset.name}</span>
        </motion.button>
      ))}
    </div>
  );
}

export { presets };