import React, { useEffect, useRef } from "react";
import "./css/ProfileMenu.css";

export default function ProfileMenu({ open, onClose, onLogout }) {
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleLogout = () => {
        onClose();

        if (onLogout) {
            onLogout();
        }
    };

    return (
        <div
            ref={menuRef}
            className="profile-menu"
            role="menu"
            aria-label="Account menu"
        >
            <span className="profile-menu-arrow" aria-hidden="true" />

            <button
                type="button"
                className="profile-menu-item profile-menu-logout"
                onClick={handleLogout}
                role="menuitem"
            >
                <span className="profile-menu-icon">
                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M21 3v18" />
                    </svg>
                </span>

                <span>Logout</span>
            </button>
        </div>
    );
}
