import { Effect, Schema } from "effect";
import { KeyValueStore } from "effect/unstable/persistence";
import { Atom, AtomRegistry } from "effect/unstable/reactivity";

const sidebarPreferenceKey = "tech-radar.sidebar-open";

const sidebarStorageLayer =
	typeof localStorage === "undefined"
		? KeyValueStore.layerMemory
		: KeyValueStore.layerStorage(() => localStorage);

const sidebarRuntime = Atom.runtime(sidebarStorageLayer);
const sidebarRegistry = AtomRegistry.make();

const provideSidebarRegistry = <A, E>(
	effect: Effect.Effect<A, E, AtomRegistry.AtomRegistry>,
) => Effect.provideService(effect, AtomRegistry.AtomRegistry, sidebarRegistry);

const runSidebarEffect = <A, E>(
	effect: Effect.Effect<A, E, AtomRegistry.AtomRegistry>,
): Promise<A> => Effect.runPromise(provideSidebarRegistry(effect));

const radarSidebarOpenAtom = Atom.kvs({
	runtime: sidebarRuntime,
	key: sidebarPreferenceKey,
	schema: Schema.Boolean,
	defaultValue: () => true,
});

export const subscribeRadarSidebarOpenPreference = (
	listener: (isOpen: boolean) => void,
): (() => void) =>
	sidebarRegistry.subscribe(radarSidebarOpenAtom, listener, {
		immediate: true,
	});

export const setRadarSidebarOpenPreference = (isOpen: boolean): Promise<void> =>
	runSidebarEffect(Atom.set(radarSidebarOpenAtom, isOpen));
