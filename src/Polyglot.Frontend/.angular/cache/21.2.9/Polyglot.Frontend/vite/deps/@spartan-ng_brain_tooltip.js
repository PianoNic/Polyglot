import "./chunk-AAHDPYNC.js";
import {
  ComponentPortal,
  Directionality,
  Overlay,
  OverlayPositionBuilder
} from "./chunk-44GUTAKX.js";
import "./chunk-CPQOJDVT.js";
import {
  takeUntilDestroyed
} from "./chunk-WUHKT4RW.js";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  afterNextRender,
  booleanAttribute,
  input,
  numberAttribute,
  output,
  setClassMetadata,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BATDMF3R.js";
import {
  DOCUMENT,
  DestroyRef,
  InjectionToken,
  Injector,
  Subject,
  computed,
  effect,
  inject,
  linkedSignal,
  map,
  of,
  runInInjectionContext,
  signal,
  switchMap,
  timer,
  ɵɵnamespaceSVG
} from "./chunk-KWSEEMQO.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-tooltip.mjs
function BrnTooltipContent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0._tooltipText());
  }
}
function isTemplateRef(value) {
  return value instanceof TemplateRef;
}
var BrnTooltipStringTemplateOutlet = class _BrnTooltipStringTemplateOutlet {
  _viewContainer = inject(ViewContainerRef);
  _templateRef = inject(TemplateRef);
  _embeddedViewRef = null;
  _context = {};
  _isFirstChange = true;
  _lastOutletWasTemplate = false;
  _lastTemplateRef = null;
  _lastContext;
  brnTooltipStringTemplateOutletContext = input(void 0, ...ngDevMode ? [{
    debugName: "brnTooltipStringTemplateOutletContext"
  }] : []);
  brnTooltipStringTemplateOutlet = input.required(...ngDevMode ? [{
    debugName: "brnTooltipStringTemplateOutlet"
  }] : []);
  _hasContextShapeChanged(context) {
    if (!context) {
      return false;
    }
    const prevCtxKeys = Object.keys(this._lastContext || {});
    const currCtxKeys = Object.keys(context || {});
    if (prevCtxKeys.length === currCtxKeys.length) {
      for (const propName of currCtxKeys) {
        if (!prevCtxKeys.includes(propName)) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }
  _shouldViewBeRecreated(stringTemplateOutlet, stringTemplateOutletContext) {
    const isTemplate = isTemplateRef(stringTemplateOutlet);
    const shouldOutletRecreate = this._isFirstChange || isTemplate !== this._lastOutletWasTemplate || isTemplate && stringTemplateOutlet !== this._lastTemplateRef;
    const shouldContextRecreate = this._hasContextShapeChanged(stringTemplateOutletContext);
    return shouldContextRecreate || shouldOutletRecreate;
  }
  _updateTrackingState(stringTemplateOutlet, stringTemplateOutletContext) {
    const isTemplate = isTemplateRef(stringTemplateOutlet);
    if (this._isFirstChange && !isTemplate) {
      this._isFirstChange = false;
    }
    if (stringTemplateOutletContext !== void 0) {
      this._lastContext = stringTemplateOutletContext;
    }
    this._lastOutletWasTemplate = isTemplate;
    this._lastTemplateRef = isTemplate ? stringTemplateOutlet : null;
  }
  _viewEffect = effect(() => {
    const stringTemplateOutlet = this.brnTooltipStringTemplateOutlet();
    const stringTemplateOutletContext = this.brnTooltipStringTemplateOutletContext();
    if (!this._isFirstChange && isTemplateRef(stringTemplateOutlet)) {
      this._isFirstChange = true;
    }
    if (!isTemplateRef(stringTemplateOutlet)) {
      this._context["$implicit"] = stringTemplateOutlet;
    }
    const recreateView = this._shouldViewBeRecreated(stringTemplateOutlet, stringTemplateOutletContext);
    this._updateTrackingState(stringTemplateOutlet, stringTemplateOutletContext);
    if (recreateView) {
      this._recreateView(stringTemplateOutlet, stringTemplateOutletContext);
    } else {
      this._updateContext(stringTemplateOutlet, stringTemplateOutletContext);
    }
  }, ...ngDevMode ? [{
    debugName: "_viewEffect"
  }] : []);
  _recreateView(outlet, context) {
    this._viewContainer.clear();
    if (isTemplateRef(outlet)) {
      this._embeddedViewRef = this._viewContainer.createEmbeddedView(outlet, context);
    } else {
      this._embeddedViewRef = this._viewContainer.createEmbeddedView(this._templateRef, this._context);
    }
  }
  _updateContext(outlet, context) {
    const newCtx = isTemplateRef(outlet) ? context : this._context;
    let oldCtx = this._embeddedViewRef?.context;
    if (!oldCtx) {
      oldCtx = newCtx;
    } else if (newCtx && typeof newCtx === "object") {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
    this._lastContext = oldCtx;
  }
  static ngTemplateContextGuard(_dir, _ctx) {
    return true;
  }
  ngOnDestroy() {
    this._viewEffect.destroy();
    this._viewContainer.clear();
    this._embeddedViewRef = null;
  }
  /** @nocollapse */
  static ɵfac = function BrnTooltipStringTemplateOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnTooltipStringTemplateOutlet)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnTooltipStringTemplateOutlet,
    selectors: [["", "brnTooltipStringTemplateOutlet", ""]],
    inputs: {
      brnTooltipStringTemplateOutletContext: [1, "brnTooltipStringTemplateOutletContext"],
      brnTooltipStringTemplateOutlet: [1, "brnTooltipStringTemplateOutlet"]
    },
    exportAs: ["brnTooltipStringTemplateOutlet"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnTooltipStringTemplateOutlet, [{
    type: Directive,
    args: [{
      selector: "[brnTooltipStringTemplateOutlet]",
      exportAs: "brnTooltipStringTemplateOutlet"
    }]
  }], null, {
    brnTooltipStringTemplateOutletContext: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "brnTooltipStringTemplateOutletContext",
        required: false
      }]
    }],
    brnTooltipStringTemplateOutlet: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "brnTooltipStringTemplateOutlet",
        required: true
      }]
    }]
  });
})();
var uniqueId = 0;
var BrnTooltipContent = class _BrnTooltipContent {
  id = input(`brn-tooltip-${++uniqueId}`, ...ngDevMode ? [{
    debugName: "id"
  }] : []);
  state = signal("closed", ...ngDevMode ? [{
    debugName: "state"
  }] : []);
  _tooltipClass = signal("", ...ngDevMode ? [{
    debugName: "_tooltipClass"
  }] : []);
  _arrowClass = signal("", ...ngDevMode ? [{
    debugName: "_arrowClass"
  }] : []);
  _svgClass = signal("", ...ngDevMode ? [{
    debugName: "_svgClass"
  }] : []);
  _position = signal("top", ...ngDevMode ? [{
    debugName: "_position"
  }] : []);
  _tooltipText = signal(null, ...ngDevMode ? [{
    debugName: "_tooltipText"
  }] : []);
  setProps(tooltipText, position, tooltipClasses, arrowClasses, svgClasses) {
    if (tooltipText) {
      this._tooltipText.set(tooltipText);
    }
    this._position.set(position);
    this._tooltipClass.set(tooltipClasses);
    this._arrowClass.set(arrowClasses);
    this._svgClass.set(svgClasses);
  }
  /** @nocollapse */
  static ɵfac = function BrnTooltipContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnTooltipContent)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnTooltipContent,
    selectors: [["ng-component"]],
    hostAttrs: ["role", "tooltip"],
    hostVars: 5,
    hostBindings: function BrnTooltipContent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("id", ctx.id())("data-side", ctx._position())("data-state", ctx.state());
        ɵɵclassMap(ctx._tooltipClass());
      }
    },
    inputs: {
      id: [1, "id"]
    },
    decls: 4,
    vars: 5,
    consts: [[4, "brnTooltipStringTemplateOutlet"], ["width", "10", "height", "5", "viewBox", "0 0 30 10", "preserveAspectRatio", "none"], ["points", "0,0 30,0 15,10"]],
    template: function BrnTooltipContent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, BrnTooltipContent_ng_container_0_Template, 2, 1, "ng-container", 0);
        ɵɵelementStart(1, "span");
        ɵɵnamespaceSVG();
        ɵɵelementStart(2, "svg", 1);
        ɵɵelement(3, "polygon", 2);
        ɵɵelementEnd()();
      }
      if (rf & 2) {
        ɵɵproperty("brnTooltipStringTemplateOutlet", ctx._tooltipText());
        ɵɵadvance();
        ɵɵclassMap(ctx._arrowClass());
        ɵɵadvance();
        ɵɵclassMap(ctx._svgClass());
      }
    },
    dependencies: [BrnTooltipStringTemplateOutlet],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnTooltipContent, [{
    type: Component,
    args: [{
      imports: [BrnTooltipStringTemplateOutlet],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class]": "_tooltipClass()",
        "[attr.id]": "id()",
        "[attr.data-side]": "_position()",
        "[attr.data-state]": "state()",
        role: "tooltip"
      },
      template: `
		<ng-container *brnTooltipStringTemplateOutlet="_tooltipText()">{{ _tooltipText() }}</ng-container>

		<span [class]="_arrowClass()">
			<svg [class]="_svgClass()" width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none">
				<polygon points="0,0 30,0 15,10" />
			</svg>
		</span>
	`
    }]
  }], null, {
    id: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }]
  });
})();
var BRN_TOOLTIP_POSITIONS_MAP = {
  top: {
    originX: "center",
    originY: "top",
    overlayX: "center",
    overlayY: "bottom",
    offsetY: -8
  },
  bottom: {
    originX: "center",
    originY: "bottom",
    overlayX: "center",
    overlayY: "top",
    offsetY: 8
  },
  left: {
    originX: "start",
    originY: "center",
    overlayX: "end",
    overlayY: "center",
    offsetX: -8
  },
  right: {
    originX: "end",
    originY: "center",
    overlayX: "start",
    overlayY: "center",
    offsetX: 8
  }
};
var BRN_TOOLTIP_FALLBACK_POSITIONS = {
  top: ["bottom", "right", "left"],
  bottom: ["top", "right", "left"],
  left: ["right", "top", "bottom"],
  right: ["left", "top", "bottom"]
};
function resolveTooltipPosition(pair) {
  for (const [pos, config] of Object.entries(BRN_TOOLTIP_POSITIONS_MAP)) {
    if (pair.originX === config.originX && pair.originY === config.originY && pair.overlayX === config.overlayX && pair.overlayY === config.overlayY) {
      return pos;
    }
  }
  return null;
}
var defaultOptions = {
  showDelay: 150,
  hideDelay: 100,
  svgClasses: "",
  arrowClasses: () => "",
  tooltipContentClasses: ""
};
var BRN_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken("brn-tooltip-default-options", {
  providedIn: "root",
  factory: () => defaultOptions
});
function provideBrnTooltipDefaultOptions(options) {
  return {
    provide: BRN_TOOLTIP_DEFAULT_OPTIONS,
    useValue: __spreadValues(__spreadValues({}, defaultOptions), options)
  };
}
function injectBrnTooltipDefaultOptions() {
  return inject(BRN_TOOLTIP_DEFAULT_OPTIONS, {
    optional: true
  }) ?? defaultOptions;
}
var BrnTooltip = class _BrnTooltip {
  _config = injectBrnTooltipDefaultOptions();
  _destroyRef = inject(DestroyRef);
  _document = inject(DOCUMENT);
  _elementRef = inject(ElementRef);
  _injector = inject(Injector);
  _overlay = inject(Overlay);
  _overlayPositionBuilder = inject(OverlayPositionBuilder);
  _renderer = inject(Renderer2);
  _dir = inject(Directionality);
  _tooltipHovered = false;
  _listenersRefs = [];
  _delaySubject = void 0;
  _componentRef = void 0;
  _overlayRef = void 0;
  _ariaEffectRef = void 0;
  _positionChangeSub = void 0;
  tooltipDisabled = input(false, ...ngDevMode ? [{
    debugName: "tooltipDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]);
  mutableTooltipDisabled = linkedSignal(this.tooltipDisabled, ...ngDevMode ? [{
    debugName: "mutableTooltipDisabled"
  }] : []);
  position = input(this._config.position ?? "top", ...ngDevMode ? [{
    debugName: "position"
  }] : []);
  brnTooltip = input(null, ...ngDevMode ? [{
    debugName: "brnTooltip"
  }] : []);
  showDelay = input(this._config.showDelay, ...ngDevMode ? [{
    debugName: "showDelay",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  hideDelay = input(this._config.hideDelay, ...ngDevMode ? [{
    debugName: "hideDelay",
    transform: numberAttribute
  }] : [{
    transform: numberAttribute
  }]);
  show = output();
  hide = output();
  _tooltipText = computed(() => {
    let tooltipText = this.brnTooltip();
    if (!tooltipText) {
      return "";
    } else if (typeof tooltipText === "string") {
      tooltipText = tooltipText.trim();
    }
    return tooltipText;
  }, ...ngDevMode ? [{
    debugName: "_tooltipText"
  }] : []);
  constructor() {
    afterNextRender(() => {
      this._overlayRef = this._overlay.create({
        direction: this._dir,
        positionStrategy: this._buildPositionStrategy()
      });
      this._dir.change.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
        if (this._overlayRef) {
          this._updatePosition();
          if (this._overlayRef.hasAttached()) {
            this._overlayRef.updatePosition();
          }
        }
      });
      runInInjectionContext(this._injector, () => {
        if (!this._overlayRef) return;
        this._setupDelayMechanism();
        this._cleanupTriggerEvents();
        this._initTriggers();
        this._listenersRefs = [...this._listenersRefs, this._renderer.listen(this._overlayRef.hostElement, "mouseenter", () => this._tooltipHovered = true), this._renderer.listen(this._overlayRef.hostElement, "mouseleave", () => {
          this._tooltipHovered = false;
          this.delay(false, this.hideDelay());
        })];
      });
    });
    this._destroyRef.onDestroy(() => {
      this._clearAriaDescribedBy();
      this._delaySubject?.complete();
      this._cleanupTriggerEvents();
      this._overlayRef?.dispose();
    });
  }
  _updatePosition() {
    const strategy = this._overlayRef?.getConfig().positionStrategy;
    if (strategy) {
      strategy.withPositions(this._getAllPositions());
    }
  }
  _buildPositionStrategy() {
    return this._overlayPositionBuilder.flexibleConnectedTo(this._elementRef).withPositions(this._getAllPositions()).withViewportMargin(8);
  }
  /** Build [preferred, ...fallbacks] position array for viewport-aware auto-flip. */
  _getAllPositions() {
    const preferred = this.position();
    return [preferred, ...BRN_TOOLTIP_FALLBACK_POSITIONS[preferred]].map((pos) => this._getAdjustedPositionFor(pos));
  }
  _getAdjustedPositionFor(pos) {
    const position = BRN_TOOLTIP_POSITIONS_MAP[pos];
    const isLtr = this._dir.value !== "rtl";
    return __spreadProps(__spreadValues({}, position), {
      offsetX: position.offsetX != null ? isLtr ? position.offsetX : -position.offsetX : void 0
    });
  }
  _initTriggers() {
    this._initScrollListener();
    this._initHoverListeners();
  }
  _initHoverListeners() {
    this._listenersRefs = [...this._listenersRefs, this._renderer.listen(this._elementRef.nativeElement, "mouseenter", () => this.delay(true, this.showDelay())), this._renderer.listen(this._elementRef.nativeElement, "mouseleave", () => this.delay(false, this.hideDelay())), this._renderer.listen(this._elementRef.nativeElement, "focus", () => this.delay(true, this.showDelay())), this._renderer.listen(this._elementRef.nativeElement, "blur", () => this.delay(false, this.hideDelay()))];
  }
  _initScrollListener() {
    this._listenersRefs = [...this._listenersRefs, this._renderer.listen(this._document.defaultView, "scroll", () => this._hide())];
  }
  _cleanupTriggerEvents() {
    for (const eventRef of this._listenersRefs) {
      eventRef();
    }
    this._listenersRefs = [];
  }
  delay(isShow, delay = -1) {
    this._delaySubject?.next({
      isShow,
      delay
    });
  }
  _setupDelayMechanism() {
    this._delaySubject?.complete();
    this._delaySubject = new Subject();
    this._delaySubject.pipe(switchMap((config) => config.delay < 0 ? of(config) : timer(config.delay).pipe(map(() => config))), takeUntilDestroyed(this._destroyRef)).subscribe((config) => {
      if (config.isShow) {
        this._show();
      } else {
        this._hide();
      }
    });
  }
  _show() {
    if (this._componentRef || !this._tooltipText() || this.mutableTooltipDisabled()) {
      return;
    }
    const tooltipPortal = new ComponentPortal(BrnTooltipContent);
    this._componentRef = this._overlayRef?.attach(tooltipPortal);
    this._componentRef?.onDestroy(() => {
      this._componentRef = void 0;
    });
    this._componentRef?.instance.state.set("opened");
    this._componentRef?.instance.setProps(this._tooltipText(), this.position(), this._config.tooltipContentClasses, this._config.arrowClasses(this.position()), this._config.svgClasses);
    const strategy = this._overlayRef?.getConfig().positionStrategy;
    if (strategy && this._componentRef) {
      const compRef = this._componentRef;
      this._positionChangeSub = strategy.positionChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((change) => {
        const resolved = resolveTooltipPosition(change.connectionPair);
        if (resolved) {
          compRef.instance.setProps(null, resolved, this._config.tooltipContentClasses, this._config.arrowClasses(resolved), this._config.svgClasses);
        }
      });
    }
    runInInjectionContext(this._injector, () => {
      this._ariaEffectRef = effect(() => {
        const tooltipId = this._componentRef?.instance.id();
        if (tooltipId) {
          this._renderer.setAttribute(this._elementRef.nativeElement, "aria-describedby", tooltipId);
          this._ariaEffectRef?.destroy();
          this._ariaEffectRef = void 0;
        }
      }, ...ngDevMode ? [{
        debugName: "_ariaEffectRef"
      }] : []);
    });
    this.show.emit();
  }
  _hide() {
    if (!this._componentRef || this._tooltipHovered) return;
    this._clearAriaDescribedBy();
    this._positionChangeSub?.unsubscribe();
    this._positionChangeSub = void 0;
    this._renderer.removeAttribute(this._elementRef.nativeElement, "aria-describedby");
    this._componentRef.instance.state.set("closed");
    this.hide.emit();
    this._overlayRef?.detach();
  }
  _clearAriaDescribedBy() {
    if (this._ariaEffectRef) {
      this._ariaEffectRef.destroy();
      this._ariaEffectRef = void 0;
    }
  }
  /** @nocollapse */
  static ɵfac = function BrnTooltip_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnTooltip)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnTooltip,
    selectors: [["", "brnTooltip", ""]],
    inputs: {
      tooltipDisabled: [1, "tooltipDisabled"],
      position: [1, "position"],
      brnTooltip: [1, "brnTooltip"],
      showDelay: [1, "showDelay"],
      hideDelay: [1, "hideDelay"]
    },
    outputs: {
      show: "show",
      hide: "hide"
    },
    exportAs: ["brnTooltip"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnTooltip, [{
    type: Directive,
    args: [{
      selector: "[brnTooltip]",
      exportAs: "brnTooltip"
    }]
  }], () => [], {
    tooltipDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "tooltipDisabled",
        required: false
      }]
    }],
    position: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "position",
        required: false
      }]
    }],
    brnTooltip: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "brnTooltip",
        required: false
      }]
    }],
    showDelay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "showDelay",
        required: false
      }]
    }],
    hideDelay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "hideDelay",
        required: false
      }]
    }],
    show: [{
      type: Output,
      args: ["show"]
    }],
    hide: [{
      type: Output,
      args: ["hide"]
    }]
  });
})();
var BrnTooltipImports = [BrnTooltip, BrnTooltipContent];
export {
  BRN_TOOLTIP_FALLBACK_POSITIONS,
  BrnTooltip,
  BrnTooltipContent,
  BrnTooltipImports,
  defaultOptions,
  injectBrnTooltipDefaultOptions,
  provideBrnTooltipDefaultOptions,
  resolveTooltipPosition
};
//# sourceMappingURL=@spartan-ng_brain_tooltip.js.map
