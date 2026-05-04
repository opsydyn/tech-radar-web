// XState machine for Wardley mapping interactions
// Following functional programming patterns from CLAUDE.md

import { assign, createMachine } from "xstate";
import type {
	ComponentId,
	InteractionState,
	WardleyComponent,
	WardleyLayout,
	WardleyMap,
} from "./wardley.types";

// 🎯 Machine context type
type WardleyContext = {
	readonly map: WardleyMap | null;
	readonly layout: WardleyLayout | null;
	readonly interactionState: InteractionState;
	readonly selectedComponent: ComponentId | null;
	readonly hoveredComponent: ComponentId | null;
	readonly dragStart: { x: number; y: number } | null;
	readonly showDependencies: boolean;
	readonly showEvolutionStages: boolean;
	readonly filterByVisibility: string | null;
};

// 🎯 Machine events (discriminated union for type safety)
type WardleyEvent =
	| { type: "LOAD_MAP"; map: WardleyMap }
	| { type: "UPDATE_LAYOUT"; layout: WardleyLayout }
	| { type: "HOVER_COMPONENT"; componentId: ComponentId; x: number; y: number }
	| { type: "LEAVE_COMPONENT" }
	| { type: "SELECT_COMPONENT"; componentId: ComponentId }
	| { type: "CLEAR_SELECTION" }
	| { type: "START_DRAG"; componentId: ComponentId; x: number; y: number }
	| { type: "DRAG_COMPONENT"; x: number; y: number }
	| { type: "END_DRAG" }
	| { type: "TOGGLE_DEPENDENCIES" }
	| { type: "TOGGLE_EVOLUTION_STAGES" }
	| { type: "FILTER_VISIBILITY"; level: string | null }
	| { type: "RESET_FILTERS" };

// 🎰 XState machine definition
export const wardleyMachine = createMachine({
	id: "wardleyMap",
	initial: "idle",
	context: {
		map: null,
		layout: null,
		interactionState: { type: "idle" },
		selectedComponent: null,
		hoveredComponent: null,
		dragStart: null,
		showDependencies: true,
		showEvolutionStages: true,
		filterByVisibility: null,
	},
	states: {
		idle: {
			on: {
				LOAD_MAP: {
					target: "loaded",
					actions: assign({
						map: ({ event }) => event.map,
						interactionState: () => ({ type: "idle" }) as InteractionState,
						selectedComponent: () => null,
						hoveredComponent: () => null,
						dragStart: () => null,
					}),
				},
			},
		},
		loaded: {
			on: {
				UPDATE_LAYOUT: {
					actions: assign({
						layout: ({ event }) => event.layout,
					}),
				},
				HOVER_COMPONENT: {
					target: "hovering",
					actions: assign({
						hoveredComponent: ({ event }) => event.componentId,
						interactionState: ({ event }) =>
							({
								type: "hovering",
								componentId: event.componentId,
							}) as InteractionState,
					}),
				},
				SELECT_COMPONENT: {
					target: "selected",
					actions: assign({
						selectedComponent: ({ event }) => event.componentId,
						interactionState: ({ event }) =>
							({
								type: "selected",
								componentId: event.componentId,
							}) as InteractionState,
					}),
				},
				START_DRAG: {
					target: "dragging",
					actions: assign({
						dragStart: ({ event }) => ({ x: event.x, y: event.y }),
						interactionState: ({ event }) =>
							({
								type: "dragging",
								componentId: event.componentId,
								startX: event.x,
								startY: event.y,
							}) as InteractionState,
					}),
				},
				TOGGLE_DEPENDENCIES: {
					actions: assign({
						showDependencies: ({ context }) => !context.showDependencies,
					}),
				},
				TOGGLE_EVOLUTION_STAGES: {
					actions: assign({
						showEvolutionStages: ({ context }) => !context.showEvolutionStages,
					}),
				},
				FILTER_VISIBILITY: {
					actions: assign({
						filterByVisibility: ({ event }) => event.level,
					}),
				},
				RESET_FILTERS: {
					actions: assign({
						filterByVisibility: () => null,
						showDependencies: () => true,
						showEvolutionStages: () => true,
					}),
				},
			},
		},
		hovering: {
			on: {
				LEAVE_COMPONENT: {
					target: "loaded",
					actions: assign({
						hoveredComponent: () => null,
						interactionState: ({ context }) =>
							context.interactionState.type === "dragging"
								? context.interactionState
								: ({ type: "idle" } as InteractionState),
					}),
				},
				SELECT_COMPONENT: {
					target: "selected",
					actions: assign({
						selectedComponent: ({ event }) => event.componentId,
						interactionState: ({ event }) =>
							({
								type: "selected",
								componentId: event.componentId,
							}) as InteractionState,
					}),
				},
				START_DRAG: {
					target: "dragging",
					actions: assign({
						dragStart: ({ event }) => ({ x: event.x, y: event.y }),
						interactionState: ({ event }) =>
							({
								type: "dragging",
								componentId: event.componentId,
								startX: event.x,
								startY: event.y,
							}) as InteractionState,
					}),
				},
				HOVER_COMPONENT: {
					actions: assign({
						hoveredComponent: ({ event }) => event.componentId,
						interactionState: ({ event }) =>
							({
								type: "hovering",
								componentId: event.componentId,
							}) as InteractionState,
					}),
				},
			},
		},
		selected: {
			on: {
				CLEAR_SELECTION: {
					target: "loaded",
					actions: assign({
						selectedComponent: () => null,
						interactionState: () => ({ type: "idle" }) as InteractionState,
					}),
				},
				SELECT_COMPONENT: {
					actions: assign({
						selectedComponent: ({ event }) => event.componentId,
						interactionState: ({ event }) =>
							({
								type: "selected",
								componentId: event.componentId,
							}) as InteractionState,
					}),
				},
				HOVER_COMPONENT: {
					target: "hovering",
					actions: assign({
						hoveredComponent: ({ event }) => event.componentId,
						interactionState: ({ event }) =>
							({
								type: "hovering",
								componentId: event.componentId,
							}) as InteractionState,
					}),
				},
				START_DRAG: {
					target: "dragging",
					actions: assign({
						dragStart: ({ event }) => ({ x: event.x, y: event.y }),
						interactionState: ({ event }) =>
							({
								type: "dragging",
								componentId: event.componentId,
								startX: event.x,
								startY: event.y,
							}) as InteractionState,
					}),
				},
			},
		},
		dragging: {
			on: {
				DRAG_COMPONENT: {
					// No context updates needed for drag movement
				},
				END_DRAG: {
					target: "loaded",
					actions: assign({
						dragStart: () => null,
						interactionState: ({ context }) =>
							context.selectedComponent
								? ({
										type: "selected",
										componentId: context.selectedComponent,
									} as InteractionState)
								: ({ type: "idle" } as InteractionState),
					}),
				},
			},
		},
	},
});

// 🎯 Event creators for type safety and consistency
export const wardleyEvents = {
	loadMap: (map: WardleyMap) => ({ type: "LOAD_MAP", map }) as const,
	updateLayout: (layout: WardleyLayout) =>
		({ type: "UPDATE_LAYOUT", layout }) as const,
	hoverComponent: (componentId: ComponentId, x: number, y: number) =>
		({
			type: "HOVER_COMPONENT",
			componentId,
			x,
			y,
		}) as const,
	leaveComponent: () => ({ type: "LEAVE_COMPONENT" }) as const,
	selectComponent: (componentId: ComponentId) =>
		({ type: "SELECT_COMPONENT", componentId }) as const,
	clearSelection: () => ({ type: "CLEAR_SELECTION" }) as const,
	startDrag: (componentId: ComponentId, x: number, y: number) =>
		({
			type: "START_DRAG",
			componentId,
			x,
			y,
		}) as const,
	dragComponent: (x: number, y: number) =>
		({ type: "DRAG_COMPONENT", x, y }) as const,
	endDrag: () => ({ type: "END_DRAG" }) as const,
	toggleDependencies: () => ({ type: "TOGGLE_DEPENDENCIES" }) as const,
	toggleEvolutionStages: () => ({ type: "TOGGLE_EVOLUTION_STAGES" }) as const,
	filterVisibility: (level: string | null) =>
		({ type: "FILTER_VISIBILITY", level }) as const,
	resetFilters: () => ({ type: "RESET_FILTERS" }) as const,
};

// 🎯 State type for selectors
type WardleyState = { context: WardleyContext };

// 🎯 Selectors for extracting state (pure functions)
export const selectMap = (state: WardleyState): WardleyMap | null =>
	state.context.map;
export const selectLayout = (state: WardleyState): WardleyLayout | null =>
	state.context.layout;
export const selectInteractionState = (state: WardleyState): InteractionState =>
	state.context.interactionState;
export const selectSelectedComponent = (
	state: WardleyState,
): ComponentId | null => state.context.selectedComponent;
export const selectHoveredComponent = (
	state: WardleyState,
): ComponentId | null => state.context.hoveredComponent;
export const selectDragStart = (
	state: WardleyState,
): { x: number; y: number } | null => state.context.dragStart;
export const selectShowDependencies = (state: WardleyState): boolean =>
	state.context.showDependencies;
export const selectShowEvolutionStages = (state: WardleyState): boolean =>
	state.context.showEvolutionStages;
export const selectFilterByVisibility = (state: WardleyState): string | null =>
	state.context.filterByVisibility;

// 🎯 Computed selectors for derived state
export const selectVisibleComponents = (
	state: WardleyState,
): WardleyComponent[] => {
	const layout = selectLayout(state);
	const filter = selectFilterByVisibility(state);

	if (!layout || !filter) {
		return (
			layout?.components.map((c) => ({
				id: c.id,
				name: c.name,
				evolution: c.evolution,
				value: c.value,
				stage: c.stage,
				visibility: c.visibility,
				type: c.type,
				movement: c.movement,
				size: c.size,
				dependencies: c.dependencies,
			})) || []
		);
	}

	return layout.components
		.filter((c) => c.visibility === filter)
		.map((c) => ({
			id: c.id,
			name: c.name,
			evolution: c.evolution,
			value: c.value,
			stage: c.stage,
			visibility: c.visibility,
			type: c.type,
			movement: c.movement,
			size: c.size,
			dependencies: c.dependencies,
		}));
};

export const selectIsDragging = (state: WardleyState): boolean => {
	const interactionState = selectInteractionState(state);
	return interactionState.type === "dragging";
};

export const selectIsComponentSelected = (
	state: WardleyState,
	componentId: ComponentId,
): boolean => {
	const selected = selectSelectedComponent(state);
	return selected === componentId;
};

export const selectIsComponentHovered = (
	state: WardleyState,
	componentId: ComponentId,
): boolean => {
	const hovered = selectHoveredComponent(state);
	return hovered === componentId;
};

// 🎪 Export machine configuration for external usage
export const WARDLEY_MACHINE_CONFIG = {
	DEFAULT_SHOW_DEPENDENCIES: true,
	DEFAULT_SHOW_EVOLUTION_STAGES: true,
	DRAG_THRESHOLD: 5, // pixels
	HOVER_DELAY: 100, // milliseconds
} as const;
