import React, { useEffect, useRef, useState } from "react";
import type { Screen } from "../../App";
import { HowToPlay } from "../../components/HowToPlay/HowToPlay";
import gameInfo from "../../json/gameInfo.json";

interface Props {
  selectedGame: (typeof gameInfo)[number] | undefined;
  onNavigate: (screen: Screen) => void;
}

export function GameMenu(props: Props) {
  const { selectedGame, onNavigate } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isShowingHelp, setIsShowingHelp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Menyen lukkes av Escape og av trykk utenfor.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function onPointerDown(event: Event) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function showHelp() {
    setIsOpen(false);
    // Menyvalget forsvinner, så menyknappen får fokus. Dit går det tilbake
    // når hjelpen lukkes.
    buttonRef.current?.focus();
    setIsShowingHelp(true);
  }

  return (
    <div className="menu" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className="menu__button"
        aria-label="Meny"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true">
          <path
            d="M3 6h16M3 11h16M3 16h16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {isOpen && (
        <nav className="menu__list" aria-label="Spillmeny">
          <button
            type="button"
            className="menu__item"
            onClick={() => onNavigate("setup")}
          >
            Endre oppsett
          </button>
          {selectedGame && (
            <>
              <a
                className="menu__item"
                href={selectedGame.spotifyLink}
                target="_blank"
                rel="noreferrer"
              >
                Spilleliste
              </a>
              <a
                className="menu__item"
                href={selectedGame.googleDocLink}
                target="_blank"
                rel="noreferrer"
              >
                Fasit (kun spilleder)
              </a>
            </>
          )}
          <button type="button" className="menu__item" onClick={showHelp}>
            Slik spiller du
          </button>
          <button
            type="button"
            className="menu__item menu__item--separated"
            onClick={() => onNavigate("result")}
          >
            Avslutt og kår vinner
          </button>
        </nav>
      )}
      {isShowingHelp && <HowToPlay onClose={() => setIsShowingHelp(false)} />}
    </div>
  );
}
