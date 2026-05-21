import { usePawMode } from '../context/PawModeContext';

export default function PawModeToggle() {
  const { pawMode, togglePawMode, pawCount, clearPaws } = usePawMode();

  return (
    <>
      {pawMode && (
        <>
          <div className="paw-counter" data-paw-ignore>
            Отпечатков: <span>{pawCount}</span>
          </div>
          <button
            type="button"
            data-paw-ignore
            className="paw-clear-btn"
            onClick={clearPaws}
          >
            Очистить
          </button>
        </>
      )}
      <div className="paw-mode-label" data-paw-ignore>
        {pawMode ? '🐾 Режим: лапка!' : 'Режим: обычный'}
      </div>
      <button
        type="button"
        id="paw-btn"
        data-paw-ignore
        className={pawMode ? 'active' : ''}
        onClick={togglePawMode}
        aria-label={pawMode ? 'Выключить режим лапки' : 'Включить режим лапки'}
        aria-pressed={pawMode}
      >
        🐾
      </button>
    </>
  );
}
