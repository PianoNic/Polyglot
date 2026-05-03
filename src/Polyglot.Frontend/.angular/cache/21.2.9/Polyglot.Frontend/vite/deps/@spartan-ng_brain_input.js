import {
  BrnFieldControl,
  provideBrnLabelable
} from "./chunk-G6HJXT4C.js";
import "./chunk-CPQOJDVT.js";
import {
  Directive,
  Input,
  input,
  setClassMetadata,
  ɵɵHostDirectivesFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵdefineDirective,
  ɵɵdomProperty
} from "./chunk-BATDMF3R.js";
import {
  inject
} from "./chunk-KWSEEMQO.js";
import "./chunk-GOMI4DH3.js";

// node_modules/@spartan-ng/brain/fesm2022/spartan-ng-brain-input.mjs
var BrnInput = class _BrnInput {
  static _id = 0;
  _fieldControl = inject(BrnFieldControl, {
    optional: true
  });
  /** The id of the input. */
  id = input(`brn-input-${++_BrnInput._id}`, ...ngDevMode ? [{
    debugName: "id"
  }] : []);
  labelableId = this.id;
  _ariaInvalid = this._fieldControl?.invalid;
  _touched = this._fieldControl?.touched;
  _dirty = this._fieldControl?.dirty;
  _spartanInvalid = this._fieldControl?.spartanInvalid;
  /** @nocollapse */
  static ɵfac = function BrnInput_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrnInput)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _BrnInput,
    selectors: [["", "brnInput", ""]],
    hostVars: 6,
    hostBindings: function BrnInput_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵdomProperty("id", ctx.id());
        ɵɵattribute("aria-invalid", (ctx._ariaInvalid == null ? null : ctx._ariaInvalid()) ? "true" : null)("data-invalid", (ctx._ariaInvalid == null ? null : ctx._ariaInvalid()) ? "true" : null)("data-touched", (ctx._touched == null ? null : ctx._touched()) ? "true" : null)("data-dirty", (ctx._dirty == null ? null : ctx._dirty()) ? "true" : null)("data-matches-spartan-invalid", (ctx._spartanInvalid == null ? null : ctx._spartanInvalid()) ? "true" : null);
      }
    },
    inputs: {
      id: [1, "id"]
    },
    features: [ɵɵProvidersFeature([provideBrnLabelable(_BrnInput)]), ɵɵHostDirectivesFeature([BrnFieldControl])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrnInput, [{
    type: Directive,
    args: [{
      selector: "[brnInput]",
      providers: [provideBrnLabelable(BrnInput)],
      hostDirectives: [BrnFieldControl],
      host: {
        "[id]": "id()",
        "[attr.aria-invalid]": '_ariaInvalid?.() ? "true" : null',
        "[attr.data-invalid]": '_ariaInvalid?.() ? "true" : null',
        "[attr.data-touched]": '_touched?.() ? "true" : null',
        "[attr.data-dirty]": '_dirty?.() ? "true" : null',
        "[attr.data-matches-spartan-invalid]": '_spartanInvalid?.() ? "true" : null'
      }
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
var BrnInputImports = [BrnInput];
export {
  BrnInput,
  BrnInputImports
};
//# sourceMappingURL=@spartan-ng_brain_input.js.map
