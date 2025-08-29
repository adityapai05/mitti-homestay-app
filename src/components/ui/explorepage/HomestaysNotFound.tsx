import { Ghost } from "lucide-react";
import React from "react";

const HomestaysNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-mitti-dark-brown">
      <Ghost size={48} className="mb-4 text-mitti-dark-brown/50" />
      <h2 className="text-3xl font-bold mb-2">No homestays found</h2>
      <p className="text-sm text-mitti-dark-brown/70 max-w-md">
        We couldn't find any homestays matching your search criteria. Try
        changing the destination, dates, or number of guests.
      </p>
    </div>
  );
};

export default HomestaysNotFound;
