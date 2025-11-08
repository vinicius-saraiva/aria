'use client';

import { useEffect, useRef, useState } from 'react';
import { LocationData } from './WeatherApp';

interface WeatherMapProps {
  onLocationSelect: (location: LocationData) => void;
}

export default function WeatherMap({ onLocationSelect }: WeatherMapProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentUrl, setCurrentUrl] = useState('https://earth.nullschool.net/#current/wind/surface/level/orthographic');

  useEffect(() => {
    // Listen for messages from the iframe (if earth.nullschool.net supports postMessage)
    const handleMessage = (event: MessageEvent) => {
      // For security, verify the origin
      if (event.origin === 'https://earth.nullschool.net') {
        console.log('Message from map:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleMapClick = () => {
    // Try to extract coordinates from the URL hash
    if (iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        // Note: Due to CORS restrictions, we can't directly access iframe content
        // We'll need to parse the URL or use a different approach
        const url = iframe.src;
        console.log('Current map URL:', url);

        // Parse coordinates from URL if available
        // earth.nullschool.net URL format: #current/wind/surface/level/orthographic=-10.00,20.00,1000
        const match = url.match(/orthographic=([-\d.]+),([-\d.]+)/);
        if (match) {
          const lat = parseFloat(match[1]);
          const lon = parseFloat(match[2]);
          onLocationSelect({
            lat,
            lon,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error extracting coordinates:', error);
      }
    }
  };

  const handleCoordinateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lat = parseFloat(formData.get('lat') as string);
    const lon = parseFloat(formData.get('lon') as string);

    if (!isNaN(lat) && !isNaN(lon)) {
      // Update the iframe URL with new coordinates
      const newUrl = `https://earth.nullschool.net/#current/wind/surface/level/orthographic=${lon},${lat},1500`;
      setCurrentUrl(newUrl);

      // Send location to chat
      onLocationSelect({
        lat,
        lon,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Coordinate Input */}
      <div className="p-4 bg-gray-800 text-white">
        <h2 className="text-lg font-bold mb-3">Sailing Weather Map</h2>
        <form onSubmit={handleCoordinateSubmit} className="flex gap-2">
          <input
            type="number"
            name="lat"
            placeholder="Latitude"
            step="0.01"
            min="-90"
            max="90"
            className="px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 flex-1"
            required
          />
          <input
            type="number"
            name="lon"
            placeholder="Longitude"
            step="0.01"
            min="-180"
            max="180"
            className="px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 flex-1"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
          >
            Go
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          Enter coordinates or explore the map, then ask the AI about the weather conditions
        </p>
      </div>

      {/* Map iframe */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-0"
          title="Earth Wind Map"
          onClick={handleMapClick}
        />
      </div>
    </div>
  );
}
