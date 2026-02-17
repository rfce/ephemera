import { useState, useMemo } from "react";
import "./css/App.css";
import { useAtom } from 'jotai';
import { composeAtom } from '@org/shared-state';
import MESSAGES from "./messages.json";

const CATEGORIES = [
  "Fun",
  "Greetings",
  "Celebration",
  "Work",
  "Follow-up",
  "Friendly",
  "Reminder",
  "Random",
];

export const getRandomMessages = (category, count = 6, messages = MESSAGES) => {
  const list = messages[category] || [];
  return [...list]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

const Recommended = () => {
  const [active, setActive] = useState("Fun");
  const [text, setText] = useAtom(composeAtom);

  // Generate random messages ONLY once on initial mount
  const cachedMessages = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((cat) => {
      map[cat] = getRandomMessages(cat);
    });
    return map;
  }, []);

  return (
    <div className="_8rid">
      <div className="mettle-bang">
        <div className="franc-fink">Recommended</div>

        {/* Category Tabs */}
        <div className="category-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${active === cat ? "active" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Messages Grid */}
        <div className="messages-grid">
          {cachedMessages[active].map((msg, i) => (
            <div
              key={i}
              className="message-card"
              onClick={() => setText(msg)}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommended;
