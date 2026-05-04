// XState machine for Cynefin Framework interactions
// Following event-driven architecture patterns from CLAUDE.md

import { assign, emit, setup } from "xstate";
import type {
	CynefinDomain,
	CynefinError,
	InteractionState,
} from "./cynefin.types";

// 📋 Machine context type
type CynefinContext = {
	readonly selectedDomain: CynefinDomain | null;
	readonly hoveredDomain: CynefinDomain | null;
	readonly interactionState: InteractionState;
	readonly lastError: CynefinError | null;
};

// 🎯 Event types for machine communication
type CynefinEvents =
	| { type: "HOVER_DOMAIN"; domain: CynefinDomain }
	| { type: "LEAVE_DOMAIN" }
	| { type: "SELECT_DOMAIN"; domain: CynefinDomain }
	| { type: "CLEAR_SELECTION" }
	| { type: "TRANSITION_START"; from: CynefinDomain; to: CynefinDomain }
	| { type: "TRANSITION_COMPLETE" }
	| { type: "ERROR_OCCURRED"; error: CynefinError }
	| { type: "CLEAR_ERROR" };

// 🔄 Pure function for context updates using lookup table
const updateInteractionState = (
	context: CynefinContext,
	event: CynefinEvents,
): Partial<CynefinContext> => {
	const contextUpdaters = {
		HOVER_DOMAIN: (
			ctx: CynefinContext,
			evt: Extract<CynefinEvents, { type: "HOVER_DOMAIN" }>,
		) => ({
			hoveredDomain: evt.domain,
			interactionState: {
				type: "Hovered",
				domain: evt.domain,
			} as InteractionState,
		}),
		LEAVE_DOMAIN: (ctx: CynefinContext) => ({
			hoveredDomain: null,
			interactionState: ctx.selectedDomain
				? ({
						type: "Selected",
						domain: ctx.selectedDomain,
						approach: "",
					} as InteractionState)
				: ({ type: "Idle" } as InteractionState),
		}),
		SELECT_DOMAIN: (
			ctx: CynefinContext,
			evt: Extract<CynefinEvents, { type: "SELECT_DOMAIN" }>,
		) => ({
			selectedDomain: evt.domain,
			interactionState: {
				type: "Selected",
				domain: evt.domain,
				approach: getDomainApproach(evt.domain),
			} as InteractionState,
		}),
		CLEAR_SELECTION: (ctx: CynefinContext) => ({
			selectedDomain: null,
			interactionState: ctx.hoveredDomain
				? ({
						type: "Hovered",
						domain: ctx.hoveredDomain,
					} as InteractionState)
				: ({ type: "Idle" } as InteractionState),
		}),
		TRANSITION_START: (
			ctx: CynefinContext,
			evt: Extract<CynefinEvents, { type: "TRANSITION_START" }>,
		) => ({
			interactionState: {
				type: "Transitioning",
				from: evt.from,
				to: evt.to,
			} as InteractionState,
		}),
		TRANSITION_COMPLETE: () => ({
			interactionState: { type: "Idle" } as InteractionState,
		}),
		ERROR_OCCURRED: (
			ctx: CynefinContext,
			evt: Extract<CynefinEvents, { type: "ERROR_OCCURRED" }>,
		) => ({
			lastError: evt.error,
			interactionState: { type: "Idle" } as InteractionState,
		}),
		CLEAR_ERROR: () => ({
			lastError: null,
		}),
	} as const;

	const updater = contextUpdaters[event.type];
	return updater ? updater(context, event as never) : {};
};

// Helper function for domain approach lookup
const getDomainApproach = (domain: CynefinDomain): string => {
	const approaches = {
		Clear: "Sense → Categorize → Respond",
		Complicated: "Sense → Analyze → Respond",
		Complex: "Probe → Sense → Respond",
		Chaotic: "Act → Sense → Respond",
		Aporetic: "Pause, reframe, explore",
	};
	return approaches[domain];
};

// 🎰 Main Cynefin interaction machine
export const cynefinMachine = setup({
	types: {
		context: {} as CynefinContext,
		events: {} as CynefinEvents,
	},
	actions: {
		updateContext: assign(({ context, event }) =>
			updateInteractionState(context, event),
		),
		emitDomainHovered: emit(({ event }) => {
			if (event.type === "HOVER_DOMAIN") {
				return {
					type: "cynefin.domainHovered",
					domain: event.domain,
				};
			}
			return { type: "cynefin.noOp" };
		}),
		emitDomainSelected: emit(({ event }) => {
			if (event.type === "SELECT_DOMAIN") {
				return {
					type: "cynefin.domainSelected",
					domain: event.domain,
					approach: getDomainApproach(event.domain),
				};
			}
			return { type: "cynefin.noOp" };
		}),
		emitTransitionStarted: emit(({ event }) => {
			if (event.type === "TRANSITION_START") {
				return {
					type: "cynefin.transitionStarted",
					from: event.from,
					to: event.to,
				};
			}
			return { type: "cynefin.noOp" };
		}),
		emitErrorOccurred: emit(({ event }) => {
			if (event.type === "ERROR_OCCURRED") {
				return {
					type: "cynefin.errorOccurred",
					error: event.error,
				};
			}
			return { type: "cynefin.noOp" };
		}),
	},
	guards: {
		isDomainValid: ({ event }) => {
			if (event.type === "HOVER_DOMAIN" || event.type === "SELECT_DOMAIN") {
				const validDomains: CynefinDomain[] = [
					"Clear",
					"Complicated",
					"Complex",
					"Chaotic",
					"Aporetic",
				];
				return validDomains.includes(event.domain);
			}
			return true;
		},
		hasSelectedDomain: ({ context }) => context.selectedDomain !== null,
		hasError: ({ context }) => context.lastError !== null,
	},
}).createMachine({
	id: "cynefinInteraction",
	initial: "idle",
	context: {
		selectedDomain: null,
		hoveredDomain: null,
		interactionState: { type: "Idle" },
		lastError: null,
	},
	states: {
		idle: {
			on: {
				HOVER_DOMAIN: {
					guard: "isDomainValid",
					target: "hovering",
					actions: ["updateContext", "emitDomainHovered"],
				},
				SELECT_DOMAIN: {
					guard: "isDomainValid",
					target: "selected",
					actions: ["updateContext", "emitDomainSelected"],
				},
				ERROR_OCCURRED: {
					target: "error",
					actions: ["updateContext", "emitErrorOccurred"],
				},
			},
		},
		hovering: {
			on: {
				LEAVE_DOMAIN: {
					target: "idle",
					actions: ["updateContext"],
				},
				HOVER_DOMAIN: {
					guard: "isDomainValid",
					target: "hovering",
					actions: ["updateContext", "emitDomainHovered"],
				},
				SELECT_DOMAIN: {
					guard: "isDomainValid",
					target: "selected",
					actions: ["updateContext", "emitDomainSelected"],
				},
				ERROR_OCCURRED: {
					target: "error",
					actions: ["updateContext", "emitErrorOccurred"],
				},
			},
		},
		selected: {
			on: {
				HOVER_DOMAIN: {
					guard: "isDomainValid",
					target: "hovering",
					actions: ["updateContext", "emitDomainHovered"],
				},
				SELECT_DOMAIN: {
					guard: "isDomainValid",
					target: "selected",
					actions: ["updateContext", "emitDomainSelected"],
				},
				CLEAR_SELECTION: {
					target: "idle",
					actions: ["updateContext"],
				},
				TRANSITION_START: {
					target: "transitioning",
					actions: ["updateContext", "emitTransitionStarted"],
				},
				ERROR_OCCURRED: {
					target: "error",
					actions: ["updateContext", "emitErrorOccurred"],
				},
			},
		},
		transitioning: {
			on: {
				TRANSITION_COMPLETE: {
					target: "idle",
					actions: ["updateContext"],
				},
				ERROR_OCCURRED: {
					target: "error",
					actions: ["updateContext", "emitErrorOccurred"],
				},
			},
		},
		error: {
			on: {
				CLEAR_ERROR: {
					target: "idle",
					actions: ["updateContext"],
				},
				HOVER_DOMAIN: {
					guard: "isDomainValid",
					target: "hovering",
					actions: ["updateContext", "emitDomainHovered"],
				},
			},
		},
	},
});

// 🔧 Machine type exports for component usage
export type CynefinMachine = typeof cynefinMachine;
export type CynefinSnapshot = { context: CynefinContext };

// 🎯 Selector functions for component usage
export const selectSelectedDomain = (
	state: CynefinSnapshot,
): CynefinDomain | null => state.context.selectedDomain;

export const selectHoveredDomain = (
	state: CynefinSnapshot,
): CynefinDomain | null => state.context.hoveredDomain;

export const selectInteractionState = (
	state: CynefinSnapshot,
): InteractionState => state.context.interactionState;

export const selectLastError = (state: CynefinSnapshot): CynefinError | null =>
	state.context.lastError;

export const selectIsIdle = (state: CynefinSnapshot): boolean =>
	state.context.interactionState.type === "Idle";

export const selectIsHovering = (state: CynefinSnapshot): boolean =>
	state.context.interactionState.type === "Hovered";

export const selectIsSelected = (state: CynefinSnapshot): boolean =>
	state.context.interactionState.type === "Selected";

export const selectIsTransitioning = (state: CynefinSnapshot): boolean =>
	state.context.interactionState.type === "Transitioning";

// 🚀 Event creators for component usage
export const cynefinEvents = {
	hoverDomain: (domain: CynefinDomain) =>
		({ type: "HOVER_DOMAIN", domain }) as const,
	leaveDomain: () => ({ type: "LEAVE_DOMAIN" }) as const,
	selectDomain: (domain: CynefinDomain) =>
		({ type: "SELECT_DOMAIN", domain }) as const,
	clearSelection: () => ({ type: "CLEAR_SELECTION" }) as const,
	startTransition: (from: CynefinDomain, to: CynefinDomain) =>
		({ type: "TRANSITION_START", from, to }) as const,
	completeTransition: () => ({ type: "TRANSITION_COMPLETE" }) as const,
	errorOccurred: (error: CynefinError) =>
		({ type: "ERROR_OCCURRED", error }) as const,
	clearError: () => ({ type: "CLEAR_ERROR" }) as const,
};

// 🔧 Additional type exports for component usage
export type CynefinSend = (event: CynefinEvents) => void;
