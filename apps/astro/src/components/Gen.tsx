import { type ReactNode, createElement } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type AccessibilityProps = Partial<
  {
    id: string;
    role: string;
    tabIndex: number;
  } & Record<`aria-${string}`, string>
>;

type HeadingProps = { children: ReactNode } & AccessibilityProps;
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


const computeFontSize = (level: HeadingLevel) => `text-${7 - level}xl font-bold`;

const createHeading = (level: HeadingLevel) => {
  const Component = ({ children, ...attrs }: HeadingProps) =>
    createElement(`h${level}`, { className: computeFontSize(level), ...attrs }, children);

  Component.displayName = `H${level}`;
  return Component;
};

const toGeneratorEffect = <T,>(gen: Generator<T>): GeneratorEffect<T> => ({
  next: () => gen.next()
});

const createLazyList = <T,>(gen: GeneratorEffect<T>): LazyList<T> | null => {
  const result = gen.next();
  if (result.done) return null;

  return {
    value: result.value,
    next: () => createLazyList(gen)
  };
};


export const GenWrapper = <T,>(genFn: GeneratorFn<T>) => {
  const getLazyList: Effect<LazyList<T> | null> = () => createLazyList(genFn());

  const isDone = (count: number, list: LazyList<T> | null): boolean =>
    count === 0 || !list;

  const takeRec = (
    list: LazyList<T> | null,
    count: number,
    acc: Array<T> = []
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
    }
  };
};


const headingGen = function* (
  level: HeadingLevel = 1
): Generator<Array<string | ReturnType<typeof createHeading>>, void, unknown> {
  if (level > 6) return;
  yield [
    `H${level}`,
    createHeading(level)
  ];
  yield* headingGen((level + 1) as HeadingLevel);
};


const Headings = Object.fromEntries(
  GenWrapper(() => toGeneratorEffect(headingGen())).take(6)
) as Record<`H${HeadingLevel}`, ReturnType<typeof createHeading>>;

export const { H1, H2, H3, H4, H5, H6 } = Headings;

export const Heading = ({ level, children, ...attrs }: { level: HeadingLevel } & HeadingProps) =>
  createElement(`h${level}`, { className: computeFontSize(level), ...attrs }, children);

export const ExampleHeadings = () => (
  <div className="space-y-4">
    <H1 id="main-title" role="heading" data-testid="main-heading" aria-label="Main page heading" tabIndex={0}>
      Main Title
    </H1>

    <H2 id="section-title" aria-describedby="section-description" data-analytics="section-heading">
      Section Title
    </H2>

    <H3 id="subsection" aria-hidden="false" data-testid="subsection-heading">
      Subsection
    </H3>

    <Heading level={4} id="dynamic-heading" role="heading" aria-level={4} data-testid="dynamic-heading">
      Dynamic Heading
    </Heading>
  </div>
);
