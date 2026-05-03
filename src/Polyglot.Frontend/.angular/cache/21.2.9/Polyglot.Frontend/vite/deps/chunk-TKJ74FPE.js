import {
  isPlatformServer
} from "./chunk-CPQOJDVT.js";
import {
  toObservable,
  toSignal
} from "./chunk-WUHKT4RW.js";
import {
  ElementRef,
  PLATFORM_ID,
  afterNextRender
} from "./chunk-BATDMF3R.js";
import {
  DestroyRef,
  InjectionToken,
  Injector,
  Observable,
  computed,
  debounceTime,
  distinctUntilChanged,
  filter,
  forwardRef,
  fromEvent,
  inject,
  map,
  merge,
  pipe,
  runInInjectionContext,
  signal,
  takeUntil,
  untracked
} from "./chunk-KWSEEMQO.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-core.mjs
function computedPrevious(computation) {
  let current = null;
  let previous = untracked(() => computation());
  return computed(() => {
    current = computation();
    const result = previous;
    previous = current;
    return result;
  });
}
function brnZoneFull(zone) {
  return (source) => new Observable((subscriber) => source.subscribe({
    next: (value) => zone.run(() => subscriber.next(value)),
    error: (error) => zone.run(() => subscriber.error(error)),
    complete: () => zone.run(() => subscriber.complete())
  }));
}
function brnZoneFree(zone) {
  return (source) => new Observable((subscriber) => zone.runOutsideAngular(() => source.subscribe(subscriber)));
}
function brnZoneOptimized(zone) {
  return pipe(brnZoneFree(zone), brnZoneFull(zone));
}
function movedOut({ currentTarget, relatedTarget }) {
  return !isElement(relatedTarget) || !isElement(currentTarget) || !currentTarget.contains(relatedTarget);
}
function isElement(node) {
  return !!node && "nodeType" in node && node.nodeType === Node.ELEMENT_NODE;
}
var createHoverObservable = (nativeElement, zone, destroyed$) => {
  return merge(
    fromEvent(nativeElement, "mouseenter").pipe(map(() => ({ hover: true }))),
    fromEvent(nativeElement, "mouseleave").pipe(map((e) => ({ hover: false, relatedTarget: e.relatedTarget }))),
    // Hello, Safari
    fromEvent(nativeElement, "mouseout").pipe(filter(movedOut), map((e) => ({ hover: false, relatedTarget: e.relatedTarget })))
  ).pipe(distinctUntilChanged(), brnZoneOptimized(zone), takeUntil(destroyed$));
};
function createInjectionToken(description) {
  const token = new InjectionToken(description);
  const provideFn = (value) => {
    return { provide: token, useValue: value };
  };
  const provideExistingFn = (value) => {
    return { provide: token, useExisting: forwardRef(value) };
  };
  const injectFn = (options = {}) => {
    return inject(token, options);
  };
  return [injectFn, provideFn, provideExistingFn, token];
}
var [injectCustomClassSettable, provideCustomClassSettable, provideCustomClassSettableExisting, SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN] = createInjectionToken("@spartan-ng SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN");
function debouncedSignal(source, delay) {
  const source$ = toObservable(source);
  const debounced$ = source$.pipe(debounceTime(delay), distinctUntilChanged());
  return toSignal(debounced$, { initialValue: source() });
}
var brnDevMode = ngDevMode;
var [injectExposedSideProvider, provideExposedSideProvider, provideExposedSideProviderExisting, EXPOSES_SIDE_TOKEN] = createInjectionToken("@spartan-ng EXPOSES_SIDE_TOKEN");
var [injectExposesStateProvider, provideExposesStateProvider, provideExposesStateProviderExisting, EXPOSES_STATE_TOKEN] = createInjectionToken("@spartan-ng EXPOSES_STATE_TOKEN");
function injectElementSize(options = {}) {
  return runInInjectionContext(options.injector ?? inject(Injector), () => {
    const elementRef = options.elementRef ?? inject(ElementRef);
    const platformId = inject(PLATFORM_ID);
    const destroyRef = inject(DestroyRef);
    const element = elementRef.nativeElement;
    const size = signal(void 0, ...ngDevMode ? [{ debugName: "size" }] : []);
    if (isPlatformServer(platformId)) {
      return size;
    }
    afterNextRender({
      read: () => {
        const rect = element.getBoundingClientRect();
        size.set({
          width: rect.width || element.offsetWidth,
          height: rect.height || element.offsetHeight
        });
        observerMap.set(element, { element, size });
        getSharedObserver().observe(element, { box: "border-box" });
        destroyRef.onDestroy(() => {
          getSharedObserver().unobserve(element);
          observerMap.delete(element);
          if (observerMap.size === 0 && sharedObserver) {
            sharedObserver.disconnect();
            sharedObserver = void 0;
          }
        });
      }
    });
    return size.asReadonly();
  });
}
var observerMap = /* @__PURE__ */ new Map();
var sharedObserver;
function getSharedObserver() {
  if (!sharedObserver) {
    sharedObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target;
        const entryData = observerMap.get(el);
        if (!entryData)
          continue;
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSize = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
          width = borderSize.inlineSize;
          height = borderSize.blockSize;
        } else {
          width = el.offsetWidth;
          height = el.offsetHeight;
        }
        entryData.size.set({ width, height });
      }
    });
  }
  return sharedObserver;
}
var measureDimensions = (elementToMeasure, measurementDisplay) => {
  const previousHeight = elementToMeasure.style.height;
  const previousDisplay = elementToMeasure.style.display;
  const previousHidden = elementToMeasure.hidden;
  elementToMeasure.hidden = false;
  elementToMeasure.style.height = "auto";
  elementToMeasure.style.display = !previousDisplay || previousDisplay === "none" ? measurementDisplay : previousDisplay;
  const { width, height } = elementToMeasure.getBoundingClientRect();
  elementToMeasure.hidden = previousHidden;
  elementToMeasure.style.display = previousDisplay;
  elementToMeasure.style.height = previousHeight;
  return { width, height };
};
var createMenuPosition = (align, side) => {
  const verticalAlign = align === "start" ? "top" : align === "end" ? "bottom" : "center";
  const createPositions = (originX, originY, overlayX, overlayY) => [
    { originX, originY, overlayX, overlayY },
    { originX: overlayX, originY: overlayY, overlayX: originX, overlayY: originY }
  ];
  switch (side) {
    case "top":
      return createPositions(align, "top", align, "bottom");
    case "bottom":
      return createPositions(align, "bottom", align, "top");
    case "left":
      return createPositions("start", verticalAlign, "end", verticalAlign);
    case "right":
      return createPositions("end", verticalAlign, "start", verticalAlign);
  }
};
function stringifyAsLabel(item, itemToStringLabel) {
  if (itemToStringLabel && item != null) {
    return itemToStringLabel(item) ?? "";
  }
  if (item && typeof item === "object") {
    if ("label" in item && item.label != null) {
      return String(item.label);
    }
    if ("value" in item) {
      return String(item.value);
    }
  }
  return serializeValue(item);
}
function serializeValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
var [injectTableClassesSettable, provideTableClassesSettable, provideTableClassesSettableExisting, SET_TABLE_CLASSES_TOKEN] = createInjectionToken("@spartan-ng SET_TABLE_CLASSES_TOKEN");
async function waitForElementAnimations(el) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  const animationFillMode = el.style.animationFillMode;
  const animations = el.getAnimations({ subtree: true });
  el.style.animationFillMode = "forwards";
  await Promise.all(animations.map((animation) => animation.finished.catch((err) => {
    if (!(err instanceof Error && err.name === "AbortError")) {
      throw err;
    }
    return animation;
  })));
  setTimeout(() => {
    if (el.style.animationFillMode === "forwards")
      el.style.animationFillMode = animationFillMode;
  });
}

export {
  computedPrevious,
  brnZoneFull,
  brnZoneFree,
  brnZoneOptimized,
  isElement,
  createHoverObservable,
  injectCustomClassSettable,
  provideCustomClassSettable,
  provideCustomClassSettableExisting,
  SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN,
  debouncedSignal,
  brnDevMode,
  injectExposedSideProvider,
  provideExposedSideProvider,
  provideExposedSideProviderExisting,
  EXPOSES_SIDE_TOKEN,
  injectExposesStateProvider,
  provideExposesStateProvider,
  provideExposesStateProviderExisting,
  EXPOSES_STATE_TOKEN,
  injectElementSize,
  measureDimensions,
  createMenuPosition,
  stringifyAsLabel,
  serializeValue,
  injectTableClassesSettable,
  provideTableClassesSettable,
  provideTableClassesSettableExisting,
  SET_TABLE_CLASSES_TOKEN,
  waitForElementAnimations
};
//# sourceMappingURL=chunk-TKJ74FPE.js.map
