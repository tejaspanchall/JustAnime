import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const InfoTag = ({ icon, text, bgColor, className = "" }) => {
    if (!text) return null;

    return (
        <div
            className={`flex space-x-1 justify-center items-center px-2 sm:px-3 py-0.5 sm:py-1 text-white backdrop-blur-md font-medium text-[10px] sm:text-[13px] rounded-md sm:rounded-full transition-all duration-300 hover:bg-white/20 ${className}`}
            style={bgColor ? { backgroundColor: bgColor } : {}}
        >
            {icon && <FontAwesomeIcon icon={icon} className="text-[10px] sm:text-[12px] mr-1" />}
            <p className="text-[10px] sm:text-[12px]">{text}</p>
        </div>
    );
};

export default React.memo(InfoTag);
