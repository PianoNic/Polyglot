import {
  CdkMonitorFocus,
  FocusMonitor
} from "./chunk-TQRZPWTF.js";
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  Directionality,
  ESCAPE,
  OverlayConfig,
  OverlayContainer,
  OverlayModule,
  OverlayOutsideClickDispatcher,
  OverlayPositionBuilder,
  OverlayRef,
  Platform,
  PortalModule,
  ScrollStrategyOptions,
  TemplatePortal,
  _CdkPrivateStyleLoader,
  _IdGenerator,
  _getFocusedElementPierceShadowDom,
  coerceArray,
  coerceElement,
  coerceNumberProperty,
  createBlockScrollStrategy,
  createGlobalPositionStrategy,
  createOverlayRef,
  hasModifierKey
} from "./chunk-44GUTAKX.js";
import {
  provideCustomClassSettableExisting,
  provideExposesStateProviderExisting
} from "./chunk-TKJ74FPE.js";
import {
  takeUntilDestroyed
} from "./chunk-WUHKT4RW.js";
import {
  CSP_NONCE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Injectable,
  Input,
  NgModule,
  Output,
  Renderer2,
  RendererFactory2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  input,
  numberAttribute,
  output,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineNgModule,
  ɵɵdomProperty,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵqueryRefresh,
  ɵɵtemplate,
  ɵɵviewQuery
} from "./chunk-BATDMF3R.js";
import {
  DOCUMENT,
  DestroyRef,
  EventEmitter,
  InjectionToken,
  Injector,
  NgZone,
  Observable,
  Subject,
  combineLatest,
  computed,
  concat,
  debounceTime,
  defer,
  effect,
  filter,
  inject,
  linkedSignal,
  map,
  merge,
  runInInjectionContext,
  signal,
  skip,
  startWith,
  take,
  takeUntil,
  untracked,
  ɵɵdefineInjectable,
  ɵɵdefineInjector
} from "./chunk-KWSEEMQO.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@angular/cdk/fesm2022/private.mjs
var _VisuallyHiddenLoader = class __VisuallyHiddenLoader {
  static ɵfac = function _VisuallyHiddenLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || __VisuallyHiddenLoader)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: __VisuallyHiddenLoader,
    selectors: [["ng-component"]],
    exportAs: ["cdkVisuallyHidden"],
    decls: 0,
    vars: 0,
    template: function _VisuallyHiddenLoader_Template(rf, ctx) {
    },
    styles: [".cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;outline:0;-webkit-appearance:none;-moz-appearance:none;left:0}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_VisuallyHiddenLoader, [{
    type: Component,
    args: [{
      exportAs: "cdkVisuallyHidden",
      encapsulation: ViewEncapsulation.None,
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [".cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;outline:0;-webkit-appearance:none;-moz-appearance:none;left:0}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}\n"]
    }]
  }], null, null);
})();

// node_modules/@angular/cdk/fesm2022/_breakpoints-observer-chunk.mjs
var mediaQueriesForWebkitCompatibility = /* @__PURE__ */ new Set();
var mediaQueryStyleNode;
var MediaMatcher = class _MediaMatcher {
  _platform = inject(Platform);
  _nonce = inject(CSP_NONCE, {
    optional: true
  });
  _matchMedia;
  constructor() {
    this._matchMedia = this._platform.isBrowser && window.matchMedia ? window.matchMedia.bind(window) : noopMatchMedia;
  }
  matchMedia(query) {
    if (this._platform.WEBKIT || this._platform.BLINK) {
      createEmptyStyleRule(query, this._nonce);
    }
    return this._matchMedia(query);
  }
  static ɵfac = function MediaMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MediaMatcher)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MediaMatcher,
    factory: _MediaMatcher.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MediaMatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function createEmptyStyleRule(query, nonce) {
  if (mediaQueriesForWebkitCompatibility.has(query)) {
    return;
  }
  try {
    if (!mediaQueryStyleNode) {
      mediaQueryStyleNode = document.createElement("style");
      if (nonce) {
        mediaQueryStyleNode.setAttribute("nonce", nonce);
      }
      mediaQueryStyleNode.setAttribute("type", "text/css");
      document.head.appendChild(mediaQueryStyleNode);
    }
    if (mediaQueryStyleNode.sheet) {
      mediaQueryStyleNode.sheet.insertRule(`@media ${query} {body{ }}`, 0);
      mediaQueriesForWebkitCompatibility.add(query);
    }
  } catch (e) {
    console.error(e);
  }
}
function noopMatchMedia(query) {
  return {
    matches: query === "all" || query === "",
    media: query,
    addListener: () => {
    },
    removeListener: () => {
    }
  };
}
var BreakpointObserver = class _BreakpointObserver {
  _mediaMatcher = inject(MediaMatcher);
  _zone = inject(NgZone);
  _queries = /* @__PURE__ */ new Map();
  _destroySubject = new Subject();
  constructor() {
  }
  ngOnDestroy() {
    this._destroySubject.next();
    this._destroySubject.complete();
  }
  isMatched(value) {
    const queries = splitQueries(coerceArray(value));
    return queries.some((mediaQuery) => this._registerQuery(mediaQuery).mql.matches);
  }
  observe(value) {
    const queries = splitQueries(coerceArray(value));
    const observables = queries.map((query) => this._registerQuery(query).observable);
    let stateObservable = combineLatest(observables);
    stateObservable = concat(stateObservable.pipe(take(1)), stateObservable.pipe(skip(1), debounceTime(0)));
    return stateObservable.pipe(map((breakpointStates) => {
      const response = {
        matches: false,
        breakpoints: {}
      };
      breakpointStates.forEach(({
        matches,
        query
      }) => {
        response.matches = response.matches || matches;
        response.breakpoints[query] = matches;
      });
      return response;
    }));
  }
  _registerQuery(query) {
    if (this._queries.has(query)) {
      return this._queries.get(query);
    }
    const mql = this._mediaMatcher.matchMedia(query);
    const queryObservable = new Observable((observer) => {
      const handler = (e) => this._zone.run(() => observer.next(e));
      mql.addListener(handler);
      return () => {
        mql.removeListener(handler);
      };
    }).pipe(startWith(mql), map(({
      matches
    }) => ({
      query,
      matches
    })), takeUntil(this._destroySubject));
    const output2 = {
      observable: queryObservable,
      mql
    };
    this._queries.set(query, output2);
    return output2;
  }
  static ɵfac = function BreakpointObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BreakpointObserver)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BreakpointObserver,
    factory: _BreakpointObserver.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreakpointObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function splitQueries(queries) {
  return queries.map((query) => query.split(",")).reduce((a1, a2) => a1.concat(a2)).map((query) => query.trim());
}

// node_modules/@angular/cdk/fesm2022/observers.mjs
function shouldIgnoreRecord(record) {
  if (record.type === "characterData" && record.target instanceof Comment) {
    return true;
  }
  if (record.type === "childList") {
    for (let i = 0; i < record.addedNodes.length; i++) {
      if (!(record.addedNodes[i] instanceof Comment)) {
        return false;
      }
    }
    for (let i = 0; i < record.removedNodes.length; i++) {
      if (!(record.removedNodes[i] instanceof Comment)) {
        return false;
      }
    }
    return true;
  }
  return false;
}
var MutationObserverFactory = class _MutationObserverFactory {
  create(callback) {
    return typeof MutationObserver === "undefined" ? null : new MutationObserver(callback);
  }
  static ɵfac = function MutationObserverFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MutationObserverFactory)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MutationObserverFactory,
    factory: _MutationObserverFactory.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MutationObserverFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var ContentObserver = class _ContentObserver {
  _mutationObserverFactory = inject(MutationObserverFactory);
  _observedElements = /* @__PURE__ */ new Map();
  _ngZone = inject(NgZone);
  constructor() {
  }
  ngOnDestroy() {
    this._observedElements.forEach((_, element) => this._cleanupObserver(element));
  }
  observe(elementOrRef) {
    const element = coerceElement(elementOrRef);
    return new Observable((observer) => {
      const stream = this._observeElement(element);
      const subscription = stream.pipe(map((records) => records.filter((record) => !shouldIgnoreRecord(record))), filter((records) => !!records.length)).subscribe((records) => {
        this._ngZone.run(() => {
          observer.next(records);
        });
      });
      return () => {
        subscription.unsubscribe();
        this._unobserveElement(element);
      };
    });
  }
  _observeElement(element) {
    return this._ngZone.runOutsideAngular(() => {
      if (!this._observedElements.has(element)) {
        const stream = new Subject();
        const observer = this._mutationObserverFactory.create((mutations) => stream.next(mutations));
        if (observer) {
          observer.observe(element, {
            characterData: true,
            childList: true,
            subtree: true
          });
        }
        this._observedElements.set(element, {
          observer,
          stream,
          count: 1
        });
      } else {
        this._observedElements.get(element).count++;
      }
      return this._observedElements.get(element).stream;
    });
  }
  _unobserveElement(element) {
    if (this._observedElements.has(element)) {
      this._observedElements.get(element).count--;
      if (!this._observedElements.get(element).count) {
        this._cleanupObserver(element);
      }
    }
  }
  _cleanupObserver(element) {
    if (this._observedElements.has(element)) {
      const {
        observer,
        stream
      } = this._observedElements.get(element);
      if (observer) {
        observer.disconnect();
      }
      stream.complete();
      this._observedElements.delete(element);
    }
  }
  static ɵfac = function ContentObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContentObserver)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ContentObserver,
    factory: _ContentObserver.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContentObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var CdkObserveContent = class _CdkObserveContent {
  _contentObserver = inject(ContentObserver);
  _elementRef = inject(ElementRef);
  event = new EventEmitter();
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._disabled ? this._unsubscribe() : this._subscribe();
  }
  _disabled = false;
  get debounce() {
    return this._debounce;
  }
  set debounce(value) {
    this._debounce = coerceNumberProperty(value);
    this._subscribe();
  }
  _debounce;
  _currentSubscription = null;
  constructor() {
  }
  ngAfterContentInit() {
    if (!this._currentSubscription && !this.disabled) {
      this._subscribe();
    }
  }
  ngOnDestroy() {
    this._unsubscribe();
  }
  _subscribe() {
    this._unsubscribe();
    const stream = this._contentObserver.observe(this._elementRef);
    this._currentSubscription = (this.debounce ? stream.pipe(debounceTime(this.debounce)) : stream).subscribe(this.event);
  }
  _unsubscribe() {
    this._currentSubscription?.unsubscribe();
  }
  static ɵfac = function CdkObserveContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkObserveContent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkObserveContent,
    selectors: [["", "cdkObserveContent", ""]],
    inputs: {
      disabled: [2, "cdkObserveContentDisabled", "disabled", booleanAttribute],
      debounce: "debounce"
    },
    outputs: {
      event: "cdkObserveContent"
    },
    exportAs: ["cdkObserveContent"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkObserveContent, [{
    type: Directive,
    args: [{
      selector: "[cdkObserveContent]",
      exportAs: "cdkObserveContent"
    }]
  }], () => [], {
    event: [{
      type: Output,
      args: ["cdkObserveContent"]
    }],
    disabled: [{
      type: Input,
      args: [{
        alias: "cdkObserveContentDisabled",
        transform: booleanAttribute
      }]
    }],
    debounce: [{
      type: Input
    }]
  });
})();
var ObserversModule = class _ObserversModule {
  static ɵfac = function ObserversModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ObserversModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ObserversModule,
    imports: [CdkObserveContent],
    exports: [CdkObserveContent]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [MutationObserverFactory]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ObserversModule, [{
    type: NgModule,
    args: [{
      imports: [CdkObserveContent],
      exports: [CdkObserveContent],
      providers: [MutationObserverFactory]
    }]
  }], null, null);
})();

// node_modules/@angular/cdk/fesm2022/_a11y-module-chunk.mjs
var InteractivityChecker = class _InteractivityChecker {
  _platform = inject(Platform);
  constructor() {
  }
  isDisabled(element) {
    return element.hasAttribute("disabled");
  }
  isVisible(element) {
    return hasGeometry(element) && getComputedStyle(element).visibility === "visible";
  }
  isTabbable(element) {
    if (!this._platform.isBrowser) {
      return false;
    }
    const frameElement = getFrameElement(getWindow(element));
    if (frameElement) {
      if (getTabIndexValue(frameElement) === -1) {
        return false;
      }
      if (!this.isVisible(frameElement)) {
        return false;
      }
    }
    let nodeName = element.nodeName.toLowerCase();
    let tabIndexValue = getTabIndexValue(element);
    if (element.hasAttribute("contenteditable")) {
      return tabIndexValue !== -1;
    }
    if (nodeName === "iframe" || nodeName === "object") {
      return false;
    }
    if (this._platform.WEBKIT && this._platform.IOS && !isPotentiallyTabbableIOS(element)) {
      return false;
    }
    if (nodeName === "audio") {
      if (!element.hasAttribute("controls")) {
        return false;
      }
      return tabIndexValue !== -1;
    }
    if (nodeName === "video") {
      if (tabIndexValue === -1) {
        return false;
      }
      if (tabIndexValue !== null) {
        return true;
      }
      return this._platform.FIREFOX || element.hasAttribute("controls");
    }
    return element.tabIndex >= 0;
  }
  isFocusable(element, config) {
    return isPotentiallyFocusable(element) && !this.isDisabled(element) && (config?.ignoreVisibility || this.isVisible(element));
  }
  static ɵfac = function InteractivityChecker_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InteractivityChecker)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _InteractivityChecker,
    factory: _InteractivityChecker.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InteractivityChecker, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function getFrameElement(window2) {
  try {
    return window2.frameElement;
  } catch {
    return null;
  }
}
function hasGeometry(element) {
  return !!(element.offsetWidth || element.offsetHeight || typeof element.getClientRects === "function" && element.getClientRects().length);
}
function isNativeFormElement(element) {
  let nodeName = element.nodeName.toLowerCase();
  return nodeName === "input" || nodeName === "select" || nodeName === "button" || nodeName === "textarea";
}
function isHiddenInput(element) {
  return isInputElement(element) && element.type == "hidden";
}
function isAnchorWithHref(element) {
  return isAnchorElement(element) && element.hasAttribute("href");
}
function isInputElement(element) {
  return element.nodeName.toLowerCase() == "input";
}
function isAnchorElement(element) {
  return element.nodeName.toLowerCase() == "a";
}
function hasValidTabIndex(element) {
  if (!element.hasAttribute("tabindex") || element.tabIndex === void 0) {
    return false;
  }
  let tabIndex = element.getAttribute("tabindex");
  return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));
}
function getTabIndexValue(element) {
  if (!hasValidTabIndex(element)) {
    return null;
  }
  const tabIndex = parseInt(element.getAttribute("tabindex") || "", 10);
  return isNaN(tabIndex) ? -1 : tabIndex;
}
function isPotentiallyTabbableIOS(element) {
  let nodeName = element.nodeName.toLowerCase();
  let inputType = nodeName === "input" && element.type;
  return inputType === "text" || inputType === "password" || nodeName === "select" || nodeName === "textarea";
}
function isPotentiallyFocusable(element) {
  if (isHiddenInput(element)) {
    return false;
  }
  return isNativeFormElement(element) || isAnchorWithHref(element) || element.hasAttribute("contenteditable") || hasValidTabIndex(element);
}
function getWindow(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || window;
}
var FocusTrap = class {
  _element;
  _checker;
  _ngZone;
  _document;
  _injector;
  _startAnchor;
  _endAnchor;
  _hasAttached = false;
  startAnchorListener = () => this.focusLastTabbableElement();
  endAnchorListener = () => this.focusFirstTabbableElement();
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    if (this._startAnchor && this._endAnchor) {
      this._toggleAnchorTabIndex(value, this._startAnchor);
      this._toggleAnchorTabIndex(value, this._endAnchor);
    }
  }
  _enabled = true;
  constructor(_element, _checker, _ngZone, _document, deferAnchors = false, _injector) {
    this._element = _element;
    this._checker = _checker;
    this._ngZone = _ngZone;
    this._document = _document;
    this._injector = _injector;
    if (!deferAnchors) {
      this.attachAnchors();
    }
  }
  destroy() {
    const startAnchor = this._startAnchor;
    const endAnchor = this._endAnchor;
    if (startAnchor) {
      startAnchor.removeEventListener("focus", this.startAnchorListener);
      startAnchor.remove();
    }
    if (endAnchor) {
      endAnchor.removeEventListener("focus", this.endAnchorListener);
      endAnchor.remove();
    }
    this._startAnchor = this._endAnchor = null;
    this._hasAttached = false;
  }
  attachAnchors() {
    if (this._hasAttached) {
      return true;
    }
    this._ngZone.runOutsideAngular(() => {
      if (!this._startAnchor) {
        this._startAnchor = this._createAnchor();
        this._startAnchor.addEventListener("focus", this.startAnchorListener);
      }
      if (!this._endAnchor) {
        this._endAnchor = this._createAnchor();
        this._endAnchor.addEventListener("focus", this.endAnchorListener);
      }
    });
    if (this._element.parentNode) {
      this._element.parentNode.insertBefore(this._startAnchor, this._element);
      this._element.parentNode.insertBefore(this._endAnchor, this._element.nextSibling);
      this._hasAttached = true;
    }
    return this._hasAttached;
  }
  focusInitialElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusInitialElement(options)));
    });
  }
  focusFirstTabbableElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusFirstTabbableElement(options)));
    });
  }
  focusLastTabbableElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusLastTabbableElement(options)));
    });
  }
  _getRegionBoundary(bound) {
    const markers = this._element.querySelectorAll(`[cdk-focus-region-${bound}], [cdkFocusRegion${bound}], [cdk-focus-${bound}]`);
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      for (let i = 0; i < markers.length; i++) {
        if (markers[i].hasAttribute(`cdk-focus-${bound}`)) {
          console.warn(`Found use of deprecated attribute 'cdk-focus-${bound}', use 'cdkFocusRegion${bound}' instead. The deprecated attribute will be removed in 8.0.0.`, markers[i]);
        } else if (markers[i].hasAttribute(`cdk-focus-region-${bound}`)) {
          console.warn(`Found use of deprecated attribute 'cdk-focus-region-${bound}', use 'cdkFocusRegion${bound}' instead. The deprecated attribute will be removed in 8.0.0.`, markers[i]);
        }
      }
    }
    if (bound == "start") {
      return markers.length ? markers[0] : this._getFirstTabbableElement(this._element);
    }
    return markers.length ? markers[markers.length - 1] : this._getLastTabbableElement(this._element);
  }
  focusInitialElement(options) {
    const redirectToElement = this._element.querySelector(`[cdk-focus-initial], [cdkFocusInitial]`);
    if (redirectToElement) {
      if ((typeof ngDevMode === "undefined" || ngDevMode) && redirectToElement.hasAttribute(`cdk-focus-initial`)) {
        console.warn(`Found use of deprecated attribute 'cdk-focus-initial', use 'cdkFocusInitial' instead. The deprecated attribute will be removed in 8.0.0`, redirectToElement);
      }
      if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._checker.isFocusable(redirectToElement)) {
        console.warn(`Element matching '[cdkFocusInitial]' is not focusable.`, redirectToElement);
      }
      if (!this._checker.isFocusable(redirectToElement)) {
        const focusableChild = this._getFirstTabbableElement(redirectToElement);
        focusableChild?.focus(options);
        return !!focusableChild;
      }
      redirectToElement.focus(options);
      return true;
    }
    return this.focusFirstTabbableElement(options);
  }
  focusFirstTabbableElement(options) {
    const redirectToElement = this._getRegionBoundary("start");
    if (redirectToElement) {
      redirectToElement.focus(options);
    }
    return !!redirectToElement;
  }
  focusLastTabbableElement(options) {
    const redirectToElement = this._getRegionBoundary("end");
    if (redirectToElement) {
      redirectToElement.focus(options);
    }
    return !!redirectToElement;
  }
  hasAttached() {
    return this._hasAttached;
  }
  _getFirstTabbableElement(root) {
    if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
      return root;
    }
    const children = root.children;
    for (let i = 0; i < children.length; i++) {
      const tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ? this._getFirstTabbableElement(children[i]) : null;
      if (tabbableChild) {
        return tabbableChild;
      }
    }
    return null;
  }
  _getLastTabbableElement(root) {
    if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
      return root;
    }
    const children = root.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ? this._getLastTabbableElement(children[i]) : null;
      if (tabbableChild) {
        return tabbableChild;
      }
    }
    return null;
  }
  _createAnchor() {
    const anchor = this._document.createElement("div");
    this._toggleAnchorTabIndex(this._enabled, anchor);
    anchor.classList.add("cdk-visually-hidden");
    anchor.classList.add("cdk-focus-trap-anchor");
    anchor.setAttribute("aria-hidden", "true");
    return anchor;
  }
  _toggleAnchorTabIndex(isEnabled, anchor) {
    isEnabled ? anchor.setAttribute("tabindex", "0") : anchor.removeAttribute("tabindex");
  }
  toggleAnchors(enabled) {
    if (this._startAnchor && this._endAnchor) {
      this._toggleAnchorTabIndex(enabled, this._startAnchor);
      this._toggleAnchorTabIndex(enabled, this._endAnchor);
    }
  }
  _executeOnStable(fn) {
    if (this._injector) {
      afterNextRender(fn, {
        injector: this._injector
      });
    } else {
      setTimeout(fn);
    }
  }
};
var FocusTrapFactory = class _FocusTrapFactory {
  _checker = inject(InteractivityChecker);
  _ngZone = inject(NgZone);
  _document = inject(DOCUMENT);
  _injector = inject(Injector);
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
  }
  create(element, deferCaptureElements = false) {
    return new FocusTrap(element, this._checker, this._ngZone, this._document, deferCaptureElements, this._injector);
  }
  static ɵfac = function FocusTrapFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FocusTrapFactory)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FocusTrapFactory,
    factory: _FocusTrapFactory.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusTrapFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var CdkTrapFocus = class _CdkTrapFocus {
  _elementRef = inject(ElementRef);
  _focusTrapFactory = inject(FocusTrapFactory);
  focusTrap;
  _previouslyFocusedElement = null;
  get enabled() {
    return this.focusTrap?.enabled || false;
  }
  set enabled(value) {
    if (this.focusTrap) {
      this.focusTrap.enabled = value;
    }
  }
  autoCapture;
  constructor() {
    const platform = inject(Platform);
    if (platform.isBrowser) {
      this.focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement, true);
    }
  }
  ngOnDestroy() {
    this.focusTrap?.destroy();
    if (this._previouslyFocusedElement) {
      this._previouslyFocusedElement.focus();
      this._previouslyFocusedElement = null;
    }
  }
  ngAfterContentInit() {
    this.focusTrap?.attachAnchors();
    if (this.autoCapture) {
      this._captureFocus();
    }
  }
  ngDoCheck() {
    if (this.focusTrap && !this.focusTrap.hasAttached()) {
      this.focusTrap.attachAnchors();
    }
  }
  ngOnChanges(changes) {
    const autoCaptureChange = changes["autoCapture"];
    if (autoCaptureChange && !autoCaptureChange.firstChange && this.autoCapture && this.focusTrap?.hasAttached()) {
      this._captureFocus();
    }
  }
  _captureFocus() {
    this._previouslyFocusedElement = _getFocusedElementPierceShadowDom();
    this.focusTrap?.focusInitialElementWhenReady();
  }
  static ɵfac = function CdkTrapFocus_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkTrapFocus)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkTrapFocus,
    selectors: [["", "cdkTrapFocus", ""]],
    inputs: {
      enabled: [2, "cdkTrapFocus", "enabled", booleanAttribute],
      autoCapture: [2, "cdkTrapFocusAutoCapture", "autoCapture", booleanAttribute]
    },
    exportAs: ["cdkTrapFocus"],
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTrapFocus, [{
    type: Directive,
    args: [{
      selector: "[cdkTrapFocus]",
      exportAs: "cdkTrapFocus"
    }]
  }], () => [], {
    enabled: [{
      type: Input,
      args: [{
        alias: "cdkTrapFocus",
        transform: booleanAttribute
      }]
    }],
    autoCapture: [{
      type: Input,
      args: [{
        alias: "cdkTrapFocusAutoCapture",
        transform: booleanAttribute
      }]
    }]
  });
})();
var LIVE_ANNOUNCER_ELEMENT_TOKEN = new InjectionToken("liveAnnouncerElement", {
  providedIn: "root",
  factory: () => null
});
var LIVE_ANNOUNCER_DEFAULT_OPTIONS = new InjectionToken("LIVE_ANNOUNCER_DEFAULT_OPTIONS");
var uniqueIds = 0;
var LiveAnnouncer = class _LiveAnnouncer {
  _ngZone = inject(NgZone);
  _defaultOptions = inject(LIVE_ANNOUNCER_DEFAULT_OPTIONS, {
    optional: true
  });
  _liveElement;
  _document = inject(DOCUMENT);
  _previousTimeout;
  _currentPromise;
  _currentResolve;
  constructor() {
    const elementToken = inject(LIVE_ANNOUNCER_ELEMENT_TOKEN, {
      optional: true
    });
    this._liveElement = elementToken || this._createLiveElement();
  }
  announce(message, ...args) {
    const defaultOptions2 = this._defaultOptions;
    let politeness;
    let duration;
    if (args.length === 1 && typeof args[0] === "number") {
      duration = args[0];
    } else {
      [politeness, duration] = args;
    }
    this.clear();
    clearTimeout(this._previousTimeout);
    if (!politeness) {
      politeness = defaultOptions2 && defaultOptions2.politeness ? defaultOptions2.politeness : "polite";
    }
    if (duration == null && defaultOptions2) {
      duration = defaultOptions2.duration;
    }
    this._liveElement.setAttribute("aria-live", politeness);
    if (this._liveElement.id) {
      this._exposeAnnouncerToModals(this._liveElement.id);
    }
    return this._ngZone.runOutsideAngular(() => {
      if (!this._currentPromise) {
        this._currentPromise = new Promise((resolve) => this._currentResolve = resolve);
      }
      clearTimeout(this._previousTimeout);
      this._previousTimeout = setTimeout(() => {
        this._liveElement.textContent = message;
        if (typeof duration === "number") {
          this._previousTimeout = setTimeout(() => this.clear(), duration);
        }
        this._currentResolve?.();
        this._currentPromise = this._currentResolve = void 0;
      }, 100);
      return this._currentPromise;
    });
  }
  clear() {
    if (this._liveElement) {
      this._liveElement.textContent = "";
    }
  }
  ngOnDestroy() {
    clearTimeout(this._previousTimeout);
    this._liveElement?.remove();
    this._liveElement = null;
    this._currentResolve?.();
    this._currentPromise = this._currentResolve = void 0;
  }
  _createLiveElement() {
    const elementClass = "cdk-live-announcer-element";
    const previousElements = this._document.getElementsByClassName(elementClass);
    const liveEl = this._document.createElement("div");
    for (let i = 0; i < previousElements.length; i++) {
      previousElements[i].remove();
    }
    liveEl.classList.add(elementClass);
    liveEl.classList.add("cdk-visually-hidden");
    liveEl.setAttribute("aria-atomic", "true");
    liveEl.setAttribute("aria-live", "polite");
    liveEl.id = `cdk-live-announcer-${uniqueIds++}`;
    this._document.body.appendChild(liveEl);
    return liveEl;
  }
  _exposeAnnouncerToModals(id) {
    const modals = this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      const ariaOwns = modal.getAttribute("aria-owns");
      if (!ariaOwns) {
        modal.setAttribute("aria-owns", id);
      } else if (ariaOwns.indexOf(id) === -1) {
        modal.setAttribute("aria-owns", ariaOwns + " " + id);
      }
    }
  }
  static ɵfac = function LiveAnnouncer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LiveAnnouncer)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _LiveAnnouncer,
    factory: _LiveAnnouncer.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LiveAnnouncer, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var CdkAriaLive = class _CdkAriaLive {
  _elementRef = inject(ElementRef);
  _liveAnnouncer = inject(LiveAnnouncer);
  _contentObserver = inject(ContentObserver);
  _ngZone = inject(NgZone);
  get politeness() {
    return this._politeness;
  }
  set politeness(value) {
    this._politeness = value === "off" || value === "assertive" ? value : "polite";
    if (this._politeness === "off") {
      if (this._subscription) {
        this._subscription.unsubscribe();
        this._subscription = null;
      }
    } else if (!this._subscription) {
      this._subscription = this._ngZone.runOutsideAngular(() => {
        return this._contentObserver.observe(this._elementRef).subscribe(() => {
          const elementText = this._elementRef.nativeElement.textContent;
          if (elementText !== this._previousAnnouncedText) {
            this._liveAnnouncer.announce(elementText, this._politeness, this.duration);
            this._previousAnnouncedText = elementText;
          }
        });
      });
    }
  }
  _politeness = "polite";
  duration;
  _previousAnnouncedText;
  _subscription;
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
  }
  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
  static ɵfac = function CdkAriaLive_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkAriaLive)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkAriaLive,
    selectors: [["", "cdkAriaLive", ""]],
    inputs: {
      politeness: [0, "cdkAriaLive", "politeness"],
      duration: [0, "cdkAriaLiveDuration", "duration"]
    },
    exportAs: ["cdkAriaLive"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAriaLive, [{
    type: Directive,
    args: [{
      selector: "[cdkAriaLive]",
      exportAs: "cdkAriaLive"
    }]
  }], () => [], {
    politeness: [{
      type: Input,
      args: ["cdkAriaLive"]
    }],
    duration: [{
      type: Input,
      args: ["cdkAriaLiveDuration"]
    }]
  });
})();
var HighContrastMode;
(function(HighContrastMode2) {
  HighContrastMode2[HighContrastMode2["NONE"] = 0] = "NONE";
  HighContrastMode2[HighContrastMode2["BLACK_ON_WHITE"] = 1] = "BLACK_ON_WHITE";
  HighContrastMode2[HighContrastMode2["WHITE_ON_BLACK"] = 2] = "WHITE_ON_BLACK";
})(HighContrastMode || (HighContrastMode = {}));
var BLACK_ON_WHITE_CSS_CLASS = "cdk-high-contrast-black-on-white";
var WHITE_ON_BLACK_CSS_CLASS = "cdk-high-contrast-white-on-black";
var HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS = "cdk-high-contrast-active";
var HighContrastModeDetector = class _HighContrastModeDetector {
  _platform = inject(Platform);
  _hasCheckedHighContrastMode;
  _document = inject(DOCUMENT);
  _breakpointSubscription;
  constructor() {
    this._breakpointSubscription = inject(BreakpointObserver).observe("(forced-colors: active)").subscribe(() => {
      if (this._hasCheckedHighContrastMode) {
        this._hasCheckedHighContrastMode = false;
        this._applyBodyHighContrastModeCssClasses();
      }
    });
  }
  getHighContrastMode() {
    if (!this._platform.isBrowser) {
      return HighContrastMode.NONE;
    }
    const testElement = this._document.createElement("div");
    testElement.style.backgroundColor = "rgb(1,2,3)";
    testElement.style.position = "absolute";
    this._document.body.appendChild(testElement);
    const documentWindow = this._document.defaultView || window;
    const computedStyle = documentWindow && documentWindow.getComputedStyle ? documentWindow.getComputedStyle(testElement) : null;
    const computedColor = (computedStyle && computedStyle.backgroundColor || "").replace(/ /g, "");
    testElement.remove();
    switch (computedColor) {
      case "rgb(0,0,0)":
      case "rgb(45,50,54)":
      case "rgb(32,32,32)":
        return HighContrastMode.WHITE_ON_BLACK;
      case "rgb(255,255,255)":
      case "rgb(255,250,239)":
        return HighContrastMode.BLACK_ON_WHITE;
    }
    return HighContrastMode.NONE;
  }
  ngOnDestroy() {
    this._breakpointSubscription.unsubscribe();
  }
  _applyBodyHighContrastModeCssClasses() {
    if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
      const bodyClasses = this._document.body.classList;
      bodyClasses.remove(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS, WHITE_ON_BLACK_CSS_CLASS);
      this._hasCheckedHighContrastMode = true;
      const mode = this.getHighContrastMode();
      if (mode === HighContrastMode.BLACK_ON_WHITE) {
        bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS);
      } else if (mode === HighContrastMode.WHITE_ON_BLACK) {
        bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, WHITE_ON_BLACK_CSS_CLASS);
      }
    }
  }
  static ɵfac = function HighContrastModeDetector_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HighContrastModeDetector)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _HighContrastModeDetector,
    factory: _HighContrastModeDetector.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HighContrastModeDetector, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var A11yModule = class _A11yModule {
  constructor() {
    inject(HighContrastModeDetector)._applyBodyHighContrastModeCssClasses();
  }
  static ɵfac = function A11yModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _A11yModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _A11yModule,
    imports: [ObserversModule, CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
    exports: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [ObserversModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(A11yModule, [{
    type: NgModule,
    args: [{
      imports: [ObserversModule, CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
      exports: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus]
    }]
  }], () => [], null);
})();

// node_modules/@angular/cdk/fesm2022/dialog.mjs
function CdkDialogContainer_ng_template_0_Template(rf, ctx) {
}
var DialogConfig = class {
  viewContainerRef;
  injector;
  id;
  role = "dialog";
  panelClass = "";
  hasBackdrop = true;
  backdropClass = "";
  disableClose = false;
  closePredicate;
  width = "";
  height = "";
  minWidth;
  minHeight;
  maxWidth;
  maxHeight;
  positionStrategy;
  data = null;
  direction;
  ariaDescribedBy = null;
  ariaLabelledBy = null;
  ariaLabel = null;
  ariaModal = false;
  autoFocus = "first-tabbable";
  restoreFocus = true;
  scrollStrategy;
  closeOnNavigation = true;
  closeOnDestroy = true;
  closeOnOverlayDetachments = true;
  disableAnimations = false;
  providers;
  container;
  templateContext;
};
function throwDialogContentAlreadyAttachedError() {
  throw Error("Attempting to attach dialog content after content is already attached");
}
var CdkDialogContainer = class _CdkDialogContainer extends BasePortalOutlet {
  _elementRef = inject(ElementRef);
  _focusTrapFactory = inject(FocusTrapFactory);
  _config;
  _interactivityChecker = inject(InteractivityChecker);
  _ngZone = inject(NgZone);
  _focusMonitor = inject(FocusMonitor);
  _renderer = inject(Renderer2);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _injector = inject(Injector);
  _platform = inject(Platform);
  _document = inject(DOCUMENT);
  _portalOutlet;
  _focusTrapped = new Subject();
  _focusTrap = null;
  _elementFocusedBeforeDialogWasOpened = null;
  _closeInteractionType = null;
  _ariaLabelledByQueue = [];
  _isDestroyed = false;
  constructor() {
    super();
    this._config = inject(DialogConfig, {
      optional: true
    }) || new DialogConfig();
    if (this._config.ariaLabelledBy) {
      this._ariaLabelledByQueue.push(this._config.ariaLabelledBy);
    }
  }
  _addAriaLabelledBy(id) {
    this._ariaLabelledByQueue.push(id);
    this._changeDetectorRef.markForCheck();
  }
  _removeAriaLabelledBy(id) {
    const index = this._ariaLabelledByQueue.indexOf(id);
    if (index > -1) {
      this._ariaLabelledByQueue.splice(index, 1);
      this._changeDetectorRef.markForCheck();
    }
  }
  _contentAttached() {
    this._initializeFocusTrap();
    this._captureInitialFocus();
  }
  _captureInitialFocus() {
    this._trapFocus();
  }
  ngOnDestroy() {
    this._focusTrapped.complete();
    this._isDestroyed = true;
    this._restoreFocus();
  }
  attachComponentPortal(portal) {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwDialogContentAlreadyAttachedError();
    }
    const result = this._portalOutlet.attachComponentPortal(portal);
    this._contentAttached();
    return result;
  }
  attachTemplatePortal(portal) {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwDialogContentAlreadyAttachedError();
    }
    const result = this._portalOutlet.attachTemplatePortal(portal);
    this._contentAttached();
    return result;
  }
  attachDomPortal = (portal) => {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwDialogContentAlreadyAttachedError();
    }
    const result = this._portalOutlet.attachDomPortal(portal);
    this._contentAttached();
    return result;
  };
  _recaptureFocus() {
    if (!this._containsFocus()) {
      this._trapFocus();
    }
  }
  _forceFocus(element, options) {
    if (!this._interactivityChecker.isFocusable(element)) {
      element.tabIndex = -1;
      this._ngZone.runOutsideAngular(() => {
        const callback = () => {
          deregisterBlur();
          deregisterMousedown();
          element.removeAttribute("tabindex");
        };
        const deregisterBlur = this._renderer.listen(element, "blur", callback);
        const deregisterMousedown = this._renderer.listen(element, "mousedown", callback);
      });
    }
    element.focus(options);
  }
  _focusByCssSelector(selector, options) {
    let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
    if (elementToFocus) {
      this._forceFocus(elementToFocus, options);
    }
  }
  _trapFocus(options) {
    if (this._isDestroyed) {
      return;
    }
    afterNextRender(() => {
      const element = this._elementRef.nativeElement;
      switch (this._config.autoFocus) {
        case false:
        case "dialog":
          if (!this._containsFocus()) {
            element.focus(options);
          }
          break;
        case true:
        case "first-tabbable":
          const focusedSuccessfully = this._focusTrap?.focusInitialElement(options);
          if (!focusedSuccessfully) {
            this._focusDialogContainer(options);
          }
          break;
        case "first-heading":
          this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]', options);
          break;
        default:
          this._focusByCssSelector(this._config.autoFocus, options);
          break;
      }
      this._focusTrapped.next();
    }, {
      injector: this._injector
    });
  }
  _restoreFocus() {
    const focusConfig = this._config.restoreFocus;
    let focusTargetElement = null;
    if (typeof focusConfig === "string") {
      focusTargetElement = this._document.querySelector(focusConfig);
    } else if (typeof focusConfig === "boolean") {
      focusTargetElement = focusConfig ? this._elementFocusedBeforeDialogWasOpened : null;
    } else if (focusConfig) {
      focusTargetElement = focusConfig;
    }
    if (this._config.restoreFocus && focusTargetElement && typeof focusTargetElement.focus === "function") {
      const activeElement = _getFocusedElementPierceShadowDom();
      const element = this._elementRef.nativeElement;
      if (!activeElement || activeElement === this._document.body || activeElement === element || element.contains(activeElement)) {
        if (this._focusMonitor) {
          this._focusMonitor.focusVia(focusTargetElement, this._closeInteractionType);
          this._closeInteractionType = null;
        } else {
          focusTargetElement.focus();
        }
      }
    }
    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }
  _focusDialogContainer(options) {
    this._elementRef.nativeElement.focus?.(options);
  }
  _containsFocus() {
    const element = this._elementRef.nativeElement;
    const activeElement = _getFocusedElementPierceShadowDom();
    return element === activeElement || element.contains(activeElement);
  }
  _initializeFocusTrap() {
    if (this._platform.isBrowser) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
      if (this._document) {
        this._elementFocusedBeforeDialogWasOpened = _getFocusedElementPierceShadowDom();
      }
    }
  }
  static ɵfac = function CdkDialogContainer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkDialogContainer)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _CdkDialogContainer,
    selectors: [["cdk-dialog-container"]],
    viewQuery: function CdkDialogContainer_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(CdkPortalOutlet, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._portalOutlet = _t.first);
      }
    },
    hostAttrs: ["tabindex", "-1", 1, "cdk-dialog-container"],
    hostVars: 6,
    hostBindings: function CdkDialogContainer_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx._config.id || null)("role", ctx._config.role)("aria-modal", ctx._config.ariaModal)("aria-labelledby", ctx._config.ariaLabel ? null : ctx._ariaLabelledByQueue[0])("aria-label", ctx._config.ariaLabel)("aria-describedby", ctx._config.ariaDescribedBy || null);
      }
    },
    features: [ɵɵInheritDefinitionFeature],
    decls: 1,
    vars: 0,
    consts: [["cdkPortalOutlet", ""]],
    template: function CdkDialogContainer_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, CdkDialogContainer_ng_template_0_Template, 0, 0, "ng-template", 0);
      }
    },
    dependencies: [CdkPortalOutlet],
    styles: [".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}\n"],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkDialogContainer, [{
    type: Component,
    args: [{
      selector: "cdk-dialog-container",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      imports: [CdkPortalOutlet],
      host: {
        "class": "cdk-dialog-container",
        "tabindex": "-1",
        "[attr.id]": "_config.id || null",
        "[attr.role]": "_config.role",
        "[attr.aria-modal]": "_config.ariaModal",
        "[attr.aria-labelledby]": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]",
        "[attr.aria-label]": "_config.ariaLabel",
        "[attr.aria-describedby]": "_config.ariaDescribedBy || null"
      },
      template: "<ng-template cdkPortalOutlet />\n",
      styles: [".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}\n"]
    }]
  }], () => [], {
    _portalOutlet: [{
      type: ViewChild,
      args: [CdkPortalOutlet, {
        static: true
      }]
    }]
  });
})();
var DialogRef = class {
  overlayRef;
  config;
  componentInstance;
  componentRef;
  containerInstance;
  disableClose;
  closed = new Subject();
  backdropClick;
  keydownEvents;
  outsidePointerEvents;
  id;
  _detachSubscription;
  constructor(overlayRef, config) {
    this.overlayRef = overlayRef;
    this.config = config;
    this.disableClose = config.disableClose;
    this.backdropClick = overlayRef.backdropClick();
    this.keydownEvents = overlayRef.keydownEvents();
    this.outsidePointerEvents = overlayRef.outsidePointerEvents();
    this.id = config.id;
    this.keydownEvents.subscribe((event) => {
      if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
        event.preventDefault();
        this.close(void 0, {
          focusOrigin: "keyboard"
        });
      }
    });
    this.backdropClick.subscribe(() => {
      if (!this.disableClose && this._canClose()) {
        this.close(void 0, {
          focusOrigin: "mouse"
        });
      } else {
        this.containerInstance._recaptureFocus?.();
      }
    });
    this._detachSubscription = overlayRef.detachments().subscribe(() => {
      if (config.closeOnOverlayDetachments !== false) {
        this.close();
      }
    });
  }
  close(result, options) {
    if (this._canClose(result)) {
      const closedSubject = this.closed;
      this.containerInstance._closeInteractionType = options?.focusOrigin || "program";
      this._detachSubscription.unsubscribe();
      this.overlayRef.dispose();
      closedSubject.next(result);
      closedSubject.complete();
      this.componentInstance = this.containerInstance = null;
    }
  }
  updatePosition() {
    this.overlayRef.updatePosition();
    return this;
  }
  updateSize(width = "", height = "") {
    this.overlayRef.updateSize({
      width,
      height
    });
    return this;
  }
  addPanelClass(classes) {
    this.overlayRef.addPanelClass(classes);
    return this;
  }
  removePanelClass(classes) {
    this.overlayRef.removePanelClass(classes);
    return this;
  }
  _canClose(result) {
    const config = this.config;
    return !!this.containerInstance && (!config.closePredicate || config.closePredicate(result, config, this.componentInstance));
  }
};
var DIALOG_SCROLL_STRATEGY = new InjectionToken("DialogScrollStrategy", {
  providedIn: "root",
  factory: () => {
    const injector = inject(Injector);
    return () => createBlockScrollStrategy(injector);
  }
});
var DIALOG_DATA = new InjectionToken("DialogData");
var DEFAULT_DIALOG_CONFIG = new InjectionToken("DefaultDialogConfig");
function getDirectionality(value) {
  const valueSignal = signal(value, ...ngDevMode ? [{
    debugName: "valueSignal"
  }] : []);
  const change = new EventEmitter();
  return {
    valueSignal,
    get value() {
      return valueSignal();
    },
    change,
    ngOnDestroy() {
      change.complete();
    }
  };
}
var Dialog = class _Dialog {
  _injector = inject(Injector);
  _defaultOptions = inject(DEFAULT_DIALOG_CONFIG, {
    optional: true
  });
  _parentDialog = inject(_Dialog, {
    optional: true,
    skipSelf: true
  });
  _overlayContainer = inject(OverlayContainer);
  _idGenerator = inject(_IdGenerator);
  _openDialogsAtThisLevel = [];
  _afterAllClosedAtThisLevel = new Subject();
  _afterOpenedAtThisLevel = new Subject();
  _ariaHiddenElements = /* @__PURE__ */ new Map();
  _scrollStrategy = inject(DIALOG_SCROLL_STRATEGY);
  get openDialogs() {
    return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
  }
  get afterOpened() {
    return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
  }
  afterAllClosed = defer(() => this.openDialogs.length ? this._getAfterAllClosed() : this._getAfterAllClosed().pipe(startWith(void 0)));
  constructor() {
  }
  open(componentOrTemplateRef, config) {
    const defaults = this._defaultOptions || new DialogConfig();
    config = __spreadValues(__spreadValues({}, defaults), config);
    config.id = config.id || this._idGenerator.getId("cdk-dialog-");
    if (config.id && this.getDialogById(config.id) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
    }
    const overlayConfig = this._getOverlayConfig(config);
    const overlayRef = createOverlayRef(this._injector, overlayConfig);
    const dialogRef = new DialogRef(overlayRef, config);
    const dialogContainer = this._attachContainer(overlayRef, dialogRef, config);
    dialogRef.containerInstance = dialogContainer;
    if (!this.openDialogs.length) {
      const overlayContainer = this._overlayContainer.getContainerElement();
      if (dialogContainer._focusTrapped) {
        dialogContainer._focusTrapped.pipe(take(1)).subscribe(() => {
          this._hideNonDialogContentFromAssistiveTechnology(overlayContainer);
        });
      } else {
        this._hideNonDialogContentFromAssistiveTechnology(overlayContainer);
      }
    }
    this._attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config);
    this.openDialogs.push(dialogRef);
    dialogRef.closed.subscribe(() => this._removeOpenDialog(dialogRef, true));
    this.afterOpened.next(dialogRef);
    return dialogRef;
  }
  closeAll() {
    reverseForEach(this.openDialogs, (dialog) => dialog.close());
  }
  getDialogById(id) {
    return this.openDialogs.find((dialog) => dialog.id === id);
  }
  ngOnDestroy() {
    reverseForEach(this._openDialogsAtThisLevel, (dialog) => {
      if (dialog.config.closeOnDestroy === false) {
        this._removeOpenDialog(dialog, false);
      }
    });
    reverseForEach(this._openDialogsAtThisLevel, (dialog) => dialog.close());
    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
    this._openDialogsAtThisLevel = [];
  }
  _getOverlayConfig(config) {
    const state = new OverlayConfig({
      positionStrategy: config.positionStrategy || createGlobalPositionStrategy().centerHorizontally().centerVertically(),
      scrollStrategy: config.scrollStrategy || this._scrollStrategy(),
      panelClass: config.panelClass,
      hasBackdrop: config.hasBackdrop,
      direction: config.direction,
      minWidth: config.minWidth,
      minHeight: config.minHeight,
      maxWidth: config.maxWidth,
      maxHeight: config.maxHeight,
      width: config.width,
      height: config.height,
      disposeOnNavigation: config.closeOnNavigation,
      disableAnimations: config.disableAnimations
    });
    if (config.backdropClass) {
      state.backdropClass = config.backdropClass;
    }
    return state;
  }
  _attachContainer(overlay, dialogRef, config) {
    const userInjector = config.injector || config.viewContainerRef?.injector;
    const providers = [{
      provide: DialogConfig,
      useValue: config
    }, {
      provide: DialogRef,
      useValue: dialogRef
    }, {
      provide: OverlayRef,
      useValue: overlay
    }];
    let containerType;
    if (config.container) {
      if (typeof config.container === "function") {
        containerType = config.container;
      } else {
        containerType = config.container.type;
        providers.push(...config.container.providers(config));
      }
    } else {
      containerType = CdkDialogContainer;
    }
    const containerPortal = new ComponentPortal(containerType, config.viewContainerRef, Injector.create({
      parent: userInjector || this._injector,
      providers
    }));
    const containerRef = overlay.attach(containerPortal);
    return containerRef.instance;
  }
  _attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config) {
    if (componentOrTemplateRef instanceof TemplateRef) {
      const injector = this._createInjector(config, dialogRef, dialogContainer, void 0);
      let context = {
        $implicit: config.data,
        dialogRef
      };
      if (config.templateContext) {
        context = __spreadValues(__spreadValues({}, context), typeof config.templateContext === "function" ? config.templateContext() : config.templateContext);
      }
      dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, context, injector));
    } else {
      const injector = this._createInjector(config, dialogRef, dialogContainer, this._injector);
      const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
      dialogRef.componentRef = contentRef;
      dialogRef.componentInstance = contentRef.instance;
    }
  }
  _createInjector(config, dialogRef, dialogContainer, fallbackInjector) {
    const userInjector = config.injector || config.viewContainerRef?.injector;
    const providers = [{
      provide: DIALOG_DATA,
      useValue: config.data
    }, {
      provide: DialogRef,
      useValue: dialogRef
    }];
    if (config.providers) {
      if (typeof config.providers === "function") {
        providers.push(...config.providers(dialogRef, config, dialogContainer));
      } else {
        providers.push(...config.providers);
      }
    }
    if (config.direction && (!userInjector || !userInjector.get(Directionality, null, {
      optional: true
    }))) {
      providers.push({
        provide: Directionality,
        useValue: getDirectionality(config.direction)
      });
    }
    return Injector.create({
      parent: userInjector || fallbackInjector,
      providers
    });
  }
  _removeOpenDialog(dialogRef, emitEvent) {
    const index = this.openDialogs.indexOf(dialogRef);
    if (index > -1) {
      this.openDialogs.splice(index, 1);
      if (!this.openDialogs.length) {
        this._ariaHiddenElements.forEach((previousValue, element) => {
          if (previousValue) {
            element.setAttribute("aria-hidden", previousValue);
          } else {
            element.removeAttribute("aria-hidden");
          }
        });
        this._ariaHiddenElements.clear();
        if (emitEvent) {
          this._getAfterAllClosed().next();
        }
      }
    }
  }
  _hideNonDialogContentFromAssistiveTechnology(overlayContainer) {
    if (overlayContainer.parentElement) {
      const siblings = overlayContainer.parentElement.children;
      for (let i = siblings.length - 1; i > -1; i--) {
        const sibling = siblings[i];
        if (sibling !== overlayContainer && sibling.nodeName !== "SCRIPT" && sibling.nodeName !== "STYLE" && !sibling.hasAttribute("aria-live") && !sibling.hasAttribute("popover")) {
          this._ariaHiddenElements.set(sibling, sibling.getAttribute("aria-hidden"));
          sibling.setAttribute("aria-hidden", "true");
        }
      }
    }
  }
  _getAfterAllClosed() {
    const parent = this._parentDialog;
    return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
  }
  static ɵfac = function Dialog_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Dialog)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _Dialog,
    factory: _Dialog.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Dialog, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function reverseForEach(items, callback) {
  let i = items.length;
  while (i--) {
    callback(items[i]);
  }
}
var DialogModule = class _DialogModule {
  static ɵfac = function DialogModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DialogModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _DialogModule,
    imports: [OverlayModule, PortalModule, A11yModule, CdkDialogContainer],
    exports: [PortalModule, CdkDialogContainer]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [Dialog],
    imports: [OverlayModule, PortalModule, A11yModule, PortalModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DialogModule, [{
    type: NgModule,
    args: [{
      imports: [OverlayModule, PortalModule, A11yModule, CdkDialogContainer],
      exports: [PortalModule, CdkDialogContainer],
      providers: [Dialog]
    }]
  }], null, null);
})();

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-dialog.mjs
var defaultOptions = {
  ariaLabel: void 0,
  ariaModal: true,
  attachPositions: [],
  attachTo: null,
  autoFocus: "first-tabbable",
  backdropClass: "bg-transparent",
  closeDelay: 100,
  closeOnBackdropClick: true,
  closeOnOutsidePointerEvents: false,
  disableClose: false,
  hasBackdrop: true,
  panelClass: "",
  positionStrategy: null,
  restoreFocus: true,
  role: "dialog",
  scrollStrategy: null
};
var BRN_DIALOG_DEFAULT_OPTIONS = new InjectionToken("brn-dialog-default-options", {
  providedIn: "root",
  factory: () => defaultOptions
});
function provideBrnDialogDefaultOptions(options) {
  return {
    provide: BRN_DIALOG_DEFAULT_OPTIONS,
    useValue: __spreadValues(__spreadValues({}, defaultOptions), options)
  };
}
function injectBrnDialogDefaultOptions() {
  return inject(BRN_DIALOG_DEFAULT_OPTIONS, {
    optional: true
  }) ?? defaultOptions;
}
var cssClassesToArray = (classes, defaultClass = "") => {
  if (typeof classes === "string") {
    const splitClasses = classes.trim().split(" ");
    if (splitClasses.length === 0) {
      return [defaultClass];
    }
    return splitClasses;
  }
  return classes ?? [];
};
var BrnDialogRef = class {
  _cdkDialogRef;
  _open;
  state;
  dialogId;
  _closing$ = new Subject();
  closing$ = this._closing$.asObservable();
  closed$;
  _previousTimeout;
  get open() {
    return this.state() === "open";
  }
  _options = signal(void 0, ...ngDevMode ? [{
    debugName: "_options"
  }] : []);
  options = this._options.asReadonly();
  constructor(_cdkDialogRef, _open, state, dialogId, _options) {
    this._cdkDialogRef = _cdkDialogRef;
    this._open = _open;
    this.state = state;
    this.dialogId = dialogId;
    if (_options) {
      this._options.set(_options);
    }
    this.closed$ = this._cdkDialogRef.closed.pipe(take(1));
  }
  updateOptions(options) {
    this._options.update((prev) => __spreadValues(__spreadValues({}, prev ?? {}), options));
  }
  close(result, delay = this._options()?.closeDelay ?? 0) {
    if (!this.open || this._options()?.disableClose) return;
    this._closing$.next();
    this._open.set(false);
    if (this._previousTimeout) {
      clearTimeout(this._previousTimeout);
    }
    this._previousTimeout = setTimeout(() => {
      this._cdkDialogRef.close(result);
    }, delay);
  }
  setPanelClass(paneClass) {
    this._cdkDialogRef.config.panelClass = cssClassesToArray(paneClass);
  }
  setOverlayClass(overlayClass) {
    this._cdkDialogRef.config.backdropClass = cssClassesToArray(overlayClass);
  }
  setAriaDescribedBy(ariaDescribedBy) {
    this._cdkDialogRef.config.ariaDescribedBy = ariaDescribedBy;
  }
  setAriaLabelledBy(ariaLabelledBy) {
    this._cdkDialogRef.config.ariaLabelledBy = ariaLabelledBy;
  }
  setAriaLabel(ariaLabel) {
    this._cdkDialogRef.config.ariaLabel = ariaLabel;
  }
  updatePosition() {
    this._cdkDialogRef.overlayRef?.updatePosition();
  }
};
var dialogSequence = 0;
var injectBrnDialogCtx = () => {
  return inject(DIALOG_DATA);
};
var injectBrnDialogContext = (options = {}) => {
  return inject(DIALOG_DATA, options);
};
var BrnDialogService = class _BrnDialogService {
  _overlayCloseDispatcher = inject(OverlayOutsideClickDispatcher);
  _cdkDialog = inject(Dialog);
  _rendererFactory = inject(RendererFactory2);
  _renderer = this._rendererFactory.createRenderer(null, null);
  _positionBuilder = inject(OverlayPositionBuilder);
  _sso = inject(ScrollStrategyOptions);
  _injector = inject(Injector);
  _defaultOptions = injectBrnDialogDefaultOptions();
  open(content, vcr, context, options) {
    if (options?.id && this._cdkDialog.getDialogById(options.id)) {
      throw new Error(`Dialog with ID: ${options.id} already exists`);
    }
    const attachTo = options?.attachTo ?? this._defaultOptions.attachTo;
    const positionStrategy = options?.positionStrategy ?? this._defaultOptions.positionStrategy ?? (attachTo && options?.attachPositions && options?.attachPositions?.length > 0 ? this._positionBuilder?.flexibleConnectedTo(attachTo).withPositions(options.attachPositions ?? []) : this._positionBuilder.global().centerHorizontally().centerVertically());
    let brnDialogRef;
    const effectRefs = [];
    const contextOrData = __spreadProps(__spreadValues({}, context), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      close: (result = void 0) => brnDialogRef.close(result, options?.closeDelay)
    });
    const destroyed$ = new Subject();
    const optionsChanged$ = new Subject();
    const open = signal(true, ...ngDevMode ? [{
      debugName: "open"
    }] : []);
    const state = computed(() => open() ? "open" : "closed", ...ngDevMode ? [{
      debugName: "state"
    }] : []);
    const dialogId = ++dialogSequence;
    const cdkDialogRef = this._cdkDialog.open(content, {
      id: options?.id ?? `brn-dialog-${dialogId}`,
      role: options?.role ?? this._defaultOptions.role,
      viewContainerRef: vcr,
      templateContext: () => ({
        $implicit: contextOrData
      }),
      data: contextOrData,
      hasBackdrop: options?.hasBackdrop ?? this._defaultOptions.hasBackdrop,
      panelClass: cssClassesToArray(options?.panelClass) ?? cssClassesToArray(this._defaultOptions.panelClass),
      backdropClass: cssClassesToArray(options?.backdropClass) ?? cssClassesToArray(this._defaultOptions.backdropClass),
      positionStrategy,
      scrollStrategy: options?.scrollStrategy ?? this._defaultOptions.scrollStrategy ?? this._sso?.block(),
      restoreFocus: options?.restoreFocus ?? this._defaultOptions.restoreFocus,
      disableClose: true,
      autoFocus: options?.autoFocus ?? this._defaultOptions.autoFocus,
      ariaDescribedBy: options?.ariaDescribedBy ?? `brn-dialog-description-${dialogId}`,
      ariaLabelledBy: options?.ariaLabelledBy ?? `brn-dialog-title-${dialogId}`,
      ariaLabel: options?.ariaLabel ?? this._defaultOptions.ariaLabel,
      ariaModal: options?.ariaModal ?? this._defaultOptions.ariaModal,
      providers: (cdkDialogRef2) => {
        brnDialogRef = new BrnDialogRef(cdkDialogRef2, open, state, dialogId, options);
        runInInjectionContext(this._injector, () => {
          const ref = effect(() => {
            if (overlay) {
              this._renderer.setAttribute(overlay, "data-state", state());
            }
            if (backdrop) {
              this._renderer.setAttribute(backdrop, "data-state", state());
            }
          }, ...ngDevMode ? [{
            debugName: "ref"
          }] : []);
          effectRefs.push(ref);
        });
        const providers = [{
          provide: BrnDialogRef,
          useValue: brnDialogRef
        }];
        if (options?.providers) {
          if (typeof options.providers === "function") {
            providers.push(...options.providers());
          }
          if (Array.isArray(options.providers)) {
            providers.push(...options.providers);
          }
        }
        return providers;
      }
    });
    const overlay = cdkDialogRef.overlayRef.overlayElement;
    const backdrop = cdkDialogRef.overlayRef.backdropElement;
    runInInjectionContext(this._injector, () => {
      const optionChangeEffect = effect(() => {
        const options2 = brnDialogRef.options();
        optionsChanged$.next();
        const closeOnOutsidePointerEvents = options2?.closeOnOutsidePointerEvents ?? this._defaultOptions.closeOnOutsidePointerEvents;
        if (closeOnOutsidePointerEvents) {
          cdkDialogRef.outsidePointerEvents.pipe(takeUntil(merge(destroyed$, optionsChanged$))).subscribe(() => {
            const overlays = this._overlayCloseDispatcher._attachedOverlays;
            const index = overlays.indexOf(cdkDialogRef.overlayRef);
            if (index === overlays.length - 1 || overlays.length > 1 && !this.isNested(cdkDialogRef.overlayRef, overlays.at(-1))) {
              brnDialogRef.close(void 0, options2?.closeDelay);
            }
          });
        }
        const closeOnBackdropClick = options2?.closeOnBackdropClick ?? this._defaultOptions.closeOnBackdropClick;
        if (closeOnBackdropClick) {
          cdkDialogRef.backdropClick.pipe(takeUntil(merge(destroyed$, optionsChanged$))).subscribe(() => {
            brnDialogRef.close(void 0, options2?.closeDelay);
          });
        }
        const disableClose = options2?.disableClose ?? this._defaultOptions.disableClose;
        if (!disableClose) {
          cdkDialogRef.keydownEvents.pipe(filter((e) => e.key === "Escape"), takeUntil(merge(destroyed$, optionsChanged$))).subscribe(() => {
            brnDialogRef.close(void 0, options2?.closeDelay);
          });
        }
      }, ...ngDevMode ? [{
        debugName: "optionChangeEffect"
      }] : []);
      effectRefs.push(optionChangeEffect);
    });
    cdkDialogRef.closed.pipe(takeUntil(destroyed$)).subscribe(() => {
      effectRefs.forEach((a) => a.destroy());
      destroyed$.next();
      optionsChanged$.next();
    });
    if ("_changeDetectorRef" in cdkDialogRef.containerInstance) {
      const containerInstance = cdkDialogRef.containerInstance;
      containerInstance._changeDetectorRef.detectChanges();
    }
    return brnDialogRef;
  }
  isNested(parent, child) {
    const childOrigin = child.getConfig().positionStrategy._origin;
    if (!childOrigin) {
      return false;
    } else if ("width" in childOrigin && "height" in childOrigin) {
      const rect = parent.hostElement.getBoundingClientRect();
      return childOrigin.x >= rect.left && childOrigin.x <= rect.right && childOrigin.y >= rect.top && childOrigin.y <= rect.bottom;
    } else {
      const element = childOrigin.nativeElement || childOrigin;
      return parent.hostElement.contains(element);
    }
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogService)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _BrnDialogService,
    factory: _BrnDialogService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var BrnDialog = class _BrnDialog {
  _dialogService = inject(BrnDialogService);
  _destroyRef = inject(DestroyRef);
  _vcr = inject(ViewContainerRef);
  positionBuilder = inject(OverlayPositionBuilder);
  ssos = inject(ScrollStrategyOptions);
  _injector = inject(Injector);
  _defaultOptions = injectBrnDialogDefaultOptions();
  _context = {};
  stateComputed = computed(() => this._dialogRef()?.state() ?? "closed", ...ngDevMode ? [{
    debugName: "stateComputed"
  }] : []);
  _contentTemplate;
  _dialogRef = signal(void 0, ...ngDevMode ? [{
    debugName: "_dialogRef"
  }] : []);
  _dialogStateEffectRefs = [];
  _backdropClass = signal(null, ...ngDevMode ? [{
    debugName: "_backdropClass"
  }] : []);
  _panelClass = signal(null, ...ngDevMode ? [{
    debugName: "_panelClass"
  }] : []);
  closed = output();
  stateChanged = output();
  state = input(null, ...ngDevMode ? [{
    debugName: "state"
  }] : []);
  role = input(this._defaultOptions.role, ...ngDevMode ? [{
    debugName: "role"
  }] : []);
  hasBackdrop = input(this._defaultOptions.hasBackdrop, ...ngDevMode ? [{
    debugName: "hasBackdrop",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  positionStrategy = input(this._defaultOptions.positionStrategy, ...ngDevMode ? [{
    debugName: "positionStrategy"
  }] : []);
  mutablePositionStrategy = linkedSignal(() => this.positionStrategy(), ...ngDevMode ? [{
    debugName: "mutablePositionStrategy"
  }] : []);
  scrollStrategy = input(this._defaultOptions.scrollStrategy, ...ngDevMode ? [{
    debugName: "scrollStrategy"
  }] : []);
  _options = computed(() => {
    const scrollStrategyInput = this.scrollStrategy();
    let scrollStrategy;
    if (scrollStrategyInput === "close") {
      scrollStrategy = this.ssos.close();
    } else if (scrollStrategyInput === "reposition") {
      scrollStrategy = this.ssos.reposition();
    } else {
      scrollStrategy = scrollStrategyInput;
    }
    return {
      role: this.role(),
      hasBackdrop: this.hasBackdrop(),
      positionStrategy: this.mutablePositionStrategy(),
      scrollStrategy,
      restoreFocus: this.restoreFocus(),
      closeOnOutsidePointerEvents: this.mutableCloseOnOutsidePointerEvents(),
      closeOnBackdropClick: this.closeOnBackdropClick(),
      attachTo: this.mutableAttachTo(),
      attachPositions: this.mutableAttachPositions(),
      autoFocus: this.autoFocus(),
      closeDelay: this.closeDelay(),
      disableClose: this.disableClose(),
      backdropClass: this._backdropClass() ?? "",
      panelClass: this._panelClass() ?? "",
      ariaDescribedBy: this._mutableAriaDescribedBy(),
      ariaLabelledBy: this._mutableAriaLabelledBy(),
      ariaLabel: this._mutableAriaLabel(),
      ariaModal: this._mutableAriaModal()
    };
  }, ...ngDevMode ? [{
    debugName: "_options"
  }] : []);
  constructor() {
    effect(() => {
      const state = this.state();
      if (state === "open") {
        untracked(() => this.open());
      }
      if (state === "closed") {
        untracked(() => this.close());
      }
    });
  }
  restoreFocus = input(this._defaultOptions.restoreFocus, ...ngDevMode ? [{
    debugName: "restoreFocus"
  }] : []);
  closeOnOutsidePointerEvents = input(this._defaultOptions.closeOnOutsidePointerEvents, ...ngDevMode ? [{
    debugName: "closeOnOutsidePointerEvents",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  mutableCloseOnOutsidePointerEvents = linkedSignal(() => this.closeOnOutsidePointerEvents(), ...ngDevMode ? [{
    debugName: "mutableCloseOnOutsidePointerEvents"
  }] : []);
  closeOnBackdropClick = input(this._defaultOptions.closeOnBackdropClick, ...ngDevMode ? [{
    debugName: "closeOnBackdropClick",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  attachTo = input(null, ...ngDevMode ? [{
    debugName: "attachTo"
  }] : []);
  mutableAttachTo = linkedSignal(() => this.attachTo(), ...ngDevMode ? [{
    debugName: "mutableAttachTo"
  }] : []);
  attachPositions = input(this._defaultOptions.attachPositions, ...ngDevMode ? [{
    debugName: "attachPositions"
  }] : []);
  mutableAttachPositions = linkedSignal(() => this.attachPositions(), ...ngDevMode ? [{
    debugName: "mutableAttachPositions"
  }] : []);
  autoFocus = input(this._defaultOptions.autoFocus, ...ngDevMode ? [{
    debugName: "autoFocus"
  }] : []);
  closeDelay = input(this._defaultOptions.closeDelay, ...ngDevMode ? [{
    debugName: "closeDelay",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  disableClose = input(this._defaultOptions.disableClose, ...ngDevMode ? [{
    debugName: "disableClose",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  ariaDescribedBy = input(null, ...ngDevMode ? [{
    debugName: "ariaDescribedBy",
    alias: "aria-describedby"
  }] : [{
    alias: "aria-describedby"
  }]);
  _mutableAriaDescribedBy = linkedSignal(() => this.ariaDescribedBy(), ...ngDevMode ? [{
    debugName: "_mutableAriaDescribedBy"
  }] : []);
  ariaLabelledBy = input(null, ...ngDevMode ? [{
    debugName: "ariaLabelledBy",
    alias: "aria-labelledby"
  }] : [{
    alias: "aria-labelledby"
  }]);
  _mutableAriaLabelledBy = linkedSignal(() => this.ariaLabelledBy(), ...ngDevMode ? [{
    debugName: "_mutableAriaLabelledBy"
  }] : []);
  ariaLabel = input(null, ...ngDevMode ? [{
    debugName: "ariaLabel",
    alias: "aria-label"
  }] : [{
    alias: "aria-label"
  }]);
  _mutableAriaLabel = linkedSignal(() => this.ariaLabel(), ...ngDevMode ? [{
    debugName: "_mutableAriaLabel"
  }] : []);
  ariaModal = input(true, ...ngDevMode ? [{
    debugName: "ariaModal",
    alias: "aria-modal",
    transform: booleanAttribute
  }] : [{
    alias: "aria-modal",
    transform: booleanAttribute
  }]);
  _mutableAriaModal = linkedSignal(() => this.ariaModal(), ...ngDevMode ? [{
    debugName: "_mutableAriaModal"
  }] : []);
  open() {
    if (!this._contentTemplate || this._dialogRef()) return;
    this._dialogStateEffectRefs.forEach((ref) => ref.destroy());
    const dialogRef = this._dialogService.open(this._contentTemplate, this._vcr, this._context, this._options());
    this._dialogRef.set(dialogRef);
    runInInjectionContext(this._injector, () => {
      this._dialogStateEffectRefs.push(effect(() => {
        const state = dialogRef.state();
        untracked(() => this.stateChanged.emit(state));
      }), effect(() => dialogRef.updateOptions(this._options())));
    });
    dialogRef.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      this._dialogRef.set(void 0);
      this.closed.emit(result);
    });
  }
  close(result, delay) {
    this._dialogRef()?.close(result, delay ?? this._options().closeDelay);
  }
  registerTemplate(template) {
    this._contentTemplate = template;
  }
  setOverlayClass(overlayClass) {
    this._backdropClass.set(overlayClass);
    this._dialogRef()?.setOverlayClass(overlayClass);
  }
  setPanelClass(panelClass) {
    this._panelClass.set(panelClass ?? "");
    this._dialogRef()?.setPanelClass(panelClass);
  }
  setContext(context) {
    this._context = __spreadValues(__spreadValues({}, this._context), context);
  }
  setAriaDescribedBy(ariaDescribedBy) {
    this._mutableAriaDescribedBy.set(ariaDescribedBy);
    this._dialogRef()?.setAriaDescribedBy(ariaDescribedBy);
  }
  setAriaLabelledBy(ariaLabelledBy) {
    this._mutableAriaLabelledBy.set(ariaLabelledBy);
    this._dialogRef()?.setAriaLabelledBy(ariaLabelledBy);
  }
  setAriaLabel(ariaLabel) {
    this._mutableAriaLabel.set(ariaLabel);
    this._dialogRef()?.setAriaLabel(ariaLabel);
  }
  setAriaModal(ariaModal) {
    this._mutableAriaModal.set(ariaModal);
  }
  updatePosition() {
    this._dialogRef()?.updatePosition();
  }
  /** @nocollapse */
  static ɵfac = function BrnDialog_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialog)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialog,
    selectors: [["", "brnDialog", ""], ["brn-dialog"]],
    inputs: {
      state: [1, "state"],
      role: [1, "role"],
      hasBackdrop: [1, "hasBackdrop"],
      positionStrategy: [1, "positionStrategy"],
      scrollStrategy: [1, "scrollStrategy"],
      restoreFocus: [1, "restoreFocus"],
      closeOnOutsidePointerEvents: [1, "closeOnOutsidePointerEvents"],
      closeOnBackdropClick: [1, "closeOnBackdropClick"],
      attachTo: [1, "attachTo"],
      attachPositions: [1, "attachPositions"],
      autoFocus: [1, "autoFocus"],
      closeDelay: [1, "closeDelay"],
      disableClose: [1, "disableClose"],
      ariaDescribedBy: [1, "aria-describedby", "ariaDescribedBy"],
      ariaLabelledBy: [1, "aria-labelledby", "ariaLabelledBy"],
      ariaLabel: [1, "aria-label", "ariaLabel"],
      ariaModal: [1, "aria-modal", "ariaModal"]
    },
    outputs: {
      closed: "closed",
      stateChanged: "stateChanged"
    },
    exportAs: ["brnDialog"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialog, [{
    type: Directive,
    args: [{
      selector: "[brnDialog],brn-dialog",
      exportAs: "brnDialog"
    }]
  }], () => [], {
    closed: [{
      type: Output,
      args: ["closed"]
    }],
    stateChanged: [{
      type: Output,
      args: ["stateChanged"]
    }],
    state: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "state",
        required: false
      }]
    }],
    role: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "role",
        required: false
      }]
    }],
    hasBackdrop: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hasBackdrop",
        required: false
      }]
    }],
    positionStrategy: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "positionStrategy",
        required: false
      }]
    }],
    scrollStrategy: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "scrollStrategy",
        required: false
      }]
    }],
    restoreFocus: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "restoreFocus",
        required: false
      }]
    }],
    closeOnOutsidePointerEvents: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "closeOnOutsidePointerEvents",
        required: false
      }]
    }],
    closeOnBackdropClick: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "closeOnBackdropClick",
        required: false
      }]
    }],
    attachTo: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "attachTo",
        required: false
      }]
    }],
    attachPositions: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "attachPositions",
        required: false
      }]
    }],
    autoFocus: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "autoFocus",
        required: false
      }]
    }],
    closeDelay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "closeDelay",
        required: false
      }]
    }],
    disableClose: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disableClose",
        required: false
      }]
    }],
    ariaDescribedBy: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "aria-describedby",
        required: false
      }]
    }],
    ariaLabelledBy: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "aria-labelledby",
        required: false
      }]
    }],
    ariaLabel: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "aria-label",
        required: false
      }]
    }],
    ariaModal: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "aria-modal",
        required: false
      }]
    }]
  });
})();
var BrnDialogClose = class _BrnDialogClose {
  _brnDialogRef = inject(BrnDialogRef);
  delay = input(void 0, ...ngDevMode ? [{
    debugName: "delay",
    transform: coerceNumberProperty
  }] : [{
    transform: coerceNumberProperty
  }]);
  close() {
    this._brnDialogRef.close(void 0, this.delay());
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogClose_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogClose)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogClose,
    selectors: [["button", "brnDialogClose", ""]],
    hostBindings: function BrnDialogClose_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function BrnDialogClose_click_HostBindingHandler() {
          return ctx.close();
        });
      }
    },
    inputs: {
      delay: [1, "delay"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogClose, [{
    type: Directive,
    args: [{
      selector: "button[brnDialogClose]",
      host: {
        "(click)": "close()"
      }
    }]
  }], null, {
    delay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "delay",
        required: false
      }]
    }]
  });
})();
var BrnDialogContent = class _BrnDialogContent {
  _brnDialog = inject(BrnDialog, {
    optional: true
  });
  _brnDialogRef = inject(BrnDialogRef, {
    optional: true
  });
  _template = inject(TemplateRef);
  state = computed(() => this._brnDialog?.stateComputed() ?? this._brnDialogRef?.state() ?? "closed", ...ngDevMode ? [{
    debugName: "state"
  }] : []);
  className = input(void 0, ...ngDevMode ? [{
    debugName: "className",
    alias: "class"
  }] : [{
    alias: "class"
  }]);
  context = input(void 0, ...ngDevMode ? [{
    debugName: "context"
  }] : []);
  constructor() {
    if (!this._brnDialog) return;
    this._brnDialog.registerTemplate(this._template);
    effect(() => {
      const context = this.context();
      if (!this._brnDialog || !context) return;
      untracked(() => this._brnDialog?.setContext(context));
    });
    effect(() => {
      if (!this._brnDialog) return;
      const newClass = this.className();
      untracked(() => this._brnDialog?.setPanelClass(newClass));
    });
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogContent)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogContent,
    selectors: [["", "brnDialogContent", ""]],
    inputs: {
      className: [1, "class", "className"],
      context: [1, "context"]
    },
    features: [ɵɵProvidersFeature([provideExposesStateProviderExisting(() => _BrnDialogContent)])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogContent, [{
    type: Directive,
    args: [{
      selector: "[brnDialogContent]",
      providers: [provideExposesStateProviderExisting(() => BrnDialogContent)]
    }]
  }], () => [], {
    className: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "class",
        required: false
      }]
    }],
    context: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "context",
        required: false
      }]
    }]
  });
})();
var BrnDialogDescription = class _BrnDialogDescription {
  _brnDialogRef = inject(BrnDialogRef);
  _id = signal(`brn-dialog-description-${this._brnDialogRef?.dialogId}`, ...ngDevMode ? [{
    debugName: "_id"
  }] : []);
  constructor() {
    effect(() => {
      this._brnDialogRef.setAriaDescribedBy(this._id());
    });
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogDescription_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogDescription)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogDescription,
    selectors: [["", "brnDialogDescription", ""]],
    hostVars: 1,
    hostBindings: function BrnDialogDescription_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵdomProperty("id", ctx._id());
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogDescription, [{
    type: Directive,
    args: [{
      selector: "[brnDialogDescription]",
      host: {
        "[id]": "_id()"
      }
    }]
  }], () => [], null);
})();
var BrnDialogOverlay = class _BrnDialogOverlay {
  _brnDialog = inject(BrnDialog);
  className = input(void 0, ...ngDevMode ? [{
    debugName: "className",
    alias: "class"
  }] : [{
    alias: "class"
  }]);
  constructor() {
    effect(() => {
      if (!this._brnDialog) return;
      const newClass = this.className();
      untracked(() => this._brnDialog.setOverlayClass(newClass));
    });
  }
  setClassToCustomElement(newClass) {
    this._brnDialog.setOverlayClass(newClass);
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogOverlay_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogOverlay)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogOverlay,
    selectors: [["", "brnDialogOverlay", ""], ["brn-dialog-overlay"]],
    inputs: {
      className: [1, "class", "className"]
    },
    features: [ɵɵProvidersFeature([provideCustomClassSettableExisting(() => _BrnDialogOverlay)])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogOverlay, [{
    type: Directive,
    args: [{
      selector: "[brnDialogOverlay],brn-dialog-overlay",
      providers: [provideCustomClassSettableExisting(() => BrnDialogOverlay)]
    }]
  }], () => [], {
    className: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "class",
        required: false
      }]
    }]
  });
})();
var BrnDialogTitle = class _BrnDialogTitle {
  _brnDialogRef = inject(BrnDialogRef);
  _id = signal(`brn-dialog-title-${this._brnDialogRef?.dialogId}`, ...ngDevMode ? [{
    debugName: "_id"
  }] : []);
  constructor() {
    effect(() => {
      this._brnDialogRef.setAriaLabelledBy(this._id());
    });
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogTitle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogTitle)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogTitle,
    selectors: [["", "brnDialogTitle", ""]],
    hostVars: 1,
    hostBindings: function BrnDialogTitle_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵdomProperty("id", ctx._id());
      }
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogTitle, [{
    type: Directive,
    args: [{
      selector: "[brnDialogTitle]",
      host: {
        "[id]": "_id()"
      }
    }]
  }], () => [], null);
})();
var idSequence = 0;
var BrnDialogTrigger = class _BrnDialogTrigger {
  _brnDialog = inject(BrnDialog, {
    optional: true
  });
  _brnDialogRef = inject(BrnDialogRef, {
    optional: true
  });
  id = input(`brn-dialog-trigger-${++idSequence}`, ...ngDevMode ? [{
    debugName: "id"
  }] : []);
  type = input("button", ...ngDevMode ? [{
    debugName: "type"
  }] : []);
  state = computed(() => {
    const dialogFromInput = this.brnDialogTriggerForState();
    if (dialogFromInput) {
      return dialogFromInput.stateComputed();
    }
    if (this._brnDialog) {
      return this._brnDialog.stateComputed();
    }
    if (this._brnDialogRef) {
      return this._brnDialogRef.state();
    }
    return "closed";
  }, ...ngDevMode ? [{
    debugName: "state"
  }] : []);
  dialogId = `brn-dialog-${this._brnDialogRef?.dialogId ?? ++idSequence}`;
  brnDialogTriggerFor = input(void 0, ...ngDevMode ? [{
    debugName: "brnDialogTriggerFor",
    alias: "brnDialogTriggerFor"
  }] : [{
    alias: "brnDialogTriggerFor"
  }]);
  mutableBrnDialogTriggerFor = computed(() => signal(this.brnDialogTriggerFor()), ...ngDevMode ? [{
    debugName: "mutableBrnDialogTriggerFor"
  }] : []);
  brnDialogTriggerForState = computed(() => this.mutableBrnDialogTriggerFor()(), ...ngDevMode ? [{
    debugName: "brnDialogTriggerForState"
  }] : []);
  constructor() {
    effect(() => {
      const brnDialog = this.brnDialogTriggerForState();
      if (!brnDialog) return;
      this._brnDialog = brnDialog;
    });
  }
  open() {
    this._brnDialog?.open();
  }
  /** @nocollapse */
  static ɵfac = function BrnDialogTrigger_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnDialogTrigger)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnDialogTrigger,
    selectors: [["button", "brnDialogTrigger", ""], ["button", "brnDialogTriggerFor", ""]],
    hostAttrs: ["aria-haspopup", "dialog"],
    hostVars: 5,
    hostBindings: function BrnDialogTrigger_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function BrnDialogTrigger_click_HostBindingHandler() {
          return ctx.open();
        });
      }
      if (rf & 2) {
        ɵɵdomProperty("id", ctx.id())("type", ctx.type());
        ɵɵattribute("aria-expanded", ctx.state() === "open" ? "true" : "false")("data-state", ctx.state())("aria-controls", ctx.dialogId);
      }
    },
    inputs: {
      id: [1, "id"],
      type: [1, "type"],
      brnDialogTriggerFor: [1, "brnDialogTriggerFor"]
    },
    exportAs: ["brnDialogTrigger"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnDialogTrigger, [{
    type: Directive,
    args: [{
      selector: "button[brnDialogTrigger],button[brnDialogTriggerFor]",
      exportAs: "brnDialogTrigger",
      host: {
        "[id]": "id()",
        "(click)": "open()",
        "aria-haspopup": "dialog",
        "[attr.aria-expanded]": "state() === 'open' ? 'true': 'false'",
        "[attr.data-state]": "state()",
        "[attr.aria-controls]": "dialogId",
        "[type]": "type()"
      }
    }]
  }], () => [], {
    id: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    type: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "type",
        required: false
      }]
    }],
    brnDialogTriggerFor: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "brnDialogTriggerFor",
        required: false
      }]
    }]
  });
})();
var BrnDialogImports = [BrnDialog, BrnDialogOverlay, BrnDialogTrigger, BrnDialogClose, BrnDialogContent, BrnDialogTitle, BrnDialogDescription];

export {
  defaultOptions,
  provideBrnDialogDefaultOptions,
  injectBrnDialogDefaultOptions,
  cssClassesToArray,
  BrnDialogRef,
  injectBrnDialogCtx,
  injectBrnDialogContext,
  BrnDialogService,
  BrnDialog,
  BrnDialogClose,
  BrnDialogContent,
  BrnDialogDescription,
  BrnDialogOverlay,
  BrnDialogTitle,
  BrnDialogTrigger,
  BrnDialogImports
};
//# sourceMappingURL=chunk-JWTVCFNQ.js.map
