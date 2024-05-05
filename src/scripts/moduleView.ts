import { Dispatch, SetStateAction } from "react";
import { Module } from "../types/factory";

const MODULE_SIZE = 20;

export class FactoryViewManager {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  isDragging = false;
  isMoved = false;
  clickedModuleId: string | undefined = undefined;
  setSelectedModuleId: Dispatch<SetStateAction<string | undefined>>;
  setPosition: (moduleId: string, position?: { x: number; y: number }) => void;
  drawnModules = new Map<string, Module>();

  constructor(
    canvas: HTMLCanvasElement,
    setSelectedModuleId: Dispatch<SetStateAction<string | undefined>>,
    setPosition: (moduleId: string, position?: { x: number; y: number }) => void
  ) {
    this.canvas = canvas;
    this.setSelectedModuleId = setSelectedModuleId;
    this.setPosition = setPosition;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.setOnClickEvent();
  }

  drawFactory(modules: Map<string, Module>, selectedModuleId?: string) {
    this.drawnModules = modules;
    this.context.clearRect(0, 0, 512, 512);
    // 接続の描画
    Array.from(modules.entries()).forEach(([_, module]) => {
      if (!module.position) {
        return;
      }
      const inputPosition = module.position;
      module.inputs.forEach((input) => {
        if (!input) {
          return;
        }
        const outputModule = modules.get(input.moduleId);
        if (!outputModule) {
          return;
        }
        const outputPosition = outputModule.position;
        if (!outputPosition) {
          return;
        }
        this.drawArrow(
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
      this.drawModule(
        module.position.x,
        module.position.y,
        moduleId === selectedModuleId
      );
    });
  }

  drawModule(x: number, y: number, isSelected?: boolean) {
    this.context.beginPath();
    this.context.arc(x, y, MODULE_SIZE / 2, 0, 2 * Math.PI, false);
    this.context.strokeStyle = isSelected ? "red" : "black";
    this.context.lineWidth = 1;
    this.context.fillStyle = "white";
    this.context.fill();
    this.context.stroke();
  }

  drawArrow(startX: number, startY: number, endX: number, endY: number) {
    this.context.strokeStyle = "black";
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.stroke();
  }

  setOnClickEvent() {
    this.canvas.addEventListener("mousedown", (e) => {
      if (this.isDragging) return;
      this.isDragging = true;
      this.isMoved = false;
      this.clickedModuleId = undefined;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const [moduleId, module] of Array.from(
        this.drawnModules.entries()
      )) {
        if (!module.position) continue;
        if (
          Math.sqrt(
            (module.position.x - x) ** 2 + (module.position.y - y) ** 2
          ) <=
          MODULE_SIZE / 2
        ) {
          this.clickedModuleId = moduleId;
          break;
        }
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      if (!this.clickedModuleId) return;

      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        return;
      }

      if (!this.isMoved) {
        this.setSelectedModuleId(this.clickedModuleId);
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.isMoved = true;

      if (!this.clickedModuleId) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        return;
      }
      this.setPosition(this.clickedModuleId, { x, y });
    });
  }
}
