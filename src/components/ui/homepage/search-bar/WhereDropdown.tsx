"use client";

import React from "react";

interface WhereDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const WhereDropdown: React.FC<WhereDropdownProps> = ({ value, onChange }) => {
  return (
          <div className="bg-mitti-beige border-2 border-mitti-dark-brown shadow-xl rounded-xl p-4">
            <input
              type="text"
              placeholder="Try Ooty, Coorg, or 'Anywhere in Bharat'"
              className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-mitti-dark-brown focus:ring-2"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <p className="text-xs mt-2">Leave blank to explore all locations</p>
          </div>
  );
};

export default WhereDropdown;
