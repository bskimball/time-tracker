import React from 'react';
import type { LiveFloorData, MetricType } from '../types';

interface WarehouseFloorProps {
  data: LiveFloorData;
  metric: MetricType;
}

const colorForMetric = (value: number, metric: MetricType): string => {
  if (metric === 'occupancy') {
    if (value > 90) return 'bg-red-500';
    if (value > 75) return 'bg-yellow-400';
    return 'bg-green-500';
  } else {
    // efficiency: higher is better, low efficiency is warning
    if (value < 50) return 'bg-red-500';
    if (value < 75) return 'bg-yellow-400';
    return 'bg-green-500';
  }
};

const zonesLayout = [
  { id: 'Picking', x: 10, y: 10, width: 120, height: 80 },
  { id: 'Packing', x: 150, y: 10, width: 120, height: 80 },
  { id: 'Filling', x: 290, y: 10, width: 120, height: 80 },
  { id: 'Receiving', x: 10, y: 110, width: 120, height: 80 },
  { id: 'Shipping', x: 150, y: 110, width: 120, height: 80 },
];

const WarehouseFloor: React.FC<WarehouseFloorProps> = ({ data, metric }) => {
  const zonesMap = data.zones.reduce<Record<string, number>>((acc, zone) => {
    acc[zone.name] = metric === 'occupancy' ? zone.occupancy : zone.efficiency;
    return acc;
  }, {});

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Live Warehouse Floor</h2>
      <svg width={430} height={210} className="mx-auto">
        {zonesLayout.map((zone) => {
          const value = zonesMap[zone.id] ?? 0;
          const colorClass = colorForMetric(value, metric);
          return (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                className={`${colorClass} stroke-gray-700 stroke`}
              />
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-medium"
              >
                {zone.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default WarehouseFloor;
