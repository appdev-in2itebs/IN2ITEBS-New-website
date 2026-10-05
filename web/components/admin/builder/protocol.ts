import type { Block, BlockType } from "@/lib/builder/blocks";

/**
 * Messages between the builder (the admin page) and its canvas (the preview in an iframe). Both are
 * on the same origin and both check it; the canvas only ever draws what the builder sends it.
 */
export type ToCanvas =
  | { kind: "render"; blocks: Block[]; selected: string | null }
  | { kind: "reveal"; id: string }
  /** Sent by the builder when it starts, in case the canvas loaded first and its "ready" was missed. */
  | { kind: "hello" };

export type FromCanvas =
  | { kind: "ready" }
  | { kind: "select"; id: string | null }
  | { kind: "move"; id: string; index: number }
  | { kind: "insert"; type: BlockType; index: number }
  | { kind: "action"; id: string; action: "up" | "down" | "duplicate" | "delete" }
  | { kind: "addAt"; index: number };

/** Drag data types: an existing block being moved, or a new block from the library. */
export const DRAG_BLOCK = "application/x-builder-block";
export const DRAG_NEW = "application/x-builder-new";
