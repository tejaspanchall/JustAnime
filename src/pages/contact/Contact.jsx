import React from 'react';
import website_name from '@/src/config/website.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function Contact() {
  return (
    <div className="max-w-4xl mx-auto pt-16 pb-8">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <div className="space-y-8 text-white/60">
        <p>
          Get in touch with the {website_name} team through any of the following platforms:
        </p>
        <div className="flex flex-wrap gap-6">
          <a
            href="https://t.me/JustAnimeZone"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-xl text-white/60 group-hover:text-white" />
            <span className="text-white/60 group-hover:text-white">Join our Telegram</span>
          </a>
          <a
            href="https://discord.gg/P3yqksmGun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <FontAwesomeIcon icon={faDiscord} className="text-xl text-white/60 group-hover:text-white" />
            <span className="text-white/60 group-hover:text-white">Join Discord Server</span>
          </a>
          <a
            href="https://github.com/tejaspanchall/JustAnime"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <FontAwesomeIcon icon={faGithub} className="text-xl text-white/60 group-hover:text-white" />
            <span className="text-white/60 group-hover:text-white">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact; 