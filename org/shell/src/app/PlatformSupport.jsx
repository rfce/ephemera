import "./css/PlatformSupport.css"
import React, { useState, useEffect, useRef } from 'react';

export default function PlatformSupportLight() {
  return (
    <section className="prem-plat-section light-mode is-visible">
      <div className="prem-plat-wrapper">
        
        {/* Floating Corner Emojis - Wrapped for entrance animation */}
        <div className="emoji-reveal-wrapper emoji-tl delay-1">
          <img src="https://lookup.trackpixels.online/api/Focus/1f605.png" alt="Sweat Emoji" className="floating-emoji" />
        </div>
        <div className="emoji-reveal-wrapper emoji-tr delay-3">
          <img src="https://lookup.trackpixels.online/api/Focus/1f382.png" alt="Cake Emoji" className="floating-emoji" />
        </div>
        <div className="emoji-reveal-wrapper emoji-bl delay-5">
          <img src="https://lookup.trackpixels.online/api/Focus/1f929.png" alt="Star Emoji" className="floating-emoji" />
        </div>

        <div className="prem-plat-container">
          
          <div className="prem-plat-kicker animate-item delay-1">EMAIL PLATFORM SUPPORT</div>
          
          <h2 className="prem-plat-headline animate-item delay-2">
            Works with your favorite <br />
            <span className="coral-highlight">email platforms</span>
          </h2>
          
          <p className="prem-plat-subhead animate-item delay-3">
            Track Pixels works seamlessly with the tools you already use. No integrations, plugins, or inbox access required.
          </p>

          <div className="prem-plat-divider animate-item delay-4"></div>

          <div className="prem-plat-pill animate-item delay-5">
            <div className="pulse-dot"></div>
            <span>Outlook</span>
          </div>

          <div className="prem-plat-stats">
            {/* Staggering the individual stat blocks for a high-end feel */}
            <div className="stat-block animate-item delay-6">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Emails tracked</div>
            </div>
            <div className="stat-block animate-item delay-7">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-block animate-item delay-8">
              <div className="stat-number">&lt;1s</div>
              <div className="stat-label">Tracking latency</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
