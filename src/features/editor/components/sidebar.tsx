"use client";

import {
  ImageIcon,
  LayoutTemplate,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from "lucide-react";
import { ActiveTool } from "../types";
import { SidebarItem } from "./sidebar-item";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  return (
    <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
      <ul className="flex flex-col">
        <SidebarItem
          label="Design"
          icon={LayoutTemplate}
          isActive={activeTool === "templates"}
          onClick={() => {
            onChangeActiveTool("templates");
          }}
        />
        <SidebarItem
          label="Image"
          icon={ImageIcon}
          isActive={activeTool === "images"}
          onClick={() => {
            onChangeActiveTool("images");
          }}
        />
        <SidebarItem
          label="Text"
          icon={Type}
          isActive={activeTool === "text"}
          onClick={() => {
            onChangeActiveTool("text");
          }}
        />
        <SidebarItem
          label="Shapes"
          icon={Shapes}
          isActive={activeTool === "shapes"}
          onClick={() => {
            onChangeActiveTool("shapes");
          }}
        />
        <SidebarItem
          label="AI"
          icon={Sparkles}
          isActive={activeTool === "ai"}
          onClick={() => {
            onChangeActiveTool("ai");
          }}
        />
        <SidebarItem
          label="Settings"
          icon={Settings}
          isActive={activeTool === "settings"}
          onClick={() => {
            onChangeActiveTool("settings");
          }}
        />
      </ul>
    </aside>
  );
};
