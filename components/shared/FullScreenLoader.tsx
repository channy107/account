"use client";
import { DotLoader } from "react-spinners";

const FullScreenLoader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-[rgba(255,255,255,0.75)]">
      <DotLoader color="#17191a" />
    </div>
  );
};

export default FullScreenLoader;
