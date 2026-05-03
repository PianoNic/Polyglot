import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Pipe,
  contentChild,
  setClassMetadata,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefinePipe,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryAdvance
} from "./chunk-BATDMF3R.js";
import {
  computed,
  forwardRef,
  signal
} from "./chunk-KWSEEMQO.js";
import "./chunk-GOMI4DH3.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-avatar.mjs
var _c0 = [[["", "brnAvatarImage", ""]], [["", "brnAvatarFallback", ""]]];
var _c1 = ["[brnAvatarImage]", "[brnAvatarFallback]"];
function BrnAvatar_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function BrnAvatar_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
  }
}
var BrnAvatarImage = class _BrnAvatarImage {
  _loaded = signal(false, ...ngDevMode ? [{
    debugName: "_loaded"
  }] : []);
  _onError() {
    this._loaded.set(false);
  }
  _onLoad() {
    this._loaded.set(true);
  }
  canShow = computed(() => this._loaded(), ...ngDevMode ? [{
    debugName: "canShow"
  }] : []);
  /** @nocollapse */
  static ɵfac = function BrnAvatarImage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnAvatarImage)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnAvatarImage,
    selectors: [["img", "brnAvatarImage", ""]],
    hostBindings: function BrnAvatarImage_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("load", function BrnAvatarImage_load_HostBindingHandler() {
          return ctx._onLoad();
        })("error", function BrnAvatarImage_error_HostBindingHandler() {
          return ctx._onError();
        });
      }
    },
    exportAs: ["avatarImage"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnAvatarImage, [{
    type: Directive,
    args: [{
      selector: "img[brnAvatarImage]",
      exportAs: "avatarImage",
      host: {
        "(load)": "_onLoad()",
        "(error)": "_onError()"
      }
    }]
  }], null, null);
})();
var BrnAvatar = class _BrnAvatar {
  _image = contentChild(BrnAvatarImage, ...ngDevMode ? [{
    debugName: "_image"
  }] : []);
  /** @nocollapse */
  static ɵfac = function BrnAvatar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnAvatar)();
  };
  /** @nocollapse */
  static ɵcmp = ɵɵdefineComponent({
    type: _BrnAvatar,
    selectors: [["brn-avatar"]],
    contentQueries: function BrnAvatar_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx._image, BrnAvatarImage, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    ngContentSelectors: _c1,
    decls: 2,
    vars: 1,
    template: function BrnAvatar_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c0);
        ɵɵconditionalCreate(0, BrnAvatar_Conditional_0_Template, 1, 0)(1, BrnAvatar_Conditional_1_Template, 1, 0);
      }
      if (rf & 2) {
        let tmp_0_0;
        ɵɵconditional(((tmp_0_0 = ctx._image()) == null ? null : tmp_0_0.canShow()) ? 0 : 1);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnAvatar, [{
    type: Component,
    args: [{
      selector: "brn-avatar",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
		@if (_image()?.canShow()) {
			<ng-content select="[brnAvatarImage]" />
		} @else {
			<ng-content select="[brnAvatarFallback]" />
		}
	`
    }]
  }], null, {
    _image: [{
      type: ContentChild,
      args: [forwardRef(() => BrnAvatarImage), {
        isSignal: true
      }]
    }]
  });
})();
var BrnAvatarFallback = class _BrnAvatarFallback {
  /** @nocollapse */
  static ɵfac = function BrnAvatarFallback_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnAvatarFallback)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnAvatarFallback,
    selectors: [["", "brnAvatarFallback", ""]],
    exportAs: ["avatarFallback"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnAvatarFallback, [{
    type: Directive,
    args: [{
      selector: "[brnAvatarFallback]",
      exportAs: "avatarFallback"
    }]
  }], null, null);
})();
function hashString(str) {
  let h;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h || 0) + str.charCodeAt(i) | 0;
  return h || 0;
}
function hashManyTimes(times, str) {
  let h = hashString(str);
  for (let i = 0; i < times; i++) h = hashString(String(h));
  return h;
}
function hexColorFor(str) {
  const hash = str.length <= 2 ? hashManyTimes(5, str) : hashString(str);
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = hash >> i * 8 & 255;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}
var toInitial = (capitalize = true) => (word) => {
  const initial = word.charAt(0);
  return capitalize ? initial.toLocaleUpperCase() : initial;
};
var firstAndLast = (initials) => `${initials[0]}${initials[initials.length - 1]}`;
var InitialsPipe = class _InitialsPipe {
  transform(name, capitalize = true, firstAndLastOnly = true, delimiter = " ") {
    if (!name) return "";
    const initials = name.trim().split(delimiter).filter(Boolean).map(toInitial(capitalize));
    if (firstAndLastOnly && initials.length > 1) return firstAndLast(initials);
    return initials.join("");
  }
  /** @nocollapse */
  static ɵfac = function InitialsPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InitialsPipe)();
  };
  /** @nocollapse */
  static ɵpipe = ɵɵdefinePipe({
    name: "initials",
    type: _InitialsPipe,
    pure: true
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InitialsPipe, [{
    type: Pipe,
    args: [{
      name: "initials"
    }]
  }], null, null);
})();
var isShortHand = (hex) => hex.length === 3;
var cleanup = (hex) => {
  const noHash = hex.replace("#", "").trim().toLowerCase();
  if (!isShortHand(noHash)) return noHash;
  return noHash.split("").map((char) => char + char).join("");
};
var isBright = (hex) => Number.parseInt(cleanup(hex), 16) > 16777215 / 1.25;
var BrnAvatarImports = [BrnAvatar, BrnAvatarFallback, BrnAvatarImage];
export {
  BrnAvatar,
  BrnAvatarFallback,
  BrnAvatarImage,
  BrnAvatarImports,
  InitialsPipe,
  hexColorFor,
  isBright
};
//# sourceMappingURL=@spartan-ng_brain_avatar.js.map
