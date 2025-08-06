'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LensButton, { lensConfigs } from './LensButton';
import IntensitySlider from './IntensitySlider';
import PresetButtons, { presets } from './PresetButtons';

// Define the 8 lens keys in order
const lensKeys = [
  'analytical', 'character', 'philosophical', 'creative',
  'practical', 'emotional', 'historical', 'connective'
];

export default function MindmapLensSelector({
  isOpen = false,
  onClose,
  onGenerate,
  book = null,
  className = ''
}) {
  const [selectedLenses, setSelectedLenses] = useState({});
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize with default selection (Medium analytical mode)
  useEffect(() => {
    if (Object.keys(selectedLenses).length === 0) {
      setSelectedLenses({
        analytical: 0.7 // Default to medium analytical
      });
    }
  }, [selectedLenses]);

  const handleLensToggle = (lensKey) => {
    setSelectedLenses(prev => {
      const newSelection = { ...prev };
      
      if (newSelection[lensKey]) {
        // Remove lens
        delete newSelection[lensKey];
      } else {
        // Add lens with medium intensity
        newSelection[lensKey] = 0.7;
      }
      
      return newSelection;
    });
    
    // Clear preset selection when manually changing lenses
    setSelectedPreset(null);
  };

  const handleIntensityChange = (lensKey, intensity) => {
    setSelectedLenses(prev => ({
      ...prev,
      [lensKey]: intensity
    }));
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setSelectedLenses(preset.modes);
    setShowAdvanced(false); // Hide advanced options when using preset
  };

  const handleGenerate = async () => {
    if (Object.keys(selectedLenses).length === 0) {
      // Default to analytical if nothing selected
      setSelectedLenses({ analytical: 0.7 });
      return;
    }

    setIsGenerating(true);
    
    try {
      const lensData = {
        selectedModes: selectedLenses,
        preset: selectedPreset?.id || 'custom',
        bookTitle: book?.title || 'Unknown Book',
        totalModes: Object.keys(selectedLenses).length
      };

      await onGenerate(lensData);
      onClose(); // Close modal after successful generation
    } catch (error) {
      console.error('Error generating mindmap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCount = Object.keys(selectedLenses).length;
  const hasSelection = selectedCount > 0;

  // Modal backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isGenerating) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`
            bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] 
            overflow-y-auto border border-gray-100 ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-8 py-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg">
                  📖
                </div>
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-gray-800">
                    Choose Your Reading Lens
                  </h2>
                  <p className="text-gray-600">
                    Select the perspectives that resonate with you for "{book?.title || 'this book'}"
                  </p>
                </div>
              </div>
              
              {!isGenerating && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Selection Summary */}
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                {selectedCount} lens{selectedCount !== 1 ? 'es' : ''} selected
                {selectedPreset && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {selectedPreset.name}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-1 text-[#2349b4] hover:text-[#1a3798] font-medium transition-colors"
              >
                <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
                <motion.svg 
                  animate={{ rotate: showAdvanced ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Preset Selection */}
            <PresetButtons
              onPresetSelect={handlePresetSelect}
              selectedPreset={selectedPreset}
            />

            {/* Lens Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Customize Individual Lenses
                </h3>
                <button
                  onClick={() => setSelectedLenses({})}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Primary lenses (first 4) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {lensKeys.slice(0, 4).map((lensKey) => (
                  <LensButton
                    key={lensKey}
                    lensKey={lensKey}
                    isSelected={!!selectedLenses[lensKey]}
                    onToggle={handleLensToggle}
                    disabled={isGenerating}
                  />
                ))}
              </div>

              {/* Advanced lenses (last 4) - collapsible */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-md font-medium text-gray-700 mb-4">Advanced Lenses</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {lensKeys.slice(4).map((lensKey) => (
                          <LensButton
                            key={lensKey}
                            lensKey={lensKey}
                            isSelected={!!selectedLenses[lensKey]}
                            onToggle={handleLensToggle}
                            disabled={isGenerating}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Intensity Controls */}
            {hasSelection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="border-t border-gray-100 pt-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Fine-tune Intensity
                </h3>
                <div className="grid gap-6 max-w-2xl">
                  {Object.entries(selectedLenses).map(([lensKey, intensity]) => (
                    <IntensitySlider
                      key={lensKey}
                      lensKey={lensKey}
                      intensity={intensity}
                      onIntensityChange={(newIntensity) => handleIntensityChange(lensKey, newIntensity)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white rounded-b-3xl border-t border-gray-100 px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-gray-600">
                {!hasSelection && (
                  <span className="text-amber-600">⚠️ Please select at least one lens</span>
                )}
                {hasSelection && (
                  <span>Ready to generate your personalized mindmap</span>
                )}
              </div>

              <div className="flex gap-3">
                {!isGenerating && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                )}

                <motion.button
                  whileHover={hasSelection && !isGenerating ? { scale: 1.02 } : {}}
                  whileTap={hasSelection && !isGenerating ? { scale: 0.98 } : {}}
                  onClick={handleGenerate}
                  disabled={!hasSelection || isGenerating}
                  className={`
                    px-8 py-3 rounded-2xl font-semibold transition-all duration-300 
                    flex items-center space-x-2 min-w-[160px] justify-center
                    ${hasSelection && !isGenerating
                      ? 'bg-gradient-to-r from-[#2349b4] to-[#1a3798] text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Mindmap</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { lensKeys, lensConfigs };