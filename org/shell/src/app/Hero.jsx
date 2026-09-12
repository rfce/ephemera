import { useEffect, useState } from "react";
import "./css/Hero.css";
import { useNavigate } from "react-router-dom";

const Logo = new URL('../assets/Logo-transparent.png', import.meta.url).href
const Background = new URL('../assets/hero-scrub.mp4', import.meta.url).href


function LogoMark() {
    return (
        <svg
            className="logo-mark"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <g transform="rotate(-30 12 12)">
                <circle cx="7.3" cy="3.2" r="1.45" />
                <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <circle cx="16.7" cy="20.8" r="1.45" />
            </g>
        </svg>
    );
}

function Sparkle() {
    return (
        <svg
            className="badge-star"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
        >
            <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
        </svg>
    );
}

function Hero() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const elements = document.querySelectorAll(".appear, .hero-photo");

        const handleAnimationEnd = (event) => {
            event.currentTarget.classList.add("is-in");
        };

        elements.forEach((element) => {
            element.addEventListener("animationend", handleAnimationEnd);
        });

        const frame1 = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                elements.forEach((element) => {
                    const animations = element.getAnimations?.();

                    if (!animations?.some(
                        (animation) =>
                            animation.playState === "running" ||
                            animation.playState === "finished"
                    )) {
                        element.classList.add("is-in");
                    }
                });
            });
        });

        return () => {
            cancelAnimationFrame(frame1);

            elements.forEach((element) => {
                element.removeEventListener(
                    "animationend",
                    handleAnimationEnd
                );
            });
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth >= 901) {
                setMenuOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("keydown", handleEscape);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle("menu-open", menuOpen);

        return () => {
            document.body.classList.remove("menu-open");
        };
    }, [menuOpen]);

    const navigate = useNavigate()

    return (
        <div className="vesper-page">
            <div className="grain" />

            <video
                className="hero-photo"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
            >
                <source src={Background} type="video/mp4" />
            </video>

            <div className="menu-backdrop" />

            <div className="page">
                <header className="header">
                    <a
                        href="#top"
                        className="logo appear appear--scale"
                        style={{ "--d": "0.08s" }}
                        aria-label="Vesper.ai"
                    >
                        <img src={Logo} alt="Logo" />
                        <span>
                            Track Pixels
                        </span>
                    </a>
                    <nav></nav>
                    <a
                        className="btn btn-solid header-cta appear appear--scale"
                        style={{ "--d": "0.34s" }}
                        onClick={(e) => {
                            (e) => e.preventDefault()
                            navigate("/sign-up")}}
                    >
                        Start for Free
                    </a>

                    <button
                        className="burger appear appear--scale"
                        style={{ "--d": "0.34s" }}
                        type="button"
                        aria-controls="site-nav"
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMenuOpen((value) => !value)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </header>

                <main className="hero" id="top">
                    <div className="hero-copy">
                        <div
                            className="badge appear appear--pop"
                            style={{ "--d": "0.22s" }}
                        >
                            
                            <Sparkle />
                            <span>Your emails have secrets</span>
                        </div>

                        <h1>
                            <span
                                className="headline-line appear appear--mask"
                                style={{ "--d": "0.42s" }}
                            >
                                Emails <em>that tell</em> you
                            </span>

                            <span
                                className="headline-line appear appear--mask"
                                style={{ "--d": "0.62s" }}
                            >
                                when they are opened.
                            </span>
                        </h1>

                        <p
                            className="lede appear appear--soft"
                            style={{
                                "--d": "0.82s",
                                "--duration": "1.25s"
                            }}
                        >
                            Turn an ordinary emoji into a tiny tracking pixel and discover when your emails are opened, viewed, and engaged with.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Hero;
