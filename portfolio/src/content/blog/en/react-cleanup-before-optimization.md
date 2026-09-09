---
title: What I remove before optimizing a React layout
slug: react-cleanup-before-optimization
excerpt: Before discussing performance, I reduce structural noise: duplicated state, unnecessary effects, and wrappers that only add complexity.
publishedAt: 2026-03-12
category: Performance
tags: [React, Performance, Refactor]
featured: false
hasDemo: false
---
# Optimization almost always starts with removal

In a portfolio and in a real product, the first impulse is often to add memoization, virtualization, or another library. Before that, I look for duplicated state, effects without a clear responsibility, and structure without a purpose.

## Method

My method begins with a simple question: which interaction is slow, and what evidence demonstrates it? Without that answer, an optimization may only move complexity somewhere else.

Then I read the complete flow. I identify the data source, the events that change intent, the effects that synchronize with the outside world, and the elements that truly need to exist in the DOM.

The practical order is:

1. remove derived state
2. move actions into events
3. separate external synchronization from local calculation
4. reduce wrappers with no role
5. measure again

This order does not promise a universal gain. It reduces hypotheses before introducing techniques that also have a cost.

## Derived state

If a value can be calculated during render from props or existing state, creating another state value opens a second source of truth.

Before:

```tsx
const [filtered, setFiltered] = useState<Item[]>([]);

useEffect(() => {
  setFiltered(items.filter((item) => item.active));
}, [items]);
```

After:

```tsx
const filtered = items.filter((item) => item.active);
```

The second example makes the dependency direct. It does not need to wait for an effect to reflect `items`. It also eliminates a state update used only to repeat a calculation.

The recommendation does not mean every calculation should be repeated without thought. For an expensive transformation, `useMemo` may be considered after measuring. First, the cost and the correctness of the dependency must be demonstrated.

## Events and effects

Effects are appropriate for synchronizing a component with external systems. A click, however, already provides information about user intent. Hiding that action in an effect makes the flow indirect.

Before:

```tsx
useEffect(() => {
  if (shouldNavigate) {
    navigate('/checkout');
  }
}, [shouldNavigate, navigate]);
```

After:

```tsx
function handleConfirm() {
  startTransition(() => {
    navigate('/checkout');
  });
}
```

The main point is not to add `startTransition` to every navigation. The choice depends on the operation and the React version. The safe lesson is to keep the cause of the change beside the event that produced it.

An effect that reacts to `shouldNavigate` may run twice in development, depending on the environment checks. The action must be idempotent or, better, remain in the event when it is a direct consequence of that event.

## Effect contracts

When an effect is necessary, I check four aspects: dependencies, cleanup, concurrency, and the external boundary. The effect should declare what it reads and interrupt work that can no longer complete.

A window listener, for example, must be removed. A request may need cancellation or a way to ignore an obsolete response. The concrete solution depends on the API in use.

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/items?q=${query}`, { signal: controller.signal })
    .then((response) => response.json())
    .then(setItems)
    .catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setError(error);
    });

  return () => controller.abort();
}, [query]);
```

The example shows a cancellation contract for the Fetch API. It does not replace HTTP response handling or validation of received data.

## DOM

A wrapper without a semantic, layout, or accessibility role adds reading and can make selectors, styles, and tests harder. This does not mean DOM depth is automatically a performance problem.

Before:

```tsx
<div className="grid">
  <div className="grid-item">
    <div className="card-wrapper">
      <Card />
    </div>
  </div>
</div>
```

After:

```tsx
<div className="grid">
  <Card className="grid-item" />
</div>
```

Before removing one, I check whether the element provides semantics, `aria` context, positioning, or a real visual boundary. The criterion is function, not an arbitrary node count.

## Asynchronous contracts

The interface also becomes simpler when transport does not return ambiguous formats. A discriminated result separates success from failure without relying on null values with many meanings.

```ts
type ResponseEntity<T, E> =
  | { success: true; data: T }
  | { success: false; data: null; error: E };
```

The component renders known states. This reduces scattered conditionals, but it does not turn a network failure into a domain failure. That classification remains the responsibility of the layer that understands the transport.

## Measurement

After cleanup, I choose one or two critical interactions. I record the initial situation, repeat the scenario under similar conditions, and compare the result.

```ts
performance.mark('projects-render-start');
// render da seção
performance.mark('projects-render-end');
performance.measure('projects-render', 'projects-render-start', 'projects-render-end');
```

This snippet illustrates the User Timing API. It does not measure perceived performance by itself. For a serious evaluation, I combine React profiles, browser tools, and a clear definition of what is being compared.

I also separate correctness from speed. A change that saves milliseconds but loses focus, announces state incorrectly, or discards a valid response is not an acceptable improvement.

## Criteria

I consider the refactor appropriate when the source of truth is singular and the event flow is explicit.

I also check that effects synchronize only with the outside world and that the DOM retains semantics.

I consider optimization justified when there is a measurable hypothesis, a suitable tool, and a regression covered by a test or reproducible check.

If a change merely adds `memo`, `useMemo`, or an abstraction without evidence, I postpone it. Cognitive cost is also part of the system.

## What not to remove

Cleanup does not mean deleting every layer or turning every function into a short expression. An explicit name can protect an important rule. A component may exist to provide focus, semantics, or a testing boundary.

I also do not remove an abstraction merely because it looks small today. The criterion is whether it concentrates a repeated decision and whether its name remains easier to understand than the copies it prevents.

In particular, I do not sacrifice error handling, cancellation, or accessibility to reduce line count. Less code is useful when it removes accidental duplication, not when it removes information needed to operate the system.

This limit avoids a superficial reading of simplicity. A small function can remain difficult to operate if it omits states, while a larger function can be clear when it records an external sequence that needs explicit handling.

## Limitations

Removing derived state does not guarantee a noticeable reduction in interaction time. Removing wrappers may not change layout cost. The application may have bottlenecks in the network, images, server, or third parties.

For that reason, cleanup prepares an investigation; it is not a success metric. The effect can be judged only after repeating the scenario and observing the relevant interaction.

Using `performance.measure` requires interpreting the scenario. An isolated measurement is affected by the device, cache, and environment. The conclusions of this method are hypotheses until repeated.

## Conclusion

Before optimizing a React layout, I clean the flow so that the next problem is observable. Derived calculations remain in render when that is sufficient. Events carry intent. Effects are reserved for synchronization.

This approach does not reject optimization. It creates criteria for an optimization to be small, explainable, and reversible. Instead of accumulating techniques, the code shows why each one exists.

The expected result is a more reliable starting point for the next measurement.

## References

- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
- [React: Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)
