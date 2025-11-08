'use client';

import { useState } from 'react';
import WeatherMap from './WeatherMap';
import ChatPanel from './ChatPanel';

export interface LocationData {
  lat: number;
  lon: number;
  timestamp: string;
  screenshot?: string; // base64 encoded screenshot
}

export default function WeatherApp() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  return (
    <div className="flex h-full w-full">
      {/* Left side - Weather Map */}
      <div className="w-1/2 h-full border-r border-gray-300">
        <WeatherMap onLocationSelect={setSelectedLocation} />
      </div>

      {/* Right side - AI Chat */}
      <div className="w-1/2 h-full">
        <ChatPanel selectedLocation={selectedLocation} />
      </div>
    </div>
  );
}
