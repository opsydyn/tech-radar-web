type Pure<T> = T;
type Effect<T> = () => Pure<T>;

type GeneratorEffect<T> = {
	next(): { done?: boolean; value: T };
};

type GeneratorFn<T> = Effect<GeneratorEffect<T>>;

type LazyList<T> = Pure<{
	readonly value: T;
	readonly next: Effect<LazyList<T> | null>;
}>;

const toGeneratorEffect = <T,>(gen: Generator<T>): GeneratorEffect<T> => ({
	next: () => gen.next(),
});

const createLazyList = <T,>(gen: GeneratorEffect<T>): LazyList<T> | null => {
	const result = gen.next();
	if (result.done) return null;

	return {
		value: result.value,
		next: () => createLazyList(gen),
	};
};

export const GenWrapper = <T,>(genFn: GeneratorFn<T>) => {
	const getLazyList: Effect<LazyList<T> | null> = () => createLazyList(genFn());

	const isDone = (count: number, list: LazyList<T> | null): boolean =>
		count === 0 || !list;

	const takeRec = (
		list: LazyList<T> | null,
		count: number,
		acc: Array<T> = [],
	): Array<T> =>
		isDone(count, list)
			? acc
			: takeRec(list!.next(), count - 1, [...acc, list!.value]);

	return {
		next: (): Pure<T | undefined> => {
			const list = getLazyList();
			return list?.value;
		},
		take: (n: number): Pure<ReadonlyArray<T>> => {
			return Object.freeze(takeRec(getLazyList(), n));
		},
	};
};
