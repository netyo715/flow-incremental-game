import { Module } from "../types/factory";

export const drawModuleView = (
  context: CanvasRenderingContext2D,
  modules: Map<string, Module>,
  selectedModuleId?: string
) => {
  context.clearRect(0, 0, 512, 512);
  // 接続の描画
  Array.from(modules.entries()).forEach(([moduleId, module]) => {
    if (!module.position) {
      return;
    }
    const inputPosition = module.position;
    module.inputs.forEach((input) => {
      if (!input.connectedModuleIO) {
        return;
      }
      const outputModule = modules.get(input.connectedModuleIO.moduleId);
      if (!outputModule) {
        return;
      }
      const outputPosition = outputModule.position;
      if (!outputPosition) {
        return;
      }
      drawArrow(
        context,
        inputPosition.x,
        inputPosition.y,
        outputPosition.x,
        outputPosition.y
      );
    });
  });
  // モジュールの描画
  Array.from(modules.entries()).forEach(([moduleId, module]) => {
    if (!module.position) {
      return;
    }
    drawModule(
      context,
      module.position.x,
      module.position.y,
      moduleId === selectedModuleId
    );
  });
};

const drawModule = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  isSelected?: boolean
) => {
  context.beginPath();
  context.arc(x, y, 10, 0, 2 * Math.PI, false);
  context.strokeStyle = isSelected ? "red" : "black";
  context.lineWidth = 1;
  context.fillStyle = "white";
  context.fill();
  context.stroke();
};

const drawArrow = (
  context: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
};
