'use client';

import { motion } from 'framer-motion';
import { lensConfigs } from './LensButton';

const intensityLevels = [
  { value: 0.3, label: 'Light', description: 'Subtle emphasis' },
  { value: 0.7, label: 'Medium', description: 'Balanced focus' },
  { value: 1.0, label: 'Strong', description: 'Primary emphasis' }
];

export default function IntensitySlider({ 
  lensKey, 
  intensity = 0.7, 
  onIntensityChange,
  className = ''
}) {
  const config = lensConfigs[lensKey];
  
  if (!config) {
    return null;
  }

  const currentLevelIndex = intensityLevels.findIndex(level => level.value === intensity);
  const currentLevel = intensityLevels[currentLevelIndex] || intensityLevels[1];

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{config.icon}</span>
          <span className="text-sm font-medium text-gray-700">{config.name}</span>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          {currentLevel.label}
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative">
        {/* Background track */}
        <div className="h-2 bg-gray-200 rounded-full">
          {/* Active track */}
          <motion.div 
            className={`h-2 rounded-full bg-gradient-to-r ${config.gradient}`}
            initial={{ width: '0%' }}
            animate={{ width: `${intensity * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Intensity level markers */}
        <div className="absolute top-0 w-full h-2 flex justify-between items-center">
          {intensityLevels.map((level, index) => (
            <motion.button
              key={level.value}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onIntensityChange(level.value)}
              className={`
                w-4 h-4 rounded-full border-2 cursor-pointer transition-all duration-200
                ${intensity === level.value
                  ? 'bg-white border-[#2349b4] shadow-lg scale-110'
                  : 'bg-white border-gray-300 hover:border-gray-400'
                }
              `}
              style={{
                boxShadow: intensity === level.value 
                  ? '0 0 0 3px rgba(35, 73, 180, 0.2)' 
                  : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* Level labels */}
      <div className="flex justify-between text-xs text-gray-500 px-2">
        {intensityLevels.map((level) => (
          <motion.button
            key={level.value}
            whileHover={{ scale: 1.05 }}
            onClick={() => onIntensityChange(level.value)}
            className={`
              cursor-pointer transition-colors duration-200 font-medium
              ${intensity === level.value 
                ? 'text-[#2349b4]' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {level.label}
          </motion.button>
        ))}
      </div>

      {/* Description */}
      <div className="text-xs text-gray-400 text-center italic">
        {currentLevel.description}
      </div>
    </div>
  );
}

// Alternative simplified version for space-constrained layouts
export function CompactIntensitySlider({ 
  lensKey, 
  intensity = 0.7, 
  onIntensityChange,
  className = ''
}) {
  const config = lensConfigs[lensKey];
  
  if (!config) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-600">Intensity:</span>
      
      {/* Compact button group */}
      <div className="flex space-x-1">
        {intensityLevels.map((level) => (
          <motion.button
            key={level.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onIntensityChange(level.value)}
            className={`
              w-8 h-6 rounded text-xs font-medium transition-all duration-200
              ${intensity === level.value
                ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {level.label[0]}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export { intensityLevels };