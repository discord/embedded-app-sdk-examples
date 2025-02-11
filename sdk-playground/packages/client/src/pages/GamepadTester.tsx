import React from "react";
import ReactJsonView from "../components/ReactJsonView";
import { useLocation } from "react-router-dom";
import { styled } from "../styled";

const GamepadCard = styled("div", {
  border: "1px solid $slate12",
  borderRadius: "4px",
  padding: "16px",
  marginBottom: "16px",
  maxWidth: "1200px",
});

const GamepadGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginTop: "12px",
  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
});

const Section = styled("div", {
  border: "1px solid $slate6",
  padding: "12px 16px",
  borderRadius: "4px",
  background: "$slate2",
  minWidth: 0, // Prevent overflow in grid
});

const InputRow = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 8px",
  marginBottom: "4px",
  border: "1px solid $slate6",
  borderRadius: "4px",
  transition: "all 0.2s ease",
  variants: {
    active: {
      true: {
        borderColor: "$indigo9",
        background: "$indigo3",
      },
    },
  },
});

const ValueBadge = styled("span", {
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "0.9em",
  variants: {
    active: {
      true: {
        background: "$indigo9",
        color: "white",
      },
      false: {
        background: "$slate4",
        color: "$slate11",
      },
    },
  },
});

const GamepadId = styled("div", {
  color: "$slate11",
  fontSize: "0.9em",
});

const SectionTitle = styled("h3", {
  margin: "0 0 8px 0",
  color: "$slate12",
  fontWeight: "normal",
  fontSize: "0.9em",
});

interface GamepadRendererProps {
  gamepad: Gamepad | null;
  index: number;
}

function GamepadRenderer({ gamepad, index }: GamepadRendererProps) {
  const mapping = React.useMemo(() => {
    if (!gamepad) return null;
    return gamepadMappings.find((m) => m.match(gamepad));
  }, [gamepad]);

  if (gamepad === null) {
    return (
      <GamepadCard>
        <h2>Gamepad {index + 1}</h2>
        <p>Gamepad disconnected</p>
      </GamepadCard>
    );
  }

  return (
    <GamepadCard>
      <h2 style={{ margin: "0 0 4px 0", fontSize: "1.1em" }}>Gamepad {index + 1}</h2>
      <GamepadId>{gamepad.id}</GamepadId>
      
      <GamepadGrid>
        <Section>
          <SectionTitle>Axes</SectionTitle>
          {gamepad.axes.map((axis, idx) => (
            <InputRow key={idx} active={Math.abs(axis) > 0.1}>
              <span>
                {mapping?.map.axes[idx] ? mapping.map.axes[idx] : `Axis ${idx}`}
              </span>
              <ValueBadge active={Math.abs(axis) > 0.1}>
                {axis.toFixed(2)}
              </ValueBadge>
            </InputRow>
          ))}
        </Section>

        <Section>
          <SectionTitle>Buttons</SectionTitle>
          {gamepad.buttons.map((button, idx) => (
            <InputRow key={idx} active={button.value > 0}>
              <span>
                {mapping?.map.buttons[idx] ? mapping.map.buttons[idx] : `Button ${idx}`}
              </span>
              <ValueBadge active={button.value > 0}>
                {button.value.toFixed(2)}
              </ValueBadge>
            </InputRow>
          ))}
        </Section>
      </GamepadGrid>
    </GamepadCard>
  );
}

type GamepadMapping = {
  match: (gamepad: Gamepad) => boolean;
  map: {
    axes: { [key: number]: string };
    buttons: { [key: number]: string };
  };
};

const gamepadMappings: GamepadMapping[] = [
  {
    match: (gamepad: Gamepad) => gamepad.id.toLowerCase().includes("xbox"),
    map: {
      axes: {
        0: "left stick x",
        1: "left stick y",
        2: "right stick x",
        3: "right stick y",
      },
      buttons: {
        0: "A",
        1: "B",
        2: "X",
        3: "Y",
        4: "LB",
        5: "RB",
        6: "LT",
        7: "RT",
        8: "view",
        9: "menu",
        10: "left stick",
        11: "right stick",
        12: "d-pad up",
        13: "d-pad down",
        14: "d-pad left",
        15: "d-pad right",
        16: "Xbox",
        17: "Share"
      },
    },
  },
  {
    match: (gamepad: Gamepad) => gamepad.id.includes("Backbone One"),
    map: {
      axes: {
        0: "left stick x",
        1: "left stick y",
        2: "right stick x",
        3: "right stick y",
      },
      buttons: {
        0: "A",
        1: "B",
        2: "X",
        3: "Y",
        4: "L1",
        5: "R1",
        6: "L2",
        7: "R2",
        8: "select",
        9: "start",
        10: "left stick",
        11: "right stick",
        12: "up",
        13: "down",
        14: "left",
        15: "right",
      },
    },
  },
  {
    match: (gamepad: Gamepad) => gamepad.id.includes("DualSense"),
    map: {
      axes: {
        0: "left stick x",
        1: "left stick y",
        2: "right stick x",
        3: "right stick y",
      },
      buttons: {
        0: "cross",
        1: "circle",
        2: "square",
        3: "triangle",
        4: "L1",
        5: "R1",
        6: "L2",
        7: "R2",
        8: "share",
        9: "options",
        10: "left stick",
        11: "right stick",
        16: "PS",
        17: "touchpad",
      },
    },
  },
];

export default function GamepadTester() {
  const [gamepads, setGamepads] = React.useState<(Gamepad | null)[]>([]);
  const animateRef = React.useRef<number | null>(null);

  function animate() {
    setGamepads(navigator.getGamepads());
    animateRef.current = requestAnimationFrame(animate);
  }

  React.useEffect(() => {
    function onGamepadConnected(event: GamepadEvent) {
      console.log("A gamepad connected:");
      console.log(event.gamepad);
      setGamepads(navigator.getGamepads());
    }

    function onGamepadDisconnected(event: GamepadEvent) {
      console.log("A gamepad disconnected:");
      console.log(event.gamepad);
      setGamepads(navigator.getGamepads());
    }

    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    animateRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      cancelAnimationFrame(animateRef.current!);
    };
  }, []);

  return (
    <div style={{ padding: "16px 32px" }}>
      <h1>Gamepad tester</h1>
      <p>press any button to make your gamepad appear</p>
      {gamepads.length === 0 && <p>No gamepads connected</p>}

      {gamepads.map((gamepad, index) => (
        <GamepadRenderer key={index} gamepad={gamepad} index={index} />
      ))}
    </div>
  );
}
