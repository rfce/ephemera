import "./css/Slides.css"

import { useLayoutEffect, useRef, useState } from "react"


const DEFAULT_STATS = [
    {
        value: 412,
        unit: "B",
        label: "Total beacon weight",
        note: "smaller than a bare tracking pixel",
    },
    {
        value: 0,
        unit: "",
        label: "Inbox permissions",
        note: "nothing to connect, nothing to leak",
    },
    {
        value: 1,
        unit: "",
        label: "Request per open",
        note: "one image fetch, that's the whole signal",
    }
]

const DEFAULT_CLIENTS = ["Spark", "Airmail", "Gmail", "Outlook", "Apple Mail", "Superhuman"]


function SlideGroup({
    items,
    repetitions,
    hidden = false,
    groupRef,
}) {
    return (
        <div
            ref={groupRef}
            className="slides-marquee__group"
            aria-hidden={hidden}
        >
            {Array.from({ length: repetitions }).map((_, repetition) =>
                items.map((name, index) => (
                    <span
                        className="slides-pill"
                        key={`${repetition}-${name}-${index}`}
                        aria-hidden={repetition > 0}
                    >
                        <span className="slides-pill__name">{name}</span>
                        <span className="slides-pill__tag">works</span>
                    </span>
                )),
            )}
        </div>
    )
}

function SlideRow({ items }) {
    const marqueeRef = useRef(null)
    const groupRef = useRef(null)
    const [repetitions, setRepetitions] = useState(2)

    useLayoutEffect(() => {
        const marquee = marqueeRef.current
        const group = groupRef.current

        if (!marquee || !group) return undefined

        const updateRepetitions = () => {
            const groupWidth = group.scrollWidth
            const oneSetWidth = groupWidth / repetitions

            if (!oneSetWidth) return

            // Extra repetition prevents blank space at the viewport edge.
            const required = Math.max(
                2,
                Math.ceil(marquee.clientWidth / oneSetWidth) + 1,
            )

            setRepetitions((current) =>
                current === required ? current : required,
            )
        }

        updateRepetitions()

        const observer = new ResizeObserver(updateRepetitions)
        observer.observe(marquee)

        return () => observer.disconnect()
    }, [items, repetitions])

    return (
        <div
            ref={marqueeRef}
            className="slides-marquee"
            aria-label="Supported email clients"
        >
            <div className="slides-marquee__track">
                <SlideGroup
                    items={items}
                    repetitions={repetitions}
                    groupRef={groupRef}
                />

                <SlideGroup
                    items={items}
                    repetitions={repetitions}
                    hidden
                />
            </div>
        </div>
    )
}

export default function Slides({
    stats = DEFAULT_STATS,
    clients = DEFAULT_CLIENTS,
    duration = 1400,
    className = "",
}) {
    const rootClass = className ? `slides ${className}` : "slides"

    return (
        <div className={rootClass}>
            {clients.length > 0 ? <SlideRow items={clients} /> : null}
        </div>
    )
}
