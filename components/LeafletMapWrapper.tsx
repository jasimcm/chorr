// src/components/LeafletMapWrapper.tsx

"use client";

import dynamic from "next/dynamic";

// Dynamically import LeafletMap with SSR disabled
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

const LeafletMapWrapper = () => {
  return <LeafletMap />;
};

export default LeafletMapWrapper;
