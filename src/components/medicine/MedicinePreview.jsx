import React from 'react';
import { FaPills, FaVial, FaBox } from 'react-icons/fa';

const MedicinePreview = ({ type = 'pill', color = '#0ea5e9' }) => {
  const getIcon = () => {
    switch (type) {
      case 'pill':
        return <FaPills className="text-6xl" style={{ color }} />;
      case 'bottle':
        return <FaVial className="text-6xl" style={{ color }} />;
      case 'box':
        return <FaBox className="text-6xl" style={{ color }} />;
      default:
        return <FaPills className="text-6xl" style={{ color }} />;
    }
  };

  const getBgColor = () => {
    // Create a lighter background color based on the main color
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb = hexToRgb(color);
    if (!rgb) return 'bg-gray-100 dark:bg-gray-800';

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="w-32 h-32 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: getBgColor() }}
      >
        {getIcon()}
      </div>
      <div className="text-center">
        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {type === 'pill' ? 'Tablets/Capsules' : type === 'bottle' ? 'Liquid/Syrup' : 'Box/Package'}
        </p>
      </div>
    </div>
  );
};

export default MedicinePreview;
