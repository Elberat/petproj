import type { ControlId } from "./types";

type ControlsPadProps = {
  controls: ControlId[];
  onPress: (control: ControlId) => void;
};

export const ControlsPad = ({ controls, onPress }: ControlsPadProps) => {
  const handlePress = (control: ControlId) => {
    onPress(control);
  };

  const buttonStyle: React.CSSProperties = {
    minHeight: "48px",
    minWidth: "48px",
    border: "2px solid #fff",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
    touchAction: "manipulation",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (controls.length === 0) {
    return null;
  }

  // Одна большая кнопка для tap или action
  if (controls.length === 1 && (controls[0] === "tap" || controls[0] === "action")) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "16px" }}>
        <button
          style={{
            ...buttonStyle,
            width: "100%",
            maxWidth: "300px",
            height: "80px",
            fontSize: "20px",
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress(controls[0]);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handlePress(controls[0]);
          }}
        >
          {controls[0] === "tap" ? "TAP" : "ACTION"}
        </button>
      </div>
    );
  }

  // Две кнопки для left/right
  if (controls.length === 2 && controls.includes("left") && controls.includes("right")) {
    return (
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <button
          style={{
            ...buttonStyle,
            flex: 1,
            maxWidth: "150px",
            height: "80px",
            fontSize: "20px",
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress("left");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handlePress("left");
          }}
        >
          ← LEFT
        </button>
        <button
          style={{
            ...buttonStyle,
            flex: 1,
            maxWidth: "150px",
            height: "80px",
            fontSize: "20px",
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress("right");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handlePress("right");
          }}
        >
          RIGHT →
        </button>
      </div>
    );
  }

  // D-pad для up/down/left/right
  if (
    controls.length >= 2 &&
    (controls.includes("up") ||
      controls.includes("down") ||
      controls.includes("left") ||
      controls.includes("right"))
  ) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          padding: "16px",
        }}
      >
        {controls.includes("up") && (
          <button
            style={{
              ...buttonStyle,
              width: "80px",
              height: "60px",
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              handlePress("up");
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handlePress("up");
            }}
          >
            ↑
          </button>
        )}
        <div style={{ display: "flex", gap: "4px" }}>
          {controls.includes("left") && (
            <button
              style={{
                ...buttonStyle,
                width: "80px",
                height: "60px",
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                handlePress("left");
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePress("left");
              }}
            >
              ←
            </button>
          )}
          {controls.includes("down") && (
            <button
              style={{
                ...buttonStyle,
                width: "80px",
                height: "60px",
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                handlePress("down");
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePress("down");
              }}
            >
              ↓
            </button>
          )}
          {controls.includes("right") && (
            <button
              style={{
                ...buttonStyle,
                width: "80px",
                height: "60px",
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                handlePress("right");
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePress("right");
              }}
            >
              →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback: рендерим все кнопки из controls
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {controls.map((control) => (
        <button
          key={control}
          style={{
            ...buttonStyle,
            padding: "12px 24px",
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress(control);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handlePress(control);
          }}
        >
          {control.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

