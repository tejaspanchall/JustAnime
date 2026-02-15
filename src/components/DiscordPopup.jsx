import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaDiscord, FaTelegram } from "react-icons/fa";

const DiscordPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Check if the user has opted out of seeing the popup
        const isHidden = localStorage.getItem("hideDiscordPopup");
        if (isHidden) return;

        // Set a timer for 2 minutes (120,000 ms)
        const timer = setTimeout(() => {
            setShouldRender(true);
            // Brief delay to trigger entrance animation
            setTimeout(() => setIsVisible(true), 10);
        }, 60000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for animation to finish before removing from DOM
        setTimeout(() => setShouldRender(false), 300);
    };

    const handleNeverShowAgain = () => {
        localStorage.setItem("hideDiscordPopup", "true");
        handleClose();
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 backdrop-blur-md pointer-events-auto" : "opacity-0 backdrop-blur-none pointer-events-none"
                }`}
        >
            <div
                className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden max-w-sm w-full transition-all duration-300 transform ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a] bg-[#1a1a1a]">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#5865F2] text-white rounded-xl shadow-md">
                            <FaDiscord className="text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-[15px] leading-tight">Join Our Community</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">Discord & Telegram</span>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-[#2a2a2a] rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 bg-[#1a1a1a]">
                    <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                        Join our official channels for early updates, announcements, and to connect with other fans!
                    </p>

                    <div className="mt-6 flex flex-col gap-3">
                        <a
                            href="https://discord.gg/P3yqksmGun"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#5865F2] hover:bg-[#4759d8] text-white py-2.5 px-4 rounded-xl font-bold transition-all transform active:scale-[0.97] shadow-lg"
                        >
                            <FaDiscord className="text-lg" />
                            JOIN DISCORD
                        </a>

                        <a
                            href="https://tinyurl.com/JustAnimeZone"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#26A5E4] hover:bg-[#2295ce] text-white py-2.5 px-4 rounded-xl font-bold transition-all transform active:scale-[0.97] shadow-lg"
                        >
                            <FaTelegram className="text-lg" />
                            JOIN TELEGRAM
                        </a>
                    </div>

                    <button
                        onClick={handleNeverShowAgain}
                        className="mt-5 w-full text-[11px] text-gray-500 hover:text-white underline-offset-4 hover:underline transition-colors py-1 font-semibold tracking-wide"
                    >
                        NEVER SHOW AGAIN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiscordPopup;
