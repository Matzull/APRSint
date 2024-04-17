var o0 = Object.create;
var Oa = Object.defineProperty;
var a0 = Object.getOwnPropertyDescriptor;
var s0 = Object.getOwnPropertyNames;
var f0 = Object.getPrototypeOf, l0 = Object.prototype.hasOwnProperty;
var u0 =
  (e =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
      ? new Proxy(e, { get: (t, r) => (typeof require < "u" ? require : t)[r] })
      : e)(function(e) {
      if (typeof require < "u") return require.apply(this, arguments);
      throw Error("Dynamic require of \"" + e + "\" is not supported");
    });
var mr = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  c0 = (e, t) => {
    for (var r in t) Oa(e, r, { get: t[r], enumerable: !0 });
  },
  d0 = (e, t, r, n) => {
    if (t && typeof t == "object" || typeof t == "function") {
      for (let i of s0(t)) {
        !l0.call(e, i) && i !== r
          && Oa(e, i, {
            get: () => t[i],
            enumerable: !(n = a0(t, i)) || n.enumerable,
          });
      }
    }
    return e;
  };
var nu = (
  e,
  t,
  r,
) => (r = e != null ? o0(f0(e)) : {},
  d0(
    t || !e || !e.__esModule
      ? Oa(r, "default", { value: e, enumerable: !0 })
      : r,
    e,
  ));
var Xc = mr((ns, is) => {
  (function(e, t) {
    typeof ns == "object" && typeof is < "u"
      ? is.exports = t()
      : typeof define == "function" && define.amd
      ? define(t)
      : e.createREGL = t();
  })(ns, function() {
    "use strict";
    var e = function(f) {
        return f instanceof Uint8Array || f instanceof Uint16Array
          || f instanceof Uint32Array || f instanceof Int8Array
          || f instanceof Int16Array || f instanceof Int32Array
          || f instanceof Float32Array || f instanceof Float64Array
          || f instanceof Uint8ClampedArray;
      },
      t = function(f, h) {
        for (var _ = Object.keys(h), M = 0; M < _.length; ++M) {
          f[_[M]] = h[_[M]];
        }
        return f;
      },
      r = `
`;
    function n(f) {
      return typeof atob < "u" ? atob(f) : "base64:" + f;
    }
    function i(f) {
      var h = new Error("(regl) " + f);
      throw console.error(h), h;
    }
    function o(f, h) {
      f || i(h);
    }
    function s(f) {
      return f ? ": " + f : "";
    }
    function a(f, h, _) {
      f in h
        || i(
          "unknown parameter (" + f + ")" + s(_) + ". possible values: "
            + Object.keys(h).join(),
        );
    }
    function l(f, h) {
      e(f) || i("invalid parameter type" + s(h) + ". must be a typed array");
    }
    function u(f, h) {
      switch (h) {
        case "number":
          return typeof f == "number";
        case "object":
          return typeof f == "object";
        case "string":
          return typeof f == "string";
        case "boolean":
          return typeof f == "boolean";
        case "function":
          return typeof f == "function";
        case "undefined":
          return typeof f > "u";
        case "symbol":
          return typeof f == "symbol";
      }
    }
    function d(f, h, _) {
      u(f, h)
        || i(
          "invalid parameter type" + s(_) + ". expected " + h + ", got "
            + typeof f,
        );
    }
    function g(f, h) {
      f >= 0 && (f | 0) === f
        || i(
          "invalid parameter type, (" + f + ")" + s(h)
            + ". must be a nonnegative integer",
        );
    }
    function w(f, h, _) {
      h.indexOf(f) < 0 && i("invalid value" + s(_) + ". must be one of: " + h);
    }
    var C = [
      "gl",
      "canvas",
      "container",
      "attributes",
      "pixelRatio",
      "extensions",
      "optionalExtensions",
      "profile",
      "onDone",
    ];
    function Y(f) {
      Object.keys(f).forEach(function(h) {
        C.indexOf(h) < 0
          && i(
            "invalid regl constructor argument \"" + h + "\". must be one of "
              + C,
          );
      });
    }
    function me(f, h) {
      for (f = f + ""; f.length < h;) f = " " + f;
      return f;
    }
    function ce() {
      this.name = "unknown",
        this.lines = [],
        this.index = {},
        this.hasErrors = !1;
    }
    function ie(f, h) {
      this.number = f, this.line = h, this.errors = [];
    }
    function Le(f, h, _) {
      this.file = f, this.line = h, this.message = _;
    }
    function _e() {
      var f = new Error(),
        h = (f.stack || f).toString(),
        _ = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(h);
      if (_) return _[1];
      var M = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(h);
      return M ? M[1] : "unknown";
    }
    function Re() {
      var f = new Error(),
        h = (f.stack || f).toString(),
        _ = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(h);
      if (_) return _[1];
      var M = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(h);
      return M ? M[1] : "unknown";
    }
    function Me(f, h) {
      var _ = f.split(`
`),
        M = 1,
        j = 0,
        N = { unknown: new ce(), 0: new ce() };
      N.unknown.name = N[0].name = h || _e(),
        N.unknown.lines.push(new ie(0, ""));
      for (var G = 0; G < _.length; ++G) {
        var Z = _[G], W = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(Z);
        if (W) {
          switch (W[1]) {
            case "line":
              var te = /(\d+)(\s+\d+)?/.exec(W[2]);
              te
                && (M = te[1] | 0,
                  te[2] && (j = te[2] | 0, j in N || (N[j] = new ce())));
              break;
            case "define":
              var ne = /SHADER_NAME(_B64)?\s+(.*)$/.exec(W[2]);
              ne && (N[j].name = ne[1] ? n(ne[2]) : ne[2]);
              break;
          }
        }
        N[j].lines.push(new ie(M++, Z));
      }
      return Object.keys(N).forEach(function(re) {
        var ae = N[re];
        ae.lines.forEach(function(Q) {
          ae.index[Q.number] = Q;
        });
      }),
        N;
    }
    function qe(f) {
      var h = [];
      return f.split(`
`).forEach(function(_) {
        if (!(_.length < 5)) {
          var M = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(_);
          M
            ? h.push(new Le(M[1] | 0, M[2] | 0, M[3].trim()))
            : _.length > 0 && h.push(new Le("unknown", 0, _));
        }
      }),
        h;
    }
    function We(f, h) {
      h.forEach(function(_) {
        var M = f[_.file];
        if (M) {
          var j = M.index[_.line];
          if (j) {
            j.errors.push(_), M.hasErrors = !0;
            return;
          }
        }
        f.unknown.hasErrors = !0, f.unknown.lines[0].errors.push(_);
      });
    }
    function rt(f, h, _, M, j) {
      if (!f.getShaderParameter(h, f.COMPILE_STATUS)) {
        var N = f.getShaderInfoLog(h),
          G = M === f.FRAGMENT_SHADER ? "fragment" : "vertex";
        Te(_, "string", G + " shader source must be a string", j);
        var Z = Me(_, j), W = qe(N);
        We(Z, W),
          Object.keys(Z).forEach(function(te) {
            var ne = Z[te];
            if (!ne.hasErrors) return;
            var re = [""], ae = [""];
            function Q(ee, L) {
              re.push(ee), ae.push(L || "");
            }
            Q(
              "file number " + te + ": " + ne.name + `
`,
              "color:red;text-decoration:underline;font-weight:bold",
            ),
              ne.lines.forEach(function(ee) {
                if (ee.errors.length > 0) {
                  Q(
                    me(ee.number, 4) + "|  ",
                    "background-color:yellow; font-weight:bold",
                  ),
                    Q(
                      ee.line + r,
                      "color:red; background-color:yellow; font-weight:bold",
                    );
                  var L = 0;
                  ee.errors.forEach(function(O) {
                    var J = O.message, ge = /^\s*'(.*)'\s*:\s*(.*)$/.exec(J);
                    if (ge) {
                      var X = ge[1];
                      switch (J = ge[2], X) {
                        case "assign":
                          X = "=";
                          break;
                      }
                      L = Math.max(ee.line.indexOf(X, L), 0);
                    }
                    else L = 0;
                    Q(me("| ", 6)),
                      Q(me("^^^", L + 3) + r, "font-weight:bold"),
                      Q(me("| ", 6)),
                      Q(J + r, "font-weight:bold");
                  }), Q(me("| ", 6) + r);
                }
                else Q(me(ee.number, 4) + "|  "), Q(ee.line + r, "color:red");
              }),
              typeof document < "u" && !window.chrome
                ? (ae[0] = re.join("%c"), console.log.apply(console, ae))
                : console.log(re.join(""));
          }),
          o.raise("Error compiling " + G + " shader, " + Z[0].name);
      }
    }
    function ft(f, h, _, M, j) {
      if (!f.getProgramParameter(h, f.LINK_STATUS)) {
        var N = f.getProgramInfoLog(h),
          G = Me(_, j),
          Z = Me(M, j),
          W = "Error linking program with vertex shader, \"" + Z[0].name
            + "\", and fragment shader \"" + G[0].name + "\"";
        typeof document < "u"
          ? console.log(
            "%c" + W + r + "%c" + N,
            "color:red;text-decoration:underline;font-weight:bold",
            "color:red",
          )
          : console.log(W + r + N), o.raise(W);
      }
    }
    function tt(f) {
      f._commandRef = _e();
    }
    function De(f, h, _, M) {
      tt(f);
      function j(W) {
        return W ? M.id(W) : 0;
      }
      f._fragId = j(f.static.frag), f._vertId = j(f.static.vert);
      function N(W, te) {
        Object.keys(te).forEach(function(ne) {
          W[M.id(ne)] = !0;
        });
      }
      var G = f._uniformSet = {};
      N(G, h.static), N(G, h.dynamic);
      var Z = f._attributeSet = {};
      N(Z, _.static),
        N(Z, _.dynamic),
        f._hasCount = "count" in f.static || "count" in f.dynamic
          || "elements" in f.static || "elements" in f.dynamic;
    }
    function Je(f, h) {
      var _ = Re();
      i(
        f + " in command " + (h || _e())
          + (_ === "unknown" ? "" : " called from " + _),
      );
    }
    function et(f, h, _) {
      f || Je(h, _ || _e());
    }
    function D(f, h, _, M) {
      f in h
        || Je(
          "unknown parameter (" + f + ")" + s(_) + ". possible values: "
            + Object.keys(h).join(),
          M || _e(),
        );
    }
    function Te(f, h, _, M) {
      u(f, h)
        || Je(
          "invalid parameter type" + s(_) + ". expected " + h + ", got "
            + typeof f,
          M || _e(),
        );
    }
    function le(f) {
      f();
    }
    function Pe(f, h, _) {
      f.texture
        ? w(
          f.texture._texture.internalformat,
          h,
          "unsupported texture format for attachment",
        )
        : w(
          f.renderbuffer._renderbuffer.format,
          _,
          "unsupported renderbuffer format for attachment",
        );
    }
    var Ge = 33071,
      Ve = 9728,
      Ze = 9984,
      nt = 9985,
      lt = 9986,
      qt = 9987,
      _t = 5120,
      Ot = 5121,
      Yt = 5122,
      Dt = 5123,
      Wt = 5124,
      Ln = 5125,
      Ks = 5126,
      Js = 32819,
      ef = 32820,
      tf = 33635,
      rf = 34042,
      $d = 36193,
      Gt = {};
    Gt[_t] = Gt[Ot] = 1,
      Gt[Yt] = Gt[Dt] = Gt[$d] = Gt[tf] = Gt[Js] = Gt[ef] = 2,
      Gt[Wt] = Gt[Ln] = Gt[Ks] = Gt[rf] = 4;
    function nf(f, h) {
      return f === ef || f === Js || f === tf ? 2 : f === rf ? 4 : Gt[f] * h;
    }
    function vi(f) {
      return !(f & f - 1) && !!f;
    }
    function jd(f, h, _) {
      var M, j = h.width, N = h.height, G = h.channels;
      o(
        j > 0 && j <= _.maxTextureSize && N > 0 && N <= _.maxTextureSize,
        "invalid texture shape",
      ),
        (f.wrapS !== Ge || f.wrapT !== Ge)
        && o(
          vi(j) && vi(N),
          "incompatible wrap mode for texture, both width and height must be power of 2",
        ),
        h.mipmask === 1
          ? j !== 1 && N !== 1
            && o(
              f.minFilter !== Ze && f.minFilter !== lt && f.minFilter !== nt
                && f.minFilter !== qt,
              "min filter requires mipmap",
            )
          : (o(
            vi(j) && vi(N),
            "texture must be a square power of 2 to support mipmapping",
          ),
            o(h.mipmask === (j << 1) - 1, "missing or incomplete mipmap data")),
        h.type === Ks
        && (_.extensions.indexOf("oes_texture_float_linear") < 0
          && o(
            f.minFilter === Ve && f.magFilter === Ve,
            "filter not supported, must enable oes_texture_float_linear",
          ),
          o(
            !f.genMipmaps,
            "mipmap generation not supported with float textures",
          ));
      var Z = h.images;
      for (M = 0; M < 16; ++M) {
        if (Z[M]) {
          var W = j >> M, te = N >> M;
          o(h.mipmask & 1 << M, "missing mipmap data");
          var ne = Z[M];
          if (
            o(
              ne.width === W && ne.height === te,
              "invalid shape for mip images",
            ),
              o(
                ne.format === h.format && ne.internalformat === h.internalformat
                  && ne.type === h.type,
                "incompatible type for mip image",
              ),
              !ne.compressed
          ) {
            if (ne.data) {
              var re = Math.ceil(nf(ne.type, G) * W / ne.unpackAlignment)
                * ne.unpackAlignment;
              o(
                ne.data.byteLength === re * te,
                "invalid data for image, buffer size is inconsistent with image format",
              );
            }
            else ne.element || ne.copy;
          }
        }
        else f.genMipmaps || o((h.mipmask & 1 << M) === 0, "extra mipmap data");
      }
      h.compressed
        && o(
          !f.genMipmaps,
          "mipmap generation for compressed images not supported",
        );
    }
    function Ud(f, h, _, M) {
      var j = f.width, N = f.height, G = f.channels;
      o(
        j > 0 && j <= M.maxTextureSize && N > 0 && N <= M.maxTextureSize,
        "invalid texture shape",
      ),
        o(j === N, "cube map must be square"),
        o(
          h.wrapS === Ge && h.wrapT === Ge,
          "wrap mode not supported by cube map",
        );
      for (var Z = 0; Z < _.length; ++Z) {
        var W = _[Z];
        o(W.width === j && W.height === N, "inconsistent cube map face shape"),
          h.genMipmaps
          && (o(
            !W.compressed,
            "can not generate mipmap for compressed textures",
          ),
            o(W.mipmask === 1, "can not specify mipmaps and generate mipmaps"));
        for (var te = W.images, ne = 0; ne < 16; ++ne) {
          var re = te[ne];
          if (re) {
            var ae = j >> ne, Q = N >> ne;
            o(W.mipmask & 1 << ne, "missing mipmap data"),
              o(
                re.width === ae && re.height === Q,
                "invalid shape for mip images",
              ),
              o(
                re.format === f.format && re.internalformat === f.internalformat
                  && re.type === f.type,
                "incompatible type for mip image",
              ),
              re.compressed || (re.data
                ? o(
                  re.data.byteLength
                    === ae * Q * Math.max(nf(re.type, G), re.unpackAlignment),
                  "invalid data for image, buffer size is inconsistent with image format",
                )
                : re.element || re.copy);
          }
        }
      }
    }
    var m = t(o, {
        optional: le,
        raise: i,
        commandRaise: Je,
        command: et,
        parameter: a,
        commandParameter: D,
        constructor: Y,
        type: d,
        commandType: Te,
        isTypedArray: l,
        nni: g,
        oneOf: w,
        shaderError: rt,
        linkError: ft,
        callSite: Re,
        saveCommandRef: tt,
        saveDrawInfo: De,
        framebufferFormat: Pe,
        guessCommand: _e,
        texture2D: jd,
        textureCube: Ud,
      }),
      qd = 0,
      Hd = 0,
      Xd = 5,
      Yd = 6;
    function kr(f, h) {
      this.id = qd++, this.type = f, this.data = h;
    }
    function of(f) {
      return f.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
    }
    function Fn(f) {
      if (f.length === 0) return [];
      var h = f.charAt(0), _ = f.charAt(f.length - 1);
      if (f.length > 1 && h === _ && (h === "\"" || h === "'")) {
        return ["\"" + of(f.substr(1, f.length - 2)) + "\""];
      }
      var M = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(f);
      if (M) {
        return Fn(f.substr(0, M.index)).concat(Fn(M[1])).concat(
          Fn(f.substr(M.index + M[0].length)),
        );
      }
      var j = f.split(".");
      if (j.length === 1) return ["\"" + of(f) + "\""];
      for (var N = [], G = 0; G < j.length; ++G) N = N.concat(Fn(j[G]));
      return N;
    }
    function af(f) {
      return "[" + Fn(f).join("][") + "]";
    }
    function Wd(f, h) {
      return new kr(f, af(h + ""));
    }
    function Zd(f) {
      return typeof f == "function" && !f._reglType || f instanceof kr;
    }
    function sf(f, h) {
      if (typeof f == "function") return new kr(Hd, f);
      if (typeof f == "number" || typeof f == "boolean") return new kr(Xd, f);
      if (Array.isArray(f)) {
        return new kr(
          Yd,
          f.map(function(_, M) {
            return sf(_, h + "[" + M + "]");
          }),
        );
      }
      if (f instanceof kr) return f;
      m(!1, "invalid option type in uniform " + h);
    }
    var Bt = {
        DynamicVariable: kr,
        define: Wd,
        isDynamic: Zd,
        unbox: sf,
        accessor: af,
      },
      Bo = {
        next: typeof requestAnimationFrame == "function"
          ? function(f) {
            return requestAnimationFrame(f);
          }
          : function(f) {
            return setTimeout(f, 16);
          },
        cancel: typeof cancelAnimationFrame == "function"
          ? function(f) {
            return cancelAnimationFrame(f);
          }
          : clearTimeout,
      },
      ff = typeof performance < "u" && performance.now
        ? function() {
          return performance.now();
        }
        : function() {
          return +new Date();
        };
    function Qd() {
      var f = { "": 0 }, h = [""];
      return {
        id: function(_) {
          var M = f[_];
          return M || (M = f[_] = h.length, h.push(_), M);
        },
        str: function(_) {
          return h[_];
        },
      };
    }
    function Kd(f, h, _) {
      var M = document.createElement("canvas");
      t(M.style, {
        border: 0,
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }),
        f.appendChild(M),
        f === document.body
        && (M.style.position = "absolute",
          t(f.style, { margin: 0, padding: 0 }));
      function j() {
        var Z = window.innerWidth, W = window.innerHeight;
        if (f !== document.body) {
          var te = M.getBoundingClientRect();
          Z = te.right - te.left, W = te.bottom - te.top;
        }
        M.width = _ * Z, M.height = _ * W;
      }
      var N;
      f !== document.body && typeof ResizeObserver == "function"
        ? (N = new ResizeObserver(function() {
          setTimeout(j);
        }),
          N.observe(f))
        : window.addEventListener("resize", j, !1);
      function G() {
        N ? N.disconnect() : window.removeEventListener("resize", j),
          f.removeChild(M);
      }
      return j(), { canvas: M, onDestroy: G };
    }
    function Jd(f, h) {
      function _(M) {
        try {
          return f.getContext(M, h);
        }
        catch {
          return null;
        }
      }
      return _("webgl") || _("experimental-webgl") || _("webgl-experimental");
    }
    function eh(f) {
      return typeof f.nodeName == "string" && typeof f.appendChild == "function"
        && typeof f.getBoundingClientRect == "function";
    }
    function th(f) {
      return typeof f.drawArrays == "function"
        || typeof f.drawElements == "function";
    }
    function lf(f) {
      return typeof f == "string"
        ? f.split()
        : (m(Array.isArray(f), "invalid extension array"), f);
    }
    function uf(f) {
      return typeof f == "string"
        ? (m(typeof document < "u", "not supported outside of DOM"),
          document.querySelector(f))
        : f;
    }
    function rh(f) {
      var h = f || {},
        _,
        M,
        j,
        N,
        G = {},
        Z = [],
        W = [],
        te = typeof window > "u" ? 1 : window.devicePixelRatio,
        ne = !1,
        re = function(ee) {
          ee && m.raise(ee);
        },
        ae = function() {};
      if (
        typeof h == "string"
          ? (m(
            typeof document < "u",
            "selector queries only supported in DOM enviroments",
          ),
            _ = document.querySelector(h),
            m(_, "invalid query string for element"))
          : typeof h == "object"
          ? eh(h)
            ? _ = h
            : th(h)
            ? (N = h, j = N.canvas)
            : (m.constructor(h),
              "gl" in h
                ? N = h.gl
                : "canvas" in h
                ? j = uf(h.canvas)
                : "container" in h && (M = uf(h.container)),
              "attributes" in h
              && (G = h.attributes,
                m.type(G, "object", "invalid context attributes")),
              "extensions" in h && (Z = lf(h.extensions)),
              "optionalExtensions" in h && (W = lf(h.optionalExtensions)),
              "onDone" in h
              && (m.type(
                h.onDone,
                "function",
                "invalid or missing onDone callback",
              ),
                re = h.onDone),
              "profile" in h && (ne = !!h.profile),
              "pixelRatio" in h
              && (te = +h.pixelRatio, m(te > 0, "invalid pixel ratio")))
          : m.raise("invalid arguments to regl"),
          _ && (_.nodeName.toLowerCase() === "canvas" ? j = _ : M = _),
          !N
      ) {
        if (!j) {
          m(
            typeof document < "u",
            "must manually specify webgl context outside of DOM environments",
          );
          var Q = Kd(M || document.body, re, te);
          if (!Q) return null;
          j = Q.canvas, ae = Q.onDestroy;
        }
        G.premultipliedAlpha === void 0 && (G.premultipliedAlpha = !0),
          N = Jd(j, G);
      }
      return N
        ? {
          gl: N,
          canvas: j,
          container: M,
          extensions: Z,
          optionalExtensions: W,
          pixelRatio: te,
          profile: ne,
          onDone: re,
          onDestroy: ae,
        }
        : (ae(),
          re(
            "webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org",
          ),
          null);
    }
    function nh(f, h) {
      var _ = {};
      function M(G) {
        m.type(G, "string", "extension name must be string");
        var Z = G.toLowerCase(), W;
        try {
          W = _[Z] = f.getExtension(Z);
        }
        catch {}
        return !!W;
      }
      for (var j = 0; j < h.extensions.length; ++j) {
        var N = h.extensions[j];
        if (!M(N)) {
          return h.onDestroy(),
            h.onDone(
              "\"" + N
                + "\" extension is not supported by the current WebGL context, try upgrading your system or a different browser",
            ),
            null;
        }
      }
      return h.optionalExtensions.forEach(M),
        {
          extensions: _,
          restore: function() {
            Object.keys(_).forEach(function(G) {
              if (_[G] && !M(G)) {
                throw new Error("(regl): error restoring extension " + G);
              }
            });
          },
        };
    }
    function Vt(f, h) {
      for (var _ = Array(f), M = 0; M < f; ++M) _[M] = h(M);
      return _;
    }
    var ih = 5120,
      oh = 5121,
      ah = 5122,
      sh = 5123,
      fh = 5124,
      lh = 5125,
      uh = 5126;
    function ch(f) {
      for (var h = 16; h <= 1 << 28; h *= 16) if (f <= h) return h;
      return 0;
    }
    function cf(f) {
      var h, _;
      return h = (f > 65535) << 4,
        f >>>= h,
        _ = (f > 255) << 3,
        f >>>= _,
        h |= _,
        _ = (f > 15) << 2,
        f >>>= _,
        h |= _,
        _ = (f > 3) << 1,
        f >>>= _,
        h |= _,
        h | f >> 1;
    }
    function df() {
      var f = Vt(8, function() {
        return [];
      });
      function h(N) {
        var G = ch(N), Z = f[cf(G) >> 2];
        return Z.length > 0 ? Z.pop() : new ArrayBuffer(G);
      }
      function _(N) {
        f[cf(N.byteLength) >> 2].push(N);
      }
      function M(N, G) {
        var Z = null;
        switch (N) {
          case ih:
            Z = new Int8Array(h(G), 0, G);
            break;
          case oh:
            Z = new Uint8Array(h(G), 0, G);
            break;
          case ah:
            Z = new Int16Array(h(2 * G), 0, G);
            break;
          case sh:
            Z = new Uint16Array(h(2 * G), 0, G);
            break;
          case fh:
            Z = new Int32Array(h(4 * G), 0, G);
            break;
          case lh:
            Z = new Uint32Array(h(4 * G), 0, G);
            break;
          case uh:
            Z = new Float32Array(h(4 * G), 0, G);
            break;
          default:
            return null;
        }
        return Z.length !== G ? Z.subarray(0, G) : Z;
      }
      function j(N) {
        _(N.buffer);
      }
      return { alloc: h, free: _, allocType: M, freeType: j };
    }
    var dt = df();
    dt.zero = df();
    var dh = 3408,
      hh = 3410,
      mh = 3411,
      ph = 3412,
      vh = 3413,
      gh = 3414,
      xh = 3415,
      yh = 33901,
      bh = 33902,
      _h = 3379,
      Sh = 3386,
      wh = 34921,
      Th = 36347,
      Eh = 36348,
      Ah = 35661,
      Ih = 35660,
      Lh = 34930,
      Fh = 36349,
      Ch = 34076,
      Ph = 34024,
      kh = 7936,
      Rh = 7937,
      Nh = 7938,
      Mh = 35724,
      zh = 34047,
      Oh = 36063,
      Dh = 34852,
      gi = 3553,
      hf = 34067,
      Gh = 34069,
      Bh = 33984,
      Cn = 6408,
      Vo = 5126,
      mf = 5121,
      $o = 36160,
      Vh = 36053,
      $h = 36064,
      jh = 16384,
      Uh = function(f, h) {
        var _ = 1;
        h.ext_texture_filter_anisotropic && (_ = f.getParameter(zh));
        var M = 1, j = 1;
        h.webgl_draw_buffers
          && (M = f.getParameter(Dh), j = f.getParameter(Oh));
        var N = !!h.oes_texture_float;
        if (N) {
          var G = f.createTexture();
          f.bindTexture(gi, G), f.texImage2D(gi, 0, Cn, 1, 1, 0, Cn, Vo, null);
          var Z = f.createFramebuffer();
          if (
            f.bindFramebuffer($o, Z),
              f.framebufferTexture2D($o, $h, gi, G, 0),
              f.bindTexture(gi, null),
              f.checkFramebufferStatus($o) !== Vh
          ) {
            N = !1;
          }
          else {
            f.viewport(0, 0, 1, 1), f.clearColor(1, 0, 0, 1), f.clear(jh);
            var W = dt.allocType(Vo, 4);
            f.readPixels(0, 0, 1, 1, Cn, Vo, W),
              f.getError()
                ? N = !1
                : (f.deleteFramebuffer(Z), f.deleteTexture(G), N = W[0] === 1),
              dt.freeType(W);
          }
        }
        var te = typeof navigator < "u"
            && (/MSIE/.test(navigator.userAgent)
              || /Trident\//.test(navigator.appVersion)
              || /Edge/.test(navigator.userAgent)),
          ne = !0;
        if (!te) {
          var re = f.createTexture(), ae = dt.allocType(mf, 36);
          f.activeTexture(Bh),
            f.bindTexture(hf, re),
            f.texImage2D(Gh, 0, Cn, 3, 3, 0, Cn, mf, ae),
            dt.freeType(ae),
            f.bindTexture(hf, null),
            f.deleteTexture(re),
            ne = !f.getError();
        }
        return {
          colorBits: [
            f.getParameter(hh),
            f.getParameter(mh),
            f.getParameter(ph),
            f.getParameter(vh),
          ],
          depthBits: f.getParameter(gh),
          stencilBits: f.getParameter(xh),
          subpixelBits: f.getParameter(dh),
          extensions: Object.keys(h).filter(function(Q) {
            return !!h[Q];
          }),
          maxAnisotropic: _,
          maxDrawbuffers: M,
          maxColorAttachments: j,
          pointSizeDims: f.getParameter(yh),
          lineWidthDims: f.getParameter(bh),
          maxViewportDims: f.getParameter(Sh),
          maxCombinedTextureUnits: f.getParameter(Ah),
          maxCubeMapSize: f.getParameter(Ch),
          maxRenderbufferSize: f.getParameter(Ph),
          maxTextureUnits: f.getParameter(Lh),
          maxTextureSize: f.getParameter(_h),
          maxAttributes: f.getParameter(wh),
          maxVertexUniforms: f.getParameter(Th),
          maxVertexTextureUnits: f.getParameter(Ih),
          maxVaryingVectors: f.getParameter(Eh),
          maxFragmentUniforms: f.getParameter(Fh),
          glsl: f.getParameter(Mh),
          renderer: f.getParameter(Rh),
          vendor: f.getParameter(kh),
          version: f.getParameter(Nh),
          readFloat: N,
          npotTextureCube: ne,
        };
      };
    function Zt(f) {
      return !!f && typeof f == "object" && Array.isArray(f.shape)
        && Array.isArray(f.stride) && typeof f.offset == "number"
        && f.shape.length === f.stride.length
        && (Array.isArray(f.data) || e(f.data));
    }
    var $t = function(f) {
        return Object.keys(f).map(function(h) {
          return f[h];
        });
      },
      xi = { shape: Yh, flatten: Xh };
    function qh(f, h, _) {
      for (var M = 0; M < h; ++M) _[M] = f[M];
    }
    function Hh(f, h, _, M) {
      for (var j = 0, N = 0; N < h; ++N) {
        for (var G = f[N], Z = 0; Z < _; ++Z) M[j++] = G[Z];
      }
    }
    function pf(f, h, _, M, j, N) {
      for (var G = N, Z = 0; Z < h; ++Z) {
        for (var W = f[Z], te = 0; te < _; ++te) {
          for (var ne = W[te], re = 0; re < M; ++re) {
            j[G++] = ne[re];
          }
        }
      }
    }
    function vf(f, h, _, M, j) {
      for (var N = 1, G = _ + 1; G < h.length; ++G) N *= h[G];
      var Z = h[_];
      if (h.length - _ === 4) {
        var W = h[_ + 1], te = h[_ + 2], ne = h[_ + 3];
        for (G = 0; G < Z; ++G) pf(f[G], W, te, ne, M, j), j += N;
      }
      else for (G = 0; G < Z; ++G) vf(f[G], h, _ + 1, M, j), j += N;
    }
    function Xh(f, h, _, M) {
      var j = 1;
      if (h.length) for (var N = 0; N < h.length; ++N) j *= h[N];
      else j = 0;
      var G = M || dt.allocType(_, j);
      switch (h.length) {
        case 0:
          break;
        case 1:
          qh(f, h[0], G);
          break;
        case 2:
          Hh(f, h[0], h[1], G);
          break;
        case 3:
          pf(f, h[0], h[1], h[2], G, 0);
          break;
        default:
          vf(f, h, 0, G, 0);
      }
      return G;
    }
    function Yh(f) {
      for (var h = [], _ = f; _.length; _ = _[0]) h.push(_.length);
      return h;
    }
    var jo = {
        "[object Int8Array]": 5120,
        "[object Int16Array]": 5122,
        "[object Int32Array]": 5124,
        "[object Uint8Array]": 5121,
        "[object Uint8ClampedArray]": 5121,
        "[object Uint16Array]": 5123,
        "[object Uint32Array]": 5125,
        "[object Float32Array]": 5126,
        "[object Float64Array]": 5121,
        "[object ArrayBuffer]": 5121,
      },
      Wh = 5120,
      Zh = 5122,
      Qh = 5124,
      Kh = 5121,
      Jh = 5123,
      em = 5125,
      tm = 5126,
      rm = 5126,
      Rr = {
        int8: Wh,
        int16: Zh,
        int32: Qh,
        uint8: Kh,
        uint16: Jh,
        uint32: em,
        float: tm,
        float32: rm,
      },
      nm = 35048,
      im = 35040,
      yi = { dynamic: nm, stream: im, static: 35044 },
      Uo = xi.flatten,
      gf = xi.shape,
      xf = 35044,
      om = 35040,
      qo = 5121,
      Ho = 5126,
      br = [];
    br[5120] = 1,
      br[5122] = 2,
      br[5124] = 4,
      br[5121] = 1,
      br[5123] = 2,
      br[5125] = 4,
      br[5126] = 4;
    function bi(f) {
      return jo[Object.prototype.toString.call(f)] | 0;
    }
    function yf(f, h) {
      for (var _ = 0; _ < h.length; ++_) f[_] = h[_];
    }
    function bf(f, h, _, M, j, N, G) {
      for (var Z = 0, W = 0; W < _; ++W) {
        for (var te = 0; te < M; ++te) f[Z++] = h[j * W + N * te + G];
      }
    }
    function am(f, h, _, M) {
      var j = 0, N = {};
      function G(L) {
        this.id = j++,
          this.buffer = f.createBuffer(),
          this.type = L,
          this.usage = xf,
          this.byteLength = 0,
          this.dimension = 1,
          this.dtype = qo,
          this.persistentData = null,
          _.profile && (this.stats = { size: 0 });
      }
      G.prototype.bind = function() {
        f.bindBuffer(this.type, this.buffer);
      },
        G.prototype.destroy = function() {
          ae(this);
        };
      var Z = [];
      function W(L, O) {
        var J = Z.pop();
        return J || (J = new G(L)), J.bind(), re(J, O, om, 0, 1, !1), J;
      }
      function te(L) {
        Z.push(L);
      }
      function ne(L, O, J) {
        L.byteLength = O.byteLength, f.bufferData(L.type, O, J);
      }
      function re(L, O, J, ge, X, pe) {
        var de;
        if (L.usage = J, Array.isArray(O)) {
          if (L.dtype = ge || Ho, O.length > 0) {
            var Ae;
            if (Array.isArray(O[0])) {
              de = gf(O);
              for (var U = 1, $ = 1; $ < de.length; ++$) U *= de[$];
              L.dimension = U,
                Ae = Uo(O, de, L.dtype),
                ne(L, Ae, J),
                pe ? L.persistentData = Ae : dt.freeType(Ae);
            }
            else if (typeof O[0] == "number") {
              L.dimension = X;
              var be = dt.allocType(L.dtype, O.length);
              yf(be, O),
                ne(L, be, J),
                pe ? L.persistentData = be : dt.freeType(be);
            }
            else {
              e(O[0])
                ? (L.dimension = O[0].length,
                  L.dtype = ge || bi(O[0]) || Ho,
                  Ae = Uo(O, [O.length, O[0].length], L.dtype),
                  ne(L, Ae, J),
                  pe ? L.persistentData = Ae : dt.freeType(Ae))
                : m.raise("invalid buffer data");
            }
          }
        }
        else if (e(O)) {
          L.dtype = ge || bi(O),
            L.dimension = X,
            ne(L, O, J),
            pe && (L.persistentData = new Uint8Array(new Uint8Array(O.buffer)));
        }
        else if (Zt(O)) {
          de = O.shape;
          var se = O.stride, K = O.offset, fe = 0, ue = 0, ze = 0, Ne = 0;
          de.length === 1
            ? (fe = de[0], ue = 1, ze = se[0], Ne = 0)
            : de.length === 2
            ? (fe = de[0], ue = de[1], ze = se[0], Ne = se[1])
            : m.raise("invalid shape"),
            L.dtype = ge || bi(O.data) || Ho,
            L.dimension = ue;
          var he = dt.allocType(L.dtype, fe * ue);
          bf(he, O.data, fe, ue, ze, Ne, K),
            ne(L, he, J),
            pe ? L.persistentData = he : dt.freeType(he);
        }
        else {
          O instanceof ArrayBuffer
            ? (L.dtype = qo,
              L.dimension = X,
              ne(L, O, J),
              pe && (L.persistentData = new Uint8Array(new Uint8Array(O))))
            : m.raise("invalid buffer data");
        }
      }
      function ae(L) {
        h.bufferCount--, M(L);
        var O = L.buffer;
        m(O, "buffer must not be deleted already"),
          f.deleteBuffer(O),
          L.buffer = null,
          delete N[L.id];
      }
      function Q(L, O, J, ge) {
        h.bufferCount++;
        var X = new G(O);
        N[X.id] = X;
        function pe(U) {
          var $ = xf, be = null, se = 0, K = 0, fe = 1;
          return Array.isArray(U) || e(U) || Zt(U) || U instanceof ArrayBuffer
            ? be = U
            : typeof U == "number"
            ? se = U | 0
            : U
              && (m.type(
                U,
                "object",
                "buffer arguments must be an object, a number or an array",
              ),
                "data" in U
                && (m(
                  be === null || Array.isArray(be) || e(be) || Zt(be),
                  "invalid data for buffer",
                ),
                  be = U.data),
                "usage" in U
                && (m.parameter(U.usage, yi, "invalid buffer usage"),
                  $ = yi[U.usage]),
                "type" in U
                && (m.parameter(U.type, Rr, "invalid buffer type"),
                  K = Rr[U.type]),
                "dimension" in U
                && (m.type(U.dimension, "number", "invalid dimension"),
                  fe = U.dimension | 0),
                "length" in U
                && (m.nni(se, "buffer length must be a nonnegative integer"),
                  se = U.length | 0)),
            X.bind(),
            be
              ? re(X, be, $, K, fe, ge)
              : (se && f.bufferData(X.type, se, $),
                X.dtype = K || qo,
                X.usage = $,
                X.dimension = fe,
                X.byteLength = se),
            _.profile && (X.stats.size = X.byteLength * br[X.dtype]),
            pe;
        }
        function de(U, $) {
          m(
            $ + U.byteLength <= X.byteLength,
            "invalid buffer subdata call, buffer is too small.  Can't write data of size "
              + U.byteLength + " starting from offset " + $
              + " to a buffer of size " + X.byteLength,
          ), f.bufferSubData(X.type, $, U);
        }
        function Ae(U, $) {
          var be = ($ || 0) | 0, se;
          if (X.bind(), e(U) || U instanceof ArrayBuffer) de(U, be);
          else if (Array.isArray(U)) {
            if (U.length > 0) {
              if (typeof U[0] == "number") {
                var K = dt.allocType(X.dtype, U.length);
                yf(K, U), de(K, be), dt.freeType(K);
              }
              else if (Array.isArray(U[0]) || e(U[0])) {
                se = gf(U);
                var fe = Uo(U, se, X.dtype);
                de(fe, be), dt.freeType(fe);
              }
              else m.raise("invalid buffer data");
            }
          }
          else if (Zt(U)) {
            se = U.shape;
            var ue = U.stride, ze = 0, Ne = 0, he = 0, ve = 0;
            se.length === 1
              ? (ze = se[0], Ne = 1, he = ue[0], ve = 0)
              : se.length === 2
              ? (ze = se[0], Ne = se[1], he = ue[0], ve = ue[1])
              : m.raise("invalid shape");
            var Fe = Array.isArray(U.data) ? X.dtype : bi(U.data),
              Oe = dt.allocType(Fe, ze * Ne);
            bf(Oe, U.data, ze, Ne, he, ve, U.offset),
              de(Oe, be),
              dt.freeType(Oe);
          }
          else m.raise("invalid data for buffer subdata");
          return pe;
        }
        return J || pe(L),
          pe._reglType = "buffer",
          pe._buffer = X,
          pe.subdata = Ae,
          _.profile && (pe.stats = X.stats),
          pe.destroy = function() {
            ae(X);
          },
          pe;
      }
      function ee() {
        $t(N).forEach(function(L) {
          L.buffer = f.createBuffer(),
            f.bindBuffer(L.type, L.buffer),
            f.bufferData(L.type, L.persistentData || L.byteLength, L.usage);
        });
      }
      return _.profile && (h.getTotalBufferSize = function() {
        var L = 0;
        return Object.keys(N).forEach(function(O) {
          L += N[O].stats.size;
        }),
          L;
      }),
        {
          create: Q,
          createStream: W,
          destroyStream: te,
          clear: function() {
            $t(N).forEach(ae), Z.forEach(ae);
          },
          getBuffer: function(L) {
            return L && L._buffer instanceof G ? L._buffer : null;
          },
          restore: ee,
          _initBuffer: re,
        };
    }
    var sm = 0,
      fm = 0,
      lm = 1,
      um = 1,
      cm = 4,
      dm = 4,
      _r = {
        points: sm,
        point: fm,
        lines: lm,
        line: um,
        triangles: cm,
        triangle: dm,
        "line loop": 2,
        "line strip": 3,
        "triangle strip": 5,
        "triangle fan": 6,
      },
      hm = 0,
      mm = 1,
      Pn = 4,
      pm = 5120,
      on = 5121,
      _f = 5122,
      an = 5123,
      Sf = 5124,
      Nr = 5125,
      Xo = 34963,
      vm = 35040,
      gm = 35044;
    function xm(f, h, _, M) {
      var j = {}, N = 0, G = { uint8: on, uint16: an };
      h.oes_element_index_uint && (G.uint32 = Nr);
      function Z(ee) {
        this.id = N++,
          j[this.id] = this,
          this.buffer = ee,
          this.primType = Pn,
          this.vertCount = 0,
          this.type = 0;
      }
      Z.prototype.bind = function() {
        this.buffer.bind();
      };
      var W = [];
      function te(ee) {
        var L = W.pop();
        return L || (L = new Z(_.create(null, Xo, !0, !1)._buffer)),
          re(L, ee, vm, -1, -1, 0, 0),
          L;
      }
      function ne(ee) {
        W.push(ee);
      }
      function re(ee, L, O, J, ge, X, pe) {
        ee.buffer.bind();
        var de;
        if (L) {
          var Ae = pe;
          !pe && (!e(L) || Zt(L) && !e(L.data))
          && (Ae = h.oes_element_index_uint ? Nr : an),
            _._initBuffer(ee.buffer, L, O, Ae, 3);
        }
        else {
          f.bufferData(Xo, X, O),
            ee.buffer.dtype = de || on,
            ee.buffer.usage = O,
            ee.buffer.dimension = 3,
            ee.buffer.byteLength = X;
        }
        if (de = pe, !pe) {
          switch (ee.buffer.dtype) {
            case on:
            case pm:
              de = on;
              break;
            case an:
            case _f:
              de = an;
              break;
            case Nr:
            case Sf:
              de = Nr;
              break;
            default:
              m.raise("unsupported type for element array");
          }
          ee.buffer.dtype = de;
        }
        ee.type = de,
          m(
            de !== Nr || !!h.oes_element_index_uint,
            "32 bit element buffers not supported, enable oes_element_index_uint first",
          );
        var U = ge;
        U < 0
        && (U = ee.buffer.byteLength,
          de === an
            ? U >>= 1
            : de === Nr && (U >>= 2)), ee.vertCount = U;
        var $ = J;
        if (J < 0) {
          $ = Pn;
          var be = ee.buffer.dimension;
          be === 1 && ($ = hm), be === 2 && ($ = mm), be === 3 && ($ = Pn);
        }
        ee.primType = $;
      }
      function ae(ee) {
        M.elementsCount--,
          m(ee.buffer !== null, "must not double destroy elements"),
          delete j[ee.id],
          ee.buffer.destroy(),
          ee.buffer = null;
      }
      function Q(ee, L) {
        var O = _.create(null, Xo, !0), J = new Z(O._buffer);
        M.elementsCount++;
        function ge(X) {
          if (!X) O(), J.primType = Pn, J.vertCount = 0, J.type = on;
          else if (typeof X == "number") {
            O(X), J.primType = Pn, J.vertCount = X | 0, J.type = on;
          }
          else {
            var pe = null, de = gm, Ae = -1, U = -1, $ = 0, be = 0;
            Array.isArray(X) || e(X) || Zt(X)
              ? pe = X
              : (m.type(X, "object", "invalid arguments for elements"),
                "data" in X
                && (pe = X.data,
                  m(
                    Array.isArray(pe) || e(pe) || Zt(pe),
                    "invalid data for element buffer",
                  )),
                "usage" in X
                && (m.parameter(X.usage, yi, "invalid element buffer usage"),
                  de = yi[X.usage]),
                "primitive" in X
                && (m.parameter(
                  X.primitive,
                  _r,
                  "invalid element buffer primitive",
                ),
                  Ae = _r[X.primitive]),
                "count" in X
                && (m(
                  typeof X.count == "number" && X.count >= 0,
                  "invalid vertex count for elements",
                ),
                  U = X.count | 0),
                "type" in X
                && (m.parameter(X.type, G, "invalid buffer type"),
                  be = G[X.type]),
                "length" in X
                  ? $ = X.length | 0
                  : ($ = U,
                    be === an || be === _f
                      ? $ *= 2
                      : (be === Nr || be === Sf) && ($ *= 4))),
              re(J, pe, de, Ae, U, $, be);
          }
          return ge;
        }
        return ge(ee),
          ge._reglType = "elements",
          ge._elements = J,
          ge.subdata = function(X, pe) {
            return O.subdata(X, pe), ge;
          },
          ge.destroy = function() {
            ae(J);
          },
          ge;
      }
      return {
        create: Q,
        createStream: te,
        destroyStream: ne,
        getElements: function(ee) {
          return typeof ee == "function" && ee._elements instanceof Z
            ? ee._elements
            : null;
        },
        clear: function() {
          $t(j).forEach(ae);
        },
      };
    }
    var wf = new Float32Array(1), ym = new Uint32Array(wf.buffer), bm = 5123;
    function Tf(f) {
      for (var h = dt.allocType(bm, f.length), _ = 0; _ < f.length; ++_) {
        if (isNaN(f[_])) h[_] = 65535;
        else if (f[_] === 1 / 0) h[_] = 31744;
        else if (f[_] === -1 / 0) h[_] = 64512;
        else {
          wf[0] = f[_];
          var M = ym[0],
            j = M >>> 31 << 15,
            N = (M << 1 >>> 24) - 127,
            G = M >> 13 & 1024 - 1;
          if (N < -24) h[_] = j;
          else if (N < -14) {
            var Z = -14 - N;
            h[_] = j + (G + 1024 >> Z);
          }
          else N > 15 ? h[_] = j + 31744 : h[_] = j + (N + 15 << 10) + G;
        }
      }
      return h;
    }
    function ot(f) {
      return Array.isArray(f) || e(f);
    }
    var Ef = function(f) {
        return !(f & f - 1) && !!f;
      },
      _m = 34467,
      rr = 3553,
      Yo = 34067,
      _i = 34069,
      Mr = 6408,
      Wo = 6406,
      Si = 6407,
      kn = 6409,
      wi = 6410,
      Af = 32854,
      Zo = 32855,
      If = 36194,
      Sm = 32819,
      wm = 32820,
      Tm = 33635,
      Em = 34042,
      Qo = 6402,
      Ti = 34041,
      Ko = 35904,
      Jo = 35906,
      sn = 36193,
      ea = 33776,
      ta = 33777,
      ra = 33778,
      na = 33779,
      Lf = 35986,
      Ff = 35987,
      Cf = 34798,
      Pf = 35840,
      kf = 35841,
      Rf = 35842,
      Nf = 35843,
      Mf = 36196,
      fn = 5121,
      ia = 5123,
      oa = 5125,
      Rn = 5126,
      Am = 10242,
      Im = 10243,
      Lm = 10497,
      aa = 33071,
      Fm = 33648,
      Cm = 10240,
      Pm = 10241,
      sa = 9728,
      km = 9729,
      fa = 9984,
      zf = 9985,
      Of = 9986,
      la = 9987,
      Rm = 33170,
      Ei = 4352,
      Nm = 4353,
      Mm = 4354,
      zm = 34046,
      Om = 3317,
      Dm = 37440,
      Gm = 37441,
      Bm = 37443,
      Df = 37444,
      Nn = 33984,
      Vm = [fa, Of, zf, la],
      Ai = [0, kn, wi, Si, Mr],
      Ht = {};
    Ht[kn] = Ht[Wo] = Ht[Qo] = 1,
      Ht[Ti] = Ht[wi] = 2,
      Ht[Si] = Ht[Ko] = 3,
      Ht[Mr] = Ht[Jo] = 4;
    function ln(f) {
      return "[object " + f + "]";
    }
    var Gf = ln("HTMLCanvasElement"),
      Bf = ln("OffscreenCanvas"),
      Vf = ln("CanvasRenderingContext2D"),
      $f = ln("ImageBitmap"),
      jf = ln("HTMLImageElement"),
      Uf = ln("HTMLVideoElement"),
      $m = Object.keys(jo).concat([Gf, Bf, Vf, $f, jf, Uf]),
      un = [];
    un[fn] = 1, un[Rn] = 4, un[sn] = 2, un[ia] = 2, un[oa] = 4;
    var Tt = [];
    Tt[Af] = 2,
      Tt[Zo] = 2,
      Tt[If] = 2,
      Tt[Ti] = 4,
      Tt[ea] = .5,
      Tt[ta] = .5,
      Tt[ra] = 1,
      Tt[na] = 1,
      Tt[Lf] = .5,
      Tt[Ff] = 1,
      Tt[Cf] = 1,
      Tt[Pf] = .5,
      Tt[kf] = .25,
      Tt[Rf] = .5,
      Tt[Nf] = .25,
      Tt[Mf] = .5;
    function qf(f) {
      return Array.isArray(f) && (f.length === 0 || typeof f[0] == "number");
    }
    function Hf(f) {
      if (!Array.isArray(f)) return !1;
      var h = f.length;
      return !(h === 0 || !ot(f[0]));
    }
    function zr(f) {
      return Object.prototype.toString.call(f);
    }
    function Xf(f) {
      return zr(f) === Gf;
    }
    function Yf(f) {
      return zr(f) === Bf;
    }
    function jm(f) {
      return zr(f) === Vf;
    }
    function Um(f) {
      return zr(f) === $f;
    }
    function qm(f) {
      return zr(f) === jf;
    }
    function Hm(f) {
      return zr(f) === Uf;
    }
    function ua(f) {
      if (!f) return !1;
      var h = zr(f);
      return $m.indexOf(h) >= 0 ? !0 : qf(f) || Hf(f) || Zt(f);
    }
    function Wf(f) {
      return jo[Object.prototype.toString.call(f)] | 0;
    }
    function Xm(f, h) {
      var _ = h.length;
      switch (f.type) {
        case fn:
        case ia:
        case oa:
        case Rn:
          var M = dt.allocType(f.type, _);
          M.set(h), f.data = M;
          break;
        case sn:
          f.data = Tf(h);
          break;
        default:
          m.raise("unsupported texture type, must specify a typed array");
      }
    }
    function Zf(f, h) {
      return dt.allocType(f.type === sn ? Rn : f.type, h);
    }
    function Qf(f, h) {
      f.type === sn ? (f.data = Tf(h), dt.freeType(h)) : f.data = h;
    }
    function Ym(f, h, _, M, j, N) {
      for (
        var G = f.width,
          Z = f.height,
          W = f.channels,
          te = G * Z * W,
          ne = Zf(f, te),
          re = 0,
          ae = 0;
        ae < Z;
        ++ae
      ) {
        for (var Q = 0; Q < G; ++Q) {
          for (var ee = 0; ee < W; ++ee) {
            ne[re++] = h[_ * Q + M * ae + j * ee + N];
          }
        }
      }
      Qf(f, ne);
    }
    function Ii(f, h, _, M, j, N) {
      var G;
      if (
        typeof Tt[f] < "u" ? G = Tt[f] : G = Ht[f] * un[h], N && (G *= 6), j
      ) {
        for (var Z = 0, W = _; W >= 1;) Z += G * W * W, W /= 2;
        return Z;
      }
      else return G * _ * M;
    }
    function Wm(f, h, _, M, j, N, G) {
      var Z = { "don't care": Ei, "dont care": Ei, nice: Mm, fast: Nm },
        W = { repeat: Lm, clamp: aa, mirror: Fm },
        te = { nearest: sa, linear: km },
        ne = t({
          mipmap: la,
          "nearest mipmap nearest": fa,
          "linear mipmap nearest": zf,
          "nearest mipmap linear": Of,
          "linear mipmap linear": la,
        }, te),
        re = { none: 0, browser: Df },
        ae = { uint8: fn, rgba4: Sm, rgb565: Tm, "rgb5 a1": wm },
        Q = {
          alpha: Wo,
          luminance: kn,
          "luminance alpha": wi,
          rgb: Si,
          rgba: Mr,
          rgba4: Af,
          "rgb5 a1": Zo,
          rgb565: If,
        },
        ee = {};
      h.ext_srgb && (Q.srgb = Ko, Q.srgba = Jo),
        h.oes_texture_float && (ae.float32 = ae.float = Rn),
        h.oes_texture_half_float && (ae.float16 = ae["half float"] = sn),
        h.webgl_depth_texture
        && (t(Q, { depth: Qo, "depth stencil": Ti }),
          t(ae, { uint16: ia, uint32: oa, "depth stencil": Em })),
        h.webgl_compressed_texture_s3tc
        && t(ee, {
          "rgb s3tc dxt1": ea,
          "rgba s3tc dxt1": ta,
          "rgba s3tc dxt3": ra,
          "rgba s3tc dxt5": na,
        }),
        h.webgl_compressed_texture_atc
        && t(ee, {
          "rgb atc": Lf,
          "rgba atc explicit alpha": Ff,
          "rgba atc interpolated alpha": Cf,
        }),
        h.webgl_compressed_texture_pvrtc
        && t(ee, {
          "rgb pvrtc 4bppv1": Pf,
          "rgb pvrtc 2bppv1": kf,
          "rgba pvrtc 4bppv1": Rf,
          "rgba pvrtc 2bppv1": Nf,
        }),
        h.webgl_compressed_texture_etc1 && (ee["rgb etc1"] = Mf);
      var L = Array.prototype.slice.call(f.getParameter(_m));
      Object.keys(ee).forEach(function(y) {
        var z = ee[y];
        L.indexOf(z) >= 0 && (Q[y] = z);
      });
      var O = Object.keys(Q);
      _.textureFormats = O;
      var J = [];
      Object.keys(Q).forEach(function(y) {
        var z = Q[y];
        J[z] = y;
      });
      var ge = [];
      Object.keys(ae).forEach(function(y) {
        var z = ae[y];
        ge[z] = y;
      });
      var X = [];
      Object.keys(te).forEach(function(y) {
        var z = te[y];
        X[z] = y;
      });
      var pe = [];
      Object.keys(ne).forEach(function(y) {
        var z = ne[y];
        pe[z] = y;
      });
      var de = [];
      Object.keys(W).forEach(function(y) {
        var z = W[y];
        de[z] = y;
      });
      var Ae = O.reduce(function(y, z) {
        var R = Q[z];
        return R === kn || R === Wo || R === kn || R === wi || R === Qo
            || R === Ti || h.ext_srgb && (R === Ko || R === Jo)
          ? y[R] = R
          : R === Zo || z.indexOf("rgba") >= 0
          ? y[R] = Mr
          : y[R] = Si,
          y;
      }, {});
      function U() {
        this.internalformat = Mr,
          this.format = Mr,
          this.type = fn,
          this.compressed = !1,
          this.premultiplyAlpha = !1,
          this.flipY = !1,
          this.unpackAlignment = 1,
          this.colorSpace = Df,
          this.width = 0,
          this.height = 0,
          this.channels = 0;
      }
      function $(y, z) {
        y.internalformat = z.internalformat,
          y.format = z.format,
          y.type = z.type,
          y.compressed = z.compressed,
          y.premultiplyAlpha = z.premultiplyAlpha,
          y.flipY = z.flipY,
          y.unpackAlignment = z.unpackAlignment,
          y.colorSpace = z.colorSpace,
          y.width = z.width,
          y.height = z.height,
          y.channels = z.channels;
      }
      function be(y, z) {
        if (!(typeof z != "object" || !z)) {
          if (
            "premultiplyAlpha" in z
            && (m.type(
              z.premultiplyAlpha,
              "boolean",
              "invalid premultiplyAlpha",
            ),
              y.premultiplyAlpha = z.premultiplyAlpha),
              "flipY" in z
              && (m.type(z.flipY, "boolean", "invalid texture flip"),
                y.flipY = z.flipY),
              "alignment" in z
              && (m.oneOf(
                z.alignment,
                [1, 2, 4, 8],
                "invalid texture unpack alignment",
              ),
                y.unpackAlignment = z.alignment),
              "colorSpace" in z
              && (m.parameter(z.colorSpace, re, "invalid colorSpace"),
                y.colorSpace = re[z.colorSpace]),
              "type" in z
          ) {
            var R = z.type;
            m(
              h.oes_texture_float || !(R === "float" || R === "float32"),
              "you must enable the OES_texture_float extension in order to use floating point textures.",
            ),
              m(
                h.oes_texture_half_float
                  || !(R === "half float" || R === "float16"),
                "you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.",
              ),
              m(
                h.webgl_depth_texture
                  || !(R === "uint16" || R === "uint32"
                    || R === "depth stencil"),
                "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.",
              ),
              m.parameter(R, ae, "invalid texture type"),
              y.type = ae[R];
          }
          var ye = y.width, $e = y.height, p = y.channels, c = !1;
          "shape" in z
            ? (m(
              Array.isArray(z.shape) && z.shape.length >= 2,
              "shape must be an array",
            ),
              ye = z.shape[0],
              $e = z.shape[1],
              z.shape.length === 3
              && (p = z.shape[2],
                m(p > 0 && p <= 4, "invalid number of channels"),
                c = !0),
              m(ye >= 0 && ye <= _.maxTextureSize, "invalid width"),
              m($e >= 0 && $e <= _.maxTextureSize, "invalid height"))
            : ("radius" in z
              && (ye = $e = z.radius,
                m(ye >= 0 && ye <= _.maxTextureSize, "invalid radius")),
              "width" in z
              && (ye = z.width,
                m(ye >= 0 && ye <= _.maxTextureSize, "invalid width")),
              "height" in z
              && ($e = z.height,
                m($e >= 0 && $e <= _.maxTextureSize, "invalid height")),
              "channels" in z
              && (p = z.channels,
                m(p > 0 && p <= 4, "invalid number of channels"),
                c = !0)),
            y.width = ye | 0,
            y.height = $e | 0,
            y.channels = p | 0;
          var S = !1;
          if ("format" in z) {
            var I = z.format;
            m(
              h.webgl_depth_texture
                || !(I === "depth" || I === "depth stencil"),
              "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.",
            ), m.parameter(I, Q, "invalid texture format");
            var F = y.internalformat = Q[I];
            y.format = Ae[F],
              I in ae && ("type" in z || (y.type = ae[I])),
              I in ee && (y.compressed = !0),
              S = !0;
          }
          !c && S
            ? y.channels = Ht[y.format]
            : c && !S
            ? y.channels !== Ai[y.format]
              && (y.format = y.internalformat = Ai[y.channels])
            : S && c
              && m(
                y.channels === Ht[y.format],
                "number of channels inconsistent with specified format",
              );
        }
      }
      function se(y) {
        f.pixelStorei(Dm, y.flipY),
          f.pixelStorei(Gm, y.premultiplyAlpha),
          f.pixelStorei(Bm, y.colorSpace),
          f.pixelStorei(Om, y.unpackAlignment);
      }
      function K() {
        U.call(this),
          this.xOffset = 0,
          this.yOffset = 0,
          this.data = null,
          this.needsFree = !1,
          this.element = null,
          this.needsCopy = !1;
      }
      function fe(y, z) {
        var R = null;
        if (
          ua(z)
            ? R = z
            : z
              && (m.type(z, "object", "invalid pixel data type"),
                be(y, z),
                "x" in z && (y.xOffset = z.x | 0),
                "y" in z && (y.yOffset = z.y | 0),
                ua(z.data) && (R = z.data)),
            m(
              !y.compressed || R instanceof Uint8Array,
              "compressed texture data must be stored in a uint8array",
            ),
            z.copy
        ) {
          m(!R, "can not specify copy and data field for the same texture");
          var ye = j.viewportWidth, $e = j.viewportHeight;
          y.width = y.width || ye - y.xOffset,
            y.height = y.height || $e - y.yOffset,
            y.needsCopy = !0,
            m(
              y.xOffset >= 0 && y.xOffset < ye && y.yOffset >= 0
                && y.yOffset < $e && y.width > 0 && y.width <= ye
                && y.height > 0 && y.height <= $e,
              "copy texture read out of bounds",
            );
        }
        else if (!R) {
          y.width = y.width || 1,
            y.height = y.height || 1,
            y.channels = y.channels || 4;
        }
        else if (e(R)) {
          y.channels = y.channels || 4,
            y.data = R,
            !("type" in z) && y.type === fn && (y.type = Wf(R));
        }
        else if (qf(R)) {
          y.channels = y.channels || 4,
            Xm(y, R),
            y.alignment = 1,
            y.needsFree = !0;
        }
        else if (Zt(R)) {
          var p = R.data;
          !Array.isArray(p) && y.type === fn && (y.type = Wf(p));
          var c = R.shape, S = R.stride, I, F, E, T, A, v;
          c.length === 3
            ? (E = c[2], v = S[2])
            : (m(c.length === 2, "invalid ndarray pixel data, must be 2 or 3D"),
              E = 1,
              v = 1),
            I = c[0],
            F = c[1],
            T = S[0],
            A = S[1],
            y.alignment = 1,
            y.width = I,
            y.height = F,
            y.channels = E,
            y.format = y.internalformat = Ai[E],
            y.needsFree = !0,
            Ym(y, p, T, A, v, R.offset);
        }
        else if (Xf(R) || Yf(R) || jm(R)) {
          Xf(R) || Yf(R) ? y.element = R : y.element = R.canvas,
            y.width = y.element.width,
            y.height = y.element.height,
            y.channels = 4;
        }
        else if (Um(R)) {y.element = R,
            y.width = R.width,
            y.height = R.height,
            y.channels = 4;}
        else if (qm(R)) {
          y.element = R,
            y.width = R.naturalWidth,
            y.height = R.naturalHeight,
            y.channels = 4;
        }
        else if (Hm(R)) {
          y.element = R,
            y.width = R.videoWidth,
            y.height = R.videoHeight,
            y.channels = 4;
        }
        else if (Hf(R)) {
          var b = y.width || R[0].length,
            x = y.height || R.length,
            k = y.channels;
          ot(R[0][0]) ? k = k || R[0][0].length : k = k || 1;
          for (var P = xi.shape(R), V = 1, q = 0; q < P.length; ++q) V *= P[q];
          var oe = Zf(y, V);
          xi.flatten(R, P, "", oe),
            Qf(y, oe),
            y.alignment = 1,
            y.width = b,
            y.height = x,
            y.channels = k,
            y.format = y.internalformat = Ai[k],
            y.needsFree = !0;
        }
        y.type === Rn
          ? m(
            _.extensions.indexOf("oes_texture_float") >= 0,
            "oes_texture_float extension not enabled",
          )
          : y.type === sn
            && m(
              _.extensions.indexOf("oes_texture_half_float") >= 0,
              "oes_texture_half_float extension not enabled",
            );
      }
      function ue(y, z, R) {
        var ye = y.element,
          $e = y.data,
          p = y.internalformat,
          c = y.format,
          S = y.type,
          I = y.width,
          F = y.height;
        se(y),
          ye
            ? f.texImage2D(z, R, c, c, S, ye)
            : y.compressed
            ? f.compressedTexImage2D(z, R, p, I, F, 0, $e)
            : y.needsCopy
            ? (M(), f.copyTexImage2D(z, R, c, y.xOffset, y.yOffset, I, F, 0))
            : f.texImage2D(z, R, c, I, F, 0, c, S, $e || null);
      }
      function ze(y, z, R, ye, $e) {
        var p = y.element,
          c = y.data,
          S = y.internalformat,
          I = y.format,
          F = y.type,
          E = y.width,
          T = y.height;
        se(y),
          p
            ? f.texSubImage2D(z, $e, R, ye, I, F, p)
            : y.compressed
            ? f.compressedTexSubImage2D(z, $e, R, ye, S, E, T, c)
            : y.needsCopy
            ? (M(),
              f.copyTexSubImage2D(z, $e, R, ye, y.xOffset, y.yOffset, E, T))
            : f.texSubImage2D(z, $e, R, ye, E, T, I, F, c);
      }
      var Ne = [];
      function he() {
        return Ne.pop() || new K();
      }
      function ve(y) {
        y.needsFree && dt.freeType(y.data), K.call(y), Ne.push(y);
      }
      function Fe() {
        U.call(this),
          this.genMipmaps = !1,
          this.mipmapHint = Ei,
          this.mipmask = 0,
          this.images = Array(16);
      }
      function Oe(y, z, R) {
        var ye = y.images[0] = he();
        y.mipmask = 1,
          ye.width = y.width = z,
          ye.height = y.height = R,
          ye.channels = y.channels = 4;
      }
      function je(y, z) {
        var R = null;
        if (ua(z)) R = y.images[0] = he(), $(R, y), fe(R, z), y.mipmask = 1;
        else if (be(y, z), Array.isArray(z.mipmap)) {
          for (var ye = z.mipmap, $e = 0; $e < ye.length; ++$e) {
            R = y.images[$e] = he(),
              $(R, y),
              R.width >>= $e,
              R.height >>= $e,
              fe(R, ye[$e]),
              y.mipmask |= 1 << $e;
          }
        }
        else R = y.images[0] = he(), $(R, y), fe(R, z), y.mipmask = 1;
        $(y, y.images[0]),
          y.compressed
          && (y.internalformat === ea || y.internalformat === ta
            || y.internalformat === ra || y.internalformat === na)
          && m(
            y.width % 4 === 0 && y.height % 4 === 0,
            "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4",
          );
      }
      function at(y, z) {
        for (var R = y.images, ye = 0; ye < R.length; ++ye) {
          if (!R[ye]) return;
          ue(R[ye], z, ye);
        }
      }
      var st = [];
      function He() {
        var y = st.pop() || new Fe();
        U.call(y), y.mipmask = 0;
        for (var z = 0; z < 16; ++z) y.images[z] = null;
        return y;
      }
      function gt(y) {
        for (var z = y.images, R = 0; R < z.length; ++R) {
          z[R] && ve(z[R]), z[R] = null;
        }
        st.push(y);
      }
      function it() {
        this.minFilter = sa,
          this.magFilter = sa,
          this.wrapS = aa,
          this.wrapT = aa,
          this.anisotropic = 1,
          this.genMipmaps = !1,
          this.mipmapHint = Ei;
      }
      function mt(y, z) {
        if ("min" in z) {
          var R = z.min;
          m.parameter(R, ne),
            y.minFilter = ne[R],
            Vm.indexOf(y.minFilter) >= 0 && !("faces" in z)
            && (y.genMipmaps = !0);
        }
        if ("mag" in z) {
          var ye = z.mag;
          m.parameter(ye, te), y.magFilter = te[ye];
        }
        var $e = y.wrapS, p = y.wrapT;
        if ("wrap" in z) {
          var c = z.wrap;
          typeof c == "string" ? (m.parameter(c, W), $e = p = W[c])
          : Array.isArray(c)
            && (m.parameter(c[0], W),
              m.parameter(c[1], W),
              $e = W[c[0]],
              p = W[c[1]]);
        }
        else {
          if ("wrapS" in z) {
            var S = z.wrapS;
            m.parameter(S, W), $e = W[S];
          }
          if ("wrapT" in z) {
            var I = z.wrapT;
            m.parameter(I, W), p = W[I];
          }
        }
        if (y.wrapS = $e, y.wrapT = p, "anisotropic" in z) {
          var F = z.anisotropic;
          m(
            typeof F == "number" && F >= 1 && F <= _.maxAnisotropic,
            "aniso samples must be between 1 and ",
          ), y.anisotropic = z.anisotropic;
        }
        if ("mipmap" in z) {
          var E = !1;
          switch (typeof z.mipmap) {
            case "string":
              m.parameter(z.mipmap, Z, "invalid mipmap hint"),
                y.mipmapHint = Z[z.mipmap],
                y.genMipmaps = !0,
                E = !0;
              break;
            case "boolean":
              E = y.genMipmaps = z.mipmap;
              break;
            case "object":
              m(Array.isArray(z.mipmap), "invalid mipmap type"),
                y.genMipmaps = !1,
                E = !0;
              break;
            default:
              m.raise("invalid mipmap type");
          }
          E && !("min" in z) && (y.minFilter = fa);
        }
      }
      function xt(y, z) {
        f.texParameteri(z, Pm, y.minFilter),
          f.texParameteri(z, Cm, y.magFilter),
          f.texParameteri(z, Am, y.wrapS),
          f.texParameteri(z, Im, y.wrapT),
          h.ext_texture_filter_anisotropic
          && f.texParameteri(z, zm, y.anisotropic),
          y.genMipmaps && (f.hint(Rm, y.mipmapHint), f.generateMipmap(z));
      }
      var yt = 0,
        St = {},
        Et = _.maxTextureUnits,
        ut = Array(Et).map(function() {
          return null;
        });
      function Be(y) {
        U.call(this),
          this.mipmask = 0,
          this.internalformat = Mr,
          this.id = yt++,
          this.refCount = 1,
          this.target = y,
          this.texture = f.createTexture(),
          this.unit = -1,
          this.bindCount = 0,
          this.texInfo = new it(),
          G.profile && (this.stats = { size: 0 });
      }
      function At(y) {
        f.activeTexture(Nn), f.bindTexture(y.target, y.texture);
      }
      function Qe() {
        var y = ut[0];
        y ? f.bindTexture(y.target, y.texture) : f.bindTexture(rr, null);
      }
      function Ie(y) {
        var z = y.texture;
        m(z, "must not double destroy texture");
        var R = y.unit, ye = y.target;
        R >= 0
        && (f.activeTexture(Nn + R), f.bindTexture(ye, null), ut[R] = null),
          f.deleteTexture(z),
          y.texture = null,
          y.params = null,
          y.pixels = null,
          y.refCount = 0,
          delete St[y.id],
          N.textureCount--;
      }
      t(Be.prototype, {
        bind: function() {
          var y = this;
          y.bindCount += 1;
          var z = y.unit;
          if (z < 0) {
            for (var R = 0; R < Et; ++R) {
              var ye = ut[R];
              if (ye) {
                if (ye.bindCount > 0) continue;
                ye.unit = -1;
              }
              ut[R] = y, z = R;
              break;
            }
            z >= Et && m.raise("insufficient number of texture units"),
              G.profile && N.maxTextureUnits < z + 1
              && (N.maxTextureUnits = z + 1),
              y.unit = z,
              f.activeTexture(Nn + z),
              f.bindTexture(y.target, y.texture);
          }
          return z;
        },
        unbind: function() {
          this.bindCount -= 1;
        },
        decRef: function() {
          --this.refCount <= 0 && Ie(this);
        },
      });
      function Ue(y, z) {
        var R = new Be(rr);
        St[R.id] = R, N.textureCount++;
        function ye(c, S) {
          var I = R.texInfo;
          it.call(I);
          var F = He();
          return typeof c == "number"
            ? typeof S == "number" ? Oe(F, c | 0, S | 0) : Oe(F, c | 0, c | 0)
            : c
            ? (m.type(c, "object", "invalid arguments to regl.texture"),
              mt(I, c),
              je(F, c))
            : Oe(F, 1, 1),
            I.genMipmaps && (F.mipmask = (F.width << 1) - 1),
            R.mipmask = F.mipmask,
            $(R, F),
            m.texture2D(I, F, _),
            R.internalformat = F.internalformat,
            ye.width = F.width,
            ye.height = F.height,
            At(R),
            at(F, rr),
            xt(I, rr),
            Qe(),
            gt(F),
            G.profile
            && (R.stats.size = Ii(
              R.internalformat,
              R.type,
              F.width,
              F.height,
              I.genMipmaps,
              !1,
            )),
            ye.format = J[R.internalformat],
            ye.type = ge[R.type],
            ye.mag = X[I.magFilter],
            ye.min = pe[I.minFilter],
            ye.wrapS = de[I.wrapS],
            ye.wrapT = de[I.wrapT],
            ye;
        }
        function $e(c, S, I, F) {
          m(!!c, "must specify image data");
          var E = S | 0, T = I | 0, A = F | 0, v = he();
          return $(v, R),
            v.width = 0,
            v.height = 0,
            fe(v, c),
            v.width = v.width || (R.width >> A) - E,
            v.height = v.height || (R.height >> A) - T,
            m(
              R.type === v.type && R.format === v.format
                && R.internalformat === v.internalformat,
              "incompatible format for texture.subimage",
            ),
            m(
              E >= 0 && T >= 0 && E + v.width <= R.width
                && T + v.height <= R.height,
              "texture.subimage write out of bounds",
            ),
            m(R.mipmask & 1 << A, "missing mipmap data"),
            m(v.data || v.element || v.needsCopy, "missing image data"),
            At(R),
            ze(v, rr, E, T, A),
            Qe(),
            ve(v),
            ye;
        }
        function p(c, S) {
          var I = c | 0, F = S | 0 || I;
          if (I === R.width && F === R.height) return ye;
          ye.width = R.width = I, ye.height = R.height = F, At(R);
          for (var E = 0; R.mipmask >> E; ++E) {
            var T = I >> E, A = F >> E;
            if (!T || !A) break;
            f.texImage2D(rr, E, R.format, T, A, 0, R.format, R.type, null);
          }
          return Qe(),
            G.profile
            && (R.stats.size = Ii(R.internalformat, R.type, I, F, !1, !1)),
            ye;
        }
        return ye(y, z),
          ye.subimage = $e,
          ye.resize = p,
          ye._reglType = "texture2d",
          ye._texture = R,
          G.profile && (ye.stats = R.stats),
          ye.destroy = function() {
            R.decRef();
          },
          ye;
      }
      function Ye(y, z, R, ye, $e, p) {
        var c = new Be(Yo);
        St[c.id] = c, N.cubeCount++;
        var S = new Array(6);
        function I(T, A, v, b, x, k) {
          var P, V = c.texInfo;
          for (it.call(V), P = 0; P < 6; ++P) S[P] = He();
          if (typeof T == "number" || !T) {
            var q = T | 0 || 1;
            for (P = 0; P < 6; ++P) Oe(S[P], q, q);
          }
          else if (typeof T == "object") {
            if (A) {
              je(S[0], T),
                je(S[1], A),
                je(S[2], v),
                je(S[3], b),
                je(S[4], x),
                je(S[5], k);
            }
            else if (mt(V, T), be(c, T), "faces" in T) {
              var oe = T.faces;
              for (
                m(
                  Array.isArray(oe) && oe.length === 6,
                  "cube faces must be a length 6 array",
                ), P = 0;
                P < 6;
                ++P
              ) {
                m(
                  typeof oe[P] == "object" && !!oe[P],
                  "invalid input for cube map face",
                ),
                  $(S[P], c),
                  je(S[P], oe[P]);
              }
            }
            else for (P = 0; P < 6; ++P) je(S[P], T);
          }
          else m.raise("invalid arguments to cube map");
          for (
            $(c, S[0]),
              m.optional(function() {
                _.npotTextureCube
                  || m(
                    Ef(c.width) && Ef(c.height),
                    "your browser does not support non power or two texture dimensions",
                  );
              }),
              V.genMipmaps
                ? c.mipmask = (S[0].width << 1) - 1
                : c.mipmask = S[0].mipmask,
              m.textureCube(c, V, S, _),
              c.internalformat = S[0].internalformat,
              I.width = S[0].width,
              I.height = S[0].height,
              At(c),
              P = 0;
            P < 6;
            ++P
          ) {
            at(S[P], _i + P);
          }
          for (
            xt(V, Yo),
              Qe(),
              G.profile
              && (c.stats.size = Ii(
                c.internalformat,
                c.type,
                I.width,
                I.height,
                V.genMipmaps,
                !0,
              )),
              I.format = J[c.internalformat],
              I.type = ge[c.type],
              I.mag = X[V.magFilter],
              I.min = pe[V.minFilter],
              I.wrapS = de[V.wrapS],
              I.wrapT = de[V.wrapT],
              P = 0;
            P < 6;
            ++P
          ) {
            gt(S[P]);
          }
          return I;
        }
        function F(T, A, v, b, x) {
          m(!!A, "must specify image data"),
            m(
              typeof T == "number" && T === (T | 0) && T >= 0 && T < 6,
              "invalid face",
            );
          var k = v | 0, P = b | 0, V = x | 0, q = he();
          return $(q, c),
            q.width = 0,
            q.height = 0,
            fe(q, A),
            q.width = q.width || (c.width >> V) - k,
            q.height = q.height || (c.height >> V) - P,
            m(
              c.type === q.type && c.format === q.format
                && c.internalformat === q.internalformat,
              "incompatible format for texture.subimage",
            ),
            m(
              k >= 0 && P >= 0 && k + q.width <= c.width
                && P + q.height <= c.height,
              "texture.subimage write out of bounds",
            ),
            m(c.mipmask & 1 << V, "missing mipmap data"),
            m(q.data || q.element || q.needsCopy, "missing image data"),
            At(c),
            ze(q, _i + T, k, P, V),
            Qe(),
            ve(q),
            I;
        }
        function E(T) {
          var A = T | 0;
          if (A !== c.width) {
            I.width = c.width = A, I.height = c.height = A, At(c);
            for (var v = 0; v < 6; ++v) {
              for (var b = 0; c.mipmask >> b; ++b) {
                f.texImage2D(
                  _i + v,
                  b,
                  c.format,
                  A >> b,
                  A >> b,
                  0,
                  c.format,
                  c.type,
                  null,
                );
              }
            }
            return Qe(),
              G.profile
              && (c.stats.size = Ii(
                c.internalformat,
                c.type,
                I.width,
                I.height,
                !1,
                !0,
              )),
              I;
          }
        }
        return I(y, z, R, ye, $e, p),
          I.subimage = F,
          I.resize = E,
          I._reglType = "textureCube",
          I._texture = c,
          G.profile && (I.stats = c.stats),
          I.destroy = function() {
            c.decRef();
          },
          I;
      }
      function ct() {
        for (var y = 0; y < Et; ++y) {f.activeTexture(Nn + y),
            f.bindTexture(rr, null),
            ut[y] = null;}
        $t(St).forEach(Ie), N.cubeCount = 0, N.textureCount = 0;
      }
      G.profile && (N.getTotalTextureSize = function() {
        var y = 0;
        return Object.keys(St).forEach(function(z) {
          y += St[z].stats.size;
        }),
          y;
      });
      function ir() {
        for (var y = 0; y < Et; ++y) {
          var z = ut[y];
          z && (z.bindCount = 0, z.unit = -1, ut[y] = null);
        }
        $t(St).forEach(function(R) {
          R.texture = f.createTexture(), f.bindTexture(R.target, R.texture);
          for (var ye = 0; ye < 32; ++ye) {
            if (R.mipmask & 1 << ye) {
              if (R.target === rr) {
                f.texImage2D(
                  rr,
                  ye,
                  R.internalformat,
                  R.width >> ye,
                  R.height >> ye,
                  0,
                  R.internalformat,
                  R.type,
                  null,
                );
              }
              else {
                for (var $e = 0; $e < 6; ++$e) {
                  f.texImage2D(
                    _i + $e,
                    ye,
                    R.internalformat,
                    R.width >> ye,
                    R.height >> ye,
                    0,
                    R.internalformat,
                    R.type,
                    null,
                  );
                }
              }
            }
          }
          xt(R.texInfo, R.target);
        });
      }
      function jr() {
        for (var y = 0; y < Et; ++y) {
          var z = ut[y];
          z && (z.bindCount = 0, z.unit = -1, ut[y] = null),
            f.activeTexture(Nn + y),
            f.bindTexture(rr, null),
            f.bindTexture(Yo, null);
        }
      }
      return {
        create2D: Ue,
        createCube: Ye,
        clear: ct,
        getTexture: function(y) {
          return null;
        },
        restore: ir,
        refresh: jr,
      };
    }
    var Sr = 36161,
      Li = 32854,
      Kf = 32855,
      Jf = 36194,
      el = 33189,
      tl = 36168,
      rl = 34041,
      nl = 35907,
      il = 34836,
      ol = 34842,
      al = 34843,
      Qt = [];
    Qt[Li] = 2,
      Qt[Kf] = 2,
      Qt[Jf] = 2,
      Qt[el] = 2,
      Qt[tl] = 1,
      Qt[rl] = 4,
      Qt[nl] = 4,
      Qt[il] = 16,
      Qt[ol] = 8,
      Qt[al] = 6;
    function sl(f, h, _) {
      return Qt[f] * h * _;
    }
    var Zm = function(f, h, _, M, j) {
        var N = {
          rgba4: Li,
          rgb565: Jf,
          "rgb5 a1": Kf,
          depth: el,
          stencil: tl,
          "depth stencil": rl,
        };
        h.ext_srgb && (N.srgba = nl),
          h.ext_color_buffer_half_float && (N.rgba16f = ol, N.rgb16f = al),
          h.webgl_color_buffer_float && (N.rgba32f = il);
        var G = [];
        Object.keys(N).forEach(function(Q) {
          var ee = N[Q];
          G[ee] = Q;
        });
        var Z = 0, W = {};
        function te(Q) {
          this.id = Z++,
            this.refCount = 1,
            this.renderbuffer = Q,
            this.format = Li,
            this.width = 0,
            this.height = 0,
            j.profile && (this.stats = { size: 0 });
        }
        te.prototype.decRef = function() {
          --this.refCount <= 0 && ne(this);
        };
        function ne(Q) {
          var ee = Q.renderbuffer;
          m(ee, "must not double destroy renderbuffer"),
            f.bindRenderbuffer(Sr, null),
            f.deleteRenderbuffer(ee),
            Q.renderbuffer = null,
            Q.refCount = 0,
            delete W[Q.id],
            M.renderbufferCount--;
        }
        function re(Q, ee) {
          var L = new te(f.createRenderbuffer());
          W[L.id] = L, M.renderbufferCount++;
          function O(ge, X) {
            var pe = 0, de = 0, Ae = Li;
            if (typeof ge == "object" && ge) {
              var U = ge;
              if ("shape" in U) {
                var $ = U.shape;
                m(
                  Array.isArray($) && $.length >= 2,
                  "invalid renderbuffer shape",
                ),
                  pe = $[0] | 0,
                  de = $[1] | 0;
              }
              else {
                "radius" in U && (pe = de = U.radius | 0),
                  "width" in U && (pe = U.width | 0),
                  "height" in U && (de = U.height | 0);
              }
              "format" in U
                && (m.parameter(U.format, N, "invalid renderbuffer format"),
                  Ae = N[U.format]);
            }
            else {
              typeof ge == "number"
                ? (pe = ge | 0, typeof X == "number" ? de = X | 0 : de = pe)
                : ge
                ? m.raise("invalid arguments to renderbuffer constructor")
                : pe = de = 1;
            }
            if (
              m(
                pe > 0 && de > 0 && pe <= _.maxRenderbufferSize
                  && de <= _.maxRenderbufferSize,
                "invalid renderbuffer size",
              ), !(pe === L.width && de === L.height && Ae === L.format)
            ) {
              return O.width = L.width = pe,
                O.height = L.height = de,
                L.format = Ae,
                f.bindRenderbuffer(Sr, L.renderbuffer),
                f.renderbufferStorage(Sr, Ae, pe, de),
                m(f.getError() === 0, "invalid render buffer format"),
                j.profile && (L.stats.size = sl(L.format, L.width, L.height)),
                O.format = G[L.format],
                O;
            }
          }
          function J(ge, X) {
            var pe = ge | 0, de = X | 0 || pe;
            return pe === L.width && de === L.height
              || (m(
                pe > 0 && de > 0 && pe <= _.maxRenderbufferSize
                  && de <= _.maxRenderbufferSize,
                "invalid renderbuffer size",
              ),
                O.width = L.width = pe,
                O.height = L.height = de,
                f.bindRenderbuffer(Sr, L.renderbuffer),
                f.renderbufferStorage(Sr, L.format, pe, de),
                m(f.getError() === 0, "invalid render buffer format"),
                j.profile && (L.stats.size = sl(L.format, L.width, L.height))),
              O;
          }
          return O(Q, ee),
            O.resize = J,
            O._reglType = "renderbuffer",
            O._renderbuffer = L,
            j.profile && (O.stats = L.stats),
            O.destroy = function() {
              L.decRef();
            },
            O;
        }
        j.profile && (M.getTotalRenderbufferSize = function() {
          var Q = 0;
          return Object.keys(W).forEach(function(ee) {
            Q += W[ee].stats.size;
          }),
            Q;
        });
        function ae() {
          $t(W).forEach(function(Q) {
            Q.renderbuffer = f.createRenderbuffer(),
              f.bindRenderbuffer(Sr, Q.renderbuffer),
              f.renderbufferStorage(Sr, Q.format, Q.width, Q.height);
          }), f.bindRenderbuffer(Sr, null);
        }
        return {
          create: re,
          clear: function() {
            $t(W).forEach(ne);
          },
          restore: ae,
        };
      },
      cr = 36160,
      ca = 36161,
      Or = 3553,
      Fi = 34069,
      fl = 36064,
      ll = 36096,
      ul = 36128,
      cl = 33306,
      dl = 36053,
      Qm = 36054,
      Km = 36055,
      Jm = 36057,
      ep = 36061,
      tp = 36193,
      rp = 5121,
      np = 5126,
      hl = 6407,
      ml = 6408,
      ip = 6402,
      op = [hl, ml],
      da = [];
    da[ml] = 4, da[hl] = 3;
    var Ci = [];
    Ci[rp] = 1, Ci[np] = 4, Ci[tp] = 2;
    var ap = 32854,
      sp = 32855,
      fp = 36194,
      lp = 33189,
      up = 36168,
      pl = 34041,
      cp = 35907,
      dp = 34836,
      hp = 34842,
      mp = 34843,
      pp = [ap, sp, fp, cp, hp, mp, dp],
      cn = {};
    cn[dl] = "complete",
      cn[Qm] = "incomplete attachment",
      cn[Jm] = "incomplete dimensions",
      cn[Km] = "incomplete, missing attachment",
      cn[ep] = "unsupported";
    function vp(f, h, _, M, j, N) {
      var G = { cur: null, next: null, dirty: !1, setFBO: null },
        Z = ["rgba"],
        W = ["rgba4", "rgb565", "rgb5 a1"];
      h.ext_srgb && W.push("srgba"),
        h.ext_color_buffer_half_float && W.push("rgba16f", "rgb16f"),
        h.webgl_color_buffer_float && W.push("rgba32f");
      var te = ["uint8"];
      h.oes_texture_half_float && te.push("half float", "float16"),
        h.oes_texture_float && te.push("float", "float32");
      function ne(K, fe, ue) {
        this.target = K, this.texture = fe, this.renderbuffer = ue;
        var ze = 0, Ne = 0;
        fe
          ? (ze = fe.width, Ne = fe.height)
          : ue && (ze = ue.width, Ne = ue.height),
          this.width = ze,
          this.height = Ne;
      }
      function re(K) {
        K && (K.texture && K.texture._texture.decRef(),
          K.renderbuffer && K.renderbuffer._renderbuffer.decRef());
      }
      function ae(K, fe, ue) {
        if (K) {
          if (K.texture) {
            var ze = K.texture._texture,
              Ne = Math.max(1, ze.width),
              he = Math.max(1, ze.height);
            m(
              Ne === fe && he === ue,
              "inconsistent width/height for supplied texture",
            ), ze.refCount += 1;
          }
          else {
            var ve = K.renderbuffer._renderbuffer;
            m(
              ve.width === fe && ve.height === ue,
              "inconsistent width/height for renderbuffer",
            ), ve.refCount += 1;
          }
        }
      }
      function Q(K, fe) {
        fe
          && (fe.texture
            ? f.framebufferTexture2D(
              cr,
              K,
              fe.target,
              fe.texture._texture.texture,
              0,
            )
            : f.framebufferRenderbuffer(
              cr,
              K,
              ca,
              fe.renderbuffer._renderbuffer.renderbuffer,
            ));
      }
      function ee(K) {
        var fe = Or, ue = null, ze = null, Ne = K;
        typeof K == "object"
        && (Ne = K.data, "target" in K && (fe = K.target | 0)),
          m.type(Ne, "function", "invalid attachment data");
        var he = Ne._reglType;
        return he === "texture2d"
          ? (ue = Ne, m(fe === Or))
          : he === "textureCube"
          ? (ue = Ne, m(fe >= Fi && fe < Fi + 6, "invalid cube map target"))
          : he === "renderbuffer"
          ? (ze = Ne, fe = ca)
          : m.raise("invalid regl object for attachment"),
          new ne(fe, ue, ze);
      }
      function L(K, fe, ue, ze, Ne) {
        if (ue) {
          var he = M.create2D({ width: K, height: fe, format: ze, type: Ne });
          return he._texture.refCount = 0, new ne(Or, he, null);
        }
        else {
          var ve = j.create({ width: K, height: fe, format: ze });
          return ve._renderbuffer.refCount = 0, new ne(ca, null, ve);
        }
      }
      function O(K) {
        return K && (K.texture || K.renderbuffer);
      }
      function J(K, fe, ue) {
        K
          && (K.texture
            ? K.texture.resize(fe, ue)
            : K.renderbuffer && K.renderbuffer.resize(fe, ue),
            K.width = fe,
            K.height = ue);
      }
      var ge = 0, X = {};
      function pe() {
        this.id = ge++,
          X[this.id] = this,
          this.framebuffer = f.createFramebuffer(),
          this.width = 0,
          this.height = 0,
          this.colorAttachments = [],
          this.depthAttachment = null,
          this.stencilAttachment = null,
          this.depthStencilAttachment = null;
      }
      function de(K) {
        K.colorAttachments.forEach(re),
          re(K.depthAttachment),
          re(K.stencilAttachment),
          re(K.depthStencilAttachment);
      }
      function Ae(K) {
        var fe = K.framebuffer;
        m(fe, "must not double destroy framebuffer"),
          f.deleteFramebuffer(fe),
          K.framebuffer = null,
          N.framebufferCount--,
          delete X[K.id];
      }
      function U(K) {
        var fe;
        f.bindFramebuffer(cr, K.framebuffer);
        var ue = K.colorAttachments;
        for (fe = 0; fe < ue.length; ++fe) Q(fl + fe, ue[fe]);
        for (fe = ue.length; fe < _.maxColorAttachments; ++fe) {
          f.framebufferTexture2D(cr, fl + fe, Or, null, 0);
        }
        f.framebufferTexture2D(cr, cl, Or, null, 0),
          f.framebufferTexture2D(cr, ll, Or, null, 0),
          f.framebufferTexture2D(cr, ul, Or, null, 0),
          Q(ll, K.depthAttachment),
          Q(ul, K.stencilAttachment),
          Q(cl, K.depthStencilAttachment);
        var ze = f.checkFramebufferStatus(cr);
        !f.isContextLost() && ze !== dl
        && m.raise(
          "framebuffer configuration not supported, status = " + cn[ze],
        ),
          f.bindFramebuffer(cr, G.next ? G.next.framebuffer : null),
          G.cur = G.next,
          f.getError();
      }
      function $(K, fe) {
        var ue = new pe();
        N.framebufferCount++;
        function ze(he, ve) {
          var Fe;
          m(
            G.next !== ue,
            "can not update framebuffer which is currently in use",
          );
          var Oe = 0,
            je = 0,
            at = !0,
            st = !0,
            He = null,
            gt = !0,
            it = "rgba",
            mt = "uint8",
            xt = 1,
            yt = null,
            St = null,
            Et = null,
            ut = !1;
          if (typeof he == "number") Oe = he | 0, je = ve | 0 || Oe;
          else if (!he) Oe = je = 1;
          else {
            m.type(he, "object", "invalid arguments for framebuffer");
            var Be = he;
            if ("shape" in Be) {
              var At = Be.shape;
              m(
                Array.isArray(At) && At.length >= 2,
                "invalid shape for framebuffer",
              ),
                Oe = At[0],
                je = At[1];
            }
            else {
              "radius" in Be && (Oe = je = Be.radius),
                "width" in Be && (Oe = Be.width),
                "height" in Be && (je = Be.height);
            }
            ("color" in Be || "colors" in Be)
            && (He = Be.color || Be.colors,
              Array.isArray(He)
              && m(
                He.length === 1 || h.webgl_draw_buffers,
                "multiple render targets not supported",
              )),
              He
              || ("colorCount" in Be
                && (xt = Be.colorCount | 0,
                  m(xt > 0, "invalid color buffer count")),
                "colorTexture" in Be && (gt = !!Be.colorTexture, it = "rgba4"),
                "colorType" in Be && (mt = Be.colorType,
                  gt
                    ? (m(
                      h.oes_texture_float
                        || !(mt === "float" || mt === "float32"),
                      "you must enable OES_texture_float in order to use floating point framebuffer objects",
                    ),
                      m(
                        h.oes_texture_half_float
                          || !(mt === "half float" || mt === "float16"),
                        "you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects",
                      ))
                    : mt === "half float" || mt === "float16"
                    ? (m(
                      h.ext_color_buffer_half_float,
                      "you must enable EXT_color_buffer_half_float to use 16-bit render buffers",
                    ),
                      it = "rgba16f")
                    : (mt === "float" || mt === "float32")
                      && (m(
                        h.webgl_color_buffer_float,
                        "you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers",
                      ),
                        it = "rgba32f"),
                  m.oneOf(mt, te, "invalid color type")),
                "colorFormat" in Be && (it = Be.colorFormat,
                  Z.indexOf(it) >= 0
                    ? gt = !0
                    : W.indexOf(it) >= 0
                    ? gt = !1
                    : m.optional(function() {
                      gt
                        ? m.oneOf(
                          Be.colorFormat,
                          Z,
                          "invalid color format for texture",
                        )
                        : m.oneOf(
                          Be.colorFormat,
                          W,
                          "invalid color format for renderbuffer",
                        );
                    }))),
              ("depthTexture" in Be || "depthStencilTexture" in Be)
              && (ut = !!(Be.depthTexture || Be.depthStencilTexture),
                m(
                  !ut || h.webgl_depth_texture,
                  "webgl_depth_texture extension not supported",
                )),
              "depth" in Be
              && (typeof Be.depth == "boolean"
                ? at = Be.depth
                : (yt = Be.depth, st = !1)),
              "stencil" in Be
              && (typeof Be.stencil == "boolean"
                ? st = Be.stencil
                : (St = Be.stencil, at = !1)),
              "depthStencil" in Be
              && (typeof Be.depthStencil == "boolean"
                ? at = st = Be.depthStencil
                : (Et = Be.depthStencil, at = !1, st = !1));
          }
          var Qe = null, Ie = null, Ue = null, Ye = null;
          if (Array.isArray(He)) Qe = He.map(ee);
          else if (He) Qe = [ee(He)];
          else {
            for (Qe = new Array(xt), Fe = 0; Fe < xt; ++Fe) {
              Qe[Fe] = L(Oe, je, gt, it, mt);
            }
          }
          m(
            h.webgl_draw_buffers || Qe.length <= 1,
            "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.",
          ),
            m(
              Qe.length <= _.maxColorAttachments,
              "too many color attachments, not supported",
            ),
            Oe = Oe || Qe[0].width,
            je = je || Qe[0].height,
            yt
              ? Ie = ee(yt)
              : at && !st && (Ie = L(Oe, je, ut, "depth", "uint32")),
            St
              ? Ue = ee(St)
              : st && !at && (Ue = L(Oe, je, !1, "stencil", "uint8")),
            Et
              ? Ye = ee(Et)
              : !yt && !St && st && at
                && (Ye = L(Oe, je, ut, "depth stencil", "depth stencil")),
            m(
              !!yt + !!St + !!Et <= 1,
              "invalid framebuffer configuration, can specify exactly one depth/stencil attachment",
            );
          var ct = null;
          for (Fe = 0; Fe < Qe.length; ++Fe) {
            if (
              ae(Qe[Fe], Oe, je),
                m(
                  !Qe[Fe]
                    || Qe[Fe].texture
                      && op.indexOf(Qe[Fe].texture._texture.format) >= 0
                    || Qe[Fe].renderbuffer
                      && pp.indexOf(Qe[Fe].renderbuffer._renderbuffer.format)
                        >= 0,
                  "framebuffer color attachment " + Fe + " is invalid",
                ),
                Qe[Fe] && Qe[Fe].texture
            ) {
              var ir = da[Qe[Fe].texture._texture.format]
                * Ci[Qe[Fe].texture._texture.type];
              ct === null
                ? ct = ir
                : m(
                  ct === ir,
                  "all color attachments much have the same number of bits per pixel.",
                );
            }
          }
          return ae(Ie, Oe, je),
            m(
              !Ie || Ie.texture && Ie.texture._texture.format === ip
                || Ie.renderbuffer
                  && Ie.renderbuffer._renderbuffer.format === lp,
              "invalid depth attachment for framebuffer object",
            ),
            ae(Ue, Oe, je),
            m(
              !Ue
                || Ue.renderbuffer
                  && Ue.renderbuffer._renderbuffer.format === up,
              "invalid stencil attachment for framebuffer object",
            ),
            ae(Ye, Oe, je),
            m(
              !Ye || Ye.texture && Ye.texture._texture.format === pl
                || Ye.renderbuffer
                  && Ye.renderbuffer._renderbuffer.format === pl,
              "invalid depth-stencil attachment for framebuffer object",
            ),
            de(ue),
            ue.width = Oe,
            ue.height = je,
            ue.colorAttachments = Qe,
            ue.depthAttachment = Ie,
            ue.stencilAttachment = Ue,
            ue.depthStencilAttachment = Ye,
            ze.color = Qe.map(O),
            ze.depth = O(Ie),
            ze.stencil = O(Ue),
            ze.depthStencil = O(Ye),
            ze.width = ue.width,
            ze.height = ue.height,
            U(ue),
            ze;
        }
        function Ne(he, ve) {
          m(
            G.next !== ue,
            "can not resize a framebuffer which is currently in use",
          );
          var Fe = Math.max(he | 0, 1), Oe = Math.max(ve | 0 || Fe, 1);
          if (Fe === ue.width && Oe === ue.height) return ze;
          for (var je = ue.colorAttachments, at = 0; at < je.length; ++at) {
            J(je[at], Fe, Oe);
          }
          return J(ue.depthAttachment, Fe, Oe),
            J(ue.stencilAttachment, Fe, Oe),
            J(ue.depthStencilAttachment, Fe, Oe),
            ue.width = ze.width = Fe,
            ue.height = ze.height = Oe,
            U(ue),
            ze;
        }
        return ze(K, fe),
          t(ze, {
            resize: Ne,
            _reglType: "framebuffer",
            _framebuffer: ue,
            destroy: function() {
              Ae(ue), de(ue);
            },
            use: function(he) {
              G.setFBO({ framebuffer: ze }, he);
            },
          });
      }
      function be(K) {
        var fe = Array(6);
        function ue(Ne) {
          var he;
          m(
            fe.indexOf(G.next) < 0,
            "can not update framebuffer which is currently in use",
          );
          var ve = { color: null },
            Fe = 0,
            Oe = null,
            je = "rgba",
            at = "uint8",
            st = 1;
          if (typeof Ne == "number") {
            Fe = Ne | 0;
          }
          else if (!Ne) Fe = 1;
          else {
            m.type(Ne, "object", "invalid arguments for framebuffer");
            var He = Ne;
            if ("shape" in He) {
              var gt = He.shape;
              m(
                Array.isArray(gt) && gt.length >= 2,
                "invalid shape for framebuffer",
              ),
                m(gt[0] === gt[1], "cube framebuffer must be square"),
                Fe = gt[0];
            }
            else {
              "radius" in He && (Fe = He.radius | 0),
                "width" in He
                  ? (Fe = He.width | 0,
                    "height" in He && m(He.height === Fe, "must be square"))
                  : "height" in He && (Fe = He.height | 0);
            }
            ("color" in He || "colors" in He)
            && (Oe = He.color || He.colors,
              Array.isArray(Oe)
              && m(
                Oe.length === 1 || h.webgl_draw_buffers,
                "multiple render targets not supported",
              )),
              Oe
              || ("colorCount" in He
                && (st = He.colorCount | 0,
                  m(st > 0, "invalid color buffer count")),
                "colorType" in He
                && (m.oneOf(He.colorType, te, "invalid color type"),
                  at = He.colorType),
                "colorFormat" in He
                && (je = He.colorFormat,
                  m.oneOf(
                    He.colorFormat,
                    Z,
                    "invalid color format for texture",
                  ))),
              "depth" in He && (ve.depth = He.depth),
              "stencil" in He && (ve.stencil = He.stencil),
              "depthStencil" in He && (ve.depthStencil = He.depthStencil);
          }
          var it;
          if (Oe) {
            if (Array.isArray(Oe)) {for (
                it = [], he = 0; he < Oe.length; ++he
              )
              {
                it[he] = Oe[he];
              }}
            else it = [Oe];
          }
          else {
            it = Array(st);
            var mt = { radius: Fe, format: je, type: at };
            for (he = 0; he < st; ++he) it[he] = M.createCube(mt);
          }
          for (ve.color = Array(it.length), he = 0; he < it.length; ++he) {
            var xt = it[he];
            m(
              typeof xt == "function" && xt._reglType === "textureCube",
              "invalid cube map",
            ),
              Fe = Fe || xt.width,
              m(xt.width === Fe && xt.height === Fe, "invalid cube map shape"),
              ve.color[he] = { target: Fi, data: it[he] };
          }
          for (he = 0; he < 6; ++he) {
            for (var yt = 0; yt < it.length; ++yt) {
              ve.color[yt].target = Fi + he;
            }
            he > 0
            && (ve.depth = fe[0].depth,
              ve.stencil = fe[0].stencil,
              ve.depthStencil = fe[0].depthStencil),
              fe[he] ? fe[he](ve) : fe[he] = $(ve);
          }
          return t(ue, { width: Fe, height: Fe, color: it });
        }
        function ze(Ne) {
          var he, ve = Ne | 0;
          if (
            m(ve > 0 && ve <= _.maxCubeMapSize, "invalid radius for cube fbo"),
              ve === ue.width
          ) {
            return ue;
          }
          var Fe = ue.color;
          for (he = 0; he < Fe.length; ++he) Fe[he].resize(ve);
          for (he = 0; he < 6; ++he) fe[he].resize(ve);
          return ue.width = ue.height = ve, ue;
        }
        return ue(K),
          t(ue, {
            faces: fe,
            resize: ze,
            _reglType: "framebufferCube",
            destroy: function() {
              fe.forEach(function(Ne) {
                Ne.destroy();
              });
            },
          });
      }
      function se() {
        G.cur = null,
          G.next = null,
          G.dirty = !0,
          $t(X).forEach(function(K) {
            K.framebuffer = f.createFramebuffer(), U(K);
          });
      }
      return t(G, {
        getFramebuffer: function(K) {
          if (typeof K == "function" && K._reglType === "framebuffer") {
            var fe = K._framebuffer;
            if (fe instanceof pe) return fe;
          }
          return null;
        },
        create: $,
        createCube: be,
        clear: function() {
          $t(X).forEach(Ae);
        },
        restore: se,
      });
    }
    var gp = 5126,
      vl = 34962,
      Pi = 34963,
      gl = [
        "attributes",
        "elements",
        "offset",
        "count",
        "primitive",
        "instances",
      ];
    function ha() {
      this.state = 0,
        this.x = 0,
        this.y = 0,
        this.z = 0,
        this.w = 0,
        this.buffer = null,
        this.size = 0,
        this.normalized = !1,
        this.type = gp,
        this.offset = 0,
        this.stride = 0,
        this.divisor = 0;
    }
    function xp(f, h, _, M, j, N, G) {
      for (var Z = _.maxAttributes, W = new Array(Z), te = 0; te < Z; ++te) {
        W[te] = new ha();
      }
      var ne = 0,
        re = {},
        ae = {
          Record: ha,
          scope: {},
          state: W,
          currentVAO: null,
          targetVAO: null,
          restore: ee() ? de : function() {},
          createVAO: Ae,
          getVAO: O,
          destroyBuffer: Q,
          setVAO: ee() ? J : ge,
          clear: ee() ? X : function() {},
        };
      function Q(U) {
        for (var $ = 0; $ < W.length; ++$) {
          var be = W[$];
          be.buffer === U && (f.disableVertexAttribArray($), be.buffer = null);
        }
      }
      function ee() {
        return h.oes_vertex_array_object;
      }
      function L() {
        return h.angle_instanced_arrays;
      }
      function O(U) {
        return typeof U == "function" && U._vao ? U._vao : null;
      }
      function J(U) {
        if (U !== ae.currentVAO) {
          var $ = ee();
          U ? $.bindVertexArrayOES(U.vao) : $.bindVertexArrayOES(null),
            ae.currentVAO = U;
        }
      }
      function ge(U) {
        if (U !== ae.currentVAO) {
          if (U) U.bindAttrs();
          else {
            for (var $ = L(), be = 0; be < W.length; ++be) {
              var se = W[be];
              se.buffer
                ? (f.enableVertexAttribArray(be),
                  se.buffer.bind(),
                  f.vertexAttribPointer(
                    be,
                    se.size,
                    se.type,
                    se.normalized,
                    se.stride,
                    se.offfset,
                  ),
                  $ && se.divisor && $.vertexAttribDivisorANGLE(be, se.divisor))
                : (f.disableVertexAttribArray(be),
                  f.vertexAttrib4f(be, se.x, se.y, se.z, se.w));
            }
            G.elements ? f.bindBuffer(Pi, G.elements.buffer.buffer)
            : f.bindBuffer(Pi, null);
          }
          ae.currentVAO = U;
        }
      }
      function X() {
        $t(re).forEach(function(U) {
          U.destroy();
        });
      }
      function pe() {
        this.id = ++ne,
          this.attributes = [],
          this.elements = null,
          this.ownsElements = !1,
          this.count = 0,
          this.offset = 0,
          this.instances = -1,
          this.primitive = 4;
        var U = ee();
        U ? this.vao = U.createVertexArrayOES() : this.vao = null,
          re[this.id] = this,
          this.buffers = [];
      }
      pe.prototype.bindAttrs = function() {
        for (var U = L(), $ = this.attributes, be = 0; be < $.length; ++be) {
          var se = $[be];
          se.buffer
            ? (f.enableVertexAttribArray(be),
              f.bindBuffer(vl, se.buffer.buffer),
              f.vertexAttribPointer(
                be,
                se.size,
                se.type,
                se.normalized,
                se.stride,
                se.offset,
              ),
              U && se.divisor && U.vertexAttribDivisorANGLE(be, se.divisor))
            : (f.disableVertexAttribArray(be),
              f.vertexAttrib4f(be, se.x, se.y, se.z, se.w));
        }
        for (var K = $.length; K < Z; ++K) f.disableVertexAttribArray(K);
        var fe = N.getElements(this.elements);
        fe ? f.bindBuffer(Pi, fe.buffer.buffer) : f.bindBuffer(Pi, null);
      },
        pe.prototype.refresh = function() {
          var U = ee();
          U
            && (U.bindVertexArrayOES(this.vao),
              this.bindAttrs(),
              ae.currentVAO = null,
              U.bindVertexArrayOES(null));
        },
        pe.prototype.destroy = function() {
          if (this.vao) {
            var U = ee();
            this === ae.currentVAO
            && (ae.currentVAO = null, U.bindVertexArrayOES(null)),
              U.deleteVertexArrayOES(this.vao),
              this.vao = null;
          }
          this.ownsElements
          && (this.elements.destroy(),
            this.elements = null,
            this.ownsElements = !1),
            re[this.id] && (delete re[this.id], M.vaoCount -= 1);
        };
      function de() {
        var U = ee();
        U && $t(re).forEach(function($) {
          $.refresh();
        });
      }
      function Ae(U) {
        var $ = new pe();
        M.vaoCount += 1;
        function be(se) {
          var K;
          if (Array.isArray(se)) {
            K = se,
              $.elements && $.ownsElements && $.elements.destroy(),
              $.elements = null,
              $.ownsElements = !1,
              $.offset = 0,
              $.count = 0,
              $.instances = -1,
              $.primitive = 4;
          }
          else {
            if (
              m(typeof se == "object", "invalid arguments for create vao"),
                m("attributes" in se, "must specify attributes for vao"),
                se.elements
            ) {
              var fe = se.elements;
              $.ownsElements
                ? typeof fe == "function" && fe._reglType === "elements"
                  ? ($.elements.destroy(), $.ownsElements = !1)
                  : ($.elements(fe), $.ownsElements = !1)
                : N.getElements(se.elements)
                ? ($.elements = se.elements, $.ownsElements = !1)
                : ($.elements = N.create(se.elements), $.ownsElements = !0);
            }
            else $.elements = null, $.ownsElements = !1;
            K = se.attributes,
              $.offset = 0,
              $.count = -1,
              $.instances = -1,
              $.primitive = 4,
              $.elements
              && ($.count = $.elements._elements.vertCount,
                $.primitive = $.elements._elements.primType),
              "offset" in se && ($.offset = se.offset | 0),
              "count" in se && ($.count = se.count | 0),
              "instances" in se && ($.instances = se.instances | 0),
              "primitive" in se
              && (m(se.primitive in _r, "bad primitive type: " + se.primitive),
                $.primitive = _r[se.primitive]),
              m.optional(() => {
                for (var at = Object.keys(se), st = 0; st < at.length; ++st) {
                  m(
                    gl.indexOf(at[st]) >= 0,
                    "invalid option for vao: \"" + at[st]
                      + "\" valid options are " + gl,
                  );
                }
              }),
              m(Array.isArray(K), "attributes must be an array");
          }
          m(K.length < Z, "too many attributes"),
            m(K.length > 0, "must specify at least one attribute");
          var ue = {}, ze = $.attributes;
          ze.length = K.length;
          for (var Ne = 0; Ne < K.length; ++Ne) {
            var he = K[Ne], ve = ze[Ne] = new ha(), Fe = he.data || he;
            if (Array.isArray(Fe) || e(Fe) || Zt(Fe)) {
              var Oe;
              $.buffers[Ne]
              && (Oe = $.buffers[Ne],
                e(Fe) && Oe._buffer.byteLength >= Fe.byteLength
                  ? Oe.subdata(Fe)
                  : (Oe.destroy(), $.buffers[Ne] = null)),
                $.buffers[Ne]
                || (Oe = $.buffers[Ne] = j.create(he, vl, !1, !0)),
                ve.buffer = j.getBuffer(Oe),
                ve.size = ve.buffer.dimension | 0,
                ve.normalized = !1,
                ve.type = ve.buffer.dtype,
                ve.offset = 0,
                ve.stride = 0,
                ve.divisor = 0,
                ve.state = 1,
                ue[Ne] = 1;
            }
            else {
              j.getBuffer(he)
                ? (ve.buffer = j.getBuffer(he),
                  ve.size = ve.buffer.dimension | 0,
                  ve.normalized = !1,
                  ve.type = ve.buffer.dtype,
                  ve.offset = 0,
                  ve.stride = 0,
                  ve.divisor = 0,
                  ve.state = 1)
                : j.getBuffer(he.buffer)
                ? (ve.buffer = j.getBuffer(he.buffer),
                  ve.size = (+he.size || ve.buffer.dimension) | 0,
                  ve.normalized = !!he.normalized || !1,
                  "type" in he
                    ? (m.parameter(he.type, Rr, "invalid buffer type"),
                      ve.type = Rr[he.type])
                    : ve.type = ve.buffer.dtype,
                  ve.offset = (he.offset || 0) | 0,
                  ve.stride = (he.stride || 0) | 0,
                  ve.divisor = (he.divisor || 0) | 0,
                  ve.state = 1,
                  m(
                    ve.size >= 1 && ve.size <= 4,
                    "size must be between 1 and 4",
                  ),
                  m(ve.offset >= 0, "invalid offset"),
                  m(
                    ve.stride >= 0 && ve.stride <= 255,
                    "stride must be between 0 and 255",
                  ),
                  m(ve.divisor >= 0, "divisor must be positive"),
                  m(
                    !ve.divisor || !!h.angle_instanced_arrays,
                    "ANGLE_instanced_arrays must be enabled to use divisor",
                  ))
                : "x" in he
                ? (m(Ne > 0, "first attribute must not be a constant"),
                  ve.x = +he.x || 0,
                  ve.y = +he.y || 0,
                  ve.z = +he.z || 0,
                  ve.w = +he.w || 0,
                  ve.state = 2)
                : m(!1, "invalid attribute spec for location " + Ne);
            }
          }
          for (var je = 0; je < $.buffers.length; ++je) {
            !ue[je] && $.buffers[je]
              && ($.buffers[je].destroy(), $.buffers[je] = null);
          }
          return $.refresh(), be;
        }
        return be.destroy = function() {
          for (var se = 0; se < $.buffers.length; ++se) {
            $.buffers[se] && $.buffers[se].destroy();
          }
          $.buffers.length = 0,
            $.ownsElements
            && ($.elements.destroy(), $.elements = null, $.ownsElements = !1),
            $.destroy();
        },
          be._vao = $,
          be._reglType = "vao",
          be(U);
      }
      return ae;
    }
    var xl = 35632, yp = 35633, bp = 35718, _p = 35721;
    function Sp(f, h, _, M) {
      var j = {}, N = {};
      function G(L, O, J, ge) {
        this.name = L, this.id = O, this.location = J, this.info = ge;
      }
      function Z(L, O) {
        for (var J = 0; J < L.length; ++J) {if (L[J].id === O.id) {
            L[J].location = O.location;
            return;
          }}
        L.push(O);
      }
      function W(L, O, J) {
        var ge = L === xl ? j : N, X = ge[O];
        if (!X) {
          var pe = h.str(O);
          X = f.createShader(L),
            f.shaderSource(X, pe),
            f.compileShader(X),
            m.shaderError(f, X, pe, L, J),
            ge[O] = X;
        }
        return X;
      }
      var te = {}, ne = [], re = 0;
      function ae(L, O) {
        this.id = re++,
          this.fragId = L,
          this.vertId = O,
          this.program = null,
          this.uniforms = [],
          this.attributes = [],
          this.refCount = 1,
          M.profile && (this.stats = { uniformsCount: 0, attributesCount: 0 });
      }
      function Q(L, O, J) {
        var ge,
          X,
          pe = W(xl, L.fragId),
          de = W(yp, L.vertId),
          Ae = L.program = f.createProgram();
        if (f.attachShader(Ae, pe), f.attachShader(Ae, de), J) {
          for (ge = 0; ge < J.length; ++ge) {
            var U = J[ge];
            f.bindAttribLocation(Ae, U[0], U[1]);
          }
        }
        f.linkProgram(Ae),
          m.linkError(f, Ae, h.str(L.fragId), h.str(L.vertId), O);
        var $ = f.getProgramParameter(Ae, bp);
        M.profile && (L.stats.uniformsCount = $);
        var be = L.uniforms;
        for (ge = 0; ge < $; ++ge) {
          if (X = f.getActiveUniform(Ae, ge), X) {
            if (X.size > 1) {
              for (var se = 0; se < X.size; ++se) {
                var K = X.name.replace("[0]", "[" + se + "]");
                Z(be, new G(K, h.id(K), f.getUniformLocation(Ae, K), X));
              }
            }
            var fe = X.name;
            X.size > 1 && (fe = fe.replace("[0]", "")),
              Z(be, new G(fe, h.id(fe), f.getUniformLocation(Ae, fe), X));
          }
        }
        var ue = f.getProgramParameter(Ae, _p);
        M.profile && (L.stats.attributesCount = ue);
        var ze = L.attributes;
        for (ge = 0; ge < ue; ++ge) {
          X = f.getActiveAttrib(Ae, ge),
            X
            && Z(
              ze,
              new G(X.name, h.id(X.name), f.getAttribLocation(Ae, X.name), X),
            );
        }
      }
      M.profile && (_.getMaxUniformsCount = function() {
        var L = 0;
        return ne.forEach(function(O) {
          O.stats.uniformsCount > L && (L = O.stats.uniformsCount);
        }),
          L;
      },
        _.getMaxAttributesCount = function() {
          var L = 0;
          return ne.forEach(function(O) {
            O.stats.attributesCount > L && (L = O.stats.attributesCount);
          }),
            L;
        });
      function ee() {
        j = {}, N = {};
        for (var L = 0; L < ne.length; ++L) {
          Q(
            ne[L],
            null,
            ne[L].attributes.map(function(O) {
              return [O.location, O.name];
            }),
          );
        }
      }
      return {
        clear: function() {
          var L = f.deleteShader.bind(f);
          $t(j).forEach(L),
            j = {},
            $t(N).forEach(L),
            N = {},
            ne.forEach(function(O) {
              f.deleteProgram(O.program);
            }),
            ne.length = 0,
            te = {},
            _.shaderCount = 0;
        },
        program: function(L, O, J, ge) {
          m.command(L >= 0, "missing vertex shader", J),
            m.command(O >= 0, "missing fragment shader", J);
          var X = te[O];
          X || (X = te[O] = {});
          var pe = X[L];
          if (pe && (pe.refCount++, !ge)) return pe;
          var de = new ae(O, L);
          return _.shaderCount++,
            Q(de, J, ge),
            pe || (X[L] = de),
            ne.push(de),
            t(de, {
              destroy: function() {
                if (de.refCount--, de.refCount <= 0) {
                  f.deleteProgram(de.program);
                  var Ae = ne.indexOf(de);
                  ne.splice(Ae, 1), _.shaderCount--;
                }
                X[de.vertId].refCount <= 0
                && (f.deleteShader(N[de.vertId]),
                  delete N[de.vertId],
                  delete te[de.fragId][de.vertId]),
                  Object.keys(te[de.fragId]).length
                  || (f.deleteShader(j[de.fragId]),
                    delete j[de.fragId],
                    delete te[de.fragId]);
              },
            });
        },
        restore: ee,
        shader: W,
        frag: -1,
        vert: -1,
      };
    }
    var wp = 6408, Mn = 5121, Tp = 3333, ki = 5126;
    function Ep(f, h, _, M, j, N, G) {
      function Z(ne) {
        var re;
        h.next === null
          ? (m(
            j.preserveDrawingBuffer,
            "you must create a webgl context with \"preserveDrawingBuffer\":true in order to read pixels from the drawing buffer",
          ),
            re = Mn)
          : (m(
            h.next.colorAttachments[0].texture !== null,
            "You cannot read from a renderbuffer",
          ),
            re = h.next.colorAttachments[0].texture._texture.type,
            m.optional(function() {
              N.oes_texture_float
                ? (m(
                  re === Mn || re === ki,
                  "Reading from a framebuffer is only allowed for the types 'uint8' and 'float'",
                ),
                  re === ki
                  && m(
                    G.readFloat,
                    "Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float",
                  ))
                : m(
                  re === Mn,
                  "Reading from a framebuffer is only allowed for the type 'uint8'",
                );
            }));
        var ae = 0,
          Q = 0,
          ee = M.framebufferWidth,
          L = M.framebufferHeight,
          O = null;
        e(ne)
          ? O = ne
          : ne
            && (m.type(ne, "object", "invalid arguments to regl.read()"),
              ae = ne.x | 0,
              Q = ne.y | 0,
              m(
                ae >= 0 && ae < M.framebufferWidth,
                "invalid x offset for regl.read",
              ),
              m(
                Q >= 0 && Q < M.framebufferHeight,
                "invalid y offset for regl.read",
              ),
              ee = (ne.width || M.framebufferWidth - ae) | 0,
              L = (ne.height || M.framebufferHeight - Q) | 0,
              O = ne.data || null),
          O && (re === Mn
            ? m(
              O instanceof Uint8Array,
              "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'",
            )
            : re === ki
              && m(
                O instanceof Float32Array,
                "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'",
              )),
          m(
            ee > 0 && ee + ae <= M.framebufferWidth,
            "invalid width for read pixels",
          ),
          m(
            L > 0 && L + Q <= M.framebufferHeight,
            "invalid height for read pixels",
          ),
          _();
        var J = ee * L * 4;
        return O || (re === Mn
          ? O = new Uint8Array(J)
          : re === ki && (O = O || new Float32Array(J))),
          m.isTypedArray(O, "data buffer for regl.read() must be a typedarray"),
          m(O.byteLength >= J, "data buffer for regl.read() too small"),
          f.pixelStorei(Tp, 4),
          f.readPixels(ae, Q, ee, L, wp, re, O),
          O;
      }
      function W(ne) {
        var re;
        return h.setFBO({ framebuffer: ne.framebuffer }, function() {
          re = Z(ne);
        }),
          re;
      }
      function te(ne) {
        return !ne || !("framebuffer" in ne) ? Z(ne) : W(ne);
      }
      return te;
    }
    function dn(f) {
      return Array.prototype.slice.call(f);
    }
    function hn(f) {
      return dn(f).join("");
    }
    function Ap() {
      var f = 0, h = [], _ = [];
      function M(re) {
        for (var ae = 0; ae < _.length; ++ae) if (_[ae] === re) return h[ae];
        var Q = "g" + f++;
        return h.push(Q), _.push(re), Q;
      }
      function j() {
        var re = [];
        function ae() {
          re.push.apply(re, dn(arguments));
        }
        var Q = [];
        function ee() {
          var L = "v" + f++;
          return Q.push(L),
            arguments.length > 0
            && (re.push(L, "="),
              re.push.apply(re, dn(arguments)),
              re.push(";")),
            L;
        }
        return t(ae, {
          def: ee,
          toString: function() {
            return hn([
              Q.length > 0
                ? "var " + Q.join(",") + ";"
                : "",
              hn(re),
            ]);
          },
        });
      }
      function N() {
        var re = j(), ae = j(), Q = re.toString, ee = ae.toString;
        function L(O, J) {
          ae(O, J, "=", re.def(O, J), ";");
        }
        return t(function() {
          re.apply(re, dn(arguments));
        }, {
          def: re.def,
          entry: re,
          exit: ae,
          save: L,
          set: function(O, J, ge) {
            L(O, J), re(O, J, "=", ge, ";");
          },
          toString: function() {
            return Q() + ee();
          },
        });
      }
      function G() {
        var re = hn(arguments),
          ae = N(),
          Q = N(),
          ee = ae.toString,
          L = Q.toString;
        return t(ae, {
          then: function() {
            return ae.apply(ae, dn(arguments)), this;
          },
          else: function() {
            return Q.apply(Q, dn(arguments)), this;
          },
          toString: function() {
            var O = L();
            return O && (O = "else{" + O + "}"),
              hn(["if(", re, "){", ee(), "}", O]);
          },
        });
      }
      var Z = j(), W = {};
      function te(re, ae) {
        var Q = [];
        function ee() {
          var X = "a" + Q.length;
          return Q.push(X), X;
        }
        ae = ae || 0;
        for (var L = 0; L < ae; ++L) ee();
        var O = N(),
          J = O.toString,
          ge = W[re] = t(O, {
            arg: ee,
            toString: function() {
              return hn(["function(", Q.join(), "){", J(), "}"]);
            },
          });
        return ge;
      }
      function ne() {
        var re = ["\"use strict\";", Z, "return {"];
        Object.keys(W).forEach(function(ee) {
          re.push("\"", ee, "\":", W[ee].toString(), ",");
        }), re.push("}");
        var ae = hn(re).replace(
            /;/g,
            `;
`,
          ).replace(
            /}/g,
            `}
`,
          ).replace(
            /{/g,
            `{
`,
          ),
          Q = Function.apply(null, h.concat(ae));
        return Q.apply(null, _);
      }
      return {
        global: Z,
        link: M,
        block: j,
        proc: te,
        scope: N,
        cond: G,
        compile: ne,
      };
    }
    var mn = "xyzw".split(""),
      yl = 5121,
      pn = 1,
      ma = 2,
      pa = 0,
      va = 1,
      ga = 2,
      xa = 3,
      Ri = 4,
      bl = 5,
      _l = 6,
      Sl = "dither",
      wl = "blend.enable",
      Tl = "blend.color",
      ya = "blend.equation",
      ba = "blend.func",
      El = "depth.enable",
      Al = "depth.func",
      Il = "depth.range",
      Ll = "depth.mask",
      _a = "colorMask",
      Fl = "cull.enable",
      Cl = "cull.face",
      Sa = "frontFace",
      wa = "lineWidth",
      Pl = "polygonOffset.enable",
      Ta = "polygonOffset.offset",
      kl = "sample.alpha",
      Rl = "sample.enable",
      Ea = "sample.coverage",
      Nl = "stencil.enable",
      Ml = "stencil.mask",
      Aa = "stencil.func",
      Ia = "stencil.opFront",
      zn = "stencil.opBack",
      zl = "scissor.enable",
      Ni = "scissor.box",
      dr = "viewport",
      On = "profile",
      Dr = "framebuffer",
      Dn = "vert",
      Gn = "frag",
      Gr = "elements",
      Br = "primitive",
      Vr = "count",
      Mi = "offset",
      zi = "instances",
      Bn = "vao",
      La = "Width",
      Fa = "Height",
      vn = Dr + La,
      gn = Dr + Fa,
      Ip = dr + La,
      Lp = dr + Fa,
      Ol = "drawingBuffer",
      Dl = Ol + La,
      Gl = Ol + Fa,
      Fp = [ba, ya, Aa, Ia, zn, Ea, dr, Ni, Ta],
      xn = 34962,
      Ca = 34963,
      Cp = 35632,
      Pp = 35633,
      Bl = 3553,
      kp = 34067,
      Rp = 2884,
      Np = 3042,
      Mp = 3024,
      zp = 2960,
      Op = 2929,
      Dp = 3089,
      Gp = 32823,
      Bp = 32926,
      Vp = 32928,
      Pa = 5126,
      Oi = 35664,
      Di = 35665,
      Gi = 35666,
      ka = 5124,
      Bi = 35667,
      Vi = 35668,
      $i = 35669,
      Ra = 35670,
      ji = 35671,
      Ui = 35672,
      qi = 35673,
      Vn = 35674,
      $n = 35675,
      jn = 35676,
      Un = 35678,
      qn = 35680,
      Na = 4,
      Hn = 1028,
      $r = 1029,
      Vl = 2304,
      Ma = 2305,
      $p = 32775,
      jp = 32776,
      Up = 519,
      wr = 7680,
      $l = 0,
      jl = 1,
      Ul = 32774,
      qp = 513,
      ql = 36160,
      Hp = 36064,
      nr = {
        0: 0,
        1: 1,
        zero: 0,
        one: 1,
        "src color": 768,
        "one minus src color": 769,
        "src alpha": 770,
        "one minus src alpha": 771,
        "dst color": 774,
        "one minus dst color": 775,
        "dst alpha": 772,
        "one minus dst alpha": 773,
        "constant color": 32769,
        "one minus constant color": 32770,
        "constant alpha": 32771,
        "one minus constant alpha": 32772,
        "src alpha saturate": 776,
      },
      Hl = [
        "constant color, constant alpha",
        "one minus constant color, constant alpha",
        "constant color, one minus constant alpha",
        "one minus constant color, one minus constant alpha",
        "constant alpha, constant color",
        "constant alpha, one minus constant color",
        "one minus constant alpha, constant color",
        "one minus constant alpha, one minus constant color",
      ],
      yn = {
        never: 512,
        less: 513,
        "<": 513,
        equal: 514,
        "=": 514,
        "==": 514,
        "===": 514,
        lequal: 515,
        "<=": 515,
        greater: 516,
        ">": 516,
        notequal: 517,
        "!=": 517,
        "!==": 517,
        gequal: 518,
        ">=": 518,
        always: 519,
      },
      Tr = {
        0: 0,
        zero: 0,
        keep: 7680,
        replace: 7681,
        increment: 7682,
        decrement: 7683,
        "increment wrap": 34055,
        "decrement wrap": 34056,
        invert: 5386,
      },
      Xl = { frag: Cp, vert: Pp },
      za = { cw: Vl, ccw: Ma };
    function Hi(f) {
      return Array.isArray(f) || e(f) || Zt(f);
    }
    function Yl(f) {
      return f.sort(function(h, _) {
        return h === dr ? -1 : _ === dr ? 1 : h < _ ? -1 : 1;
      });
    }
    function bt(f, h, _, M) {
      this.thisDep = f, this.contextDep = h, this.propDep = _, this.append = M;
    }
    function Er(f) {
      return f && !(f.thisDep || f.contextDep || f.propDep);
    }
    function ht(f) {
      return new bt(!1, !1, !1, f);
    }
    function Rt(f, h) {
      var _ = f.type;
      if (_ === pa) {
        var M = f.data.length;
        return new bt(!0, M >= 1, M >= 2, h);
      }
      else if (_ === Ri) {
        var j = f.data;
        return new bt(j.thisDep, j.contextDep, j.propDep, h);
      }
      else {
        if (_ === bl) return new bt(!1, !1, !1, h);
        if (_ === _l) {
          for (var N = !1, G = !1, Z = !1, W = 0; W < f.data.length; ++W) {
            var te = f.data[W];
            if (te.type === va) Z = !0;
            else if (te.type === ga) G = !0;
            else if (te.type === xa) N = !0;
            else if (te.type === pa) {
              N = !0;
              var ne = te.data;
              ne >= 1 && (G = !0), ne >= 2 && (Z = !0);
            }
            else {
              te.type === Ri
                && (N = N || te.data.thisDep,
                  G = G || te.data.contextDep,
                  Z = Z || te.data.propDep);
            }
          }
          return new bt(N, G, Z, h);
        }
        else return new bt(_ === xa, _ === ga, _ === va, h);
      }
    }
    var Wl = new bt(!1, !1, !1, function() {});
    function Xp(f, h, _, M, j, N, G, Z, W, te, ne, re, ae, Q, ee) {
      var L = te.Record,
        O = { add: 32774, subtract: 32778, "reverse subtract": 32779 };
      _.ext_blend_minmax && (O.min = $p, O.max = jp);
      var J = _.angle_instanced_arrays,
        ge = _.webgl_draw_buffers,
        X = _.oes_vertex_array_object,
        pe = { dirty: !0, profile: ee.profile },
        de = {},
        Ae = [],
        U = {},
        $ = {};
      function be(p) {
        return p.replace(".", "_");
      }
      function se(p, c, S) {
        var I = be(p);
        Ae.push(p), de[I] = pe[I] = !!S, U[I] = c;
      }
      function K(p, c, S) {
        var I = be(p);
        Ae.push(p),
          Array.isArray(S)
            ? (pe[I] = S.slice(), de[I] = S.slice())
            : pe[I] = de[I] = S,
          $[I] = c;
      }
      se(Sl, Mp),
        se(wl, Np),
        K(Tl, "blendColor", [0, 0, 0, 0]),
        K(ya, "blendEquationSeparate", [Ul, Ul]),
        K(ba, "blendFuncSeparate", [jl, $l, jl, $l]),
        se(El, Op, !0),
        K(Al, "depthFunc", qp),
        K(Il, "depthRange", [0, 1]),
        K(Ll, "depthMask", !0),
        K(_a, _a, [!0, !0, !0, !0]),
        se(Fl, Rp),
        K(Cl, "cullFace", $r),
        K(Sa, Sa, Ma),
        K(wa, wa, 1),
        se(Pl, Gp),
        K(Ta, "polygonOffset", [0, 0]),
        se(kl, Bp),
        se(Rl, Vp),
        K(Ea, "sampleCoverage", [1, !1]),
        se(Nl, zp),
        K(Ml, "stencilMask", -1),
        K(Aa, "stencilFunc", [Up, 0, -1]),
        K(Ia, "stencilOpSeparate", [Hn, wr, wr, wr]),
        K(zn, "stencilOpSeparate", [$r, wr, wr, wr]),
        se(zl, Dp),
        K(Ni, "scissor", [0, 0, f.drawingBufferWidth, f.drawingBufferHeight]),
        K(dr, dr, [0, 0, f.drawingBufferWidth, f.drawingBufferHeight]);
      var fe = {
          gl: f,
          context: ae,
          strings: h,
          next: de,
          current: pe,
          draw: re,
          elements: N,
          buffer: j,
          shader: ne,
          attributes: te.state,
          vao: te,
          uniforms: W,
          framebuffer: Z,
          extensions: _,
          timer: Q,
          isBufferArgs: Hi,
        },
        ue = {
          primTypes: _r,
          compareFuncs: yn,
          blendFuncs: nr,
          blendEquations: O,
          stencilOps: Tr,
          glTypes: Rr,
          orientationType: za,
        };
      m.optional(function() {
        fe.isArrayLike = ot;
      }),
        ge
        && (ue.backBuffer = [$r],
          ue.drawBuffer = Vt(M.maxDrawbuffers, function(p) {
            return p === 0 ? [0] : Vt(p, function(c) {
              return Hp + c;
            });
          }));
      var ze = 0;
      function Ne() {
        var p = Ap(), c = p.link, S = p.global;
        p.id = ze++, p.batchId = "0";
        var I = c(fe), F = p.shared = { props: "a0" };
        Object.keys(fe).forEach(function(b) {
          F[b] = S.def(I, ".", b);
        }),
          m.optional(function() {
            p.CHECK = c(m),
              p.commandStr = m.guessCommand(),
              p.command = c(p.commandStr),
              p.assert = function(b, x, k) {
                b(
                  "if(!(",
                  x,
                  "))",
                  this.CHECK,
                  ".commandRaise(",
                  c(k),
                  ",",
                  this.command,
                  ");",
                );
              },
              ue.invalidBlendCombinations = Hl;
          });
        var E = p.next = {}, T = p.current = {};
        Object.keys($).forEach(function(b) {
          Array.isArray(pe[b])
            && (E[b] = S.def(F.next, ".", b), T[b] = S.def(F.current, ".", b));
        });
        var A = p.constants = {};
        Object.keys(ue).forEach(function(b) {
          A[b] = S.def(JSON.stringify(ue[b]));
        }),
          p.invoke = function(b, x) {
            switch (x.type) {
              case pa:
                var k = ["this", F.context, F.props, p.batchId];
                return b.def(
                  c(x.data),
                  ".call(",
                  k.slice(0, Math.max(x.data.length + 1, 4)),
                  ")",
                );
              case va:
                return b.def(F.props, x.data);
              case ga:
                return b.def(F.context, x.data);
              case xa:
                return b.def("this", x.data);
              case Ri:
                return x.data.append(p, b), x.data.ref;
              case bl:
                return x.data.toString();
              case _l:
                return x.data.map(function(P) {
                  return p.invoke(b, P);
                });
            }
          },
          p.attribCache = {};
        var v = {};
        return p.scopeAttrib = function(b) {
          var x = h.id(b);
          if (x in v) return v[x];
          var k = te.scope[x];
          k || (k = te.scope[x] = new L());
          var P = v[x] = c(k);
          return P;
        },
          p;
      }
      function he(p) {
        var c = p.static, S = p.dynamic, I;
        if (On in c) {
          var F = !!c[On];
          I = ht(function(T, A) {
            return F;
          }), I.enable = F;
        }
        else if (On in S) {
          var E = S[On];
          I = Rt(E, function(T, A) {
            return T.invoke(A, E);
          });
        }
        return I;
      }
      function ve(p, c) {
        var S = p.static, I = p.dynamic;
        if (Dr in S) {
          var F = S[Dr];
          return F
            ? (F = Z.getFramebuffer(F),
              m.command(F, "invalid framebuffer object"),
              ht(function(T, A) {
                var v = T.link(F), b = T.shared;
                A.set(b.framebuffer, ".next", v);
                var x = b.context;
                return A.set(x, "." + vn, v + ".width"),
                  A.set(x, "." + gn, v + ".height"),
                  v;
              }))
            : ht(function(T, A) {
              var v = T.shared;
              A.set(v.framebuffer, ".next", "null");
              var b = v.context;
              return A.set(b, "." + vn, b + "." + Dl),
                A.set(b, "." + gn, b + "." + Gl),
                "null";
            });
        }
        else if (Dr in I) {
          var E = I[Dr];
          return Rt(E, function(T, A) {
            var v = T.invoke(A, E),
              b = T.shared,
              x = b.framebuffer,
              k = A.def(x, ".getFramebuffer(", v, ")");
            m.optional(function() {
              T.assert(A, "!" + v + "||" + k, "invalid framebuffer object");
            }), A.set(x, ".next", k);
            var P = b.context;
            return A.set(P, "." + vn, k + "?" + k + ".width:" + P + "." + Dl),
              A.set(P, "." + gn, k + "?" + k + ".height:" + P + "." + Gl),
              k;
          });
        }
        else return null;
      }
      function Fe(p, c, S) {
        var I = p.static, F = p.dynamic;
        function E(v) {
          if (v in I) {
            var b = I[v];
            m.commandType(b, "object", "invalid " + v, S.commandStr);
            var x = !0, k = b.x | 0, P = b.y | 0, V, q;
            return "width" in b
              ? (V = b.width | 0,
                m.command(V >= 0, "invalid " + v, S.commandStr))
              : x = !1,
              "height" in b
                ? (q = b.height | 0,
                  m.command(q >= 0, "invalid " + v, S.commandStr))
                : x = !1,
              new bt(
                !x && c && c.thisDep,
                !x && c && c.contextDep,
                !x && c && c.propDep,
                function(Ee, xe) {
                  var H = Ee.shared.context, B = V;
                  "width" in b || (B = xe.def(H, ".", vn, "-", k));
                  var we = q;
                  return "height" in b || (we = xe.def(H, ".", gn, "-", P)),
                    [k, P, B, we];
                },
              );
          }
          else if (v in F) {
            var oe = F[v],
              ke = Rt(oe, function(Ee, xe) {
                var H = Ee.invoke(xe, oe);
                m.optional(function() {
                  Ee.assert(
                    xe,
                    H + "&&typeof " + H + "===\"object\"",
                    "invalid " + v,
                  );
                });
                var B = Ee.shared.context,
                  we = xe.def(H, ".x|0"),
                  Se = xe.def(H, ".y|0"),
                  Ce = xe.def(
                    "\"width\" in ",
                    H,
                    "?",
                    H,
                    ".width|0:",
                    "(",
                    B,
                    ".",
                    vn,
                    "-",
                    we,
                    ")",
                  ),
                  Ke = xe.def(
                    "\"height\" in ",
                    H,
                    "?",
                    H,
                    ".height|0:",
                    "(",
                    B,
                    ".",
                    gn,
                    "-",
                    Se,
                    ")",
                  );
                return m.optional(function() {
                  Ee.assert(xe, Ce + ">=0&&" + Ke + ">=0", "invalid " + v);
                }),
                  [we, Se, Ce, Ke];
              });
            return c
              && (ke.thisDep = ke.thisDep || c.thisDep,
                ke.contextDep = ke.contextDep || c.contextDep,
                ke.propDep = ke.propDep || c.propDep),
              ke;
          }
          else {return c
              ? new bt(c.thisDep, c.contextDep, c.propDep, function(Ee, xe) {
                var H = Ee.shared.context;
                return [0, 0, xe.def(H, ".", vn), xe.def(H, ".", gn)];
              }) : null;}
        }
        var T = E(dr);
        if (T) {
          var A = T;
          T = new bt(T.thisDep, T.contextDep, T.propDep, function(v, b) {
            var x = A.append(v, b), k = v.shared.context;
            return b.set(k, "." + Ip, x[2]), b.set(k, "." + Lp, x[3]), x;
          });
        }
        return { viewport: T, scissor_box: E(Ni) };
      }
      function Oe(p, c) {
        var S = p.static,
          I = typeof S[Gn] == "string" && typeof S[Dn] == "string";
        if (I) {
          if (Object.keys(c.dynamic).length > 0) return null;
          var F = c.static, E = Object.keys(F);
          if (E.length > 0 && typeof F[E[0]] == "number") {
            for (var T = [], A = 0; A < E.length; ++A) {
              m(
                typeof F[E[A]] == "number",
                "must specify all vertex attribute locations when using vaos",
              ), T.push([F[E[A]] | 0, E[A]]);
            }
            return T;
          }
        }
        return null;
      }
      function je(p, c, S) {
        var I = p.static, F = p.dynamic;
        function E(x) {
          if (x in I) {
            var k = h.id(I[x]);
            m.optional(function() {
              ne.shader(Xl[x], k, m.guessCommand());
            });
            var P = ht(function() {
              return k;
            });
            return P.id = k, P;
          }
          else if (x in F) {
            var V = F[x];
            return Rt(V, function(q, oe) {
              var ke = q.invoke(oe, V),
                Ee = oe.def(q.shared.strings, ".id(", ke, ")");
              return m.optional(function() {
                oe(
                  q.shared.shader,
                  ".shader(",
                  Xl[x],
                  ",",
                  Ee,
                  ",",
                  q.command,
                  ");",
                );
              }),
                Ee;
            });
          }
          return null;
        }
        var T = E(Gn), A = E(Dn), v = null, b;
        return Er(T) && Er(A)
          ? (v = ne.program(A.id, T.id, null, S),
            b = ht(function(x, k) {
              return x.link(v);
            }))
          : b = new bt(
            T && T.thisDep || A && A.thisDep,
            T && T.contextDep || A && A.contextDep,
            T && T.propDep || A && A.propDep,
            function(x, k) {
              var P = x.shared.shader, V;
              T ? V = T.append(x, k) : V = k.def(P, ".", Gn);
              var q;
              A ? q = A.append(x, k) : q = k.def(P, ".", Dn);
              var oe = P + ".program(" + q + "," + V;
              return m.optional(function() {
                oe += "," + x.command;
              }),
                k.def(oe + ")");
            },
          ),
          { frag: T, vert: A, progVar: b, program: v };
      }
      function at(p, c) {
        var S = p.static, I = p.dynamic, F = {}, E = !1;
        function T() {
          if (Bn in S) {
            var xe = S[Bn];
            return xe !== null && te.getVAO(xe) === null
              && (xe = te.createVAO(xe)),
              E = !0,
              F.vao = xe,
              ht(function(B) {
                var we = te.getVAO(xe);
                return we ? B.link(we) : "null";
              });
          }
          else if (Bn in I) {
            E = !0;
            var H = I[Bn];
            return Rt(H, function(B, we) {
              var Se = B.invoke(we, H);
              return we.def(B.shared.vao + ".getVAO(" + Se + ")");
            });
          }
          return null;
        }
        var A = T(), v = !1;
        function b() {
          if (Gr in S) {
            var xe = S[Gr];
            if (F.elements = xe, Hi(xe)) {
              var H = F.elements = N.create(xe, !0);
              xe = N.getElements(H), v = !0;
            }
            else {
              xe
                && (xe = N.getElements(xe),
                  v = !0,
                  m.command(xe, "invalid elements", c.commandStr));
            }
            var B = ht(function(Se, Ce) {
              if (xe) {
                var Ke = Se.link(xe);
                return Se.ELEMENTS = Ke, Ke;
              }
              return Se.ELEMENTS = null, null;
            });
            return B.value = xe, B;
          }
          else if (Gr in I) {
            v = !0;
            var we = I[Gr];
            return Rt(we, function(Se, Ce) {
              var Ke = Se.shared,
                It = Ke.isBufferArgs,
                Ur = Ke.elements,
                hr = Se.invoke(Ce, we),
                or = Ce.def("null"),
                Ar = Ce.def(It, "(", hr, ")"),
                qr = Se.cond(Ar).then(or, "=", Ur, ".createStream(", hr, ");")
                  .else(or, "=", Ur, ".getElements(", hr, ");");
              return m.optional(function() {
                Se.assert(qr.else, "!" + hr + "||" + or, "invalid elements");
              }),
                Ce.entry(qr),
                Ce.exit(Se.cond(Ar).then(Ur, ".destroyStream(", or, ");")),
                Se.ELEMENTS = or,
                or;
            });
          }
          else if (E) {
            return new bt(A.thisDep, A.contextDep, A.propDep, function(Se, Ce) {
              return Ce.def(
                Se.shared.vao + ".currentVAO?" + Se.shared.elements
                  + ".getElements(" + Se.shared.vao
                  + ".currentVAO.elements):null",
              );
            });
          }
          return null;
        }
        var x = b();
        function k() {
          if (Br in S) {
            var xe = S[Br];
            return F.primitive = xe,
              m.commandParameter(xe, _r, "invalid primitve", c.commandStr),
              ht(function(B, we) {
                return _r[xe];
              });
          }
          else if (Br in I) {
            var H = I[Br];
            return Rt(H, function(B, we) {
              var Se = B.constants.primTypes, Ce = B.invoke(we, H);
              return m.optional(function() {
                B.assert(
                  we,
                  Ce + " in " + Se,
                  "invalid primitive, must be one of " + Object.keys(_r),
                );
              }),
                we.def(Se, "[", Ce, "]");
            });
          }
          else {
            if (v) {
              return Er(x)
                ? x.value
                  ? ht(function(B, we) {
                    return we.def(B.ELEMENTS, ".primType");
                  })
                  : ht(function() {
                    return Na;
                  })
                : new bt(x.thisDep, x.contextDep, x.propDep, function(B, we) {
                  var Se = B.ELEMENTS;
                  return we.def(Se, "?", Se, ".primType:", Na);
                });
            }
            if (E) {
              return new bt(
                A.thisDep,
                A.contextDep,
                A.propDep,
                function(B, we) {
                  return we.def(
                    B.shared.vao + ".currentVAO?" + B.shared.vao
                      + ".currentVAO.primitive:" + Na,
                  );
                },
              );
            }
          }
          return null;
        }
        function P(xe, H) {
          if (xe in S) {
            var B = S[xe] | 0;
            return H ? F.offset = B : F.instances = B,
              m.command(!H || B >= 0, "invalid " + xe, c.commandStr),
              ht(function(Se, Ce) {
                return H && (Se.OFFSET = B), B;
              });
          }
          else if (xe in I) {
            var we = I[xe];
            return Rt(we, function(Se, Ce) {
              var Ke = Se.invoke(Ce, we);
              return H && (Se.OFFSET = Ke,
                m.optional(function() {
                  Se.assert(Ce, Ke + ">=0", "invalid " + xe);
                })),
                Ke;
            });
          }
          else if (H) {
            if (v) {return ht(function(Se, Ce) {
                return Se.OFFSET = 0, 0;
              });}
            if (E) {
              return new bt(
                A.thisDep,
                A.contextDep,
                A.propDep,
                function(Se, Ce) {
                  return Ce.def(
                    Se.shared.vao + ".currentVAO?" + Se.shared.vao
                      + ".currentVAO.offset:0",
                  );
                },
              );
            }
          }
          else if (E) {
            return new bt(A.thisDep, A.contextDep, A.propDep, function(Se, Ce) {
              return Ce.def(
                Se.shared.vao + ".currentVAO?" + Se.shared.vao
                  + ".currentVAO.instances:-1",
              );
            });
          }
          return null;
        }
        var V = P(Mi, !0);
        function q() {
          if (Vr in S) {
            var xe = S[Vr] | 0;
            return F.count = xe,
              m.command(
                typeof xe == "number" && xe >= 0,
                "invalid vertex count",
                c.commandStr,
              ),
              ht(function() {
                return xe;
              });
          }
          else if (Vr in I) {
            var H = I[Vr];
            return Rt(H, function(Ce, Ke) {
              var It = Ce.invoke(Ke, H);
              return m.optional(function() {
                Ce.assert(
                  Ke,
                  "typeof " + It + "===\"number\"&&" + It + ">=0&&" + It
                    + "===(" + It + "|0)",
                  "invalid vertex count",
                );
              }),
                It;
            });
          }
          else if (v) {
            if (Er(x)) {
              if (x) {
                return V
                  ? new bt(
                    V.thisDep,
                    V.contextDep,
                    V.propDep,
                    function(Ce, Ke) {
                      var It = Ke.def(Ce.ELEMENTS, ".vertCount-", Ce.OFFSET);
                      return m.optional(function() {
                        Ce.assert(
                          Ke,
                          It + ">=0",
                          "invalid vertex offset/element buffer too small",
                        );
                      }),
                        It;
                    },
                  )
                  : ht(function(Ce, Ke) {
                    return Ke.def(Ce.ELEMENTS, ".vertCount");
                  });
              }
              var B = ht(function() {
                return -1;
              });
              return m.optional(function() {
                B.MISSING = !0;
              }),
                B;
            }
            else {
              var we = new bt(
                x.thisDep || V.thisDep,
                x.contextDep || V.contextDep,
                x.propDep || V.propDep,
                function(Ce, Ke) {
                  var It = Ce.ELEMENTS;
                  return Ce.OFFSET
                    ? Ke.def(It, "?", It, ".vertCount-", Ce.OFFSET, ":-1")
                    : Ke.def(It, "?", It, ".vertCount:-1");
                },
              );
              return m.optional(function() {
                we.DYNAMIC = !0;
              }),
                we;
            }
          }
          else if (E) {
            var Se = new bt(
              A.thisDep,
              A.contextDep,
              A.propDep,
              function(Ce, Ke) {
                return Ke.def(
                  Ce.shared.vao,
                  ".currentVAO?",
                  Ce.shared.vao,
                  ".currentVAO.count:-1",
                );
              },
            );
            return Se;
          }
          return null;
        }
        var oe = k(), ke = q(), Ee = P(zi, !1);
        return {
          elements: x,
          primitive: oe,
          count: ke,
          instances: Ee,
          offset: V,
          vao: A,
          vaoActive: E,
          elementsActive: v,
          static: F,
        };
      }
      function st(p, c) {
        var S = p.static, I = p.dynamic, F = {};
        return Ae.forEach(function(E) {
          var T = be(E);
          function A(v, b) {
            if (E in S) {
              var x = v(S[E]);
              F[T] = ht(function() {
                return x;
              });
            }
            else if (E in I) {
              var k = I[E];
              F[T] = Rt(k, function(P, V) {
                return b(P, V, P.invoke(V, k));
              });
            }
          }
          switch (E) {
            case Fl:
            case wl:
            case Sl:
            case Nl:
            case El:
            case zl:
            case Pl:
            case kl:
            case Rl:
            case Ll:
              return A(function(v) {
                return m.commandType(v, "boolean", E, c.commandStr), v;
              }, function(v, b, x) {
                return m.optional(function() {
                  v.assert(
                    b,
                    "typeof " + x + "===\"boolean\"",
                    "invalid flag " + E,
                    v.commandStr,
                  );
                }),
                  x;
              });
            case Al:
              return A(function(v) {
                return m.commandParameter(v, yn, "invalid " + E, c.commandStr),
                  yn[v];
              }, function(v, b, x) {
                var k = v.constants.compareFuncs;
                return m.optional(function() {
                  v.assert(
                    b,
                    x + " in " + k,
                    "invalid " + E + ", must be one of " + Object.keys(yn),
                  );
                }),
                  b.def(k, "[", x, "]");
              });
            case Il:
              return A(function(v) {
                return m.command(
                  ot(v) && v.length === 2 && typeof v[0] == "number"
                    && typeof v[1] == "number" && v[0] <= v[1],
                  "depth range is 2d array",
                  c.commandStr,
                ),
                  v;
              }, function(v, b, x) {
                m.optional(function() {
                  v.assert(
                    b,
                    v.shared.isArrayLike + "(" + x + ")&&" + x
                      + ".length===2&&typeof " + x + "[0]===\"number\"&&typeof "
                      + x + "[1]===\"number\"&&" + x + "[0]<=" + x + "[1]",
                    "depth range must be a 2d array",
                  );
                });
                var k = b.def("+", x, "[0]"), P = b.def("+", x, "[1]");
                return [k, P];
              });
            case ba:
              return A(function(v) {
                m.commandType(v, "object", "blend.func", c.commandStr);
                var b = "srcRGB" in v ? v.srcRGB : v.src,
                  x = "srcAlpha" in v ? v.srcAlpha : v.src,
                  k = "dstRGB" in v ? v.dstRGB : v.dst,
                  P = "dstAlpha" in v ? v.dstAlpha : v.dst;
                return m.commandParameter(b, nr, T + ".srcRGB", c.commandStr),
                  m.commandParameter(x, nr, T + ".srcAlpha", c.commandStr),
                  m.commandParameter(k, nr, T + ".dstRGB", c.commandStr),
                  m.commandParameter(P, nr, T + ".dstAlpha", c.commandStr),
                  m.command(
                    Hl.indexOf(b + ", " + k) === -1,
                    "unallowed blending combination (srcRGB, dstRGB) = (" + b
                      + ", " + k + ")",
                    c.commandStr,
                  ),
                  [nr[b], nr[k], nr[x], nr[P]];
              }, function(v, b, x) {
                var k = v.constants.blendFuncs;
                m.optional(function() {
                  v.assert(
                    b,
                    x + "&&typeof " + x + "===\"object\"",
                    "invalid blend func, must be an object",
                  );
                });
                function P(H, B) {
                  var we = b.def(
                    "\"",
                    H,
                    B,
                    "\" in ",
                    x,
                    "?",
                    x,
                    ".",
                    H,
                    B,
                    ":",
                    x,
                    ".",
                    H,
                  );
                  return m.optional(function() {
                    v.assert(
                      b,
                      we + " in " + k,
                      "invalid " + E + "." + H + B + ", must be one of "
                        + Object.keys(nr),
                    );
                  }),
                    we;
                }
                var V = P("src", "RGB"), q = P("dst", "RGB");
                m.optional(function() {
                  var H = v.constants.invalidBlendCombinations;
                  v.assert(
                    b,
                    H + ".indexOf(" + V + "+\", \"+" + q + ") === -1 ",
                    "unallowed blending combination for (srcRGB, dstRGB)",
                  );
                });
                var oe = b.def(k, "[", V, "]"),
                  ke = b.def(k, "[", P("src", "Alpha"), "]"),
                  Ee = b.def(k, "[", q, "]"),
                  xe = b.def(k, "[", P("dst", "Alpha"), "]");
                return [oe, Ee, ke, xe];
              });
            case ya:
              return A(function(v) {
                if (typeof v == "string") {
                  return m.commandParameter(v, O, "invalid " + E, c.commandStr),
                    [O[v], O[v]];
                }
                if (typeof v == "object") {
                  return m.commandParameter(v.rgb, O, E + ".rgb", c.commandStr),
                    m.commandParameter(v.alpha, O, E + ".alpha", c.commandStr),
                    [O[v.rgb], O[v.alpha]];
                }
                m.commandRaise("invalid blend.equation", c.commandStr);
              }, function(v, b, x) {
                var k = v.constants.blendEquations,
                  P = b.def(),
                  V = b.def(),
                  q = v.cond("typeof ", x, "===\"string\"");
                return m.optional(function() {
                  function oe(ke, Ee, xe) {
                    v.assert(
                      ke,
                      xe + " in " + k,
                      "invalid " + Ee + ", must be one of " + Object.keys(O),
                    );
                  }
                  oe(q.then, E, x),
                    v.assert(
                      q.else,
                      x + "&&typeof " + x + "===\"object\"",
                      "invalid " + E,
                    ),
                    oe(q.else, E + ".rgb", x + ".rgb"),
                    oe(q.else, E + ".alpha", x + ".alpha");
                }),
                  q.then(P, "=", V, "=", k, "[", x, "];"),
                  q.else(
                    P,
                    "=",
                    k,
                    "[",
                    x,
                    ".rgb];",
                    V,
                    "=",
                    k,
                    "[",
                    x,
                    ".alpha];",
                  ),
                  b(q),
                  [P, V];
              });
            case Tl:
              return A(function(v) {
                return m.command(
                  ot(v) && v.length === 4,
                  "blend.color must be a 4d array",
                  c.commandStr,
                ),
                  Vt(4, function(b) {
                    return +v[b];
                  });
              }, function(v, b, x) {
                return m.optional(function() {
                  v.assert(
                    b,
                    v.shared.isArrayLike + "(" + x + ")&&" + x + ".length===4",
                    "blend.color must be a 4d array",
                  );
                }),
                  Vt(4, function(k) {
                    return b.def("+", x, "[", k, "]");
                  });
              });
            case Ml:
              return A(function(v) {
                return m.commandType(v, "number", T, c.commandStr), v | 0;
              }, function(v, b, x) {
                return m.optional(function() {
                  v.assert(
                    b,
                    "typeof " + x + "===\"number\"",
                    "invalid stencil.mask",
                  );
                }),
                  b.def(x, "|0");
              });
            case Aa:
              return A(function(v) {
                m.commandType(v, "object", T, c.commandStr);
                var b = v.cmp || "keep",
                  x = v.ref || 0,
                  k = "mask" in v ? v.mask : -1;
                return m.commandParameter(b, yn, E + ".cmp", c.commandStr),
                  m.commandType(x, "number", E + ".ref", c.commandStr),
                  m.commandType(k, "number", E + ".mask", c.commandStr),
                  [yn[b], x, k];
              }, function(v, b, x) {
                var k = v.constants.compareFuncs;
                m.optional(function() {
                  function oe() {
                    v.assert(
                      b,
                      Array.prototype.join.call(arguments, ""),
                      "invalid stencil.func",
                    );
                  }
                  oe(x + "&&typeof ", x, "===\"object\""),
                    oe("!(\"cmp\" in ", x, ")||(", x, ".cmp in ", k, ")");
                });
                var P = b.def(
                    "\"cmp\" in ",
                    x,
                    "?",
                    k,
                    "[",
                    x,
                    ".cmp]",
                    ":",
                    wr,
                  ),
                  V = b.def(x, ".ref|0"),
                  q = b.def("\"mask\" in ", x, "?", x, ".mask|0:-1");
                return [P, V, q];
              });
            case Ia:
            case zn:
              return A(function(v) {
                m.commandType(v, "object", T, c.commandStr);
                var b = v.fail || "keep",
                  x = v.zfail || "keep",
                  k = v.zpass || "keep";
                return m.commandParameter(b, Tr, E + ".fail", c.commandStr),
                  m.commandParameter(x, Tr, E + ".zfail", c.commandStr),
                  m.commandParameter(k, Tr, E + ".zpass", c.commandStr),
                  [E === zn ? $r : Hn, Tr[b], Tr[x], Tr[k]];
              }, function(v, b, x) {
                var k = v.constants.stencilOps;
                m.optional(function() {
                  v.assert(
                    b,
                    x + "&&typeof " + x + "===\"object\"",
                    "invalid " + E,
                  );
                });
                function P(V) {
                  return m.optional(function() {
                    v.assert(
                      b,
                      "!(\"" + V + "\" in " + x + ")||(" + x + "." + V + " in "
                        + k + ")",
                      "invalid " + E + "." + V + ", must be one of "
                        + Object.keys(Tr),
                    );
                  }),
                    b.def(
                      "\"",
                      V,
                      "\" in ",
                      x,
                      "?",
                      k,
                      "[",
                      x,
                      ".",
                      V,
                      "]:",
                      wr,
                    );
                }
                return [E === zn ? $r : Hn, P("fail"), P("zfail"), P("zpass")];
              });
            case Ta:
              return A(function(v) {
                m.commandType(v, "object", T, c.commandStr);
                var b = v.factor | 0, x = v.units | 0;
                return m.commandType(b, "number", T + ".factor", c.commandStr),
                  m.commandType(x, "number", T + ".units", c.commandStr),
                  [b, x];
              }, function(v, b, x) {
                m.optional(function() {
                  v.assert(
                    b,
                    x + "&&typeof " + x + "===\"object\"",
                    "invalid " + E,
                  );
                });
                var k = b.def(x, ".factor|0"), P = b.def(x, ".units|0");
                return [k, P];
              });
            case Cl:
              return A(function(v) {
                var b = 0;
                return v === "front" ? b = Hn : v === "back" && (b = $r),
                  m.command(!!b, T, c.commandStr),
                  b;
              }, function(v, b, x) {
                return m.optional(function() {
                  v.assert(
                    b,
                    x + "===\"front\"||" + x + "===\"back\"",
                    "invalid cull.face",
                  );
                }),
                  b.def(x, "===\"front\"?", Hn, ":", $r);
              });
            case wa:
              return A(function(v) {
                return m.command(
                  typeof v == "number" && v >= M.lineWidthDims[0]
                    && v <= M.lineWidthDims[1],
                  "invalid line width, must be a positive number between "
                    + M.lineWidthDims[0] + " and " + M.lineWidthDims[1],
                  c.commandStr,
                ),
                  v;
              }, function(v, b, x) {
                return m.optional(function() {
                  v.assert(
                    b,
                    "typeof " + x + "===\"number\"&&" + x + ">="
                      + M.lineWidthDims[0] + "&&" + x + "<="
                      + M.lineWidthDims[1],
                    "invalid line width",
                  );
                }),
                  x;
              });
            case Sa:
              return A(function(v) {
                return m.commandParameter(v, za, T, c.commandStr), za[v];
              }, function(v, b, x) {
                return m.optional(function() {
                  v.assert(
                    b,
                    x + "===\"cw\"||" + x + "===\"ccw\"",
                    "invalid frontFace, must be one of cw,ccw",
                  );
                }),
                  b.def(x + "===\"cw\"?" + Vl + ":" + Ma);
              });
            case _a:
              return A(function(v) {
                return m.command(
                  ot(v) && v.length === 4,
                  "color.mask must be length 4 array",
                  c.commandStr,
                ),
                  v.map(function(b) {
                    return !!b;
                  });
              }, function(v, b, x) {
                return m.optional(function() {
                  v.assert(
                    b,
                    v.shared.isArrayLike + "(" + x + ")&&" + x + ".length===4",
                    "invalid color.mask",
                  );
                }),
                  Vt(4, function(k) {
                    return "!!" + x + "[" + k + "]";
                  });
              });
            case Ea:
              return A(function(v) {
                m.command(typeof v == "object" && v, T, c.commandStr);
                var b = "value" in v ? v.value : 1, x = !!v.invert;
                return m.command(
                  typeof b == "number" && b >= 0 && b <= 1,
                  "sample.coverage.value must be a number between 0 and 1",
                  c.commandStr,
                ),
                  [b, x];
              }, function(v, b, x) {
                m.optional(function() {
                  v.assert(
                    b,
                    x + "&&typeof " + x + "===\"object\"",
                    "invalid sample.coverage",
                  );
                });
                var k = b.def("\"value\" in ", x, "?+", x, ".value:1"),
                  P = b.def("!!", x, ".invert");
                return [k, P];
              });
          }
        }),
          F;
      }
      function He(p, c) {
        var S = p.static, I = p.dynamic, F = {};
        return Object.keys(S).forEach(function(E) {
          var T = S[E], A;
          if (typeof T == "number" || typeof T == "boolean") {
            A = ht(function() {
              return T;
            });
          }
          else if (typeof T == "function") {
            var v = T._reglType;
            v === "texture2d" || v === "textureCube"
              ? A = ht(function(b) {
                return b.link(T);
              })
              : v === "framebuffer" || v === "framebufferCube"
              ? (m.command(
                T.color.length > 0,
                "missing color attachment for framebuffer sent to uniform \""
                  + E + "\"",
                c.commandStr,
              ),
                A = ht(function(b) {
                  return b.link(T.color[0]);
                }))
              : m.commandRaise(
                "invalid data for uniform \"" + E + "\"",
                c.commandStr,
              );
          }
          else {
            ot(T)
              ? A = ht(function(b) {
                var x = b.global.def(
                  "[",
                  Vt(T.length, function(k) {
                    return m.command(
                      typeof T[k] == "number" || typeof T[k] == "boolean",
                      "invalid uniform " + E,
                      b.commandStr,
                    ),
                      T[k];
                  }),
                  "]",
                );
                return x;
              })
              : m.commandRaise(
                "invalid or missing data for uniform \"" + E + "\"",
                c.commandStr,
              );
          }
          A.value = T, F[E] = A;
        }),
          Object.keys(I).forEach(function(E) {
            var T = I[E];
            F[E] = Rt(T, function(A, v) {
              return A.invoke(v, T);
            });
          }),
          F;
      }
      function gt(p, c) {
        var S = p.static, I = p.dynamic, F = {};
        return Object.keys(S).forEach(function(E) {
          var T = S[E], A = h.id(E), v = new L();
          if (Hi(T)) {
            v.state = pn,
              v.buffer = j.getBuffer(j.create(T, xn, !1, !0)),
              v.type = 0;
          }
          else {
            var b = j.getBuffer(T);
            if (b) v.state = pn, v.buffer = b, v.type = 0;
            else if (
              m.command(
                typeof T == "object" && T,
                "invalid data for attribute " + E,
                c.commandStr,
              ), "constant" in T
            ) {
              var x = T.constant;
              v.buffer = "null",
                v.state = ma,
                typeof x == "number"
                  ? v.x = x
                  : (m.command(
                    ot(x) && x.length > 0 && x.length <= 4,
                    "invalid constant for attribute " + E,
                    c.commandStr,
                  ),
                    mn.forEach(function(Ee, xe) {
                      xe < x.length && (v[Ee] = x[xe]);
                    }));
            }
            else {
              Hi(T.buffer)
                ? b = j.getBuffer(j.create(T.buffer, xn, !1, !0))
                : b = j.getBuffer(T.buffer),
                m.command(
                  !!b,
                  "missing buffer for attribute \"" + E + "\"",
                  c.commandStr,
                );
              var k = T.offset | 0;
              m.command(
                k >= 0,
                "invalid offset for attribute \"" + E + "\"",
                c.commandStr,
              );
              var P = T.stride | 0;
              m.command(
                P >= 0 && P < 256,
                "invalid stride for attribute \"" + E
                  + "\", must be integer betweeen [0, 255]",
                c.commandStr,
              );
              var V = T.size | 0;
              m.command(
                !("size" in T) || V > 0 && V <= 4,
                "invalid size for attribute \"" + E + "\", must be 1,2,3,4",
                c.commandStr,
              );
              var q = !!T.normalized, oe = 0;
              "type" in T
                && (m.commandParameter(
                  T.type,
                  Rr,
                  "invalid type for attribute " + E,
                  c.commandStr,
                ),
                  oe = Rr[T.type]);
              var ke = T.divisor | 0;
              m.optional(function() {
                "divisor" in T
                  && (m.command(
                    ke === 0 || J,
                    "cannot specify divisor for attribute \"" + E
                      + "\", instancing not supported",
                    c.commandStr,
                  ),
                    m.command(
                      ke >= 0,
                      "invalid divisor for attribute \"" + E + "\"",
                      c.commandStr,
                    ));
                var Ee = c.commandStr,
                  xe = [
                    "buffer",
                    "offset",
                    "divisor",
                    "normalized",
                    "type",
                    "size",
                    "stride",
                  ];
                Object.keys(T).forEach(function(H) {
                  m.command(
                    xe.indexOf(H) >= 0,
                    "unknown parameter \"" + H + "\" for attribute pointer \""
                      + E + "\" (valid parameters are " + xe + ")",
                    Ee,
                  );
                });
              }),
                v.buffer = b,
                v.state = pn,
                v.size = V,
                v.normalized = q,
                v.type = oe || b.dtype,
                v.offset = k,
                v.stride = P,
                v.divisor = ke;
            }
          }
          F[E] = ht(function(Ee, xe) {
            var H = Ee.attribCache;
            if (A in H) return H[A];
            var B = { isStream: !1 };
            return Object.keys(v).forEach(function(we) {
              B[we] = v[we];
            }),
              v.buffer
              && (B.buffer = Ee.link(v.buffer),
                B.type = B.type || B.buffer + ".dtype"),
              H[A] = B,
              B;
          });
        }),
          Object.keys(I).forEach(function(E) {
            var T = I[E];
            function A(v, b) {
              var x = v.invoke(b, T),
                k = v.shared,
                P = v.constants,
                V = k.isBufferArgs,
                q = k.buffer;
              m.optional(function() {
                v.assert(
                  b,
                  x + "&&(typeof " + x + "===\"object\"||typeof " + x
                    + "===\"function\")&&(" + V + "(" + x + ")||" + q
                    + ".getBuffer(" + x + ")||" + q + ".getBuffer(" + x
                    + ".buffer)||" + V + "(" + x + ".buffer)||(\"constant\" in "
                    + x + "&&(typeof " + x + ".constant===\"number\"||"
                    + k.isArrayLike + "(" + x + ".constant))))",
                  "invalid dynamic attribute \"" + E + "\"",
                );
              });
              var oe = { isStream: b.def(!1) }, ke = new L();
              ke.state = pn,
                Object.keys(ke).forEach(function(B) {
                  oe[B] = b.def("" + ke[B]);
                });
              var Ee = oe.buffer, xe = oe.type;
              b(
                "if(",
                V,
                "(",
                x,
                ")){",
                oe.isStream,
                "=true;",
                Ee,
                "=",
                q,
                ".createStream(",
                xn,
                ",",
                x,
                ");",
                xe,
                "=",
                Ee,
                ".dtype;",
                "}else{",
                Ee,
                "=",
                q,
                ".getBuffer(",
                x,
                ");",
                "if(",
                Ee,
                "){",
                xe,
                "=",
                Ee,
                ".dtype;",
                "}else if(\"constant\" in ",
                x,
                "){",
                oe.state,
                "=",
                ma,
                ";",
                "if(typeof " + x + ".constant === \"number\"){",
                oe[mn[0]],
                "=",
                x,
                ".constant;",
                mn.slice(1).map(function(B) {
                  return oe[B];
                }).join("="),
                "=0;",
                "}else{",
                mn.map(function(B, we) {
                  return oe[B] + "=" + x + ".constant.length>" + we + "?" + x
                    + ".constant[" + we + "]:0;";
                }).join(""),
                "}}else{",
                "if(",
                V,
                "(",
                x,
                ".buffer)){",
                Ee,
                "=",
                q,
                ".createStream(",
                xn,
                ",",
                x,
                ".buffer);",
                "}else{",
                Ee,
                "=",
                q,
                ".getBuffer(",
                x,
                ".buffer);",
                "}",
                xe,
                "=\"type\" in ",
                x,
                "?",
                P.glTypes,
                "[",
                x,
                ".type]:",
                Ee,
                ".dtype;",
                oe.normalized,
                "=!!",
                x,
                ".normalized;",
              );
              function H(B) {
                b(oe[B], "=", x, ".", B, "|0;");
              }
              return H("size"),
                H("offset"),
                H("stride"),
                H("divisor"),
                b("}}"),
                b.exit(
                  "if(",
                  oe.isStream,
                  "){",
                  q,
                  ".destroyStream(",
                  Ee,
                  ");",
                  "}",
                ),
                oe;
            }
            F[E] = Rt(T, A);
          }),
          F;
      }
      function it(p) {
        var c = p.static, S = p.dynamic, I = {};
        return Object.keys(c).forEach(function(F) {
          var E = c[F];
          I[F] = ht(function(T, A) {
            return typeof E == "number" || typeof E == "boolean"
              ? "" + E
              : T.link(E);
          });
        }),
          Object.keys(S).forEach(function(F) {
            var E = S[F];
            I[F] = Rt(E, function(T, A) {
              return T.invoke(A, E);
            });
          }),
          I;
      }
      function mt(p, c, S, I, F) {
        var E = p.static, T = p.dynamic;
        m.optional(function() {
          var H = [Dr, Dn, Gn, Gr, Br, Mi, Vr, zi, On, Bn].concat(Ae);
          function B(we) {
            Object.keys(we).forEach(function(Se) {
              m.command(
                H.indexOf(Se) >= 0,
                "unknown parameter \"" + Se + "\"",
                F.commandStr,
              );
            });
          }
          B(E), B(T);
        });
        var A = Oe(p, c),
          v = ve(p, F),
          b = Fe(p, v, F),
          x = at(p, F),
          k = st(p, F),
          P = je(p, F, A);
        function V(H) {
          var B = b[H];
          B && (k[H] = B);
        }
        V(dr), V(be(Ni));
        var q = Object.keys(k).length > 0,
          oe = {
            framebuffer: v,
            draw: x,
            shader: P,
            state: k,
            dirty: q,
            scopeVAO: null,
            drawVAO: null,
            useVAO: !1,
            attributes: {},
          };
        if (
          oe.profile = he(p, F),
            oe.uniforms = He(S, F),
            oe.drawVAO = oe.scopeVAO = x.vao,
            !oe.drawVAO && P.program && !A && _.angle_instanced_arrays
            && x.static.elements
        ) {
          var ke = !0,
            Ee = P.program.attributes.map(function(H) {
              var B = c.static[H];
              return ke = ke && !!B, B;
            });
          if (ke && Ee.length > 0) {
            var xe = te.getVAO(
              te.createVAO({ attributes: Ee, elements: x.static.elements }),
            );
            oe.drawVAO = new bt(null, null, null, function(H, B) {
              return H.link(xe);
            }), oe.useVAO = !0;
          }
        }
        return A ? oe.useVAO = !0 : oe.attributes = gt(c, F),
          oe.context = it(I, F),
          oe;
      }
      function xt(p, c, S) {
        var I = p.shared, F = I.context, E = p.scope();
        Object.keys(S).forEach(function(T) {
          c.save(F, "." + T);
          var A = S[T], v = A.append(p, c);
          Array.isArray(v)
            ? E(F, ".", T, "=[", v.join(), "];")
            : E(F, ".", T, "=", v, ";");
        }), c(E);
      }
      function yt(p, c, S, I) {
        var F = p.shared, E = F.gl, T = F.framebuffer, A;
        ge && (A = c.def(F.extensions, ".webgl_draw_buffers"));
        var v = p.constants, b = v.drawBuffer, x = v.backBuffer, k;
        S ? k = S.append(p, c) : k = c.def(T, ".next"),
          I || c("if(", k, "!==", T, ".cur){"),
          c(
            "if(",
            k,
            "){",
            E,
            ".bindFramebuffer(",
            ql,
            ",",
            k,
            ".framebuffer);",
          ),
          ge
          && c(
            A,
            ".drawBuffersWEBGL(",
            b,
            "[",
            k,
            ".colorAttachments.length]);",
          ),
          c("}else{", E, ".bindFramebuffer(", ql, ",null);"),
          ge && c(A, ".drawBuffersWEBGL(", x, ");"),
          c("}", T, ".cur=", k, ";"),
          I || c("}");
      }
      function St(p, c, S) {
        var I = p.shared,
          F = I.gl,
          E = p.current,
          T = p.next,
          A = I.current,
          v = I.next,
          b = p.cond(A, ".dirty");
        Ae.forEach(function(x) {
          var k = be(x);
          if (!(k in S.state)) {
            var P, V;
            if (k in T) {
              P = T[k], V = E[k];
              var q = Vt(pe[k].length, function(ke) {
                return b.def(P, "[", ke, "]");
              });
              b(
                p.cond(
                  q.map(function(ke, Ee) {
                    return ke + "!==" + V + "[" + Ee + "]";
                  }).join("||"),
                ).then(
                  F,
                  ".",
                  $[k],
                  "(",
                  q,
                  ");",
                  q.map(function(ke, Ee) {
                    return V + "[" + Ee + "]=" + ke;
                  }).join(";"),
                  ";",
                ),
              );
            }
            else {
              P = b.def(v, ".", k);
              var oe = p.cond(P, "!==", A, ".", k);
              b(oe),
                k in U
                  ? oe(
                    p.cond(P).then(F, ".enable(", U[k], ");").else(
                      F,
                      ".disable(",
                      U[k],
                      ");",
                    ),
                    A,
                    ".",
                    k,
                    "=",
                    P,
                    ";",
                  )
                  : oe(F, ".", $[k], "(", P, ");", A, ".", k, "=", P, ";");
            }
          }
        }),
          Object.keys(S.state).length === 0 && b(A, ".dirty=false;"),
          c(b);
      }
      function Et(p, c, S, I) {
        var F = p.shared, E = p.current, T = F.current, A = F.gl;
        Yl(Object.keys(S)).forEach(function(v) {
          var b = S[v];
          if (!(I && !I(b))) {
            var x = b.append(p, c);
            if (U[v]) {
              var k = U[v];
              Er(b)
                ? x ? c(A, ".enable(", k, ");") : c(A, ".disable(", k, ");")
                : c(
                  p.cond(x).then(A, ".enable(", k, ");").else(
                    A,
                    ".disable(",
                    k,
                    ");",
                  ),
                ), c(T, ".", v, "=", x, ";");
            }
            else if (ot(x)) {
              var P = E[v];
              c(
                A,
                ".",
                $[v],
                "(",
                x,
                ");",
                x.map(function(V, q) {
                  return P + "[" + q + "]=" + V;
                }).join(";"),
                ";",
              );
            }
            else c(A, ".", $[v], "(", x, ");", T, ".", v, "=", x, ";");
          }
        });
      }
      function ut(p, c) {
        J && (p.instancing = c.def(
          p.shared.extensions,
          ".angle_instanced_arrays",
        ));
      }
      function Be(p, c, S, I, F) {
        var E = p.shared,
          T = p.stats,
          A = E.current,
          v = E.timer,
          b = S.profile;
        function x() {
          return typeof performance > "u" ? "Date.now()" : "performance.now()";
        }
        var k, P;
        function V(H) {
          k = c.def(),
            H(k, "=", x(), ";"),
            typeof F == "string" ? H(T, ".count+=", F, ";") : H(T, ".count++;"),
            Q && (I
              ? (P = c.def(), H(P, "=", v, ".getNumPendingQueries();"))
              : H(v, ".beginQuery(", T, ");"));
        }
        function q(H) {
          H(T, ".cpuTime+=", x(), "-", k, ";"),
            Q
            && (I
              ? H(
                v,
                ".pushScopeStats(",
                P,
                ",",
                v,
                ".getNumPendingQueries(),",
                T,
                ");",
              )
              : H(v, ".endQuery();"));
        }
        function oe(H) {
          var B = c.def(A, ".profile");
          c(A, ".profile=", H, ";"), c.exit(A, ".profile=", B, ";");
        }
        var ke;
        if (b) {
          if (Er(b)) {
            b.enable ? (V(c), q(c.exit), oe("true")) : oe("false");
            return;
          }
          ke = b.append(p, c), oe(ke);
        }
        else ke = c.def(A, ".profile");
        var Ee = p.block();
        V(Ee), c("if(", ke, "){", Ee, "}");
        var xe = p.block();
        q(xe), c.exit("if(", ke, "){", xe, "}");
      }
      function At(p, c, S, I, F) {
        var E = p.shared;
        function T(v) {
          switch (v) {
            case Oi:
            case Bi:
            case ji:
              return 2;
            case Di:
            case Vi:
            case Ui:
              return 3;
            case Gi:
            case $i:
            case qi:
              return 4;
            default:
              return 1;
          }
        }
        function A(v, b, x) {
          var k = E.gl,
            P = c.def(v, ".location"),
            V = c.def(E.attributes, "[", P, "]"),
            q = x.state,
            oe = x.buffer,
            ke = [x.x, x.y, x.z, x.w],
            Ee = ["buffer", "normalized", "offset", "stride"];
          function xe() {
            c("if(!", V, ".buffer){", k, ".enableVertexAttribArray(", P, ");}");
            var B = x.type, we;
            if (
              x.size ? we = c.def(x.size, "||", b) : we = b,
                c(
                  "if(",
                  V,
                  ".type!==",
                  B,
                  "||",
                  V,
                  ".size!==",
                  we,
                  "||",
                  Ee.map(function(Ce) {
                    return V + "." + Ce + "!==" + x[Ce];
                  }).join("||"),
                  "){",
                  k,
                  ".bindBuffer(",
                  xn,
                  ",",
                  oe,
                  ".buffer);",
                  k,
                  ".vertexAttribPointer(",
                  [P, we, B, x.normalized, x.stride, x.offset],
                  ");",
                  V,
                  ".type=",
                  B,
                  ";",
                  V,
                  ".size=",
                  we,
                  ";",
                  Ee.map(function(Ce) {
                    return V + "." + Ce + "=" + x[Ce] + ";";
                  }).join(""),
                  "}",
                ),
                J
            ) {
              var Se = x.divisor;
              c(
                "if(",
                V,
                ".divisor!==",
                Se,
                "){",
                p.instancing,
                ".vertexAttribDivisorANGLE(",
                [P, Se],
                ");",
                V,
                ".divisor=",
                Se,
                ";}",
              );
            }
          }
          function H() {
            c(
              "if(",
              V,
              ".buffer){",
              k,
              ".disableVertexAttribArray(",
              P,
              ");",
              V,
              ".buffer=null;",
              "}if(",
              mn.map(function(B, we) {
                return V + "." + B + "!==" + ke[we];
              }).join("||"),
              "){",
              k,
              ".vertexAttrib4f(",
              P,
              ",",
              ke,
              ");",
              mn.map(function(B, we) {
                return V + "." + B + "=" + ke[we] + ";";
              }).join(""),
              "}",
            );
          }
          q === pn
            ? xe()
            : q === ma
            ? H()
            : (c("if(", q, "===", pn, "){"), xe(), c("}else{"), H(), c("}"));
        }
        I.forEach(function(v) {
          var b = v.name, x = S.attributes[b], k;
          if (x) {
            if (!F(x)) return;
            k = x.append(p, c);
          }
          else {
            if (!F(Wl)) return;
            var P = p.scopeAttrib(b);
            m.optional(function() {
              p.assert(c, P + ".state", "missing attribute " + b);
            }),
              k = {},
              Object.keys(new L()).forEach(function(V) {
                k[V] = c.def(P, ".", V);
              });
          }
          A(p.link(v), T(v.info.type), k);
        });
      }
      function Qe(p, c, S, I, F, E) {
        for (var T = p.shared, A = T.gl, v = {}, b, x = 0; x < I.length; ++x) {
          var k = I[x],
            P = k.name,
            V = k.info.type,
            q = k.info.size,
            oe = S.uniforms[P];
          if (q > 1) {
            if (!oe) continue;
            var ke = P.replace("[0]", "");
            if (v[ke]) continue;
            v[ke] = 1;
          }
          var Ee = p.link(k), xe = Ee + ".location", H;
          if (oe) {
            if (!F(oe)) continue;
            if (Er(oe)) {
              var B = oe.value;
              if (
                m.command(
                  B !== null && typeof B < "u",
                  "missing uniform \"" + P + "\"",
                  p.commandStr,
                ), V === Un || V === qn
              ) {
                m.command(
                  typeof B == "function"
                    && (V === Un
                        && (B._reglType === "texture2d"
                          || B._reglType === "framebuffer")
                      || V === qn
                        && (B._reglType === "textureCube"
                          || B._reglType === "framebufferCube")),
                  "invalid texture for uniform " + P,
                  p.commandStr,
                );
                var we = p.link(B._texture || B.color[0]._texture);
                c(A, ".uniform1i(", xe, ",", we + ".bind());"),
                  c.exit(we, ".unbind();");
              }
              else if (V === Vn || V === $n || V === jn) {
                m.optional(function() {
                  m.command(
                    ot(B),
                    "invalid matrix for uniform " + P,
                    p.commandStr,
                  ),
                    m.command(
                      V === Vn && B.length === 4 || V === $n && B.length === 9
                        || V === jn && B.length === 16,
                      "invalid length for matrix uniform " + P,
                      p.commandStr,
                    );
                });
                var Se = p.global.def(
                    "new Float32Array([" + Array.prototype.slice.call(B) + "])",
                  ),
                  Ce = 2;
                V === $n ? Ce = 3 : V === jn && (Ce = 4),
                  c(A, ".uniformMatrix", Ce, "fv(", xe, ",false,", Se, ");");
              }
              else {
                switch (V) {
                  case Pa:
                    q === 1
                      ? m.commandType(B, "number", "uniform " + P, p.commandStr)
                      : m.command(
                        ot(B) && B.length === q,
                        "uniform " + P,
                        p.commandStr,
                      ), b = "1f";
                    break;
                  case Oi:
                    m.command(
                      ot(B) && B.length && B.length % 2 === 0
                        && B.length <= q * 2,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "2f";
                    break;
                  case Di:
                    m.command(
                      ot(B) && B.length && B.length % 3 === 0
                        && B.length <= q * 3,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "3f";
                    break;
                  case Gi:
                    m.command(
                      ot(B) && B.length && B.length % 4 === 0
                        && B.length <= q * 4,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "4f";
                    break;
                  case Ra:
                    q === 1
                      ? m.commandType(
                        B,
                        "boolean",
                        "uniform " + P,
                        p.commandStr,
                      )
                      : m.command(
                        ot(B) && B.length === q,
                        "uniform " + P,
                        p.commandStr,
                      ), b = "1i";
                    break;
                  case ka:
                    q === 1
                      ? m.commandType(B, "number", "uniform " + P, p.commandStr)
                      : m.command(
                        ot(B) && B.length === q,
                        "uniform " + P,
                        p.commandStr,
                      ), b = "1i";
                    break;
                  case ji:
                    m.command(
                      ot(B) && B.length && B.length % 2 === 0
                        && B.length <= q * 2,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "2i";
                    break;
                  case Bi:
                    m.command(
                      ot(B) && B.length && B.length % 2 === 0
                        && B.length <= q * 2,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "2i";
                    break;
                  case Ui:
                    m.command(
                      ot(B) && B.length && B.length % 3 === 0
                        && B.length <= q * 3,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "3i";
                    break;
                  case Vi:
                    m.command(
                      ot(B) && B.length && B.length % 3 === 0
                        && B.length <= q * 3,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "3i";
                    break;
                  case qi:
                    m.command(
                      ot(B) && B.length && B.length % 4 === 0
                        && B.length <= q * 4,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "4i";
                    break;
                  case $i:
                    m.command(
                      ot(B) && B.length && B.length % 4 === 0
                        && B.length <= q * 4,
                      "uniform " + P,
                      p.commandStr,
                    ), b = "4i";
                    break;
                }
                q > 1
                  ? (b += "v",
                    B = p.global.def("[" + Array.prototype.slice.call(B) + "]"))
                  : B = ot(B) ? Array.prototype.slice.call(B) : B,
                  c(A, ".uniform", b, "(", xe, ",", B, ");");
              }
              continue;
            }
            else H = oe.append(p, c);
          }
          else {
            if (!F(Wl)) continue;
            H = c.def(T.uniforms, "[", h.id(P), "]");
          }
          V === Un
            ? (m(!Array.isArray(H), "must specify a scalar prop for textures"),
              c(
                "if(",
                H,
                "&&",
                H,
                "._reglType===\"framebuffer\"){",
                H,
                "=",
                H,
                ".color[0];",
                "}",
              ))
            : V === qn
              && (m(
                !Array.isArray(H),
                "must specify a scalar prop for cube maps",
              ),
                c(
                  "if(",
                  H,
                  "&&",
                  H,
                  "._reglType===\"framebufferCube\"){",
                  H,
                  "=",
                  H,
                  ".color[0];",
                  "}",
                )),
            m.optional(function() {
              function jt(Nt, Xi) {
                p.assert(
                  c,
                  Nt,
                  "bad data or missing for uniform \"" + P + "\".  " + Xi,
                );
              }
              function Hr(Nt, Xi) {
                Xi === 1
                && m(
                  !Array.isArray(H),
                  "must not specify an array type for uniform",
                ),
                  jt(
                    "Array.isArray(" + H + ") && typeof " + H + "[0]===\" " + Nt
                      + "\" || typeof " + H + "===\"" + Nt + "\"",
                    "invalid type, expected " + Nt,
                  );
              }
              function Xt(Nt, Xi, Yi) {
                Array.isArray(H)
                  ? m(
                    H.length && H.length % Nt === 0 && H.length <= Nt * Yi,
                    "must have length of " + (Yi === 1 ? "" : "n * ") + Nt,
                  )
                  : jt(
                    T.isArrayLike + "(" + H + ")&&" + H + ".length && " + H
                      + ".length % " + Nt + " === 0 && " + H + ".length<="
                      + Nt * Yi,
                    "invalid vector, should have length of " + (Yi === 1
                      ? ""
                      : "n * ") + Nt,
                    p.commandStr,
                  );
              }
              function ru(Nt) {
                m(!Array.isArray(H), "must not specify a value type"),
                  jt(
                    "typeof " + H + "===\"function\"&&" + H
                      + "._reglType===\"texture" + (Nt === Bl ? "2d" : "Cube")
                      + "\"",
                    "invalid texture type",
                    p.commandStr,
                  );
              }
              switch (V) {
                case ka:
                  Hr("number", q);
                  break;
                case Bi:
                  Xt(2, "number", q);
                  break;
                case Vi:
                  Xt(3, "number", q);
                  break;
                case $i:
                  Xt(4, "number", q);
                  break;
                case Pa:
                  Hr("number", q);
                  break;
                case Oi:
                  Xt(2, "number", q);
                  break;
                case Di:
                  Xt(3, "number", q);
                  break;
                case Gi:
                  Xt(4, "number", q);
                  break;
                case Ra:
                  Hr("boolean", q);
                  break;
                case ji:
                  Xt(2, "boolean", q);
                  break;
                case Ui:
                  Xt(3, "boolean", q);
                  break;
                case qi:
                  Xt(4, "boolean", q);
                  break;
                case Vn:
                  Xt(4, "number", q);
                  break;
                case $n:
                  Xt(9, "number", q);
                  break;
                case jn:
                  Xt(16, "number", q);
                  break;
                case Un:
                  ru(Bl);
                  break;
                case qn:
                  ru(kp);
                  break;
              }
            });
          var Ke = 1;
          switch (V) {
            case Un:
            case qn:
              var It = c.def(H, "._texture");
              c(A, ".uniform1i(", xe, ",", It, ".bind());"),
                c.exit(It, ".unbind();");
              continue;
            case ka:
            case Ra:
              b = "1i";
              break;
            case Bi:
            case ji:
              b = "2i", Ke = 2;
              break;
            case Vi:
            case Ui:
              b = "3i", Ke = 3;
              break;
            case $i:
            case qi:
              b = "4i", Ke = 4;
              break;
            case Pa:
              b = "1f";
              break;
            case Oi:
              b = "2f", Ke = 2;
              break;
            case Di:
              b = "3f", Ke = 3;
              break;
            case Gi:
              b = "4f", Ke = 4;
              break;
            case Vn:
              b = "Matrix2fv";
              break;
            case $n:
              b = "Matrix3fv";
              break;
            case jn:
              b = "Matrix4fv";
              break;
          }
          if (
            b.indexOf("Matrix") === -1 && q > 1 && (b += "v", Ke = 1),
              b.charAt(0) === "M"
          ) {
            c(A, ".uniform", b, "(", xe, ",");
            var Ur = Math.pow(V - Vn + 2, 2),
              hr = p.global.def("new Float32Array(", Ur, ")");
            Array.isArray(H)
              ? c(
                "false,(",
                Vt(Ur, function(jt) {
                  return hr + "[" + jt + "]=" + H[jt];
                }),
                ",",
                hr,
                ")",
              )
              : c(
                "false,(Array.isArray(",
                H,
                ")||",
                H,
                " instanceof Float32Array)?",
                H,
                ":(",
                Vt(Ur, function(jt) {
                  return hr + "[" + jt + "]=" + H + "[" + jt + "]";
                }),
                ",",
                hr,
                ")",
              ), c(");");
          }
          else if (Ke > 1) {
            for (var or = [], Ar = [], qr = 0; qr < Ke; ++qr) {
              Array.isArray(H)
                ? Ar.push(H[qr])
                : Ar.push(c.def(H + "[" + qr + "]")), E && or.push(c.def());
            }
            E && c(
              "if(!",
              p.batchId,
              "||",
              or.map(function(jt, Hr) {
                return jt + "!==" + Ar[Hr];
              }).join("||"),
              "){",
              or.map(function(jt, Hr) {
                return jt + "=" + Ar[Hr] + ";";
              }).join(""),
            ),
              c(A, ".uniform", b, "(", xe, ",", Ar.join(","), ");"),
              E && c("}");
          }
          else {
            if (m(!Array.isArray(H), "uniform value must not be an array"), E) {
              var tu = c.def();
              c("if(!", p.batchId, "||", tu, "!==", H, "){", tu, "=", H, ";");
            }
            c(A, ".uniform", b, "(", xe, ",", H, ");"), E && c("}");
          }
        }
      }
      function Ie(p, c, S, I) {
        var F = p.shared, E = F.gl, T = F.draw, A = I.draw;
        function v() {
          var we = A.elements, Se, Ce = c;
          return we
            ? ((we.contextDep && I.contextDynamic || we.propDep) && (Ce = S),
              Se = we.append(p, Ce),
              A.elementsActive
              && Ce(
                "if(" + Se + ")" + E + ".bindBuffer(" + Ca + "," + Se
                  + ".buffer.buffer);",
              ))
            : (Se = Ce.def(),
              Ce(
                Se,
                "=",
                T,
                ".",
                Gr,
                ";",
                "if(",
                Se,
                "){",
                E,
                ".bindBuffer(",
                Ca,
                ",",
                Se,
                ".buffer.buffer);}",
                "else if(",
                F.vao,
                ".currentVAO){",
                Se,
                "=",
                p.shared.elements + ".getElements(" + F.vao,
                ".currentVAO.elements);",
                X
                  ? ""
                  : "if(" + Se + ")" + E + ".bindBuffer(" + Ca + "," + Se
                    + ".buffer.buffer);",
                "}",
              )),
            Se;
        }
        function b() {
          var we = A.count, Se, Ce = c;
          return we
            ? ((we.contextDep && I.contextDynamic || we.propDep) && (Ce = S),
              Se = we.append(p, Ce),
              m.optional(function() {
                we.MISSING && p.assert(c, "false", "missing vertex count"),
                  we.DYNAMIC
                  && p.assert(Ce, Se + ">=0", "missing vertex count");
              }))
            : (Se = Ce.def(T, ".", Vr),
              m.optional(function() {
                p.assert(Ce, Se + ">=0", "missing vertex count");
              })),
            Se;
        }
        var x = v();
        function k(we) {
          var Se = A[we];
          return Se
            ? Se.contextDep && I.contextDynamic || Se.propDep
              ? Se.append(p, S)
              : Se.append(p, c)
            : c.def(T, ".", we);
        }
        var P = k(Br), V = k(Mi), q = b();
        if (typeof q == "number") if (q === 0) return;
        else S("if(", q, "){"), S.exit("}");
        var oe, ke;
        J && (oe = k(zi), ke = p.instancing);
        var Ee = x + ".type", xe = A.elements && Er(A.elements) && !A.vaoActive;
        function H() {
          function we() {
            S(ke, ".drawElementsInstancedANGLE(", [
              P,
              q,
              Ee,
              V + "<<((" + Ee + "-" + yl + ")>>1)",
              oe,
            ], ");");
          }
          function Se() {
            S(ke, ".drawArraysInstancedANGLE(", [P, V, q, oe], ");");
          }
          x && x !== "null"
            ? xe ? we() : (S("if(", x, "){"), we(), S("}else{"), Se(), S("}"))
            : Se();
        }
        function B() {
          function we() {
            S(
              E + ".drawElements("
                + [P, q, Ee, V + "<<((" + Ee + "-" + yl + ")>>1)"] + ");",
            );
          }
          function Se() {
            S(E + ".drawArrays(" + [P, V, q] + ");");
          }
          x && x !== "null"
            ? xe ? we() : (S("if(", x, "){"), we(), S("}else{"), Se(), S("}"))
            : Se();
        }
        J && (typeof oe != "number" || oe >= 0)
          ? typeof oe == "string"
            ? (S("if(", oe, ">0){"),
              H(),
              S("}else if(", oe, "<0){"),
              B(),
              S("}"))
            : H()
          : B();
      }
      function Ue(p, c, S, I, F) {
        var E = Ne(), T = E.proc("body", F);
        return m.optional(function() {
          E.commandStr = c.commandStr, E.command = E.link(c.commandStr);
        }),
          J
          && (E.instancing = T.def(
            E.shared.extensions,
            ".angle_instanced_arrays",
          )),
          p(E, T, S, I),
          E.compile().body;
      }
      function Ye(p, c, S, I) {
        ut(p, c),
          S.useVAO
            ? S.drawVAO
              ? c(p.shared.vao, ".setVAO(", S.drawVAO.append(p, c), ");")
              : c(p.shared.vao, ".setVAO(", p.shared.vao, ".targetVAO);")
            : (c(p.shared.vao, ".setVAO(null);"),
              At(p, c, S, I.attributes, function() {
                return !0;
              })),
          Qe(p, c, S, I.uniforms, function() {
            return !0;
          }, !1),
          Ie(p, c, c, S);
      }
      function ct(p, c) {
        var S = p.proc("draw", 1);
        ut(p, S),
          xt(p, S, c.context),
          yt(p, S, c.framebuffer),
          St(p, S, c),
          Et(p, S, c.state),
          Be(p, S, c, !1, !0);
        var I = c.shader.progVar.append(p, S);
        if (S(p.shared.gl, ".useProgram(", I, ".program);"), c.shader.program) {
          Ye(p, S, c, c.shader.program);
        }
        else {
          S(p.shared.vao, ".setVAO(null);");
          var F = p.global.def("{}"),
            E = S.def(I, ".id"),
            T = S.def(F, "[", E, "]");
          S(
            p.cond(T).then(T, ".call(this,a0);").else(
              T,
              "=",
              F,
              "[",
              E,
              "]=",
              p.link(function(A) {
                return Ue(Ye, p, c, A, 1);
              }),
              "(",
              I,
              ");",
              T,
              ".call(this,a0);",
            ),
          );
        }
        Object.keys(c.state).length > 0 && S(p.shared.current, ".dirty=true;"),
          p.shared.vao && S(p.shared.vao, ".setVAO(null);");
      }
      function ir(p, c, S, I) {
        p.batchId = "a1", ut(p, c);
        function F() {
          return !0;
        }
        At(p, c, S, I.attributes, F),
          Qe(p, c, S, I.uniforms, F, !1),
          Ie(p, c, c, S);
      }
      function jr(p, c, S, I) {
        ut(p, c);
        var F = S.contextDep, E = c.def(), T = "a0", A = "a1", v = c.def();
        p.shared.props = v, p.batchId = E;
        var b = p.scope(), x = p.scope();
        c(
          b.entry,
          "for(",
          E,
          "=0;",
          E,
          "<",
          A,
          ";++",
          E,
          "){",
          v,
          "=",
          T,
          "[",
          E,
          "];",
          x,
          "}",
          b.exit,
        );
        function k(Ee) {
          return Ee.contextDep && F || Ee.propDep;
        }
        function P(Ee) {
          return !k(Ee);
        }
        if (
          S.needsContext && xt(p, x, S.context),
            S.needsFramebuffer && yt(p, x, S.framebuffer),
            Et(p, x, S.state, k),
            S.profile && k(S.profile) && Be(p, x, S, !1, !0),
            I
        ) {
          S.useVAO
            ? S.drawVAO
              ? k(S.drawVAO)
                ? x(p.shared.vao, ".setVAO(", S.drawVAO.append(p, x), ");")
                : b(p.shared.vao, ".setVAO(", S.drawVAO.append(p, b), ");")
              : b(p.shared.vao, ".setVAO(", p.shared.vao, ".targetVAO);")
            : (b(p.shared.vao, ".setVAO(null);"),
              At(p, b, S, I.attributes, P),
              At(p, x, S, I.attributes, k)),
            Qe(p, b, S, I.uniforms, P, !1),
            Qe(p, x, S, I.uniforms, k, !0),
            Ie(p, b, x, S);
        }
        else {
          var V = p.global.def("{}"),
            q = S.shader.progVar.append(p, x),
            oe = x.def(q, ".id"),
            ke = x.def(V, "[", oe, "]");
          x(
            p.shared.gl,
            ".useProgram(",
            q,
            ".program);",
            "if(!",
            ke,
            "){",
            ke,
            "=",
            V,
            "[",
            oe,
            "]=",
            p.link(function(Ee) {
              return Ue(ir, p, S, Ee, 2);
            }),
            "(",
            q,
            ");}",
            ke,
            ".call(this,a0[",
            E,
            "],",
            E,
            ");",
          );
        }
      }
      function y(p, c) {
        var S = p.proc("batch", 2);
        p.batchId = "0", ut(p, S);
        var I = !1, F = !0;
        Object.keys(c.context).forEach(function(V) {
          I = I || c.context[V].propDep;
        }), I || (xt(p, S, c.context), F = !1);
        var E = c.framebuffer, T = !1;
        E
          ? (E.propDep ? I = T = !0 : E.contextDep && I && (T = !0),
            T || yt(p, S, E))
          : yt(p, S, null),
          c.state.viewport && c.state.viewport.propDep && (I = !0);
        function A(V) {
          return V.contextDep && I || V.propDep;
        }
        St(p, S, c),
          Et(p, S, c.state, function(V) {
            return !A(V);
          }),
          (!c.profile || !A(c.profile)) && Be(p, S, c, !1, "a1"),
          c.contextDep = I,
          c.needsContext = F,
          c.needsFramebuffer = T;
        var v = c.shader.progVar;
        if (v.contextDep && I || v.propDep) jr(p, S, c, null);
        else {
          var b = v.append(p, S);
          if (
            S(p.shared.gl, ".useProgram(", b, ".program);"), c.shader.program
          ) {
            jr(p, S, c, c.shader.program);
          }
          else {
            S(p.shared.vao, ".setVAO(null);");
            var x = p.global.def("{}"),
              k = S.def(b, ".id"),
              P = S.def(x, "[", k, "]");
            S(
              p.cond(P).then(P, ".call(this,a0,a1);").else(
                P,
                "=",
                x,
                "[",
                k,
                "]=",
                p.link(function(V) {
                  return Ue(jr, p, c, V, 2);
                }),
                "(",
                b,
                ");",
                P,
                ".call(this,a0,a1);",
              ),
            );
          }
        }
        Object.keys(c.state).length > 0 && S(p.shared.current, ".dirty=true;"),
          p.shared.vao && S(p.shared.vao, ".setVAO(null);");
      }
      function z(p, c) {
        var S = p.proc("scope", 3);
        p.batchId = "a2";
        var I = p.shared, F = I.current;
        xt(p, S, c.context),
          c.framebuffer && c.framebuffer.append(p, S),
          Yl(Object.keys(c.state)).forEach(function(T) {
            var A = c.state[T], v = A.append(p, S);
            ot(v)
              ? v.forEach(function(b, x) {
                S.set(p.next[T], "[" + x + "]", b);
              })
              : S.set(I.next, "." + T, v);
          }),
          Be(p, S, c, !0, !0),
          [Gr, Mi, Vr, zi, Br].forEach(function(T) {
            var A = c.draw[T];
            A && S.set(I.draw, "." + T, "" + A.append(p, S));
          }),
          Object.keys(c.uniforms).forEach(function(T) {
            var A = c.uniforms[T].append(p, S);
            Array.isArray(A) && (A = "[" + A.join() + "]"),
              S.set(I.uniforms, "[" + h.id(T) + "]", A);
          }),
          Object.keys(c.attributes).forEach(function(T) {
            var A = c.attributes[T].append(p, S), v = p.scopeAttrib(T);
            Object.keys(new L()).forEach(function(b) {
              S.set(v, "." + b, A[b]);
            });
          }),
          c.scopeVAO && S.set(I.vao, ".targetVAO", c.scopeVAO.append(p, S));
        function E(T) {
          var A = c.shader[T];
          A && S.set(I.shader, "." + T, A.append(p, S));
        }
        E(Dn),
          E(Gn),
          Object.keys(c.state).length > 0
          && (S(F, ".dirty=true;"), S.exit(F, ".dirty=true;")),
          S("a1(", p.shared.context, ",a0,", p.batchId, ");");
      }
      function R(p) {
        if (!(typeof p != "object" || ot(p))) {
          for (var c = Object.keys(p), S = 0; S < c.length; ++S) {
            if (Bt.isDynamic(p[c[S]])) return !0;
          }
          return !1;
        }
      }
      function ye(p, c, S) {
        var I = c.static[S];
        if (!I || !R(I)) return;
        var F = p.global,
          E = Object.keys(I),
          T = !1,
          A = !1,
          v = !1,
          b = p.global.def("{}");
        E.forEach(function(k) {
          var P = I[k];
          if (Bt.isDynamic(P)) {
            typeof P == "function" && (P = I[k] = Bt.unbox(P));
            var V = Rt(P, null);
            T = T || V.thisDep, v = v || V.propDep, A = A || V.contextDep;
          }
          else {
            switch (F(b, ".", k, "="), typeof P) {
              case "number":
                F(P);
                break;
              case "string":
                F("\"", P, "\"");
                break;
              case "object":
                Array.isArray(P) && F("[", P.join(), "]");
                break;
              default:
                F(p.link(P));
                break;
            }
            F(";");
          }
        });
        function x(k, P) {
          E.forEach(function(V) {
            var q = I[V];
            if (Bt.isDynamic(q)) {
              var oe = k.invoke(P, q);
              P(b, ".", V, "=", oe, ";");
            }
          });
        }
        c.dynamic[S] = new Bt.DynamicVariable(Ri, {
          thisDep: T,
          contextDep: A,
          propDep: v,
          ref: b,
          append: x,
        }), delete c.static[S];
      }
      function $e(p, c, S, I, F) {
        var E = Ne();
        E.stats = E.link(F),
          Object.keys(c.static).forEach(function(A) {
            ye(E, c, A);
          }),
          Fp.forEach(function(A) {
            ye(E, p, A);
          });
        var T = mt(p, c, S, I, E);
        return ct(E, T),
          z(E, T),
          y(E, T),
          t(E.compile(), {
            destroy: function() {
              T.shader.program.destroy();
            },
          });
      }
      return {
        next: de,
        current: pe,
        procs: function() {
          var p = Ne(),
            c = p.proc("poll"),
            S = p.proc("refresh"),
            I = p.block();
          c(I), S(I);
          var F = p.shared, E = F.gl, T = F.next, A = F.current;
          I(A, ".dirty=false;"), yt(p, c), yt(p, S, null, !0);
          var v;
          J && (v = p.link(J)),
            _.oes_vertex_array_object
            && S(
              p.link(_.oes_vertex_array_object),
              ".bindVertexArrayOES(null);",
            );
          for (var b = 0; b < M.maxAttributes; ++b) {
            var x = S.def(F.attributes, "[", b, "]"), k = p.cond(x, ".buffer");
            k.then(
              E,
              ".enableVertexAttribArray(",
              b,
              ");",
              E,
              ".bindBuffer(",
              xn,
              ",",
              x,
              ".buffer.buffer);",
              E,
              ".vertexAttribPointer(",
              b,
              ",",
              x,
              ".size,",
              x,
              ".type,",
              x,
              ".normalized,",
              x,
              ".stride,",
              x,
              ".offset);",
            ).else(
              E,
              ".disableVertexAttribArray(",
              b,
              ");",
              E,
              ".vertexAttrib4f(",
              b,
              ",",
              x,
              ".x,",
              x,
              ".y,",
              x,
              ".z,",
              x,
              ".w);",
              x,
              ".buffer=null;",
            ),
              S(k),
              J && S(v, ".vertexAttribDivisorANGLE(", b, ",", x, ".divisor);");
          }
          return S(
            p.shared.vao,
            ".currentVAO=null;",
            p.shared.vao,
            ".setVAO(",
            p.shared.vao,
            ".targetVAO);",
          ),
            Object.keys(U).forEach(function(P) {
              var V = U[P], q = I.def(T, ".", P), oe = p.block();
              oe(
                "if(",
                q,
                "){",
                E,
                ".enable(",
                V,
                ")}else{",
                E,
                ".disable(",
                V,
                ")}",
                A,
                ".",
                P,
                "=",
                q,
                ";",
              ),
                S(oe),
                c("if(", q, "!==", A, ".", P, "){", oe, "}");
            }),
            Object.keys($).forEach(function(P) {
              var V = $[P], q = pe[P], oe, ke, Ee = p.block();
              if (Ee(E, ".", V, "("), ot(q)) {
                var xe = q.length;
                oe = p.global.def(T, ".", P),
                  ke = p.global.def(A, ".", P),
                  Ee(
                    Vt(xe, function(H) {
                      return oe + "[" + H + "]";
                    }),
                    ");",
                    Vt(xe, function(H) {
                      return ke + "[" + H + "]=" + oe + "[" + H + "];";
                    }).join(""),
                  ),
                  c(
                    "if(",
                    Vt(xe, function(H) {
                      return oe + "[" + H + "]!==" + ke + "[" + H + "]";
                    }).join("||"),
                    "){",
                    Ee,
                    "}",
                  );
              }
              else {
                oe = I.def(T, ".", P),
                  ke = I.def(A, ".", P),
                  Ee(oe, ");", A, ".", P, "=", oe, ";"),
                  c("if(", oe, "!==", ke, "){", Ee, "}");
              }
              S(Ee);
            }),
            p.compile();
        }(),
        compile: $e,
      };
    }
    function Yp() {
      return {
        vaoCount: 0,
        bufferCount: 0,
        elementsCount: 0,
        framebufferCount: 0,
        shaderCount: 0,
        textureCount: 0,
        cubeCount: 0,
        renderbufferCount: 0,
        maxTextureUnits: 0,
      };
    }
    var Wp = 34918,
      Zp = 34919,
      Zl = 35007,
      Qp = function(f, h) {
        if (!h.ext_disjoint_timer_query) return null;
        var _ = [];
        function M() {
          return _.pop() || h.ext_disjoint_timer_query.createQueryEXT();
        }
        function j(J) {
          _.push(J);
        }
        var N = [];
        function G(J) {
          var ge = M();
          h.ext_disjoint_timer_query.beginQueryEXT(Zl, ge),
            N.push(ge),
            Q(N.length - 1, N.length, J);
        }
        function Z() {
          h.ext_disjoint_timer_query.endQueryEXT(Zl);
        }
        function W() {
          this.startQueryIndex = -1,
            this.endQueryIndex = -1,
            this.sum = 0,
            this.stats = null;
        }
        var te = [];
        function ne() {
          return te.pop() || new W();
        }
        function re(J) {
          te.push(J);
        }
        var ae = [];
        function Q(J, ge, X) {
          var pe = ne();
          pe.startQueryIndex = J,
            pe.endQueryIndex = ge,
            pe.sum = 0,
            pe.stats = X,
            ae.push(pe);
        }
        var ee = [], L = [];
        function O() {
          var J, ge, X = N.length;
          if (X !== 0) {
            L.length = Math.max(L.length, X + 1),
              ee.length = Math.max(ee.length, X + 1),
              ee[0] = 0,
              L[0] = 0;
            var pe = 0;
            for (J = 0, ge = 0; ge < N.length; ++ge) {
              var de = N[ge];
              h.ext_disjoint_timer_query.getQueryObjectEXT(de, Zp)
                ? (pe += h.ext_disjoint_timer_query.getQueryObjectEXT(de, Wp),
                  j(de))
                : N[J++] = de,
                ee[ge + 1] = pe,
                L[ge + 1] = J;
            }
            for (N.length = J, J = 0, ge = 0; ge < ae.length; ++ge) {
              var Ae = ae[ge], U = Ae.startQueryIndex, $ = Ae.endQueryIndex;
              Ae.sum += ee[$] - ee[U];
              var be = L[U], se = L[$];
              se === be
                ? (Ae.stats.gpuTime += Ae.sum / 1e6, re(Ae))
                : (Ae.startQueryIndex = be,
                  Ae.endQueryIndex = se,
                  ae[J++] = Ae);
            }
            ae.length = J;
          }
        }
        return {
          beginQuery: G,
          endQuery: Z,
          pushScopeStats: Q,
          update: O,
          getNumPendingQueries: function() {
            return N.length;
          },
          clear: function() {
            _.push.apply(_, N);
            for (var J = 0; J < _.length; J++) {
              h.ext_disjoint_timer_query.deleteQueryEXT(_[J]);
            }
            N.length = 0, _.length = 0;
          },
          restore: function() {
            N.length = 0, _.length = 0;
          },
        };
      },
      Kp = 16384,
      Jp = 256,
      e0 = 1024,
      t0 = 34962,
      Ql = "webglcontextlost",
      Kl = "webglcontextrestored",
      Jl = 1,
      r0 = 2,
      n0 = 3;
    function eu(f, h) {
      for (var _ = 0; _ < f.length; ++_) if (f[_] === h) return _;
      return -1;
    }
    function i0(f) {
      var h = rh(f);
      if (!h) return null;
      var _ = h.gl,
        M = _.getContextAttributes(),
        j = _.isContextLost(),
        N = nh(_, h);
      if (!N) return null;
      var G = Qd(),
        Z = Yp(),
        W = N.extensions,
        te = Qp(_, W),
        ne = ff(),
        re = _.drawingBufferWidth,
        ae = _.drawingBufferHeight,
        Q = {
          tick: 0,
          time: 0,
          viewportWidth: re,
          viewportHeight: ae,
          framebufferWidth: re,
          framebufferHeight: ae,
          drawingBufferWidth: re,
          drawingBufferHeight: ae,
          pixelRatio: h.pixelRatio,
        },
        ee = {},
        L = {
          elements: null,
          primitive: 4,
          count: -1,
          offset: 0,
          instances: -1,
        },
        O = Uh(_, W),
        J = am(_, Z, h, pe),
        ge = xm(_, W, J, Z),
        X = xp(_, W, O, Z, J, ge, L);
      function pe(Ie) {
        return X.destroyBuffer(Ie);
      }
      var de = Sp(_, G, Z, h),
        Ae = Wm(
          _,
          W,
          O,
          function() {
            be.procs.poll();
          },
          Q,
          Z,
          h,
        ),
        U = Zm(_, W, O, Z, h),
        $ = vp(_, W, O, Ae, U, Z),
        be = Xp(_, G, W, O, J, ge, Ae, $, ee, X, de, L, Q, te, h),
        se = Ep(_, $, be.procs.poll, Q, M, W, O),
        K = be.next,
        fe = _.canvas,
        ue = [],
        ze = [],
        Ne = [],
        he = [h.onDestroy],
        ve = null;
      function Fe() {
        if (ue.length === 0) {
          te && te.update(), ve = null;
          return;
        }
        ve = Bo.next(Fe), Et();
        for (var Ie = ue.length - 1; Ie >= 0; --Ie) {
          var Ue = ue[Ie];
          Ue && Ue(Q, null, 0);
        }
        _.flush(), te && te.update();
      }
      function Oe() {
        !ve && ue.length > 0 && (ve = Bo.next(Fe));
      }
      function je() {
        ve && (Bo.cancel(Fe), ve = null);
      }
      function at(Ie) {
        Ie.preventDefault(),
          j = !0,
          je(),
          ze.forEach(function(Ue) {
            Ue();
          });
      }
      function st(Ie) {
        _.getError(),
          j = !1,
          N.restore(),
          de.restore(),
          J.restore(),
          Ae.restore(),
          U.restore(),
          $.restore(),
          X.restore(),
          te && te.restore(),
          be.procs.refresh(),
          Oe(),
          Ne.forEach(function(Ue) {
            Ue();
          });
      }
      fe && (fe.addEventListener(Ql, at, !1), fe.addEventListener(Kl, st, !1));
      function He() {
        ue.length = 0,
          je(),
          fe
          && (fe.removeEventListener(Ql, at), fe.removeEventListener(Kl, st)),
          de.clear(),
          $.clear(),
          U.clear(),
          X.clear(),
          Ae.clear(),
          ge.clear(),
          J.clear(),
          te && te.clear(),
          he.forEach(function(Ie) {
            Ie();
          });
      }
      function gt(Ie) {
        m(!!Ie, "invalid args to regl({...})"),
          m.type(Ie, "object", "invalid args to regl({...})");
        function Ue(F) {
          var E = t({}, F);
          delete E.uniforms,
            delete E.attributes,
            delete E.context,
            delete E.vao,
            "stencil" in E && E.stencil.op
            && (E.stencil.opBack = E.stencil.opFront = E.stencil.op,
              delete E.stencil.op);
          function T(A) {
            if (A in E) {
              var v = E[A];
              delete E[A],
                Object.keys(v).forEach(function(b) {
                  E[A + "." + b] = v[b];
                });
            }
          }
          return T("blend"),
            T("depth"),
            T("cull"),
            T("stencil"),
            T("polygonOffset"),
            T("scissor"),
            T("sample"),
            "vao" in F && (E.vao = F.vao),
            E;
        }
        function Ye(F, E) {
          var T = {}, A = {};
          return Object.keys(F).forEach(function(v) {
            var b = F[v];
            if (Bt.isDynamic(b)) {
              A[v] = Bt.unbox(b, v);
              return;
            }
            else if (E && Array.isArray(b)) {
              for (var x = 0; x < b.length; ++x) {
                if (Bt.isDynamic(b[x])) {
                  A[v] = Bt.unbox(b, v);
                  return;
                }
              }
            }
            T[v] = b;
          }),
            { dynamic: A, static: T };
        }
        var ct = Ye(Ie.context || {}, !0),
          ir = Ye(Ie.uniforms || {}, !0),
          jr = Ye(Ie.attributes || {}, !1),
          y = Ye(Ue(Ie), !1),
          z = { gpuTime: 0, cpuTime: 0, count: 0 },
          R = be.compile(y, jr, ir, ct, z),
          ye = R.draw,
          $e = R.batch,
          p = R.scope,
          c = [];
        function S(F) {
          for (; c.length < F;) c.push(null);
          return c;
        }
        function I(F, E) {
          var T;
          if (j && m.raise("context lost"), typeof F == "function") {
            return p.call(this, null, F, 0);
          }
          if (typeof E == "function") {
            if (typeof F == "number") {
              for (T = 0; T < F; ++T) p.call(this, null, E, T);
            }
            else if (Array.isArray(F)) {
              for (T = 0; T < F.length; ++T) p.call(this, F[T], E, T);
            }
            else return p.call(this, F, E, 0);
          }
          else if (typeof F == "number") {
            if (F > 0) return $e.call(this, S(F | 0), F | 0);
          }
          else if (Array.isArray(F)) {
            if (F.length) return $e.call(this, F, F.length);
          }
          else return ye.call(this, F);
        }
        return t(I, {
          stats: z,
          destroy: function() {
            R.destroy();
          },
        });
      }
      var it = $.setFBO = gt({
        framebuffer: Bt.define.call(null, Jl, "framebuffer"),
      });
      function mt(Ie, Ue) {
        var Ye = 0;
        be.procs.poll();
        var ct = Ue.color;
        ct
        && (_.clearColor(+ct[0] || 0, +ct[1] || 0, +ct[2] || 0, +ct[3] || 0),
          Ye |= Kp),
          "depth" in Ue && (_.clearDepth(+Ue.depth), Ye |= Jp),
          "stencil" in Ue && (_.clearStencil(Ue.stencil | 0), Ye |= e0),
          m(!!Ye, "called regl.clear with no buffer specified"),
          _.clear(Ye);
      }
      function xt(Ie) {
        if (
          m(
            typeof Ie == "object" && Ie,
            "regl.clear() takes an object as input",
          ), "framebuffer" in Ie
        ) {
          if (Ie.framebuffer && Ie.framebuffer_reglType === "framebufferCube") {
            for (var Ue = 0; Ue < 6; ++Ue) {
              it(t({ framebuffer: Ie.framebuffer.faces[Ue] }, Ie), mt);
            }
          }
          else {
            it(Ie, mt);
          }
        }
        else mt(null, Ie);
      }
      function yt(Ie) {
        m.type(Ie, "function", "regl.frame() callback must be a function"),
          ue.push(Ie);
        function Ue() {
          var Ye = eu(ue, Ie);
          m(Ye >= 0, "cannot cancel a frame twice");
          function ct() {
            var ir = eu(ue, ct);
            ue[ir] = ue[ue.length - 1], ue.length -= 1, ue.length <= 0 && je();
          }
          ue[Ye] = ct;
        }
        return Oe(), { cancel: Ue };
      }
      function St() {
        var Ie = K.viewport, Ue = K.scissor_box;
        Ie[0] = Ie[1] = Ue[0] = Ue[1] = 0,
          Q.viewportWidth = Q.framebufferWidth = Q.drawingBufferWidth = Ie[2] =
            Ue[2] = _.drawingBufferWidth,
          Q.viewportHeight = Q.framebufferHeight = Q.drawingBufferHeight =
            Ie[3] = Ue[3] = _.drawingBufferHeight;
      }
      function Et() {
        Q.tick += 1, Q.time = Be(), St(), be.procs.poll();
      }
      function ut() {
        Ae.refresh(), St(), be.procs.refresh(), te && te.update();
      }
      function Be() {
        return (ff() - ne) / 1e3;
      }
      ut();
      function At(Ie, Ue) {
        m.type(Ue, "function", "listener callback must be a function");
        var Ye;
        switch (Ie) {
          case "frame":
            return yt(Ue);
          case "lost":
            Ye = ze;
            break;
          case "restore":
            Ye = Ne;
            break;
          case "destroy":
            Ye = he;
            break;
          default:
            m.raise("invalid event, must be one of frame,lost,restore,destroy");
        }
        return Ye.push(Ue), {
          cancel: function() {
            for (var ct = 0; ct < Ye.length; ++ct) {
              if (Ye[ct] === Ue) {
                Ye[ct] = Ye[Ye.length - 1], Ye.pop();
                return;
              }
            }
          },
        };
      }
      var Qe = t(gt, {
        clear: xt,
        prop: Bt.define.bind(null, Jl),
        context: Bt.define.bind(null, r0),
        this: Bt.define.bind(null, n0),
        draw: gt({}),
        buffer: function(Ie) {
          return J.create(Ie, t0, !1, !1);
        },
        elements: function(Ie) {
          return ge.create(Ie, !1);
        },
        texture: Ae.create2D,
        cube: Ae.createCube,
        renderbuffer: U.create,
        framebuffer: $.create,
        framebufferCube: $.createCube,
        vao: X.createVAO,
        attributes: M,
        frame: yt,
        on: At,
        limits: O,
        hasExtension: function(Ie) {
          return O.extensions.indexOf(Ie.toLowerCase()) >= 0;
        },
        read: se,
        destroy: He,
        _gl: _,
        _refresh: ut,
        poll: function() {
          Et(), te && te.update();
        },
        now: Be,
        stats: Z,
      });
      return h.onDone(null, Qe), Qe;
    }
    return i0;
  });
});
var fd = mr((sd, Es) => {
  (function(e, t, r) {
    function n(a) {
      var l = this, u = s();
      l.next = function() {
        var d = 2091639 * l.s0 + l.c * 23283064365386963e-26;
        return l.s0 = l.s1, l.s1 = l.s2, l.s2 = d - (l.c = d | 0);
      },
        l.c = 1,
        l.s0 = u(" "),
        l.s1 = u(" "),
        l.s2 = u(" "),
        l.s0 -= u(a),
        l.s0 < 0 && (l.s0 += 1),
        l.s1 -= u(a),
        l.s1 < 0 && (l.s1 += 1),
        l.s2 -= u(a),
        l.s2 < 0 && (l.s2 += 1),
        u = null;
    }
    function i(a, l) {
      return l.c = a.c, l.s0 = a.s0, l.s1 = a.s1, l.s2 = a.s2, l;
    }
    function o(a, l) {
      var u = new n(a), d = l && l.state, g = u.next;
      return g.int32 = function() {
        return u.next() * 4294967296 | 0;
      },
        g.double = function() {
          return g() + (g() * 2097152 | 0) * 11102230246251565e-32;
        },
        g.quick = g,
        d && (typeof d == "object" && i(d, u),
          g.state = function() {
            return i(u, {});
          }),
        g;
    }
    function s() {
      var a = 4022871197,
        l = function(u) {
          u = String(u);
          for (var d = 0; d < u.length; d++) {
            a += u.charCodeAt(d);
            var g = .02519603282416938 * a;
            a = g >>> 0,
              g -= a,
              g *= a,
              a = g >>> 0,
              g -= a,
              a += g * 4294967296;
          }
          return (a >>> 0) * 23283064365386963e-26;
        };
      return l;
    }
    t && t.exports ? t.exports = o : r && r.amd
      ? r(function() {
        return o;
      })
      : this.alea = o;
  })(sd, typeof Es == "object" && Es, typeof define == "function" && define);
});
var ud = mr((ld, As) => {
  (function(e, t, r) {
    function n(s) {
      var a = this, l = "";
      a.x = 0,
        a.y = 0,
        a.z = 0,
        a.w = 0,
        a.next = function() {
          var d = a.x ^ a.x << 11;
          return a.x = a.y,
            a.y = a.z,
            a.z = a.w,
            a.w ^= a.w >>> 19 ^ d ^ d >>> 8;
        },
        s === (s | 0) ? a.x = s : l += s;
      for (var u = 0; u < l.length + 64; u++) {
        a.x ^= l.charCodeAt(u) | 0, a.next();
      }
    }
    function i(s, a) {
      return a.x = s.x, a.y = s.y, a.z = s.z, a.w = s.w, a;
    }
    function o(s, a) {
      var l = new n(s),
        u = a && a.state,
        d = function() {
          return (l.next() >>> 0) / 4294967296;
        };
      return d.double = function() {
        do var g = l.next() >>> 11,
          w = (l.next() >>> 0) / 4294967296,
          C = (g + w) / (1 << 21); while (C === 0);
        return C;
      },
        d.int32 = l.next,
        d.quick = d,
        u && (typeof u == "object" && i(u, l),
          d.state = function() {
            return i(l, {});
          }),
        d;
    }
    t && t.exports ? t.exports = o : r && r.amd
      ? r(function() {
        return o;
      })
      : this.xor128 = o;
  })(ld, typeof As == "object" && As, typeof define == "function" && define);
});
var dd = mr((cd, Is) => {
  (function(e, t, r) {
    function n(s) {
      var a = this, l = "";
      a.next = function() {
        var d = a.x ^ a.x >>> 2;
        return a.x = a.y,
          a.y = a.z,
          a.z = a.w,
          a.w = a.v,
          (a.d = a.d + 362437 | 0) + (a.v = a.v ^ a.v << 4 ^ (d ^ d << 1)) | 0;
      },
        a.x = 0,
        a.y = 0,
        a.z = 0,
        a.w = 0,
        a.v = 0,
        s === (s | 0) ? a.x = s : l += s;
      for (var u = 0; u < l.length + 64; u++) {
        a.x ^= l.charCodeAt(u) | 0,
          u == l.length && (a.d = a.x << 10 ^ a.x >>> 4),
          a.next();
      }
    }
    function i(s, a) {
      return a.x = s.x,
        a.y = s.y,
        a.z = s.z,
        a.w = s.w,
        a.v = s.v,
        a.d = s.d,
        a;
    }
    function o(s, a) {
      var l = new n(s),
        u = a && a.state,
        d = function() {
          return (l.next() >>> 0) / 4294967296;
        };
      return d.double = function() {
        do var g = l.next() >>> 11,
          w = (l.next() >>> 0) / 4294967296,
          C = (g + w) / (1 << 21); while (C === 0);
        return C;
      },
        d.int32 = l.next,
        d.quick = d,
        u && (typeof u == "object" && i(u, l),
          d.state = function() {
            return i(l, {});
          }),
        d;
    }
    t && t.exports ? t.exports = o : r && r.amd
      ? r(function() {
        return o;
      })
      : this.xorwow = o;
  })(cd, typeof Is == "object" && Is, typeof define == "function" && define);
});
var md = mr((hd, Ls) => {
  (function(e, t, r) {
    function n(s) {
      var a = this;
      a.next = function() {
        var u = a.x, d = a.i, g, w, C;
        return g = u[d],
          g ^= g >>> 7,
          w = g ^ g << 24,
          g = u[d + 1 & 7],
          w ^= g ^ g >>> 10,
          g = u[d + 3 & 7],
          w ^= g ^ g >>> 3,
          g = u[d + 4 & 7],
          w ^= g ^ g << 7,
          g = u[d + 7 & 7],
          g = g ^ g << 13,
          w ^= g ^ g << 9,
          u[d] = w,
          a.i = d + 1 & 7,
          w;
      };
      function l(u, d) {
        var g, w, C = [];
        if (d === (d | 0)) w = C[0] = d;
        else {
          for (d = "" + d, g = 0; g < d.length; ++g) {
            C[g & 7] = C[g & 7] << 15 ^ d.charCodeAt(g) + C[g + 1 & 7] << 13;
          }
        }
        for (; C.length < 8;) C.push(0);
        for (g = 0; g < 8 && C[g] === 0; ++g);
        for (
          g == 8 ? w = C[7] = -1 : w = C[g], u.x = C, u.i = 0, g = 256;
          g > 0;
          --g
        ) {
          u.next();
        }
      }
      l(a, s);
    }
    function i(s, a) {
      return a.x = s.x.slice(), a.i = s.i, a;
    }
    function o(s, a) {
      s == null && (s = +new Date());
      var l = new n(s),
        u = a && a.state,
        d = function() {
          return (l.next() >>> 0) / 4294967296;
        };
      return d.double = function() {
        do var g = l.next() >>> 11,
          w = (l.next() >>> 0) / 4294967296,
          C = (g + w) / (1 << 21); while (C === 0);
        return C;
      },
        d.int32 = l.next,
        d.quick = d,
        u && (u.x && i(u, l),
          d.state = function() {
            return i(l, {});
          }),
        d;
    }
    t && t.exports ? t.exports = o : r && r.amd
      ? r(function() {
        return o;
      })
      : this.xorshift7 = o;
  })(hd, typeof Ls == "object" && Ls, typeof define == "function" && define);
});
var vd = mr((pd, Fs) => {
  (function(e, t, r) {
    function n(s) {
      var a = this;
      a.next = function() {
        var u = a.w, d = a.X, g = a.i, w, C;
        return a.w = u = u + 1640531527 | 0,
          C = d[g + 34 & 127],
          w = d[g = g + 1 & 127],
          C ^= C << 13,
          w ^= w << 17,
          C ^= C >>> 15,
          w ^= w >>> 12,
          C = d[g] = C ^ w,
          a.i = g,
          C + (u ^ u >>> 16) | 0;
      };
      function l(u, d) {
        var g, w, C, Y, me, ce = [], ie = 128;
        for (
          d === (d | 0)
            ? (w = d, d = null)
            : (d = d + "\0", w = 0, ie = Math.max(ie, d.length)),
            C = 0,
            Y = -32;
          Y < ie;
          ++Y
        ) {
          d && (w ^= d.charCodeAt((Y + 32) % d.length)),
            Y === 0 && (me = w),
            w ^= w << 10,
            w ^= w >>> 15,
            w ^= w << 4,
            w ^= w >>> 13,
            Y >= 0
            && (me = me + 1640531527 | 0,
              g = ce[Y & 127] ^= w + me,
              C = g == 0 ? C + 1 : 0);
        }
        for (
          C >= 128 && (ce[(d && d.length || 0) & 127] = -1),
            C = 127,
            Y = 4 * 128;
          Y > 0;
          --Y
        ) {
          w = ce[C + 34 & 127],
            g = ce[C = C + 1 & 127],
            w ^= w << 13,
            g ^= g << 17,
            w ^= w >>> 15,
            g ^= g >>> 12,
            ce[C] = w ^ g;
        }
        u.w = me, u.X = ce, u.i = C;
      }
      l(a, s);
    }
    function i(s, a) {
      return a.i = s.i, a.w = s.w, a.X = s.X.slice(), a;
    }
    function o(s, a) {
      s == null && (s = +new Date());
      var l = new n(s),
        u = a && a.state,
        d = function() {
          return (l.next() >>> 0) / 4294967296;
        };
      return d.double = function() {
        do var g = l.next() >>> 11,
          w = (l.next() >>> 0) / 4294967296,
          C = (g + w) / (1 << 21); while (C === 0);
        return C;
      },
        d.int32 = l.next,
        d.quick = d,
        u && (u.X && i(u, l),
          d.state = function() {
            return i(l, {});
          }),
        d;
    }
    t && t.exports ? t.exports = o : r && r.amd
      ? r(function() {
        return o;
      })
      : this.xor4096 = o;
  })(pd, typeof Fs == "object" && Fs, typeof define == "function" && define);
});
var xd = mr((gd, Cs) => {
  (function(e, t, r) {
    function n(s) {
      var a = this, l = "";
      a.next = function() {
        var d = a.b, g = a.c, w = a.d, C = a.a;
        return d = d << 25 ^ d >>> 7 ^ g,
          g = g - w | 0,
          w = w << 24 ^ w >>> 8 ^ C,
          C = C - d | 0,
          a.b = d = d << 20 ^ d >>> 12 ^ g,
          a.c = g = g - w | 0,
          a.d = w << 16 ^ g >>> 16 ^ C,
          a.a = C - d | 0;
      },
        a.a = 0,
        a.b = 0,
        a.c = -1640531527,
        a.d = 1367130551,
        s === Math.floor(s) ? (a.a = s / 4294967296 | 0, a.b = s | 0) : l += s;
      for (var u = 0; u < l.length + 20; u++) {
        a.b ^= l.charCodeAt(u) | 0, a.next();
      }
    }
    function i(s, a) {
      return a.a = s.a, a.b = s.b, a.c = s.c, a.d = s.d, a;
    }
    function o(s, a) {
      var l = new n(s),
        u = a && a.state,
        d = function() {
          return (l.next() >>> 0) / 4294967296;
        };
      return d.double = function() {
        do var g = l.next() >>> 11,
          w = (l.next() >>> 0) / 4294967296,
          C = (g + w) / (1 << 21); while (C === 0);
        return C;
      },
        d.int32 = l.next,
        d.quick = d,
        u && (typeof u == "object" && i(u, l),
          d.state = function() {
            return i(l, {});
          }),
        d;
    }
    t && t.exports ? t.exports = o : r && r.amd
      ? r(function() {
        return o;
      })
      : this.tychei = o;
  })(gd, typeof Cs == "object" && Cs, typeof define == "function" && define);
});
var bd = mr((yd, ko) => {
  (function(e, t, r) {
    var n = 256,
      i = 6,
      o = 52,
      s = "random",
      a = r.pow(n, i),
      l = r.pow(2, o),
      u = l * 2,
      d = n - 1,
      g;
    function w(_e, Re, Me) {
      var qe = [];
      Re = Re == !0 ? { entropy: !0 } : Re || {};
      var We = ce(me(Re.entropy ? [_e, Le(t)] : _e ?? ie(), 3), qe),
        rt = new C(qe),
        ft = function() {
          for (var tt = rt.g(i), De = a, Je = 0; tt < l;) {
            tt = (tt + Je) * n, De *= n, Je = rt.g(1);
          }
          for (; tt >= u;) tt /= 2, De /= 2, Je >>>= 1;
          return (tt + Je) / De;
        };
      return ft.int32 = function() {
        return rt.g(4) | 0;
      },
        ft.quick = function() {
          return rt.g(4) / 4294967296;
        },
        ft.double = ft,
        ce(Le(rt.S), t),
        (Re.pass || Me || function(tt, De, Je, et) {
          return et && (et.S && Y(et, rt),
            tt.state = function() {
              return Y(rt, {});
            }),
            Je ? (r[s] = tt, De) : tt;
        })(ft, We, "global" in Re ? Re.global : this == r, Re.state);
    }
    function C(_e) {
      var Re,
        Me = _e.length,
        qe = this,
        We = 0,
        rt = qe.i = qe.j = 0,
        ft = qe.S = [];
      for (Me || (_e = [Me++]); We < n;) ft[We] = We++;
      for (We = 0; We < n; We++) {
        ft[We] = ft[rt = d & rt + _e[We % Me] + (Re = ft[We])], ft[rt] = Re;
      }
      (qe.g = function(tt) {
        for (var De, Je = 0, et = qe.i, D = qe.j, Te = qe.S; tt--;) {
          De = Te[et = d & et + 1],
            Je = Je * n + Te[d & (Te[et] = Te[D = d & D + De]) + (Te[D] = De)];
        }
        return qe.i = et, qe.j = D, Je;
      })(n);
    }
    function Y(_e, Re) {
      return Re.i = _e.i, Re.j = _e.j, Re.S = _e.S.slice(), Re;
    }
    function me(_e, Re) {
      var Me = [], qe = typeof _e, We;
      if (Re && qe == "object") {
        for (We in _e) {
          try {
            Me.push(me(_e[We], Re - 1));
          }
          catch {}
        }
      }
      return Me.length ? Me : qe == "string" ? _e : _e + "\0";
    }
    function ce(_e, Re) {
      for (var Me = _e + "", qe, We = 0; We < Me.length;) {
        Re[d & We] = d & (qe ^= Re[d & We] * 19) + Me.charCodeAt(We++);
      }
      return Le(Re);
    }
    function ie() {
      try {
        var _e;
        return g && (_e = g.randomBytes)
          ? _e = _e(n)
          : (_e = new Uint8Array(n),
            (e.crypto || e.msCrypto).getRandomValues(_e)),
          Le(_e);
      }
      catch {
        var Re = e.navigator, Me = Re && Re.plugins;
        return [+new Date(), e, Me, e.screen, Le(t)];
      }
    }
    function Le(_e) {
      return String.fromCharCode.apply(0, _e);
    }
    if (ce(r.random(), t), typeof ko == "object" && ko.exports) {
      ko.exports = w;
      try {
        g = u0("crypto");
      }
      catch {}
    }
    else {
      typeof define == "function" && define.amd
        ? define(function() {
          return w;
        })
        : r["seed" + s] = w;
    }
  })(typeof self < "u" ? self : yd, [], Math);
});
var Sd = mr((yT, _d) => {
  var lx = fd(),
    ux = ud(),
    cx = dd(),
    dx = md(),
    hx = vd(),
    mx = xd(),
    nn = bd();
  nn.alea = lx;
  nn.xor128 = ux;
  nn.xorwow = cx;
  nn.xorshift7 = dx;
  nn.xor4096 = hx;
  nn.tychei = mx;
  _d.exports = nn;
});
var Wi = "http://www.w3.org/1999/xhtml",
  Da = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: Wi,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
  };
function pr(e) {
  var t = e += "", r = t.indexOf(":");
  return r >= 0 && (t = e.slice(0, r)) !== "xmlns" && (e = e.slice(r + 1)),
    Da.hasOwnProperty(t) ? { space: Da[t], local: e } : e;
}
function h0(e) {
  return function() {
    var t = this.ownerDocument, r = this.namespaceURI;
    return r === Wi && t.documentElement.namespaceURI === Wi
      ? t.createElement(e)
      : t.createElementNS(r, e);
  };
}
function m0(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Zi(e) {
  var t = pr(e);
  return (t.local ? m0 : h0)(t);
}
function p0() {}
function Xr(e) {
  return e == null ? p0 : function() {
    return this.querySelector(e);
  };
}
function iu(e) {
  typeof e != "function" && (e = Xr(e));
  for (
    var t = this._groups, r = t.length, n = new Array(r), i = 0; i < r; ++i
  ) {
    for (
      var o = t[i], s = o.length, a = n[i] = new Array(s), l, u, d = 0;
      d < s;
      ++d
    ) {
      (l = o[d]) && (u = e.call(l, l.__data__, d, o))
        && ("__data__" in l && (u.__data__ = l.__data__), a[d] = u);
    }
  }
  return new pt(n, this._parents);
}
function Ga(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function v0() {
  return [];
}
function Xn(e) {
  return e == null ? v0 : function() {
    return this.querySelectorAll(e);
  };
}
function g0(e) {
  return function() {
    return Ga(e.apply(this, arguments));
  };
}
function ou(e) {
  typeof e == "function" ? e = g0(e) : e = Xn(e);
  for (var t = this._groups, r = t.length, n = [], i = [], o = 0; o < r; ++o) {
    for (var s = t[o], a = s.length, l, u = 0; u < a; ++u) {
      (l = s[u]) && (n.push(e.call(l, l.__data__, u, s)), i.push(l));
    }
  }
  return new pt(n, i);
}
function Yn(e) {
  return function() {
    return this.matches(e);
  };
}
function Qi(e) {
  return function(t) {
    return t.matches(e);
  };
}
var x0 = Array.prototype.find;
function y0(e) {
  return function() {
    return x0.call(this.children, e);
  };
}
function b0() {
  return this.firstElementChild;
}
function au(e) {
  return this.select(e == null ? b0 : y0(typeof e == "function" ? e : Qi(e)));
}
var _0 = Array.prototype.filter;
function S0() {
  return Array.from(this.children);
}
function w0(e) {
  return function() {
    return _0.call(this.children, e);
  };
}
function su(e) {
  return this.selectAll(
    e == null ? S0 : w0(typeof e == "function" ? e : Qi(e)),
  );
}
function fu(e) {
  typeof e != "function" && (e = Yn(e));
  for (
    var t = this._groups, r = t.length, n = new Array(r), i = 0; i < r; ++i
  ) {
    for (var o = t[i], s = o.length, a = n[i] = [], l, u = 0; u < s; ++u) {
      (l = o[u]) && e.call(l, l.__data__, u, o) && a.push(l);
    }
  }
  return new pt(n, this._parents);
}
function Ki(e) {
  return new Array(e.length);
}
function lu() {
  return new pt(this._enter || this._groups.map(Ki), this._parents);
}
function Wn(e, t) {
  this.ownerDocument = e.ownerDocument,
    this.namespaceURI = e.namespaceURI,
    this._next = null,
    this._parent = e,
    this.__data__ = t;
}
Wn.prototype = {
  constructor: Wn,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  },
};
function uu(e) {
  return function() {
    return e;
  };
}
function T0(e, t, r, n, i, o) {
  for (var s = 0, a, l = t.length, u = o.length; s < u; ++s) {
    (a = t[s])
      ? (a.__data__ = o[s], n[s] = a)
      : r[s] = new Wn(e, o[s]);
  }
  for (; s < l; ++s) (a = t[s]) && (i[s] = a);
}
function E0(e, t, r, n, i, o, s) {
  var a, l, u = new Map(), d = t.length, g = o.length, w = new Array(d), C;
  for (a = 0; a < d; ++a) {
    (l = t[a]) && (w[a] = C = s.call(l, l.__data__, a, t) + "",
      u.has(C)
        ? i[a] = l
        : u.set(C, l));
  }
  for (a = 0; a < g; ++a) {
    C = s.call(e, o[a], a, o) + "",
      (l = u.get(C))
        ? (n[a] = l, l.__data__ = o[a], u.delete(C))
        : r[a] = new Wn(e, o[a]);
  }
  for (a = 0; a < d; ++a) (l = t[a]) && u.get(w[a]) === l && (i[a] = l);
}
function A0(e) {
  return e.__data__;
}
function cu(e, t) {
  if (!arguments.length) return Array.from(this, A0);
  var r = t ? E0 : T0, n = this._parents, i = this._groups;
  typeof e != "function" && (e = uu(e));
  for (
    var o = i.length,
      s = new Array(o),
      a = new Array(o),
      l = new Array(o),
      u = 0;
    u < o;
    ++u
  ) {
    var d = n[u],
      g = i[u],
      w = g.length,
      C = I0(e.call(d, d && d.__data__, u, n)),
      Y = C.length,
      me = a[u] = new Array(Y),
      ce = s[u] = new Array(Y),
      ie = l[u] = new Array(w);
    r(d, g, me, ce, ie, C, t);
    for (var Le = 0, _e = 0, Re, Me; Le < Y; ++Le) {
      if (Re = me[Le]) {
        for (Le >= _e && (_e = Le + 1); !(Me = ce[_e]) && ++_e < Y;);
        Re._next = Me || null;
      }
    }
  }
  return s = new pt(s, n), s._enter = a, s._exit = l, s;
}
function I0(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function du() {
  return new pt(this._exit || this._groups.map(Ki), this._parents);
}
function hu(e, t, r) {
  var n = this.enter(), i = this, o = this.exit();
  return typeof e == "function"
    ? (n = e(n), n && (n = n.selection()))
    : n = n.append(e + ""),
    t != null && (i = t(i), i && (i = i.selection())),
    r == null ? o.remove() : r(o),
    n && i ? n.merge(i).order() : i;
}
function mu(e) {
  for (
    var t = e.selection ? e.selection() : e,
      r = this._groups,
      n = t._groups,
      i = r.length,
      o = n.length,
      s = Math.min(i, o),
      a = new Array(i),
      l = 0;
    l < s;
    ++l
  ) {
    for (
      var u = r[l], d = n[l], g = u.length, w = a[l] = new Array(g), C, Y = 0;
      Y < g;
      ++Y
    ) {
      (C = u[Y] || d[Y]) && (w[Y] = C);
    }
  }
  for (; l < i; ++l) a[l] = r[l];
  return new pt(a, this._parents);
}
function pu() {
  for (var e = this._groups, t = -1, r = e.length; ++t < r;) {
    for (var n = e[t], i = n.length - 1, o = n[i], s; --i >= 0;) {
      (s = n[i])
        && (o && s.compareDocumentPosition(o) ^ 4
          && o.parentNode.insertBefore(s, o),
          o = s);
    }
  }
  return this;
}
function vu(e) {
  e || (e = L0);
  function t(g, w) {
    return g && w ? e(g.__data__, w.__data__) : !g - !w;
  }
  for (
    var r = this._groups, n = r.length, i = new Array(n), o = 0; o < n; ++o
  ) {
    for (
      var s = r[o], a = s.length, l = i[o] = new Array(a), u, d = 0; d < a; ++d
    ) {
      (u = s[d]) && (l[d] = u);
    }
    l.sort(t);
  }
  return new pt(i, this._parents).order();
}
function L0(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function gu() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function xu() {
  return Array.from(this);
}
function yu() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t) {
    for (var n = e[t], i = 0, o = n.length; i < o; ++i) {
      var s = n[i];
      if (s) {
        return s;
      }
    }
  }
  return null;
}
function bu() {
  let e = 0;
  for (let t of this) ++e;
  return e;
}
function _u() {
  return !this.node();
}
function Su(e) {
  for (var t = this._groups, r = 0, n = t.length; r < n; ++r) {
    for (var i = t[r], o = 0, s = i.length, a; o < s; ++o) {
      (a = i[o]) && e.call(a, a.__data__, o, i);
    }
  }
  return this;
}
function F0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function C0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function P0(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function k0(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function R0(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttribute(e) : this.setAttribute(e, r);
  };
}
function N0(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null
      ? this.removeAttributeNS(e.space, e.local)
      : this.setAttributeNS(e.space, e.local, r);
  };
}
function wu(e, t) {
  var r = pr(e);
  if (arguments.length < 2) {
    var n = this.node();
    return r.local ? n.getAttributeNS(r.space, r.local) : n.getAttribute(r);
  }
  return this.each(
    (t == null
      ? r.local ? C0 : F0
      : typeof t == "function"
      ? r.local ? N0 : R0
      : r.local
      ? k0
      : P0)(r, t),
  );
}
function Ji(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e
    || e.defaultView;
}
function M0(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function z0(e, t, r) {
  return function() {
    this.style.setProperty(e, t, r);
  };
}
function O0(e, t, r) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.style.removeProperty(e) : this.style.setProperty(e, n, r);
  };
}
function Tu(e, t, r) {
  return arguments.length > 1
    ? this.each(
      (t == null ? M0 : typeof t == "function" ? O0 : z0)(e, t, r ?? ""),
    )
    : Ir(this.node(), e);
}
function Ir(e, t) {
  return e.style.getPropertyValue(t)
    || Ji(e).getComputedStyle(e, null).getPropertyValue(t);
}
function D0(e) {
  return function() {
    delete this[e];
  };
}
function G0(e, t) {
  return function() {
    this[e] = t;
  };
}
function B0(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? delete this[e] : this[e] = r;
  };
}
function Eu(e, t) {
  return arguments.length > 1
    ? this.each((t == null ? D0 : typeof t == "function" ? B0 : G0)(e, t))
    : this.node()[e];
}
function Au(e) {
  return e.trim().split(/^|\s+/);
}
function Ba(e) {
  return e.classList || new Iu(e);
}
function Iu(e) {
  this._node = e, this._names = Au(e.getAttribute("class") || "");
}
Iu.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0
      && (this._names.push(e),
        this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0
      && (this._names.splice(t, 1),
        this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  },
};
function Lu(e, t) {
  for (var r = Ba(e), n = -1, i = t.length; ++n < i;) r.add(t[n]);
}
function Fu(e, t) {
  for (var r = Ba(e), n = -1, i = t.length; ++n < i;) r.remove(t[n]);
}
function V0(e) {
  return function() {
    Lu(this, e);
  };
}
function $0(e) {
  return function() {
    Fu(this, e);
  };
}
function j0(e, t) {
  return function() {
    (t.apply(this, arguments) ? Lu : Fu)(this, e);
  };
}
function Cu(e, t) {
  var r = Au(e + "");
  if (arguments.length < 2) {
    for (var n = Ba(this.node()), i = -1, o = r.length; ++i < o;) {
      if (!n.contains(r[i])) return !1;
    }
    return !0;
  }
  return this.each((typeof t == "function" ? j0 : t ? V0 : $0)(r, t));
}
function U0() {
  this.textContent = "";
}
function q0(e) {
  return function() {
    this.textContent = e;
  };
}
function H0(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Pu(e) {
  return arguments.length
    ? this.each(e == null ? U0 : (typeof e == "function" ? H0 : q0)(e))
    : this.node().textContent;
}
function X0() {
  this.innerHTML = "";
}
function Y0(e) {
  return function() {
    this.innerHTML = e;
  };
}
function W0(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function ku(e) {
  return arguments.length
    ? this.each(e == null ? X0 : (typeof e == "function" ? W0 : Y0)(e))
    : this.node().innerHTML;
}
function Z0() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Ru() {
  return this.each(Z0);
}
function Q0() {
  this.previousSibling
    && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Nu() {
  return this.each(Q0);
}
function Mu(e) {
  var t = typeof e == "function" ? e : Zi(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function K0() {
  return null;
}
function zu(e, t) {
  var r = typeof e == "function" ? e : Zi(e),
    n = t == null ? K0 : typeof t == "function" ? t : Xr(t);
  return this.select(function() {
    return this.insertBefore(
      r.apply(this, arguments),
      n.apply(this, arguments) || null,
    );
  });
}
function J0() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Ou() {
  return this.each(J0);
}
function ev() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function tv() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Du(e) {
  return this.select(e ? tv : ev);
}
function Gu(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function rv(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function nv(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var r = "", n = t.indexOf(".");
    return n >= 0 && (r = t.slice(n + 1), t = t.slice(0, n)),
      { type: t, name: r };
  });
}
function iv(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var r = 0, n = -1, i = t.length, o; r < i; ++r) {
        o = t[r],
          (!e.type || o.type === e.type) && o.name === e.name
            ? this.removeEventListener(o.type, o.listener, o.options)
            : t[++n] = o;
      }
      ++n ? t.length = n : delete this.__on;
    }
  };
}
function ov(e, t, r) {
  return function() {
    var n = this.__on, i, o = rv(t);
    if (n) {
      for (var s = 0, a = n.length; s < a; ++s) {
        if ((i = n[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options),
            this.addEventListener(i.type, i.listener = o, i.options = r),
            i.value = t;
          return;
        }
      }
    }
    this.addEventListener(e.type, o, r),
      i = { type: e.type, name: e.name, value: t, listener: o, options: r },
      n ? n.push(i) : this.__on = [i];
  };
}
function Bu(e, t, r) {
  var n = nv(e + ""), i, o = n.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, u = a.length, d; l < u; ++l) {
        for (i = 0, d = a[l]; i < o; ++i) {
          if ((s = n[i]).type === d.type && s.name === d.name) return d.value;
        }
      }
    }
    return;
  }
  for (a = t ? ov : iv, i = 0; i < o; ++i) this.each(a(n[i], t, r));
  return this;
}
function Vu(e, t, r) {
  var n = Ji(e), i = n.CustomEvent;
  typeof i == "function"
    ? i = new i(t, r)
    : (i = n.document.createEvent("Event"),
      r
        ? (i.initEvent(t, r.bubbles, r.cancelable), i.detail = r.detail)
        : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function av(e, t) {
  return function() {
    return Vu(this, e, t);
  };
}
function sv(e, t) {
  return function() {
    return Vu(this, e, t.apply(this, arguments));
  };
}
function $u(e, t) {
  return this.each((typeof t == "function" ? sv : av)(e, t));
}
function* ju() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t) {
    for (var n = e[t], i = 0, o = n.length, s; i < o; ++i) {
      (s = n[i]) && (yield s);
    }
  }
}
var Va = [null];
function pt(e, t) {
  this._groups = e, this._parents = t;
}
function Uu() {
  return new pt([[document.documentElement]], Va);
}
function fv() {
  return this;
}
pt.prototype = Uu.prototype = {
  constructor: pt,
  select: iu,
  selectAll: ou,
  selectChild: au,
  selectChildren: su,
  filter: fu,
  data: cu,
  enter: lu,
  exit: du,
  join: hu,
  merge: mu,
  selection: fv,
  order: pu,
  sort: vu,
  call: gu,
  nodes: xu,
  node: yu,
  size: bu,
  empty: _u,
  each: Su,
  attr: wu,
  style: Tu,
  property: Eu,
  classed: Cu,
  text: Pu,
  html: ku,
  raise: Ru,
  lower: Nu,
  append: Mu,
  insert: zu,
  remove: Ou,
  clone: Du,
  datum: Gu,
  on: Bu,
  dispatch: $u,
  [Symbol.iterator]: ju,
};
var vr = Uu;
function Mt(e) {
  return typeof e == "string"
    ? new pt([[document.querySelector(e)]], [document.documentElement])
    : new pt([[e]], Va);
}
function qu(e) {
  let t;
  for (; t = e.sourceEvent;) e = t;
  return e;
}
function gr(e, t) {
  if (e = qu(e), t === void 0 && (t = e.currentTarget), t) {
    var r = t.ownerSVGElement || t;
    if (r.createSVGPoint) {
      var n = r.createSVGPoint();
      return n.x = e.clientX,
        n.y = e.clientY,
        n = n.matrixTransform(t.getScreenCTM().inverse()),
        [n.x, n.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [
        e.clientX - i.left - t.clientLeft,
        e.clientY - i.top - t.clientTop,
      ];
    }
  }
  return [e.pageX, e.pageY];
}
var lv = { value: () => {} };
function Xu() {
  for (var e = 0, t = arguments.length, r = {}, n; e < t; ++e) {
    if (!(n = arguments[e] + "") || n in r || /[\s.]/.test(n)) {
      throw new Error("illegal type: " + n);
    }
    r[n] = [];
  }
  return new eo(r);
}
function eo(e) {
  this._ = e;
}
function uv(e, t) {
  return e.trim().split(/^|\s+/).map(function(r) {
    var n = "", i = r.indexOf(".");
    if (
      i >= 0 && (n = r.slice(i + 1), r = r.slice(0, i)),
        r && !t.hasOwnProperty(r)
    ) {
      throw new Error("unknown type: " + r);
    }
    return { type: r, name: n };
  });
}
eo.prototype = Xu.prototype = {
  constructor: eo,
  on: function(e, t) {
    var r = this._, n = uv(e + "", r), i, o = -1, s = n.length;
    if (arguments.length < 2) {
      for (; ++o < s;) {
        if ((i = (e = n[o]).type) && (i = cv(r[i], e.name))) return i;
      }
      return;
    }
    if (t != null && typeof t != "function") {
      throw new Error("invalid callback: " + t);
    }
    for (; ++o < s;) {if (i = (e = n[o]).type) r[i] = Hu(r[i], e.name, t);
      else if (t == null) for (i in r) r[i] = Hu(r[i], e.name, null);}
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var r in t) e[r] = t[r].slice();
    return new eo(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0) {
      for (var r = new Array(i), n = 0, i, o; n < i; ++n) {
        r[n] = arguments[n + 2];
      }
    }
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (o = this._[e], n = 0, i = o.length; n < i; ++n) o[n].value.apply(t, r);
  },
  apply: function(e, t, r) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var n = this._[e], i = 0, o = n.length; i < o; ++i) {
      n[i].value.apply(t, r);
    }
  },
};
function cv(e, t) {
  for (var r = 0, n = e.length, i; r < n; ++r) {
    if ((i = e[r]).name === t) return i.value;
  }
}
function Hu(e, t, r) {
  for (var n = 0, i = e.length; n < i; ++n) {
    if (e[n].name === t) {
      e[n] = lv, e = e.slice(0, n).concat(e.slice(n + 1));
      break;
    }
  }
  return r != null && e.push({ name: t, value: r }), e;
}
var Zn = Xu;
var bn = 0,
  Kn = 0,
  Qn = 0,
  Wu = 1e3,
  to,
  Jn,
  ro = 0,
  Yr = 0,
  no = 0,
  ei = typeof performance == "object" && performance.now ? performance : Date,
  Zu = typeof window == "object" && window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : function(e) {
      setTimeout(e, 17);
    };
function ri() {
  return Yr || (Zu(dv), Yr = ei.now() + no);
}
function dv() {
  Yr = 0;
}
function ti() {
  this._call = this._time = this._next = null;
}
ti.prototype = io.prototype = {
  constructor: ti,
  restart: function(e, t, r) {
    if (typeof e != "function") {
      throw new TypeError("callback is not a function");
    }
    r = (r == null ? ri() : +r) + (t == null ? 0 : +t),
      !this._next && Jn !== this
      && (Jn ? Jn._next = this : to = this, Jn = this),
      this._call = e,
      this._time = r,
      $a();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, $a());
  },
};
function io(e, t, r) {
  var n = new ti();
  return n.restart(e, t, r), n;
}
function Qu() {
  ri(), ++bn;
  for (var e = to, t; e;) {
    (t = Yr - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  }
  --bn;
}
function Yu() {
  Yr = (ro = ei.now()) + no, bn = Kn = 0;
  try {
    Qu();
  }
  finally {
    bn = 0, mv(), Yr = 0;
  }
}
function hv() {
  var e = ei.now(), t = e - ro;
  t > Wu && (no -= t, ro = e);
}
function mv() {
  for (var e, t = to, r, n = 1 / 0; t;) {
    t._call
      ? (n > t._time && (n = t._time), e = t, t = t._next)
      : (r = t._next, t._next = null, t = e ? e._next = r : to = r);
  }
  Jn = e, $a(n);
}
function $a(e) {
  if (!bn) {
    Kn && (Kn = clearTimeout(Kn));
    var t = e - Yr;
    t > 24
      ? (e < 1 / 0 && (Kn = setTimeout(Yu, e - ei.now() - no)),
        Qn && (Qn = clearInterval(Qn)))
      : (Qn || (ro = ei.now(), Qn = setInterval(hv, Wu)), bn = 1, Zu(Yu));
  }
}
function oo(e, t, r) {
  var n = new ti();
  return t = t == null ? 0 : +t,
    n.restart(
      i => {
        n.stop(), e(i + t);
      },
      t,
      r,
    ),
    n;
}
var pv = Zn("start", "end", "cancel", "interrupt"),
  vv = [],
  Ju = 0,
  ja = 1,
  so = 2,
  ao = 3,
  Ku = 4,
  fo = 5,
  ni = 6;
function Lr(e, t, r, n, i, o) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (r in s) return;
  gv(e, r, {
    name: t,
    index: n,
    group: i,
    on: pv,
    tween: vv,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: Ju,
  });
}
function ii(e, t) {
  var r = wt(e, t);
  if (r.state > Ju) throw new Error("too late; already scheduled");
  return r;
}
function Lt(e, t) {
  var r = wt(e, t);
  if (r.state > ao) throw new Error("too late; already running");
  return r;
}
function wt(e, t) {
  var r = e.__transition;
  if (!r || !(r = r[t])) throw new Error("transition not found");
  return r;
}
function gv(e, t, r) {
  var n = e.__transition, i;
  n[t] = r, r.timer = io(o, 0, r.time);
  function o(u) {
    r.state = ja,
      r.timer.restart(s, r.delay, r.time),
      r.delay <= u && s(u - r.delay);
  }
  function s(u) {
    var d, g, w, C;
    if (r.state !== ja) return l();
    for (d in n) {
      if (C = n[d], C.name === r.name) {
        if (C.state === ao) return oo(s);
        C.state === Ku
          ? (C.state = ni,
            C.timer.stop(),
            C.on.call("interrupt", e, e.__data__, C.index, C.group),
            delete n[d])
          : +d < t
            && (C.state = ni,
              C.timer.stop(),
              C.on.call("cancel", e, e.__data__, C.index, C.group),
              delete n[d]);
      }
    }
    if (
      oo(function() {
        r.state === ao
          && (r.state = Ku, r.timer.restart(a, r.delay, r.time), a(u));
      }),
        r.state = so,
        r.on.call("start", e, e.__data__, r.index, r.group),
        r.state === so
    ) {
      for (
        r.state = ao, i = new Array(w = r.tween.length), d = 0, g = -1;
        d < w;
        ++d
      ) {
        (C = r.tween[d].value.call(e, e.__data__, r.index, r.group))
          && (i[++g] = C);
      }
      i.length = g + 1;
    }
  }
  function a(u) {
    for (
      var d = u < r.duration
          ? r.ease.call(null, u / r.duration)
          : (r.timer.restart(l), r.state = fo, 1),
        g = -1,
        w = i.length;
      ++g < w;
    ) {
      i[g].call(e, d);
    }
    r.state === fo && (r.on.call("end", e, e.__data__, r.index, r.group), l());
  }
  function l() {
    r.state = ni, r.timer.stop(), delete n[t];
    for (var u in n) return;
    delete e.__transition;
  }
}
function Wr(e, t) {
  var r = e.__transition, n, i, o = !0, s;
  if (r) {
    t = t == null ? null : t + "";
    for (s in r) {
      if ((n = r[s]).name !== t) {
        o = !1;
        continue;
      }
      i = n.state > so && n.state < fo,
        n.state = ni,
        n.timer.stop(),
        n.on.call(i ? "interrupt" : "cancel", e, e.__data__, n.index, n.group),
        delete r[s];
    }
    o && delete e.__transition;
  }
}
function ec(e) {
  return this.each(function() {
    Wr(this, e);
  });
}
function lo(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function Ua(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function si() {}
var oi = .7,
  ho = 1 / oi,
  _n = "\\s*([+-]?\\d+)\\s*",
  ai = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
  ar = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
  xv = /^#([0-9a-f]{3,8})$/,
  yv = new RegExp(`^rgb\\(${_n},${_n},${_n}\\)$`),
  bv = new RegExp(`^rgb\\(${ar},${ar},${ar}\\)$`),
  _v = new RegExp(`^rgba\\(${_n},${_n},${_n},${ai}\\)$`),
  Sv = new RegExp(`^rgba\\(${ar},${ar},${ar},${ai}\\)$`),
  wv = new RegExp(`^hsl\\(${ai},${ar},${ar}\\)$`),
  Tv = new RegExp(`^hsla\\(${ai},${ar},${ar},${ai}\\)$`),
  tc = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  };
lo(si, Ut, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: rc,
  formatHex: rc,
  formatHex8: Ev,
  formatHsl: Av,
  formatRgb: nc,
  toString: nc,
});
function rc() {
  return this.rgb().formatHex();
}
function Ev() {
  return this.rgb().formatHex8();
}
function Av() {
  return lc(this).formatHsl();
}
function nc() {
  return this.rgb().formatRgb();
}
function Ut(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(),
    (t = xv.exec(e))
      ? (r = t[1].length,
        t = parseInt(t[1], 16),
        r === 6 ? ic(t) : r === 3
          ? new zt(
            t >> 8 & 15 | t >> 4 & 240,
            t >> 4 & 15 | t & 240,
            (t & 15) << 4 | t & 15,
            1,
          )
          : r === 8
          ? uo(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255)
          : r === 4
          ? uo(
            t >> 12 & 15 | t >> 8 & 240,
            t >> 8 & 15 | t >> 4 & 240,
            t >> 4 & 15 | t & 240,
            ((t & 15) << 4 | t & 15) / 255,
          )
          : null)
      : (t = yv.exec(e))
      ? new zt(t[1], t[2], t[3], 1)
      : (t = bv.exec(e))
      ? new zt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1)
      : (t = _v.exec(e))
      ? uo(t[1], t[2], t[3], t[4])
      : (t = Sv.exec(e))
      ? uo(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4])
      : (t = wv.exec(e))
      ? sc(t[1], t[2] / 100, t[3] / 100, 1)
      : (t = Tv.exec(e))
      ? sc(t[1], t[2] / 100, t[3] / 100, t[4])
      : tc.hasOwnProperty(e)
      ? ic(tc[e])
      : e === "transparent"
      ? new zt(NaN, NaN, NaN, 0)
      : null;
}
function ic(e) {
  return new zt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function uo(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new zt(e, t, r, n);
}
function Iv(e) {
  return e instanceof si || (e = Ut(e)),
    e ? (e = e.rgb(), new zt(e.r, e.g, e.b, e.opacity)) : new zt();
}
function Sn(e, t, r, n) {
  return arguments.length === 1 ? Iv(e) : new zt(e, t, r, n ?? 1);
}
function zt(e, t, r, n) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +n;
}
lo(
  zt,
  Sn,
  Ua(si, {
    brighter(e) {
      return e = e == null ? ho : Math.pow(ho, e),
        new zt(this.r * e, this.g * e, this.b * e, this.opacity);
    },
    darker(e) {
      return e = e == null ? oi : Math.pow(oi, e),
        new zt(this.r * e, this.g * e, this.b * e, this.opacity);
    },
    rgb() {
      return this;
    },
    clamp() {
      return new zt(Qr(this.r), Qr(this.g), Qr(this.b), mo(this.opacity));
    },
    displayable() {
      return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5
        && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity
        && this.opacity <= 1;
    },
    hex: oc,
    formatHex: oc,
    formatHex8: Lv,
    formatRgb: ac,
    toString: ac,
  }),
);
function oc() {
  return `#${Zr(this.r)}${Zr(this.g)}${Zr(this.b)}`;
}
function Lv() {
  return `#${Zr(this.r)}${Zr(this.g)}${Zr(this.b)}${
    Zr((isNaN(this.opacity) ? 1 : this.opacity) * 255)
  }`;
}
function ac() {
  let e = mo(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Qr(this.r)}, ${Qr(this.g)}, ${
    Qr(this.b)
  }${e === 1 ? ")" : `, ${e})`}`;
}
function mo(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Qr(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Zr(e) {
  return e = Qr(e), (e < 16 ? "0" : "") + e.toString(16);
}
function sc(e, t, r, n) {
  return n <= 0
    ? e = t = r = NaN
    : r <= 0 || r >= 1
    ? e = t = NaN
    : t <= 0 && (e = NaN),
    new Kt(e, t, r, n);
}
function lc(e) {
  if (e instanceof Kt) return new Kt(e.h, e.s, e.l, e.opacity);
  if (e instanceof si || (e = Ut(e)), !e) return new Kt();
  if (e instanceof Kt) return e;
  e = e.rgb();
  var t = e.r / 255,
    r = e.g / 255,
    n = e.b / 255,
    i = Math.min(t, r, n),
    o = Math.max(t, r, n),
    s = NaN,
    a = o - i,
    l = (o + i) / 2;
  return a
    ? (t === o
      ? s = (r - n) / a + (r < n) * 6
      : r === o
      ? s = (n - t) / a + 2
      : s = (t - r) / a + 4,
      a /= l < .5 ? o + i : 2 - o - i,
      s *= 60)
    : a = l > 0 && l < 1 ? 0 : s,
    new Kt(s, a, l, e.opacity);
}
function uc(e, t, r, n) {
  return arguments.length === 1 ? lc(e) : new Kt(e, t, r, n ?? 1);
}
function Kt(e, t, r, n) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +n;
}
lo(
  Kt,
  uc,
  Ua(si, {
    brighter(e) {
      return e = e == null ? ho : Math.pow(ho, e),
        new Kt(this.h, this.s, this.l * e, this.opacity);
    },
    darker(e) {
      return e = e == null ? oi : Math.pow(oi, e),
        new Kt(this.h, this.s, this.l * e, this.opacity);
    },
    rgb() {
      var e = this.h % 360 + (this.h < 0) * 360,
        t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
        r = this.l,
        n = r + (r < .5 ? r : 1 - r) * t,
        i = 2 * r - n;
      return new zt(
        qa(e >= 240 ? e - 240 : e + 120, i, n),
        qa(e, i, n),
        qa(e < 120 ? e + 240 : e - 120, i, n),
        this.opacity,
      );
    },
    clamp() {
      return new Kt(fc(this.h), co(this.s), co(this.l), mo(this.opacity));
    },
    displayable() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l
        && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
    },
    formatHsl() {
      let e = mo(this.opacity);
      return `${e === 1 ? "hsl(" : "hsla("}${fc(this.h)}, ${
        co(this.s) * 100
      }%, ${co(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
    },
  }),
);
function fc(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function co(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function qa(e, t, r) {
  return (e < 60
    ? t + (r - t) * e / 60
    : e < 180
    ? r
    : e < 240
    ? t + (r - t) * (240 - e) / 60
    : t) * 255;
}
function Ha(e, t, r, n, i) {
  var o = e * e, s = o * e;
  return ((1 - 3 * e + 3 * o - s) * t + (4 - 6 * o + 3 * s) * r
    + (1 + 3 * e + 3 * o - 3 * s) * n + s * i) / 6;
}
function cc(e) {
  var t = e.length - 1;
  return function(r) {
    var n = r <= 0 ? r = 0 : r >= 1 ? (r = 1, t - 1) : Math.floor(r * t),
      i = e[n],
      o = e[n + 1],
      s = n > 0 ? e[n - 1] : 2 * i - o,
      a = n < t - 1 ? e[n + 2] : 2 * o - i;
    return Ha((r - n / t) * t, s, i, o, a);
  };
}
function dc(e) {
  var t = e.length;
  return function(r) {
    var n = Math.floor(((r %= 1) < 0 ? ++r : r) * t),
      i = e[(n + t - 1) % t],
      o = e[n % t],
      s = e[(n + 1) % t],
      a = e[(n + 2) % t];
    return Ha((r - n / t) * t, i, o, s, a);
  };
}
var fi = e => () => e;
function Fv(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function Cv(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(n) {
    return Math.pow(e + n * t, r);
  };
}
function hc(e) {
  return (e = +e) == 1 ? po : function(t, r) {
    return r - t ? Cv(t, r, e) : fi(isNaN(t) ? r : t);
  };
}
function po(e, t) {
  var r = t - e;
  return r ? Fv(e, r) : fi(isNaN(e) ? t : e);
}
var Kr = function e(t) {
  var r = hc(t);
  function n(i, o) {
    var s = r((i = Sn(i)).r, (o = Sn(o)).r),
      a = r(i.g, o.g),
      l = r(i.b, o.b),
      u = po(i.opacity, o.opacity);
    return function(d) {
      return i.r = s(d), i.g = a(d), i.b = l(d), i.opacity = u(d), i + "";
    };
  }
  return n.gamma = e, n;
}(1);
function mc(e) {
  return function(t) {
    var r = t.length,
      n = new Array(r),
      i = new Array(r),
      o = new Array(r),
      s,
      a;
    for (s = 0; s < r; ++s) {
      a = Sn(t[s]), n[s] = a.r || 0, i[s] = a.g || 0, o[s] = a.b || 0;
    }
    return n = e(n), i = e(i), o = e(o), a.opacity = 1, function(l) {
      return a.r = n(l), a.g = i(l), a.b = o(l), a + "";
    };
  };
}
var Pv = mc(cc), kv = mc(dc);
function pc(e, t) {
  t || (t = []);
  var r = e ? Math.min(t.length, e.length) : 0, n = t.slice(), i;
  return function(o) {
    for (i = 0; i < r; ++i) n[i] = e[i] * (1 - o) + t[i] * o;
    return n;
  };
}
function vc(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function gc(e, t) {
  var r = t ? t.length : 0,
    n = e ? Math.min(r, e.length) : 0,
    i = new Array(n),
    o = new Array(r),
    s;
  for (s = 0; s < n; ++s) i[s] = Jr(e[s], t[s]);
  for (; s < r; ++s) o[s] = t[s];
  return function(a) {
    for (s = 0; s < n; ++s) o[s] = i[s](a);
    return o;
  };
}
function xc(e, t) {
  var r = new Date();
  return e = +e, t = +t, function(n) {
    return r.setTime(e * (1 - n) + t * n), r;
  };
}
function Ft(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
function yc(e, t) {
  var r = {}, n = {}, i;
  (e === null || typeof e != "object") && (e = {}),
    (t === null || typeof t != "object") && (t = {});
  for (i in t) i in e ? r[i] = Jr(e[i], t[i]) : n[i] = t[i];
  return function(o) {
    for (i in r) n[i] = r[i](o);
    return n;
  };
}
var Ya = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  Xa = new RegExp(Ya.source, "g");
function Rv(e) {
  return function() {
    return e;
  };
}
function Nv(e) {
  return function(t) {
    return e(t) + "";
  };
}
function li(e, t) {
  var r = Ya.lastIndex = Xa.lastIndex = 0, n, i, o, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (n = Ya.exec(e)) && (i = Xa.exec(t));) {
    (o = i.index) > r && (o = t.slice(r, o), a[s] ? a[s] += o : a[++s] = o),
      (n = n[0]) === (i = i[0])
        ? a[s] ? a[s] += i : a[++s] = i
        : (a[++s] = null, l.push({ i: s, x: Ft(n, i) })),
      r = Xa.lastIndex;
  }
  return r < t.length && (o = t.slice(r), a[s] ? a[s] += o : a[++s] = o),
    a.length < 2 ? l[0] ? Nv(l[0].x) : Rv(t) : (t = l.length, function(u) {
      for (var d = 0, g; d < t; ++d) a[(g = l[d]).i] = g.x(u);
      return a.join("");
    });
}
function Jr(e, t) {
  var r = typeof t, n;
  return t == null || r === "boolean"
    ? fi(t)
    : (r === "number" ? Ft
    : r === "string" ? (n = Ut(t)) ? (t = n, Kr) : li : t instanceof Ut
      ? Kr
      : t instanceof Date
      ? xc
      : vc(t)
      ? pc
      : Array.isArray(t)
      ? gc
      : typeof t.valueOf != "function" && typeof t.toString != "function"
          || isNaN(t)
      ? yc
      : Ft)(e, t);
}
function Wa(e, t) {
  return e = +e, t = +t, function(r) {
    return Math.round(e * (1 - r) + t * r);
  };
}
var bc = 180 / Math.PI,
  vo = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1,
  };
function Za(e, t, r, n, i, o) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s),
    (l = e * r + t * n) && (r -= e * l, n -= t * l),
    (a = Math.sqrt(r * r + n * n)) && (r /= a, n /= a, l /= a),
    e * n < t * r && (e = -e, t = -t, l = -l, s = -s),
    {
      translateX: i,
      translateY: o,
      rotate: Math.atan2(t, e) * bc,
      skewX: Math.atan(l) * bc,
      scaleX: s,
      scaleY: a,
    };
}
var go;
function _c(e) {
  let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(
    e + "",
  );
  return t.isIdentity ? vo : Za(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Sc(e) {
  return e == null
    ? vo
    : (go || (go = document.createElementNS("http://www.w3.org/2000/svg", "g")),
      go.setAttribute("transform", e),
      (e = go.transform.baseVal.consolidate())
        ? (e = e.matrix, Za(e.a, e.b, e.c, e.d, e.e, e.f))
        : vo);
}
function wc(e, t, r, n) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function o(u, d, g, w, C, Y) {
    if (u !== g || d !== w) {
      var me = C.push("translate(", null, t, null, r);
      Y.push({ i: me - 4, x: Ft(u, g) }, { i: me - 2, x: Ft(d, w) });
    }
    else (g || w) && C.push("translate(" + g + t + w + r);
  }
  function s(u, d, g, w) {
    u !== d
      ? (u - d > 180 ? d += 360 : d - u > 180 && (u += 360),
        w.push({ i: g.push(i(g) + "rotate(", null, n) - 2, x: Ft(u, d) }))
      : d && g.push(i(g) + "rotate(" + d + n);
  }
  function a(u, d, g, w) {
    u !== d
      ? w.push({ i: g.push(i(g) + "skewX(", null, n) - 2, x: Ft(u, d) })
      : d && g.push(i(g) + "skewX(" + d + n);
  }
  function l(u, d, g, w, C, Y) {
    if (u !== g || d !== w) {
      var me = C.push(i(C) + "scale(", null, ",", null, ")");
      Y.push({ i: me - 4, x: Ft(u, g) }, { i: me - 2, x: Ft(d, w) });
    }
    else (g !== 1 || w !== 1) && C.push(i(C) + "scale(" + g + "," + w + ")");
  }
  return function(u, d) {
    var g = [], w = [];
    return u = e(u),
      d = e(d),
      o(u.translateX, u.translateY, d.translateX, d.translateY, g, w),
      s(u.rotate, d.rotate, g, w),
      a(u.skewX, d.skewX, g, w),
      l(u.scaleX, u.scaleY, d.scaleX, d.scaleY, g, w),
      u = d = null,
      function(C) {
        for (var Y = -1, me = w.length, ce; ++Y < me;) {
          g[(ce = w[Y]).i] = ce.x(C);
        }
        return g.join("");
      };
  };
}
var Qa = wc(_c, "px, ", "px)", "deg)"), Ka = wc(Sc, ", ", ")", ")");
var Mv = 1e-12;
function Tc(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function zv(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Ov(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var Ja = function e(t, r, n) {
  function i(o, s) {
    var a = o[0],
      l = o[1],
      u = o[2],
      d = s[0],
      g = s[1],
      w = s[2],
      C = d - a,
      Y = g - l,
      me = C * C + Y * Y,
      ce,
      ie;
    if (me < Mv) {
      ie = Math.log(w / u) / t,
        ce = function(We) {
          return [a + We * C, l + We * Y, u * Math.exp(t * We * ie)];
        };
    }
    else {
      var Le = Math.sqrt(me),
        _e = (w * w - u * u + n * me) / (2 * u * r * Le),
        Re = (w * w - u * u - n * me) / (2 * w * r * Le),
        Me = Math.log(Math.sqrt(_e * _e + 1) - _e),
        qe = Math.log(Math.sqrt(Re * Re + 1) - Re);
      ie = (qe - Me) / t,
        ce = function(We) {
          var rt = We * ie,
            ft = Tc(Me),
            tt = u / (r * Le) * (ft * Ov(t * rt + Me) - zv(Me));
          return [a + tt * C, l + tt * Y, u * ft / Tc(t * rt + Me)];
        };
    }
    return ce.duration = ie * 1e3 * t / Math.SQRT2, ce;
  }
  return i.rho = function(o) {
    var s = Math.max(.001, +o), a = s * s, l = a * a;
    return e(s, a, l);
  },
    i;
}(Math.SQRT2, 2, 4);
function Dv(e, t) {
  var r, n;
  return function() {
    var i = Lt(this, e), o = i.tween;
    if (o !== r) {
      n = r = o;
      for (var s = 0, a = n.length; s < a; ++s) {
        if (n[s].name === t) {
          n = n.slice(), n.splice(s, 1);
          break;
        }
      }
    }
    i.tween = n;
  };
}
function Gv(e, t, r) {
  var n, i;
  if (typeof r != "function") throw new Error();
  return function() {
    var o = Lt(this, e), s = o.tween;
    if (s !== n) {
      i = (n = s).slice();
      for (var a = { name: t, value: r }, l = 0, u = i.length; l < u; ++l) {
        if (i[l].name === t) {
          i[l] = a;
          break;
        }
      }
      l === u && i.push(a);
    }
    o.tween = i;
  };
}
function Ec(e, t) {
  var r = this._id;
  if (e += "", arguments.length < 2) {
    for (var n = wt(this.node(), r).tween, i = 0, o = n.length, s; i < o; ++i) {
      if ((s = n[i]).name === e) return s.value;
    }
    return null;
  }
  return this.each((t == null ? Dv : Gv)(r, e, t));
}
function wn(e, t, r) {
  var n = e._id;
  return e.each(function() {
    var i = Lt(this, n);
    (i.value || (i.value = {}))[t] = r.apply(this, arguments);
  }),
    function(i) {
      return wt(i, n).value[t];
    };
}
function xo(e, t) {
  var r;
  return (typeof t == "number"
    ? Ft
    : t instanceof Ut
    ? Kr
    : (r = Ut(t))
    ? (t = r, Kr)
    : li)(e, t);
}
function Bv(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Vv(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function $v(e, t, r) {
  var n, i = r + "", o;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === n ? o : o = t(n = s, r);
  };
}
function jv(e, t, r) {
  var n, i = r + "", o;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === n ? o : o = t(n = s, r);
  };
}
function Uv(e, t, r) {
  var n, i, o;
  return function() {
    var s, a = r(this), l;
    return a == null
      ? void this.removeAttribute(e)
      : (s = this.getAttribute(e),
        l = a + "",
        s === l ? null : s === n && l === i
          ? o
          : (i = l, o = t(n = s, a)));
  };
}
function qv(e, t, r) {
  var n, i, o;
  return function() {
    var s, a = r(this), l;
    return a == null
      ? void this.removeAttributeNS(e.space, e.local)
      : (s = this.getAttributeNS(e.space, e.local),
        l = a + "",
        s === l ? null : s === n && l === i
          ? o
          : (i = l, o = t(n = s, a)));
  };
}
function Ac(e, t) {
  var r = pr(e), n = r === "transform" ? Ka : xo;
  return this.attrTween(
    e,
    typeof t == "function"
      ? (r.local ? qv : Uv)(r, n, wn(this, "attr." + e, t))
      : t == null
      ? (r.local ? Vv : Bv)(r)
      : (r.local ? jv : $v)(r, n, t),
  );
}
function Hv(e, t) {
  return function(r) {
    this.setAttribute(e, t.call(this, r));
  };
}
function Xv(e, t) {
  return function(r) {
    this.setAttributeNS(e.space, e.local, t.call(this, r));
  };
}
function Yv(e, t) {
  var r, n;
  function i() {
    var o = t.apply(this, arguments);
    return o !== n && (r = (n = o) && Xv(e, o)), r;
  }
  return i._value = t, i;
}
function Wv(e, t) {
  var r, n;
  function i() {
    var o = t.apply(this, arguments);
    return o !== n && (r = (n = o) && Hv(e, o)), r;
  }
  return i._value = t, i;
}
function Ic(e, t) {
  var r = "attr." + e;
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  var n = pr(e);
  return this.tween(r, (n.local ? Yv : Wv)(n, t));
}
function Zv(e, t) {
  return function() {
    ii(this, e).delay = +t.apply(this, arguments);
  };
}
function Qv(e, t) {
  return t = +t, function() {
    ii(this, e).delay = t;
  };
}
function Lc(e) {
  var t = this._id;
  return arguments.length
    ? this.each((typeof e == "function" ? Zv : Qv)(t, e))
    : wt(this.node(), t).delay;
}
function Kv(e, t) {
  return function() {
    Lt(this, e).duration = +t.apply(this, arguments);
  };
}
function Jv(e, t) {
  return t = +t, function() {
    Lt(this, e).duration = t;
  };
}
function Fc(e) {
  var t = this._id;
  return arguments.length
    ? this.each((typeof e == "function" ? Kv : Jv)(t, e))
    : wt(this.node(), t).duration;
}
function eg(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Lt(this, e).ease = t;
  };
}
function Cc(e) {
  var t = this._id;
  return arguments.length ? this.each(eg(t, e)) : wt(this.node(), t).ease;
}
function tg(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    if (typeof r != "function") throw new Error();
    Lt(this, e).ease = r;
  };
}
function Pc(e) {
  if (typeof e != "function") throw new Error();
  return this.each(tg(this._id, e));
}
function kc(e) {
  typeof e != "function" && (e = Yn(e));
  for (
    var t = this._groups, r = t.length, n = new Array(r), i = 0; i < r; ++i
  ) {
    for (var o = t[i], s = o.length, a = n[i] = [], l, u = 0; u < s; ++u) {
      (l = o[u]) && e.call(l, l.__data__, u, o) && a.push(l);
    }
  }
  return new Pt(n, this._parents, this._name, this._id);
}
function Rc(e) {
  if (e._id !== this._id) throw new Error();
  for (
    var t = this._groups,
      r = e._groups,
      n = t.length,
      i = r.length,
      o = Math.min(n, i),
      s = new Array(n),
      a = 0;
    a < o;
    ++a
  ) {
    for (
      var l = t[a], u = r[a], d = l.length, g = s[a] = new Array(d), w, C = 0;
      C < d;
      ++C
    ) {
      (w = l[C] || u[C]) && (g[C] = w);
    }
  }
  for (; a < n; ++a) s[a] = t[a];
  return new Pt(s, this._parents, this._name, this._id);
}
function rg(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var r = t.indexOf(".");
    return r >= 0 && (t = t.slice(0, r)), !t || t === "start";
  });
}
function ng(e, t, r) {
  var n, i, o = rg(t) ? ii : Lt;
  return function() {
    var s = o(this, e), a = s.on;
    a !== n && (i = (n = a).copy()).on(t, r), s.on = i;
  };
}
function Nc(e, t) {
  var r = this._id;
  return arguments.length < 2
    ? wt(this.node(), r).on.on(e)
    : this.each(ng(r, e, t));
}
function ig(e) {
  return function() {
    var t = this.parentNode;
    for (var r in this.__transition) if (+r !== e) return;
    t && t.removeChild(this);
  };
}
function Mc() {
  return this.on("end.remove", ig(this._id));
}
function zc(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = Xr(e));
  for (
    var n = this._groups, i = n.length, o = new Array(i), s = 0; s < i; ++s
  ) {
    for (
      var a = n[s], l = a.length, u = o[s] = new Array(l), d, g, w = 0;
      w < l;
      ++w
    ) {
      (d = a[w]) && (g = e.call(d, d.__data__, w, a))
        && ("__data__" in d && (g.__data__ = d.__data__),
          u[w] = g,
          Lr(u[w], t, r, w, u, wt(d, r)));
    }
  }
  return new Pt(o, this._parents, t, r);
}
function Oc(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = Xn(e));
  for (var n = this._groups, i = n.length, o = [], s = [], a = 0; a < i; ++a) {
    for (var l = n[a], u = l.length, d, g = 0; g < u; ++g) {
      if (d = l[g]) {
        for (
          var w = e.call(d, d.__data__, g, l),
            C,
            Y = wt(d, r),
            me = 0,
            ce = w.length;
          me < ce;
          ++me
        ) {
          (C = w[me]) && Lr(C, t, r, me, w, Y);
        }
        o.push(w), s.push(d);
      }
    }
  }
  return new Pt(o, s, t, r);
}
var og = vr.prototype.constructor;
function Dc() {
  return new og(this._groups, this._parents);
}
function ag(e, t) {
  var r, n, i;
  return function() {
    var o = Ir(this, e), s = (this.style.removeProperty(e), Ir(this, e));
    return o === s ? null : o === r && s === n ? i : i = t(r = o, n = s);
  };
}
function Gc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function sg(e, t, r) {
  var n, i = r + "", o;
  return function() {
    var s = Ir(this, e);
    return s === i ? null : s === n ? o : o = t(n = s, r);
  };
}
function fg(e, t, r) {
  var n, i, o;
  return function() {
    var s = Ir(this, e), a = r(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Ir(this, e))),
      s === l ? null : s === n && l === i ? o : (i = l, o = t(n = s, a));
  };
}
function lg(e, t) {
  var r, n, i, o = "style." + t, s = "end." + o, a;
  return function() {
    var l = Lt(this, e),
      u = l.on,
      d = l.value[o] == null ? a || (a = Gc(t)) : void 0;
    (u !== r || i !== d) && (n = (r = u).copy()).on(s, i = d), l.on = n;
  };
}
function Bc(e, t, r) {
  var n = (e += "") == "transform" ? Qa : xo;
  return t == null
    ? this.styleTween(e, ag(e, n)).on("end.style." + e, Gc(e))
    : typeof t == "function"
    ? this.styleTween(e, fg(e, n, wn(this, "style." + e, t))).each(
      lg(this._id, e),
    )
    : this.styleTween(e, sg(e, n, t), r).on("end.style." + e, null);
}
function ug(e, t, r) {
  return function(n) {
    this.style.setProperty(e, t.call(this, n), r);
  };
}
function cg(e, t, r) {
  var n, i;
  function o() {
    var s = t.apply(this, arguments);
    return s !== i && (n = (i = s) && ug(e, s, r)), n;
  }
  return o._value = t, o;
}
function Vc(e, t, r) {
  var n = "style." + (e += "");
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  return this.tween(n, cg(e, t, r ?? ""));
}
function dg(e) {
  return function() {
    this.textContent = e;
  };
}
function hg(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function $c(e) {
  return this.tween(
    "text",
    typeof e == "function"
      ? hg(wn(this, "text", e))
      : dg(e == null ? "" : e + ""),
  );
}
function mg(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function pg(e) {
  var t, r;
  function n() {
    var i = e.apply(this, arguments);
    return i !== r && (t = (r = i) && mg(i)), t;
  }
  return n._value = e, n;
}
function jc(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, pg(e));
}
function Uc() {
  for (
    var e = this._name,
      t = this._id,
      r = yo(),
      n = this._groups,
      i = n.length,
      o = 0;
    o < i;
    ++o
  ) {
    for (var s = n[o], a = s.length, l, u = 0; u < a; ++u) {
      if (l = s[u]) {
        var d = wt(l, t);
        Lr(l, e, r, u, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease,
        });
      }
    }
  }
  return new Pt(n, this._parents, e, r);
}
function qc() {
  var e, t, r = this, n = r._id, i = r.size();
  return new Promise(function(o, s) {
    var a = { value: s },
      l = {
        value: function() {
          --i === 0 && o();
        },
      };
    r.each(function() {
      var u = Lt(this, n), d = u.on;
      d !== e
      && (t = (e = d).copy(),
        t._.cancel.push(a),
        t._.interrupt.push(a),
        t._.end.push(l)), u.on = t;
    }), i === 0 && o();
  });
}
var vg = 0;
function Pt(e, t, r, n) {
  this._groups = e, this._parents = t, this._name = r, this._id = n;
}
function es(e) {
  return vr().transition(e);
}
function yo() {
  return ++vg;
}
var xr = vr.prototype;
Pt.prototype = es.prototype = {
  constructor: Pt,
  select: zc,
  selectAll: Oc,
  selectChild: xr.selectChild,
  selectChildren: xr.selectChildren,
  filter: kc,
  merge: Rc,
  selection: Dc,
  transition: Uc,
  call: xr.call,
  nodes: xr.nodes,
  node: xr.node,
  size: xr.size,
  empty: xr.empty,
  each: xr.each,
  on: Nc,
  attr: Ac,
  attrTween: Ic,
  style: Bc,
  styleTween: Vc,
  text: $c,
  textTween: jc,
  remove: Mc,
  tween: Ec,
  delay: Lc,
  duration: Fc,
  ease: Cc,
  easeVarying: Pc,
  end: qc,
  [Symbol.iterator]: xr[Symbol.iterator],
};
function ts(e) {
  return e * e;
}
function rs(e) {
  return e * (2 - e);
}
function bo(e) {
  return ((e *= 2) <= 1 ? e * e : --e * (2 - e) + 1) / 2;
}
function _o(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var gg = { time: null, delay: 0, duration: 250, ease: _o };
function xg(e, t) {
  for (var r; !(r = e.__transition) || !(r = r[t]);) {
    if (!(e = e.parentNode)) throw new Error(`transition ${t} not found`);
  }
  return r;
}
function Hc(e) {
  var t, r;
  e instanceof Pt
    ? (t = e._id, e = e._name)
    : (t = yo(), (r = gg).time = ri(), e = e == null ? null : e + "");
  for (var n = this._groups, i = n.length, o = 0; o < i; ++o) {
    for (var s = n[o], a = s.length, l, u = 0; u < a; ++u) {
      (l = s[u]) && Lr(l, e, t, u, s, r || xg(l, t));
    }
  }
  return new Pt(n, this._parents, e, t);
}
vr.prototype.interrupt = ec;
vr.prototype.transition = Hc;
var kd = nu(Xc());
function en(e, t) {
  return e == null || t == null
    ? NaN
    : e < t
    ? -1
    : e > t
    ? 1
    : e >= t
    ? 0
    : NaN;
}
function os(e, t) {
  return e == null || t == null
    ? NaN
    : t < e
    ? -1
    : t > e
    ? 1
    : t >= e
    ? 0
    : NaN;
}
function So(e) {
  let t, r, n;
  e.length !== 2
    ? (t = en, r = (a, l) => en(e(a), l), n = (a, l) => e(a) - l)
    : (t = e === en || e === os ? e : yg, r = e, n = e);
  function i(a, l, u = 0, d = a.length) {
    if (u < d) {
      if (t(l, l) !== 0) return d;
      do {
        let g = u + d >>> 1;
        r(a[g], l) < 0 ? u = g + 1 : d = g;
      } while (u < d);
    }
    return u;
  }
  function o(a, l, u = 0, d = a.length) {
    if (u < d) {
      if (t(l, l) !== 0) return d;
      do {
        let g = u + d >>> 1;
        r(a[g], l) <= 0 ? u = g + 1 : d = g;
      } while (u < d);
    }
    return u;
  }
  function s(a, l, u = 0, d = a.length) {
    let g = i(a, l, u, d - 1);
    return g > u && n(a[g - 1], l) > -n(a[g], l) ? g - 1 : g;
  }
  return { left: i, center: s, right: o };
}
function yg() {
  return 0;
}
function as(e) {
  return e === null ? NaN : +e;
}
var Yc = So(en), Wc = Yc.right, bg = Yc.left, _g = So(as).center, ss = Wc;
function tn(e, t) {
  let r, n;
  if (t === void 0) {
    for (let i of e) {
      i != null && (r === void 0
        ? i >= i && (r = n = i)
        : (r > i && (r = i), n < i && (n = i)));
    }
  }
  else {
    let i = -1;
    for (let o of e) {
      (o = t(o, ++i, e)) != null && (r === void 0
        ? o >= o && (r = n = o)
        : (r > o && (r = o), n < o && (n = o)));
    }
  }
  return [r, n];
}
var Sg = Math.sqrt(50), wg = Math.sqrt(10), Tg = Math.sqrt(2);
function wo(e, t, r) {
  let n = (t - e) / Math.max(0, r),
    i = Math.floor(Math.log10(n)),
    o = n / Math.pow(10, i),
    s = o >= Sg ? 10 : o >= wg ? 5 : o >= Tg ? 2 : 1,
    a,
    l,
    u;
  return i < 0
    ? (u = Math.pow(10, -i) / s,
      a = Math.round(e * u),
      l = Math.round(t * u),
      a / u < e && ++a,
      l / u > t && --l,
      u = -u)
    : (u = Math.pow(10, i) * s,
      a = Math.round(e / u),
      l = Math.round(t / u),
      a * u < e && ++a,
      l * u > t && --l),
    l < a && .5 <= r && r < 2 ? wo(e, t, r * 2) : [a, l, u];
}
function To(e, t, r) {
  if (t = +t, e = +e, r = +r, !(r > 0)) return [];
  if (e === t) return [e];
  let n = t < e, [i, o, s] = n ? wo(t, e, r) : wo(e, t, r);
  if (!(o >= i)) return [];
  let a = o - i + 1, l = new Array(a);
  if (n) {
    if (s < 0) for (let u = 0; u < a; ++u) l[u] = (o - u) / -s;
    else for (let u = 0; u < a; ++u) l[u] = (o - u) * s;
  }
  else if (s < 0) for (let u = 0; u < a; ++u) l[u] = (i + u) / -s;
  else for (let u = 0; u < a; ++u) l[u] = (i + u) * s;
  return l;
}
function ui(e, t, r) {
  return t = +t, e = +e, r = +r, wo(e, t, r)[2];
}
function fs(e, t, r) {
  t = +t, e = +e, r = +r;
  let n = t < e, i = n ? ui(t, e, r) : ui(e, t, r);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
function Eo(e, t, r) {
  e = +e,
    t = +t,
    r = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +r;
  for (
    var n = -1, i = Math.max(0, Math.ceil((t - e) / r)) | 0, o = new Array(i);
    ++n < i;
  ) {
    o[n] = e + n * r;
  }
  return o;
}
function Ao(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function ls(e) {
  return function() {
    return e;
  };
}
function us(e) {
  return +e;
}
var Zc = [0, 1];
function Jt(e) {
  return e;
}
function cs(e, t) {
  return (t -= e = +e)
    ? function(r) {
      return (r - e) / t;
    }
    : ls(isNaN(t) ? NaN : .5);
}
function Eg(e, t) {
  var r;
  return e > t && (r = e, e = t, t = r), function(n) {
    return Math.max(e, Math.min(t, n));
  };
}
function Ag(e, t, r) {
  var n = e[0], i = e[1], o = t[0], s = t[1];
  return i < n ? (n = cs(i, n), o = r(s, o)) : (n = cs(n, i), o = r(o, s)),
    function(a) {
      return o(n(a));
    };
}
function Ig(e, t, r) {
  var n = Math.min(e.length, t.length) - 1,
    i = new Array(n),
    o = new Array(n),
    s = -1;
  for (
    e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++s < n;
  ) {
    i[s] = cs(e[s], e[s + 1]), o[s] = r(t[s], t[s + 1]);
  }
  return function(a) {
    var l = ss(e, a, 1, n) - 1;
    return o[l](i[l](a));
  };
}
function Io(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate())
    .clamp(e.clamp()).unknown(e.unknown());
}
function ds() {
  var e = Zc, t = Zc, r = Jr, n, i, o, s = Jt, a, l, u;
  function d() {
    var w = Math.min(e.length, t.length);
    return s !== Jt && (s = Eg(e[0], e[w - 1])),
      a = w > 2 ? Ig : Ag,
      l = u = null,
      g;
  }
  function g(w) {
    return w == null || isNaN(w = +w)
      ? o
      : (l || (l = a(e.map(n), t, r)))(n(s(w)));
  }
  return g.invert = function(w) {
    return s(i((u || (u = a(t, e.map(n), Ft)))(w)));
  },
    g.domain = function(w) {
      return arguments.length ? (e = Array.from(w, us), d()) : e.slice();
    },
    g.range = function(w) {
      return arguments.length ? (t = Array.from(w), d()) : t.slice();
    },
    g.rangeRound = function(w) {
      return t = Array.from(w), r = Wa, d();
    },
    g.clamp = function(w) {
      return arguments.length ? (s = w ? !0 : Jt, d()) : s !== Jt;
    },
    g.interpolate = function(w) {
      return arguments.length ? (r = w, d()) : r;
    },
    g.unknown = function(w) {
      return arguments.length ? (o = w, g) : o;
    },
    function(w, C) {
      return n = w, i = C, d();
    };
}
function hs() {
  return ds()(Jt, Jt);
}
function Qc(e) {
  return Math.abs(e = Math.round(e)) >= 1e21
    ? e.toLocaleString("en").replace(/,/g, "")
    : e.toString(10);
}
function rn(e, t) {
  if (
    (r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0
  ) {
    return null;
  }
  var r, n = e.slice(0, r);
  return [n.length > 1 ? n[0] + n.slice(2) : n, +e.slice(r + 1)];
}
function sr(e) {
  return e = rn(Math.abs(e)), e ? e[1] : NaN;
}
function Kc(e, t) {
  return function(r, n) {
    for (
      var i = r.length, o = [], s = 0, a = e[0], l = 0;
      i > 0 && a > 0
      && (l + a + 1 > n && (a = Math.max(1, n - l)),
        o.push(r.substring(i -= a, i + a)),
        !((l += a + 1) > n));
    ) {
      a = e[s = (s + 1) % e.length];
    }
    return o.reverse().join(t);
  };
}
function Jc(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(r) {
      return e[+r];
    });
  };
}
var Lg =
  /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Fr(e) {
  if (!(t = Lg.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new Lo({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10],
  });
}
Fr.prototype = Lo.prototype;
function Lo(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "",
    this.align = e.align === void 0 ? ">" : e.align + "",
    this.sign = e.sign === void 0 ? "-" : e.sign + "",
    this.symbol = e.symbol === void 0 ? "" : e.symbol + "",
    this.zero = !!e.zero,
    this.width = e.width === void 0 ? void 0 : +e.width,
    this.comma = !!e.comma,
    this.precision = e.precision === void 0 ? void 0 : +e.precision,
    this.trim = !!e.trim,
    this.type = e.type === void 0 ? "" : e.type + "";
}
Lo.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero
    ? "0"
    : "")
    + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma
      ? ","
      : "")
    + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0))
    + (this.trim ? "~" : "") + this.type;
};
function ed(e) {
  e:
  for (var t = e.length, r = 1, n = -1, i; r < t; ++r) {
    switch (e[r]) {
      case ".":
        n = i = r;
        break;
      case "0":
        n === 0 && (n = r), i = r;
        break;
      default:
        if (!+e[r]) break e;
        n > 0 && (n = 0);
        break;
    }
  }
  return n > 0 ? e.slice(0, n) + e.slice(i + 1) : e;
}
var ms;
function td(e, t) {
  var r = rn(e, t);
  if (!r) return e + "";
  var n = r[0],
    i = r[1],
    o = i - (ms = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1,
    s = n.length;
  return o === s
    ? n
    : o > s
    ? n + new Array(o - s + 1).join("0")
    : o > 0
    ? n.slice(0, o) + "." + n.slice(o)
    : "0." + new Array(1 - o).join("0") + rn(e, Math.max(0, t + o - 1))[0];
}
function ps(e, t) {
  var r = rn(e, t);
  if (!r) return e + "";
  var n = r[0], i = r[1];
  return i < 0
    ? "0." + new Array(-i).join("0") + n
    : n.length > i + 1
    ? n.slice(0, i + 1) + "." + n.slice(i + 1)
    : n + new Array(i - n.length + 2).join("0");
}
var vs = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: e => Math.round(e).toString(2),
  c: e => e + "",
  d: Qc,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: e => Math.round(e).toString(8),
  p: (e, t) => ps(e * 100, t),
  r: ps,
  s: td,
  X: e => Math.round(e).toString(16).toUpperCase(),
  x: e => Math.round(e).toString(16),
};
function gs(e) {
  return e;
}
var rd = Array.prototype.map,
  nd = [
    "y",
    "z",
    "a",
    "f",
    "p",
    "n",
    "\xB5",
    "m",
    "",
    "k",
    "M",
    "G",
    "T",
    "P",
    "E",
    "Z",
    "Y",
  ];
function xs(e) {
  var t = e.grouping === void 0 || e.thousands === void 0
      ? gs
      : Kc(rd.call(e.grouping, Number), e.thousands + ""),
    r = e.currency === void 0 ? "" : e.currency[0] + "",
    n = e.currency === void 0 ? "" : e.currency[1] + "",
    i = e.decimal === void 0 ? "." : e.decimal + "",
    o = e.numerals === void 0 ? gs : Jc(rd.call(e.numerals, String)),
    s = e.percent === void 0 ? "%" : e.percent + "",
    a = e.minus === void 0 ? "\u2212" : e.minus + "",
    l = e.nan === void 0 ? "NaN" : e.nan + "";
  function u(g) {
    g = Fr(g);
    var w = g.fill,
      C = g.align,
      Y = g.sign,
      me = g.symbol,
      ce = g.zero,
      ie = g.width,
      Le = g.comma,
      _e = g.precision,
      Re = g.trim,
      Me = g.type;
    Me === "n"
      ? (Le = !0, Me = "g")
      : vs[Me] || (_e === void 0 && (_e = 12), Re = !0, Me = "g"),
      (ce || w === "0" && C === "=") && (ce = !0, w = "0", C = "=");
    var qe = me === "$"
        ? r
        : me === "#" && /[boxX]/.test(Me)
        ? "0" + Me.toLowerCase()
        : "",
      We = me === "$" ? n : /[%p]/.test(Me) ? s : "",
      rt = vs[Me],
      ft = /[defgprs%]/.test(Me);
    _e = _e === void 0
      ? 6
      : /[gprs]/.test(Me)
      ? Math.max(1, Math.min(21, _e))
      : Math.max(0, Math.min(20, _e));
    function tt(De) {
      var Je = qe, et = We, D, Te, le;
      if (Me === "c") et = rt(De) + et, De = "";
      else {
        De = +De;
        var Pe = De < 0 || 1 / De < 0;
        if (
          De = isNaN(De) ? l : rt(Math.abs(De), _e),
            Re && (De = ed(De)),
            Pe && +De == 0 && Y !== "+" && (Pe = !1),
            Je = (Pe ? Y === "(" ? Y : a : Y === "-" || Y === "("
              ? ""
              : Y) + Je,
            et = (Me === "s" ? nd[8 + ms / 3] : "") + et
              + (Pe && Y === "(" ? ")" : ""),
            ft
        ) {
          for (D = -1, Te = De.length; ++D < Te;) {
            if (le = De.charCodeAt(D), 48 > le || le > 57) {
              et = (le === 46 ? i + De.slice(D + 1) : De.slice(D)) + et,
                De = De.slice(0, D);
              break;
            }
          }
        }
      }
      Le && !ce && (De = t(De, 1 / 0));
      var Ge = Je.length + De.length + et.length,
        Ve = Ge < ie ? new Array(ie - Ge + 1).join(w) : "";
      switch (
        Le && ce && (De = t(
          Ve + De,
          Ve.length ? ie - et.length : 1 / 0,
        ),
          Ve = ""), C
      ) {
        case "<":
          De = Je + De + et + Ve;
          break;
        case "=":
          De = Je + Ve + De + et;
          break;
        case "^":
          De = Ve.slice(0, Ge = Ve.length >> 1) + Je + De + et + Ve.slice(Ge);
          break;
        default:
          De = Ve + Je + De + et;
          break;
      }
      return o(De);
    }
    return tt.toString = function() {
      return g + "";
    },
      tt;
  }
  function d(g, w) {
    var C = u((g = Fr(g), g.type = "f", g)),
      Y = Math.max(-8, Math.min(8, Math.floor(sr(w) / 3))) * 3,
      me = Math.pow(10, -Y),
      ce = nd[8 + Y / 3];
    return function(ie) {
      return C(me * ie) + ce;
    };
  }
  return { format: u, formatPrefix: d };
}
var Fo, Co, Po;
ys({ thousands: ",", grouping: [3], currency: ["$", ""] });
function ys(e) {
  return Fo = xs(e), Co = Fo.format, Po = Fo.formatPrefix, Fo;
}
function bs(e) {
  return Math.max(0, -sr(Math.abs(e)));
}
function _s(e, t) {
  return Math.max(
    0,
    Math.max(-8, Math.min(8, Math.floor(sr(t) / 3))) * 3 - sr(Math.abs(e)),
  );
}
function Ss(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, sr(t) - sr(e)) + 1;
}
function ws(e, t, r, n) {
  var i = fs(e, t, r), o;
  switch (n = Fr(n ?? ",f"), n.type) {
    case "s": {
      var s = Math.max(Math.abs(e), Math.abs(t));
      return n.precision == null && !isNaN(o = _s(i, s)) && (n.precision = o),
        Po(n, s);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null
        && !isNaN(o = Ss(i, Math.max(Math.abs(e), Math.abs(t))))
        && (n.precision = o - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(o = bs(i))
        && (n.precision = o - (n.type === "%") * 2);
      break;
    }
  }
  return Co(n);
}
function Ts(e) {
  var t = e.domain;
  return e.ticks = function(r) {
    var n = t();
    return To(n[0], n[n.length - 1], r ?? 10);
  },
    e.tickFormat = function(r, n) {
      var i = t();
      return ws(i[0], i[i.length - 1], r ?? 10, n);
    },
    e.nice = function(r) {
      r == null && (r = 10);
      var n = t(), i = 0, o = n.length - 1, s = n[i], a = n[o], l, u, d = 10;
      for (a < s && (u = s, s = a, a = u, u = i, i = o, o = u); d-- > 0;) {
        if (u = ui(s, a, r), u === l) return n[i] = s, n[o] = a, t(n);
        if (u > 0) s = Math.floor(s / u) * u, a = Math.ceil(a / u) * u;
        else if (u < 0) s = Math.ceil(s * u) / u, a = Math.floor(a * u) / u;
        else break;
        l = u;
      }
      return e;
    },
    e;
}
function Cr() {
  var e = hs();
  return e.copy = function() {
    return Io(e, Cr());
  },
    Ao.apply(e, arguments),
    Ts(e);
}
function id(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function Fg(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function Cg(e) {
  return e < 0 ? -e * e : e * e;
}
function Pg(e) {
  var t = e(Jt, Jt), r = 1;
  function n() {
    return r === 1 ? e(Jt, Jt) : r === .5 ? e(Fg, Cg) : e(id(r), id(1 / r));
  }
  return t.exponent = function(i) {
    return arguments.length ? (r = +i, n()) : r;
  },
    Ts(t);
}
function ci() {
  var e = Pg(ds());
  return e.copy = function() {
    return Io(e, ci()).exponent(e.exponent());
  },
    Ao.apply(e, arguments),
    e;
}
var fr = 1e-6, di = typeof Float32Array < "u" ? Float32Array : Array;
var gT = Math.PI / 180;
Math.hypot || (Math.hypot = function() {
  for (var e = 0, t = arguments.length; t--;) e += arguments[t] * arguments[t];
  return Math.sqrt(e);
});
var lr = {};
c0(lr, {
  add: () => rx,
  adjoint: () => $g,
  clone: () => Mg,
  copy: () => zg,
  create: () => Rg,
  determinant: () => jg,
  equals: () => ax,
  exactEquals: () => ox,
  frob: () => tx,
  fromMat2d: () => Zg,
  fromMat4: () => Ng,
  fromQuat: () => Qg,
  fromRotation: () => Yg,
  fromScaling: () => Wg,
  fromTranslation: () => Xg,
  fromValues: () => Og,
  identity: () => Gg,
  invert: () => Vg,
  mul: () => sx,
  multiply: () => od,
  multiplyScalar: () => nx,
  multiplyScalarAndAdd: () => ix,
  normalFromMat4: () => Kg,
  projection: () => Jg,
  rotate: () => qg,
  scale: () => Hg,
  set: () => Dg,
  str: () => ex,
  sub: () => fx,
  subtract: () => ad,
  translate: () => Ug,
  transpose: () => Bg,
});
function Rg() {
  var e = new di(9);
  return di != Float32Array
    && (e[1] = 0, e[2] = 0, e[3] = 0, e[5] = 0, e[6] = 0, e[7] = 0),
    e[0] = 1,
    e[4] = 1,
    e[8] = 1,
    e;
}
function Ng(e, t) {
  return e[0] = t[0],
    e[1] = t[1],
    e[2] = t[2],
    e[3] = t[4],
    e[4] = t[5],
    e[5] = t[6],
    e[6] = t[8],
    e[7] = t[9],
    e[8] = t[10],
    e;
}
function Mg(e) {
  var t = new di(9);
  return t[0] = e[0],
    t[1] = e[1],
    t[2] = e[2],
    t[3] = e[3],
    t[4] = e[4],
    t[5] = e[5],
    t[6] = e[6],
    t[7] = e[7],
    t[8] = e[8],
    t;
}
function zg(e, t) {
  return e[0] = t[0],
    e[1] = t[1],
    e[2] = t[2],
    e[3] = t[3],
    e[4] = t[4],
    e[5] = t[5],
    e[6] = t[6],
    e[7] = t[7],
    e[8] = t[8],
    e;
}
function Og(e, t, r, n, i, o, s, a, l) {
  var u = new di(9);
  return u[0] = e,
    u[1] = t,
    u[2] = r,
    u[3] = n,
    u[4] = i,
    u[5] = o,
    u[6] = s,
    u[7] = a,
    u[8] = l,
    u;
}
function Dg(e, t, r, n, i, o, s, a, l, u) {
  return e[0] = t,
    e[1] = r,
    e[2] = n,
    e[3] = i,
    e[4] = o,
    e[5] = s,
    e[6] = a,
    e[7] = l,
    e[8] = u,
    e;
}
function Gg(e) {
  return e[0] = 1,
    e[1] = 0,
    e[2] = 0,
    e[3] = 0,
    e[4] = 1,
    e[5] = 0,
    e[6] = 0,
    e[7] = 0,
    e[8] = 1,
    e;
}
function Bg(e, t) {
  if (e === t) {
    var r = t[1], n = t[2], i = t[5];
    e[1] = t[3], e[2] = t[6], e[3] = r, e[5] = t[7], e[6] = n, e[7] = i;
  }
  else {
    e[0] = t[0],
      e[1] = t[3],
      e[2] = t[6],
      e[3] = t[1],
      e[4] = t[4],
      e[5] = t[7],
      e[6] = t[2],
      e[7] = t[5],
      e[8] = t[8];
  }
  return e;
}
function Vg(e, t) {
  var r = t[0],
    n = t[1],
    i = t[2],
    o = t[3],
    s = t[4],
    a = t[5],
    l = t[6],
    u = t[7],
    d = t[8],
    g = d * s - a * u,
    w = -d * o + a * l,
    C = u * o - s * l,
    Y = r * g + n * w + i * C;
  return Y
    ? (Y = 1 / Y,
      e[0] = g * Y,
      e[1] = (-d * n + i * u) * Y,
      e[2] = (a * n - i * s) * Y,
      e[3] = w * Y,
      e[4] = (d * r - i * l) * Y,
      e[5] = (-a * r + i * o) * Y,
      e[6] = C * Y,
      e[7] = (-u * r + n * l) * Y,
      e[8] = (s * r - n * o) * Y,
      e)
    : null;
}
function $g(e, t) {
  var r = t[0],
    n = t[1],
    i = t[2],
    o = t[3],
    s = t[4],
    a = t[5],
    l = t[6],
    u = t[7],
    d = t[8];
  return e[0] = s * d - a * u,
    e[1] = i * u - n * d,
    e[2] = n * a - i * s,
    e[3] = a * l - o * d,
    e[4] = r * d - i * l,
    e[5] = i * o - r * a,
    e[6] = o * u - s * l,
    e[7] = n * l - r * u,
    e[8] = r * s - n * o,
    e;
}
function jg(e) {
  var t = e[0],
    r = e[1],
    n = e[2],
    i = e[3],
    o = e[4],
    s = e[5],
    a = e[6],
    l = e[7],
    u = e[8];
  return t * (u * o - s * l) + r * (-u * i + s * a) + n * (l * i - o * a);
}
function od(e, t, r) {
  var n = t[0],
    i = t[1],
    o = t[2],
    s = t[3],
    a = t[4],
    l = t[5],
    u = t[6],
    d = t[7],
    g = t[8],
    w = r[0],
    C = r[1],
    Y = r[2],
    me = r[3],
    ce = r[4],
    ie = r[5],
    Le = r[6],
    _e = r[7],
    Re = r[8];
  return e[0] = w * n + C * s + Y * u,
    e[1] = w * i + C * a + Y * d,
    e[2] = w * o + C * l + Y * g,
    e[3] = me * n + ce * s + ie * u,
    e[4] = me * i + ce * a + ie * d,
    e[5] = me * o + ce * l + ie * g,
    e[6] = Le * n + _e * s + Re * u,
    e[7] = Le * i + _e * a + Re * d,
    e[8] = Le * o + _e * l + Re * g,
    e;
}
function Ug(e, t, r) {
  var n = t[0],
    i = t[1],
    o = t[2],
    s = t[3],
    a = t[4],
    l = t[5],
    u = t[6],
    d = t[7],
    g = t[8],
    w = r[0],
    C = r[1];
  return e[0] = n,
    e[1] = i,
    e[2] = o,
    e[3] = s,
    e[4] = a,
    e[5] = l,
    e[6] = w * n + C * s + u,
    e[7] = w * i + C * a + d,
    e[8] = w * o + C * l + g,
    e;
}
function qg(e, t, r) {
  var n = t[0],
    i = t[1],
    o = t[2],
    s = t[3],
    a = t[4],
    l = t[5],
    u = t[6],
    d = t[7],
    g = t[8],
    w = Math.sin(r),
    C = Math.cos(r);
  return e[0] = C * n + w * s,
    e[1] = C * i + w * a,
    e[2] = C * o + w * l,
    e[3] = C * s - w * n,
    e[4] = C * a - w * i,
    e[5] = C * l - w * o,
    e[6] = u,
    e[7] = d,
    e[8] = g,
    e;
}
function Hg(e, t, r) {
  var n = r[0], i = r[1];
  return e[0] = n * t[0],
    e[1] = n * t[1],
    e[2] = n * t[2],
    e[3] = i * t[3],
    e[4] = i * t[4],
    e[5] = i * t[5],
    e[6] = t[6],
    e[7] = t[7],
    e[8] = t[8],
    e;
}
function Xg(e, t) {
  return e[0] = 1,
    e[1] = 0,
    e[2] = 0,
    e[3] = 0,
    e[4] = 1,
    e[5] = 0,
    e[6] = t[0],
    e[7] = t[1],
    e[8] = 1,
    e;
}
function Yg(e, t) {
  var r = Math.sin(t), n = Math.cos(t);
  return e[0] = n,
    e[1] = r,
    e[2] = 0,
    e[3] = -r,
    e[4] = n,
    e[5] = 0,
    e[6] = 0,
    e[7] = 0,
    e[8] = 1,
    e;
}
function Wg(e, t) {
  return e[0] = t[0],
    e[1] = 0,
    e[2] = 0,
    e[3] = 0,
    e[4] = t[1],
    e[5] = 0,
    e[6] = 0,
    e[7] = 0,
    e[8] = 1,
    e;
}
function Zg(e, t) {
  return e[0] = t[0],
    e[1] = t[1],
    e[2] = 0,
    e[3] = t[2],
    e[4] = t[3],
    e[5] = 0,
    e[6] = t[4],
    e[7] = t[5],
    e[8] = 1,
    e;
}
function Qg(e, t) {
  var r = t[0],
    n = t[1],
    i = t[2],
    o = t[3],
    s = r + r,
    a = n + n,
    l = i + i,
    u = r * s,
    d = n * s,
    g = n * a,
    w = i * s,
    C = i * a,
    Y = i * l,
    me = o * s,
    ce = o * a,
    ie = o * l;
  return e[0] = 1 - g - Y,
    e[3] = d - ie,
    e[6] = w + ce,
    e[1] = d + ie,
    e[4] = 1 - u - Y,
    e[7] = C - me,
    e[2] = w - ce,
    e[5] = C + me,
    e[8] = 1 - u - g,
    e;
}
function Kg(e, t) {
  var r = t[0],
    n = t[1],
    i = t[2],
    o = t[3],
    s = t[4],
    a = t[5],
    l = t[6],
    u = t[7],
    d = t[8],
    g = t[9],
    w = t[10],
    C = t[11],
    Y = t[12],
    me = t[13],
    ce = t[14],
    ie = t[15],
    Le = r * a - n * s,
    _e = r * l - i * s,
    Re = r * u - o * s,
    Me = n * l - i * a,
    qe = n * u - o * a,
    We = i * u - o * l,
    rt = d * me - g * Y,
    ft = d * ce - w * Y,
    tt = d * ie - C * Y,
    De = g * ce - w * me,
    Je = g * ie - C * me,
    et = w * ie - C * ce,
    D = Le * et - _e * Je + Re * De + Me * tt - qe * ft + We * rt;
  return D
    ? (D = 1 / D,
      e[0] = (a * et - l * Je + u * De) * D,
      e[1] = (l * tt - s * et - u * ft) * D,
      e[2] = (s * Je - a * tt + u * rt) * D,
      e[3] = (i * Je - n * et - o * De) * D,
      e[4] = (r * et - i * tt + o * ft) * D,
      e[5] = (n * tt - r * Je - o * rt) * D,
      e[6] = (me * We - ce * qe + ie * Me) * D,
      e[7] = (ce * Re - Y * We - ie * _e) * D,
      e[8] = (Y * qe - me * Re + ie * Le) * D,
      e)
    : null;
}
function Jg(e, t, r) {
  return e[0] = 2 / t,
    e[1] = 0,
    e[2] = 0,
    e[3] = 0,
    e[4] = -2 / r,
    e[5] = 0,
    e[6] = -1,
    e[7] = 1,
    e[8] = 1,
    e;
}
function ex(e) {
  return "mat3(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4]
    + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ")";
}
function tx(e) {
  return Math.hypot(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]);
}
function rx(e, t, r) {
  return e[0] = t[0] + r[0],
    e[1] = t[1] + r[1],
    e[2] = t[2] + r[2],
    e[3] = t[3] + r[3],
    e[4] = t[4] + r[4],
    e[5] = t[5] + r[5],
    e[6] = t[6] + r[6],
    e[7] = t[7] + r[7],
    e[8] = t[8] + r[8],
    e;
}
function ad(e, t, r) {
  return e[0] = t[0] - r[0],
    e[1] = t[1] - r[1],
    e[2] = t[2] - r[2],
    e[3] = t[3] - r[3],
    e[4] = t[4] - r[4],
    e[5] = t[5] - r[5],
    e[6] = t[6] - r[6],
    e[7] = t[7] - r[7],
    e[8] = t[8] - r[8],
    e;
}
function nx(e, t, r) {
  return e[0] = t[0] * r,
    e[1] = t[1] * r,
    e[2] = t[2] * r,
    e[3] = t[3] * r,
    e[4] = t[4] * r,
    e[5] = t[5] * r,
    e[6] = t[6] * r,
    e[7] = t[7] * r,
    e[8] = t[8] * r,
    e;
}
function ix(e, t, r, n) {
  return e[0] = t[0] + r[0] * n,
    e[1] = t[1] + r[1] * n,
    e[2] = t[2] + r[2] * n,
    e[3] = t[3] + r[3] * n,
    e[4] = t[4] + r[4] * n,
    e[5] = t[5] + r[5] * n,
    e[6] = t[6] + r[6] * n,
    e[7] = t[7] + r[7] * n,
    e[8] = t[8] + r[8] * n,
    e;
}
function ox(e, t) {
  return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3]
    && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7]
    && e[8] === t[8];
}
function ax(e, t) {
  var r = e[0],
    n = e[1],
    i = e[2],
    o = e[3],
    s = e[4],
    a = e[5],
    l = e[6],
    u = e[7],
    d = e[8],
    g = t[0],
    w = t[1],
    C = t[2],
    Y = t[3],
    me = t[4],
    ce = t[5],
    ie = t[6],
    Le = t[7],
    _e = t[8];
  return Math.abs(r - g) <= fr * Math.max(1, Math.abs(r), Math.abs(g))
    && Math.abs(n - w) <= fr * Math.max(1, Math.abs(n), Math.abs(w))
    && Math.abs(i - C) <= fr * Math.max(1, Math.abs(i), Math.abs(C))
    && Math.abs(o - Y) <= fr * Math.max(1, Math.abs(o), Math.abs(Y))
    && Math.abs(s - me) <= fr * Math.max(1, Math.abs(s), Math.abs(me))
    && Math.abs(a - ce) <= fr * Math.max(1, Math.abs(a), Math.abs(ce))
    && Math.abs(l - ie) <= fr * Math.max(1, Math.abs(l), Math.abs(ie))
    && Math.abs(u - Le) <= fr * Math.max(1, Math.abs(u), Math.abs(Le))
    && Math.abs(d - _e) <= fr * Math.max(1, Math.abs(d), Math.abs(_e));
}
var sx = od, fx = ad;
var Ad = nu(Sd());
function wd(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1,
      n.configurable = !0,
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, vx(n.key), n);
  }
}
function ks(e, t, r) {
  return t && wd(e.prototype, t),
    r && wd(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e;
}
function Id(e, t) {
  e.prototype = Object.create(t.prototype),
    e.prototype.constructor = e,
    Ps(e, t);
}
function Ps(e, t) {
  return Ps = Object.setPrototypeOf
    ? Object.setPrototypeOf.bind()
    : function(n, i) {
      return n.__proto__ = i, n;
    },
    Ps(e, t);
}
function px(e, t) {
  if (typeof e != "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t || "default");
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function vx(e) {
  var t = px(e, "string");
  return typeof t == "symbol" ? t : String(t);
}
var Ro = function() {
    function e() {}
    var t = e.prototype;
    return t._seed = function(n, i) {
      if (n === (n || 0)) return n;
      for (var o = "" + n, s = 0, a = 0; a < o.length; ++a) {
        s ^= o.charCodeAt(a) | 0;
      }
      return s;
    },
      e;
  }(),
  Td = function(e) {
    Id(t, e);
    function t(n, i) {
      var o;
      return o = e.call(this) || this, o._rng = void 0, o.seed(n, i), o;
    }
    var r = t.prototype;
    return r.next = function() {
      return this._rng();
    },
      r.seed = function(i, o) {
        this._rng = i;
      },
      r.clone = function(i, o) {
        return new t(this._rng, o);
      },
      ks(t, [{
        key: "name",
        get: function() {
          return "function";
        },
      }]),
      t;
  }(Ro),
  Ed = function() {
    var e = [].slice.call(arguments),
      t = e,
      r = t[0],
      n = r === void 0 ? "default" : r;
    switch (typeof n) {
      case "object":
        if (n instanceof Ro) return n;
        break;
      case "function":
        return new Td(n);
      case "number":
      case "string":
      default:
        return new Td(Ad.default.apply(void 0, e));
    }
    throw new Error("invalid RNG \"" + n + "\"");
  },
  gx = function(e, t, r) {
    return t === void 0 && (t = 0), r === void 0 && (r = 1), function() {
      return e.next() * (r - t) + t;
    };
  };
function er(e) {
  return new xx(e);
}
var xx = function(t) {
    var r = this;
    this.n = void 0,
      this.isInt = function() {
        if (Number.isInteger(r.n)) return r;
        throw new Error("Expected number to be an integer, got " + r.n);
      },
      this.isPositive = function() {
        if (r.n > 0) return r;
        throw new Error("Expected number to be positive, got " + r.n);
      },
      this.lessThan = function(n) {
        if (r.n < n) return r;
        throw new Error(
          "Expected number to be less than " + n + ", got " + r.n,
        );
      },
      this.greaterThanOrEqual = function(n) {
        if (r.n >= n) return r;
        throw new Error(
          "Expected number to be greater than or equal to " + n + ", got "
            + r.n,
        );
      },
      this.greaterThan = function(n) {
        if (r.n > n) return r;
        throw new Error(
          "Expected number to be greater than " + n + ", got " + r.n,
        );
      },
      this.n = t;
  },
  yx = function(e, t, r) {
    return t === void 0 && (t = 0),
      r === void 0 && (r = 1),
      r === void 0 && (r = t === void 0 ? 1 : t, t = 0),
      er(t).isInt(),
      er(r).isInt(),
      function() {
        return Math.floor(e.next() * (r - t + 1) + t);
      };
  },
  bx = function(e) {
    return function() {
      return e.next() >= .5;
    };
  },
  _x = function(e, t, r) {
    return t === void 0 && (t = 0), r === void 0 && (r = 1), function() {
      var n, i, o;
      do n = e.next() * 2 - 1, i = e.next() * 2 - 1, o = n * n + i * i; while (
        !o || o > 1
      );
      return t + r * i * Math.sqrt(-2 * Math.log(o) / o);
    };
  },
  Sx = function(e, t, r) {
    t === void 0 && (t = 0), r === void 0 && (r = 1);
    var n = e.normal(t, r);
    return function() {
      return Math.exp(n());
    };
  },
  wx = function(e, t) {
    return t === void 0 && (t = .5),
      er(t).greaterThanOrEqual(0).lessThan(1),
      function() {
        return Math.floor(e.next() + t);
      };
  },
  Tx = function(e, t, r) {
    return t === void 0 && (t = 1),
      r === void 0 && (r = .5),
      er(t).isInt().isPositive(),
      er(r).greaterThanOrEqual(0).lessThan(1),
      function() {
        for (var n = 0, i = 0; n++ < t;) e.next() < r && i++;
        return i;
      };
  },
  Ex = function(e, t) {
    t === void 0 && (t = .5), er(t).greaterThan(0).lessThan(1);
    var r = 1 / Math.log(1 - t);
    return function() {
      return Math.floor(1 + Math.log(e.next()) * r);
    };
  },
  Ax = [
    0,
    0,
    .6931471805599453,
    1.791759469228055,
    3.1780538303479458,
    4.787491742782046,
    6.579251212010101,
    8.525161361065415,
    10.60460290274525,
    12.801827480081469,
  ],
  Ix = function(t) {
    return Ax[t];
  },
  Lx = .9189385332046727,
  Fx = function(e, t) {
    if (t === void 0 && (t = 1), er(t).isPositive(), t < 10) {
      var r = Math.exp(-t);
      return function() {
        for (var l = r, u = 0, d = e.next(); d > l;) d = d - l, l = t * l / ++u;
        return u;
      };
    }
    else {
      var n = Math.sqrt(t),
        i = .931 + 2.53 * n,
        o = -.059 + .02483 * i,
        s = 1.1239 + 1.1328 / (i - 3.4),
        a = .9277 - 3.6224 / (i - 2);
      return function() {
        for (;;) {
          var l = void 0, u = e.next();
          if (u <= .86 * a) {
            return l = u / a - .43,
              Math.floor((2 * o / (.5 - Math.abs(l)) + i) * l + t + .445);
          }
          u >= a ? l = e.next() - .5
          : (l = u / a - .93, l = (l < 0 ? -.5 : .5) - l, u = e.next() * a);
          var d = .5 - Math.abs(l);
          if (!(d < .013 && u > d)) {
            var g = Math.floor((2 * o / d + i) * l + t + .445);
            if (u = u * s / (o / (d * d) + i), g >= 10) {
              var w = (g + .5) * Math.log(t / g) - t - Lx + g
                - (.08333333333333333
                    - (.002777777777777778 - 1 / (1260 * g * g)) / (g * g)) / g;
              if (Math.log(u * n) <= w) return g;
            }
            else if (g >= 0) {
              var C, Y = (C = Ix(g)) != null ? C : 0;
              if (Math.log(u) <= g * Math.log(t) - t - Y) return g;
            }
          }
        }
      };
    }
  },
  Cx = function(e, t) {
    return t === void 0 && (t = 1), er(t).isPositive(), function() {
      return -Math.log(1 - e.next()) / t;
    };
  },
  Px = function(e, t) {
    return t === void 0 && (t = 1),
      er(t).isInt().greaterThanOrEqual(0),
      function() {
        for (var r = 0, n = 0; n < t; ++n) r += e.next();
        return r;
      };
  },
  kx = function(e, t) {
    t === void 0 && (t = 1), er(t).isInt().isPositive();
    var r = e.irwinHall(t);
    return function() {
      return r() / t;
    };
  },
  Rx = function(e, t) {
    t === void 0 && (t = 1), er(t).greaterThanOrEqual(0);
    var r = 1 / t;
    return function() {
      return 1 / Math.pow(1 - e.next(), r);
    };
  },
  Nx = function(e) {
    Id(t, e);
    function t() {
      return e.apply(this, arguments) || this;
    }
    var r = t.prototype;
    return r.next = function() {
      return Math.random();
    },
      r.seed = function(i, o) {},
      r.clone = function() {
        return new t();
      },
      ks(t, [{
        key: "name",
        get: function() {
          return "default";
        },
      }]),
      t;
  }(Ro),
  Rs = function() {
    function e(r) {
      var n = this;
      this._rng = void 0,
        this._patch = void 0,
        this._cache = {},
        this.next = function() {
          return n._rng.next();
        },
        this.float = function(i, o) {
          return n.uniform(i, o)();
        },
        this.int = function(i, o) {
          return n.uniformInt(i, o)();
        },
        this.integer = function(i, o) {
          return n.uniformInt(i, o)();
        },
        this.bool = function() {
          return n.uniformBoolean()();
        },
        this.boolean = function() {
          return n.uniformBoolean()();
        },
        this.uniform = function(i, o) {
          return n._memoize("uniform", gx, i, o);
        },
        this.uniformInt = function(i, o) {
          return n._memoize("uniformInt", yx, i, o);
        },
        this.uniformBoolean = function() {
          return n._memoize("uniformBoolean", bx);
        },
        this.normal = function(i, o) {
          return _x(n, i, o);
        },
        this.logNormal = function(i, o) {
          return Sx(n, i, o);
        },
        this.bernoulli = function(i) {
          return wx(n, i);
        },
        this.binomial = function(i, o) {
          return Tx(n, i, o);
        },
        this.geometric = function(i) {
          return Ex(n, i);
        },
        this.poisson = function(i) {
          return Fx(n, i);
        },
        this.exponential = function(i) {
          return Cx(n, i);
        },
        this.irwinHall = function(i) {
          return Px(n, i);
        },
        this.bates = function(i) {
          return kx(n, i);
        },
        this.pareto = function(i) {
          return Rx(n, i);
        },
        r && r instanceof Ro ? this.use(r) : this.use(new Nx()),
        this._cache = {};
    }
    var t = e.prototype;
    return t.clone = function() {
      var n = [].slice.call(arguments);
      return n.length ? new e(Ed.apply(void 0, n)) : new e(this.rng.clone());
    },
      t.use = function() {
        this._rng = Ed.apply(void 0, [].slice.call(arguments));
      },
      t.patch = function() {
        if (this._patch) throw new Error("Math.random already patched");
        this._patch = Math.random, Math.random = this.uniform();
      },
      t.unpatch = function() {
        this._patch && (Math.random = this._patch, delete this._patch);
      },
      t.choice = function(n) {
        if (!Array.isArray(n)) {
          throw new Error(
            "Random.choice expected input to be an array, got " + typeof n,
          );
        }
        var i = n?.length;
        if (i > 0) {
          var o = this.uniformInt(0, i - 1)();
          return n[o];
        }
        else return;
      },
      t._memoize = function(n, i) {
        var o = [].slice.call(arguments, 2),
          s = "" + o.join(";"),
          a = this._cache[n];
        return (a === void 0 || a.key !== s)
          && (a = { key: s, distribution: i.apply(void 0, [this].concat(o)) },
            this._cache[n] = a),
          a.distribution;
      },
      ks(e, [{
        key: "rng",
        get: function() {
          return this._rng;
        },
      }]),
      e;
  }(),
  bT = new Rs();
var No = { capture: !0, passive: !1 };
function Mo(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Ns(e) {
  var t = e.document.documentElement, r = Mt(e).on("dragstart.drag", Mo, No);
  "onselectstart" in t
    ? r.on("selectstart.drag", Mo, No)
    : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Ms(e, t) {
  var r = e.document.documentElement, n = Mt(e).on("dragstart.drag", null);
  t && (n.on("click.drag", Mo, No),
    setTimeout(function() {
      n.on("click.drag", null);
    }, 0)),
    "onselectstart" in r
      ? n.on("selectstart.drag", null)
      : (r.style.MozUserSelect = r.__noselect, delete r.__noselect);
}
var hi = e => () => e;
function zs(e, { sourceEvent: t, target: r, transform: n, dispatch: i }) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: r, enumerable: !0, configurable: !0 },
    transform: { value: n, enumerable: !0, configurable: !0 },
    _: { value: i },
  });
}
function tr(e, t, r) {
  this.k = e, this.x = t, this.y = r;
}
tr.prototype = {
  constructor: tr,
  scale: function(e) {
    return e === 1 ? this : new tr(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this
    : new tr(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  },
};
var yr = new tr(1, 0, 0);
Os.prototype = tr.prototype;
function Os(e) {
  for (; !e.__zoom;) if (!(e = e.parentNode)) return yr;
  return e.__zoom;
}
function zo(e) {
  e.stopImmediatePropagation();
}
function Tn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Mx(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function zx() {
  var e = this;
  return e instanceof SVGElement
    ? (e = e.ownerSVGElement || e,
      e.hasAttribute("viewBox")
        ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]])
        : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]])
    : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Ld() {
  return this.__zoom || yr;
}
function Ox(e) {
  return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002)
    * (e.ctrlKey ? 10 : 1);
}
function Dx() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Gx(e, t, r) {
  var n = e.invertX(t[0][0]) - r[0][0],
    i = e.invertX(t[1][0]) - r[1][0],
    o = e.invertY(t[0][1]) - r[0][1],
    s = e.invertY(t[1][1]) - r[1][1];
  return e.translate(
    i > n ? (n + i) / 2 : Math.min(0, n) || Math.max(0, i),
    s > o ? (o + s) / 2 : Math.min(0, o) || Math.max(0, s),
  );
}
function Ds() {
  var e = Mx,
    t = zx,
    r = Gx,
    n = Ox,
    i = Dx,
    o = [0, 1 / 0],
    s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]],
    a = 250,
    l = Ja,
    u = Zn("start", "zoom", "end"),
    d,
    g,
    w,
    C = 500,
    Y = 150,
    me = 0,
    ce = 10;
  function ie(D) {
    D.property("__zoom", Ld).on("wheel.zoom", rt, { passive: !1 }).on(
      "mousedown.zoom",
      ft,
    ).on("dblclick.zoom", tt).filter(i).on("touchstart.zoom", De).on(
      "touchmove.zoom",
      Je,
    ).on("touchend.zoom touchcancel.zoom", et).style(
      "-webkit-tap-highlight-color",
      "rgba(0,0,0,0)",
    );
  }
  ie.transform = function(D, Te, le, Pe) {
    var Ge = D.selection ? D.selection() : D;
    Ge.property("__zoom", Ld),
      D !== Ge ? Me(D, Te, le, Pe) : Ge.interrupt().each(function() {
        qe(this, arguments).event(Pe).start().zoom(
          null,
          typeof Te == "function" ? Te.apply(this, arguments) : Te,
        ).end();
      });
  },
    ie.scaleBy = function(D, Te, le, Pe) {
      ie.scaleTo(
        D,
        function() {
          var Ge = this.__zoom.k,
            Ve = typeof Te == "function"
              ? Te.apply(this, arguments)
              : Te;
          return Ge * Ve;
        },
        le,
        Pe,
      );
    },
    ie.scaleTo = function(D, Te, le, Pe) {
      ie.transform(
        D,
        function() {
          var Ge = t.apply(this, arguments),
            Ve = this.__zoom,
            Ze = le == null ? Re(Ge) : typeof le == "function"
              ? le.apply(this, arguments)
              : le,
            nt = Ve.invert(Ze),
            lt = typeof Te == "function" ? Te.apply(this, arguments) : Te;
          return r(_e(Le(Ve, lt), Ze, nt), Ge, s);
        },
        le,
        Pe,
      );
    },
    ie.translateBy = function(D, Te, le, Pe) {
      ie.transform(
        D,
        function() {
          return r(
            this.__zoom.translate(
              typeof Te == "function"
                ? Te.apply(this, arguments)
                : Te,
              typeof le == "function" ? le.apply(this, arguments) : le,
            ),
            t.apply(this, arguments),
            s,
          );
        },
        null,
        Pe,
      );
    },
    ie.translateTo = function(D, Te, le, Pe, Ge) {
      ie.transform(
        D,
        function() {
          var Ve = t.apply(this, arguments),
            Ze = this.__zoom,
            nt = Pe == null ? Re(Ve) : typeof Pe == "function"
              ? Pe.apply(this, arguments)
              : Pe;
          return r(
            yr.translate(nt[0], nt[1]).scale(Ze.k).translate(
              typeof Te == "function" ? -Te.apply(this, arguments) : -Te,
              typeof le == "function" ? -le.apply(this, arguments) : -le,
            ),
            Ve,
            s,
          );
        },
        Pe,
        Ge,
      );
    };
  function Le(D, Te) {
    return Te = Math.max(o[0], Math.min(o[1], Te)),
      Te === D.k ? D : new tr(Te, D.x, D.y);
  }
  function _e(D, Te, le) {
    var Pe = Te[0] - le[0] * D.k, Ge = Te[1] - le[1] * D.k;
    return Pe === D.x && Ge === D.y ? D : new tr(D.k, Pe, Ge);
  }
  function Re(D) {
    return [(+D[0][0] + +D[1][0]) / 2, (+D[0][1] + +D[1][1]) / 2];
  }
  function Me(D, Te, le, Pe) {
    D.on("start.zoom", function() {
      qe(this, arguments).event(Pe).start();
    }).on("interrupt.zoom end.zoom", function() {
      qe(this, arguments).event(Pe).end();
    }).tween("zoom", function() {
      var Ge = this,
        Ve = arguments,
        Ze = qe(Ge, Ve).event(Pe),
        nt = t.apply(Ge, Ve),
        lt = le == null
          ? Re(nt)
          : typeof le == "function"
          ? le.apply(Ge, Ve)
          : le,
        qt = Math.max(nt[1][0] - nt[0][0], nt[1][1] - nt[0][1]),
        _t = Ge.__zoom,
        Ot = typeof Te == "function" ? Te.apply(Ge, Ve) : Te,
        Yt = l(
          _t.invert(lt).concat(qt / _t.k),
          Ot.invert(lt).concat(qt / Ot.k),
        );
      return function(Dt) {
        if (Dt === 1) Dt = Ot;
        else {
          var Wt = Yt(Dt), Ln = qt / Wt[2];
          Dt = new tr(Ln, lt[0] - Wt[0] * Ln, lt[1] - Wt[1] * Ln);
        }
        Ze.zoom(null, Dt);
      };
    });
  }
  function qe(D, Te, le) {
    return !le && D.__zooming || new We(D, Te);
  }
  function We(D, Te) {
    this.that = D,
      this.args = Te,
      this.active = 0,
      this.sourceEvent = null,
      this.extent = t.apply(D, Te),
      this.taps = 0;
  }
  We.prototype = {
    event: function(D) {
      return D && (this.sourceEvent = D), this;
    },
    start: function() {
      return ++this.active === 1
        && (this.that.__zooming = this, this.emit("start")),
        this;
    },
    zoom: function(D, Te) {
      return this.mouse && D !== "mouse"
        && (this.mouse[1] = Te.invert(this.mouse[0])),
        this.touch0 && D !== "touch"
        && (this.touch0[1] = Te.invert(this.touch0[0])),
        this.touch1 && D !== "touch"
        && (this.touch1[1] = Te.invert(this.touch1[0])),
        this.that.__zoom = Te,
        this.emit("zoom"),
        this;
    },
    end: function() {
      return --this.active === 0
        && (delete this.that.__zooming, this.emit("end")),
        this;
    },
    emit: function(D) {
      var Te = Mt(this.that).datum();
      u.call(
        D,
        this.that,
        new zs(D, {
          sourceEvent: this.sourceEvent,
          target: ie,
          type: D,
          transform: this.that.__zoom,
          dispatch: u,
        }),
        Te,
      );
    },
  };
  function rt(D, ...Te) {
    if (!e.apply(this, arguments)) return;
    var le = qe(this, Te).event(D),
      Pe = this.__zoom,
      Ge = Math.max(
        o[0],
        Math.min(o[1], Pe.k * Math.pow(2, n.apply(this, arguments))),
      ),
      Ve = gr(D);
    if (le.wheel) {
      (le.mouse[0][0] !== Ve[0] || le.mouse[0][1] !== Ve[1])
      && (le.mouse[1] = Pe.invert(le.mouse[0] = Ve)), clearTimeout(le.wheel);
    }
    else {
      if (Pe.k === Ge) return;
      le.mouse = [Ve, Pe.invert(Ve)], Wr(this), le.start();
    }
    Tn(D),
      le.wheel = setTimeout(Ze, Y),
      le.zoom(
        "mouse",
        r(_e(Le(Pe, Ge), le.mouse[0], le.mouse[1]), le.extent, s),
      );
    function Ze() {
      le.wheel = null, le.end();
    }
  }
  function ft(D, ...Te) {
    if (w || !e.apply(this, arguments)) return;
    var le = D.currentTarget,
      Pe = qe(this, Te, !0).event(D),
      Ge = Mt(D.view).on("mousemove.zoom", lt, !0).on("mouseup.zoom", qt, !0),
      Ve = gr(D, le),
      Ze = D.clientX,
      nt = D.clientY;
    Ns(D.view),
      zo(D),
      Pe.mouse = [Ve, this.__zoom.invert(Ve)],
      Wr(this),
      Pe.start();
    function lt(_t) {
      if (Tn(_t), !Pe.moved) {
        var Ot = _t.clientX - Ze, Yt = _t.clientY - nt;
        Pe.moved = Ot * Ot + Yt * Yt > me;
      }
      Pe.event(_t).zoom(
        "mouse",
        r(
          _e(Pe.that.__zoom, Pe.mouse[0] = gr(_t, le), Pe.mouse[1]),
          Pe.extent,
          s,
        ),
      );
    }
    function qt(_t) {
      Ge.on("mousemove.zoom mouseup.zoom", null),
        Ms(_t.view, Pe.moved),
        Tn(_t),
        Pe.event(_t).end();
    }
  }
  function tt(D, ...Te) {
    if (e.apply(this, arguments)) {
      var le = this.__zoom,
        Pe = gr(D.changedTouches ? D.changedTouches[0] : D, this),
        Ge = le.invert(Pe),
        Ve = le.k * (D.shiftKey ? .5 : 2),
        Ze = r(_e(Le(le, Ve), Pe, Ge), t.apply(this, Te), s);
      Tn(D),
        a > 0
          ? Mt(this).transition().duration(a).call(Me, Ze, Pe, D)
          : Mt(this).call(ie.transform, Ze, Pe, D);
    }
  }
  function De(D, ...Te) {
    if (e.apply(this, arguments)) {
      var le = D.touches,
        Pe = le.length,
        Ge = qe(this, Te, D.changedTouches.length === Pe).event(D),
        Ve,
        Ze,
        nt,
        lt;
      for (zo(D), Ze = 0; Ze < Pe; ++Ze) {
        nt = le[Ze],
          lt = gr(nt, this),
          lt = [lt, this.__zoom.invert(lt), nt.identifier],
          Ge.touch0
            ? !Ge.touch1 && Ge.touch0[2] !== lt[2]
              && (Ge.touch1 = lt, Ge.taps = 0)
            : (Ge.touch0 = lt, Ve = !0, Ge.taps = 1 + !!d);
      }
      d && (d = clearTimeout(d)),
        Ve && (Ge.taps < 2 && (g = lt[0],
          d = setTimeout(function() {
            d = null;
          }, C)),
          Wr(this),
          Ge.start());
    }
  }
  function Je(D, ...Te) {
    if (this.__zooming) {
      var le = qe(this, Te).event(D),
        Pe = D.changedTouches,
        Ge = Pe.length,
        Ve,
        Ze,
        nt,
        lt;
      for (Tn(D), Ve = 0; Ve < Ge; ++Ve) {
        Ze = Pe[Ve],
          nt = gr(Ze, this),
          le.touch0 && le.touch0[2] === Ze.identifier
            ? le.touch0[0] = nt
            : le.touch1 && le.touch1[2] === Ze.identifier
              && (le.touch1[0] = nt);
      }
      if (Ze = le.that.__zoom, le.touch1) {
        var qt = le.touch0[0],
          _t = le.touch0[1],
          Ot = le.touch1[0],
          Yt = le.touch1[1],
          Dt = (Dt = Ot[0] - qt[0]) * Dt + (Dt = Ot[1] - qt[1]) * Dt,
          Wt = (Wt = Yt[0] - _t[0]) * Wt + (Wt = Yt[1] - _t[1]) * Wt;
        Ze = Le(Ze, Math.sqrt(Dt / Wt)),
          nt = [(qt[0] + Ot[0]) / 2, (qt[1] + Ot[1]) / 2],
          lt = [(_t[0] + Yt[0]) / 2, (_t[1] + Yt[1]) / 2];
      }
      else if (le.touch0) nt = le.touch0[0], lt = le.touch0[1];
      else return;
      le.zoom("touch", r(_e(Ze, nt, lt), le.extent, s));
    }
  }
  function et(D, ...Te) {
    if (this.__zooming) {
      var le = qe(this, Te).event(D),
        Pe = D.changedTouches,
        Ge = Pe.length,
        Ve,
        Ze;
      for (
        zo(D),
          w && clearTimeout(w),
          w = setTimeout(function() {
            w = null;
          }, C),
          Ve = 0;
        Ve < Ge;
        ++Ve
      ) {
        Ze = Pe[Ve],
          le.touch0 && le.touch0[2] === Ze.identifier
            ? delete le.touch0
            : le.touch1 && le.touch1[2] === Ze.identifier && delete le.touch1;
      }
      if (
        le.touch1 && !le.touch0 && (le.touch0 = le.touch1, delete le.touch1),
          le.touch0
      ) {
        le.touch0[1] = this.__zoom.invert(le.touch0[0]);
      }
      else if (
        le.end(),
          le.taps === 2
          && (Ze = gr(Ze, this), Math.hypot(g[0] - Ze[0], g[1] - Ze[1]) < ce)
      ) {
        var nt = Mt(this).on("dblclick.zoom");
        nt && nt.apply(this, arguments);
      }
    }
  }
  return ie.wheelDelta = function(D) {
    return arguments.length ? (n = typeof D == "function" ? D : hi(+D), ie) : n;
  },
    ie.filter = function(D) {
      return arguments.length
        ? (e = typeof D == "function" ? D : hi(!!D), ie)
        : e;
    },
    ie.touchable = function(D) {
      return arguments.length ? (i = typeof D == "function" ? D : hi(!!D), ie)
      : i;
    },
    ie.extent = function(D) {
      return arguments.length
        ? (t = typeof D == "function"
          ? D
          : hi([[+D[0][0], +D[0][1]], [+D[1][0], +D[1][1]]]),
          ie)
        : t;
    },
    ie.scaleExtent = function(D) {
      return arguments.length ? (o[0] = +D[0], o[1] = +D[1], ie) : [o[0], o[1]];
    },
    ie.translateExtent = function(D) {
      return arguments.length
        ? (s[0][0] = +D[0][0],
          s[1][0] = +D[1][0],
          s[0][1] = +D[0][1],
          s[1][1] = +D[1][1],
          ie)
        : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
    },
    ie.constrain = function(D) {
      return arguments.length ? (r = D, ie) : r;
    },
    ie.duration = function(D) {
      return arguments.length ? (a = +D, ie) : a;
    },
    ie.interpolate = function(D) {
      return arguments.length ? (l = D, ie) : l;
    },
    ie.on = function() {
      var D = u.on.apply(u, arguments);
      return D === u ? ie : D;
    },
    ie.clickDistance = function(D) {
      return arguments.length ? (me = (D = +D) * D, ie) : Math.sqrt(me);
    },
    ie.tapDistance = function(D) {
      return arguments.length ? (ce = +D, ie) : ce;
    },
    ie;
}
var Rd = "#b3b3b3",
  Bx = .1,
  Nd = 4,
  Md = "#666666",
  Vx = .1,
  zd = 1,
  $x = "#222222",
  Xe = {
    disableSimulation: !1,
    spaceSize: 4096,
    nodeSizeScale: 1,
    linkWidthScale: 1,
    arrowSizeScale: 1,
    renderLinks: !0,
    curvedLinks: !1,
    curvedLinkSegments: 19,
    curvedLinkWeight: .8,
    curvedLinkControlPointDistance: .5,
    arrowLinks: !0,
    linkVisibilityDistanceRange: [50, 150],
    linkVisibilityMinTransparency: .25,
    hoveredNodeRingColor: "white",
    focusedNodeRingColor: "white",
    useQuadtree: !1,
    simulation: {
      decay: 1e3,
      gravity: 0,
      center: 0,
      repulsion: .1,
      repulsionTheta: 1.7,
      repulsionQuadtreeLevels: 12,
      linkSpring: 1,
      linkDistance: 2,
      linkDistRandomVariationRange: [1, 1.2],
      repulsionFromMouse: 2,
      friction: .85,
    },
    showFPSMonitor: !1,
    pixelRatio: 2,
    scaleNodesOnZoom: !0,
    disableZoom: !1,
    fitViewOnInit: !0,
    fitViewDelay: 250,
    nodeSamplingDistance: 150,
  },
  jx = .7,
  Ux = .95,
  Fd = 3,
  Od = e => typeof e == "function",
  Dd = e => Array.isArray(e),
  qx = e => e instanceof Object,
  Hx = e =>
    e instanceof Object
      ? e.constructor.name !== "Function" && e.constructor.name !== "Object"
      : !1,
  Cd = e => qx(e) && !Dd(e) && !Od(e) && !Hx(e);
function mi(e, t, r) {
  return Od(t) ? t(e, r) : t;
}
function An(e) {
  var t;
  let r;
  if (Dd(e)) r = e;
  else {
    let n = Ut(e), i = n?.rgb();
    r = [
      i?.r || 0,
      i?.g || 0,
      i?.b || 0,
      (t = n?.opacity) !== null && t !== void 0 ? t : 1,
    ];
  }
  return [r[0] / 255, r[1] / 255, r[2] / 255, r[3]];
}
function Pr(e, t) {
  let r = new Float32Array();
  return e({ framebuffer: t })(() => {
    r = e.read();
  }),
    r;
}
function Xx(e, t, r) {
  return Math.min(Math.max(e, t), r);
}
var Gs = class {
    constructor() {
      this.disableSimulation = Xe.disableSimulation,
        this.backgroundColor = $x,
        this.spaceSize = Xe.spaceSize,
        this.nodeColor = Rd,
        this.nodeGreyoutOpacity = Bx,
        this.nodeSize = Nd,
        this.nodeSizeScale = Xe.nodeSizeScale,
        this.renderHighlightedNodeRing = !0,
        this.highlightedNodeRingColor = void 0,
        this.renderHoveredNodeRing = !0,
        this.hoveredNodeRingColor = Xe.hoveredNodeRingColor,
        this.focusedNodeRingColor = Xe.focusedNodeRingColor,
        this.linkColor = Md,
        this.linkGreyoutOpacity = Vx,
        this.linkWidth = zd,
        this.linkWidthScale = Xe.linkWidthScale,
        this.renderLinks = Xe.renderLinks,
        this.curvedLinks = Xe.curvedLinks,
        this.curvedLinkSegments = Xe.curvedLinkSegments,
        this.curvedLinkWeight = Xe.curvedLinkWeight,
        this.curvedLinkControlPointDistance = Xe.curvedLinkControlPointDistance,
        this.linkArrows = Xe.arrowLinks,
        this.linkArrowsSizeScale = Xe.arrowSizeScale,
        this.linkVisibilityDistanceRange = Xe.linkVisibilityDistanceRange,
        this.linkVisibilityMinTransparency = Xe.linkVisibilityMinTransparency,
        this.useQuadtree = Xe.useQuadtree,
        this.simulation = {
          decay: Xe.simulation.decay,
          gravity: Xe.simulation.gravity,
          center: Xe.simulation.center,
          repulsion: Xe.simulation.repulsion,
          repulsionTheta: Xe.simulation.repulsionTheta,
          repulsionQuadtreeLevels: Xe.simulation.repulsionQuadtreeLevels,
          linkSpring: Xe.simulation.linkSpring,
          linkDistance: Xe.simulation.linkDistance,
          linkDistRandomVariationRange:
            Xe.simulation.linkDistRandomVariationRange,
          repulsionFromMouse: Xe.simulation.repulsionFromMouse,
          friction: Xe.simulation.friction,
          onStart: void 0,
          onTick: void 0,
          onEnd: void 0,
          onPause: void 0,
          onRestart: void 0,
        },
        this.events = {
          onClick: void 0,
          onMouseMove: void 0,
          onNodeMouseOver: void 0,
          onNodeMouseOut: void 0,
          onZoomStart: void 0,
          onZoom: void 0,
          onZoomEnd: void 0,
        },
        this.showFPSMonitor = Xe.showFPSMonitor,
        this.pixelRatio = Xe.pixelRatio,
        this.scaleNodesOnZoom = Xe.scaleNodesOnZoom,
        this.initialZoomLevel = void 0,
        this.disableZoom = Xe.disableZoom,
        this.fitViewOnInit = Xe.fitViewOnInit,
        this.fitViewDelay = Xe.fitViewDelay,
        this.fitViewByNodesInRect = void 0,
        this.randomSeed = void 0,
        this.nodeSamplingDistance = Xe.nodeSamplingDistance;
    }
    init(t) {
      Object.keys(t).forEach(r => {
        this.deepMergeConfig(this.getConfig(), t, r);
      });
    }
    deepMergeConfig(t, r, n) {
      Cd(t[n]) && Cd(r[n])
        ? Object.keys(r[n]).forEach(i => {
          this.deepMergeConfig(t[n], r[n], i);
        })
        : t[n] = r[n];
    }
    getConfig() {
      return this;
    }
  },
  ur = class {
    constructor(t, r, n, i, o) {
      this.reglInstance = t,
        this.config = r,
        this.store = n,
        this.data = i,
        o && (this.points = o);
    }
  },
  Yx = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
varying vec4 rgba;void main(){gl_FragColor=rgba;}`,
  Wx = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform float pointsTextureSize;attribute vec2 indexes;varying vec4 rgba;void main(){vec4 pointPosition=texture2D(position,indexes/pointsTextureSize);rgba=vec4(pointPosition.xy,1.0,0.0);gl_Position=vec4(0.0,0.0,0.0,1.0);gl_PointSize=1.0;}`,
  Zx = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform sampler2D centermass;uniform float center;uniform float alpha;varying vec2 index;void main(){vec4 pointPosition=texture2D(position,index);vec4 velocity=vec4(0.0);vec4 centermassValues=texture2D(centermass,vec2(0.0));vec2 centermassPosition=centermassValues.xy/centermassValues.b;vec2 distVector=centermassPosition-pointPosition.xy;float dist=sqrt(dot(distVector,distVector));if(dist>0.0){float angle=atan(distVector.y,distVector.x);float addV=alpha*center*dist*0.01;velocity.rg+=addV*vec2(cos(angle),sin(angle));}gl_FragColor=velocity;}`;
function Ct(e) {
  return {
    buffer: e.buffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])),
    size: 2,
  };
}
function En(e, t) {
  let r = new Float32Array(t * t * 2);
  for (let i = 0; i < t; i++) {
    for (let o = 0; o < t; o++) {
      let s = i * t * 2 + o * 2;
      r[s + 0] = o, r[s + 1] = i;
    }
  }
  return { buffer: e.buffer(r), size: 2 };
}
function vt(e) {
  var t;
  e && !((t = e?._framebuffer) === null || t === void 0) && t.framebuffer
    && e.destroy();
}
function Oo(e) {
  var t;
  e && !((t = e?._buffer) === null || t === void 0) && t.buffer && e.destroy();
}
var In = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
varying vec2 index;void main(){gl_FragColor=vec4(0.0);}`,
  kt = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
attribute vec2 quad;varying vec2 index;void main(){index=(quad+1.0)/2.0;gl_Position=vec4(quad,0,1);}`,
  Bs = class extends ur {
    create() {
      let { reglInstance: t } = this;
      this.centermassFbo = t.framebuffer({
        color: t.texture({
          data: new Float32Array(4).fill(0),
          shape: [1, 1, 4],
          type: "float",
        }),
        depth: !1,
        stencil: !1,
      });
    }
    initPrograms() {
      let { reglInstance: t, config: r, store: n, data: i, points: o } = this;
      this.clearCentermassCommand = t({
        frag: In,
        vert: kt,
        framebuffer: this.centermassFbo,
        primitive: "triangle strip",
        count: 4,
        attributes: { quad: Ct(t) },
      }),
        this.calculateCentermassCommand = t({
          frag: Yx,
          vert: Wx,
          framebuffer: () => this.centermassFbo,
          primitive: "points",
          count: () => i.nodes.length,
          attributes: { indexes: En(t, n.pointsTextureSize) },
          uniforms: {
            position: () => o?.previousPositionFbo,
            pointsTextureSize: () => n.pointsTextureSize,
          },
          blend: {
            enable: !0,
            func: { src: "one", dst: "one" },
            equation: { rgb: "add", alpha: "add" },
          },
          depth: { enable: !1, mask: !1 },
          stencil: { enable: !1 },
        }),
        this.runCommand = t({
          frag: Zx,
          vert: kt,
          framebuffer: () => o?.velocityFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(t) },
          uniforms: {
            position: () => o?.previousPositionFbo,
            centermass: () => this.centermassFbo,
            center: () => {
              var s;
              return (s = r.simulation) === null || s === void 0
                ? void 0
                : s.center;
            },
            alpha: () => n.alpha,
          },
        });
    }
    run() {
      var t, r, n;
      (t = this.clearCentermassCommand) === null || t === void 0
      || t.call(this),
        (r = this.calculateCentermassCommand) === null || r === void 0
        || r.call(this),
        (n = this.runCommand) === null || n === void 0 || n.call(this);
    }
    destroy() {
      vt(this.centermassFbo);
    }
  },
  Qx = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform float gravity;uniform float spaceSize;uniform float alpha;varying vec2 index;void main(){vec4 pointPosition=texture2D(position,index);vec4 velocity=vec4(0.0);vec2 centerPosition=vec2(spaceSize/2.0);vec2 distVector=centerPosition-pointPosition.rg;float dist=sqrt(dot(distVector,distVector));if(dist>0.0){float angle=atan(distVector.y,distVector.x);float addV=alpha*gravity*dist*0.1;velocity.rg+=addV*vec2(cos(angle),sin(angle));}gl_FragColor=velocity;}`,
  Vs = class extends ur {
    initPrograms() {
      let { reglInstance: t, config: r, store: n, points: i } = this;
      this.runCommand = t({
        frag: Qx,
        vert: kt,
        framebuffer: () => i?.velocityFbo,
        primitive: "triangle strip",
        count: 4,
        attributes: { quad: Ct(t) },
        uniforms: {
          position: () => i?.previousPositionFbo,
          gravity: () => {
            var o;
            return (o = r.simulation) === null || o === void 0
              ? void 0
              : o.gravity;
          },
          spaceSize: () => n.adjustedSpaceSize,
          alpha: () => n.alpha,
        },
      });
    }
    run() {
      var t;
      (t = this.runCommand) === null || t === void 0 || t.call(this);
    }
  };
function Kx(e) {
  return `
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D position;
uniform float linkSpring;
uniform float linkDistance;
uniform vec2 linkDistRandomVariationRange;

uniform sampler2D linkFirstIndicesAndAmount;
uniform sampler2D linkIndices;
uniform sampler2D linkBiasAndStrength;
uniform sampler2D linkRandomDistanceFbo;

uniform float pointsTextureSize;
uniform float linksTextureSize;
uniform float alpha;

varying vec2 index;

const float MAX_LINKS = ${e}.0;

void main() {
  vec4 pointPosition = texture2D(position, index);
  vec4 velocity = vec4(0.0);

  vec4 linkFirstIJAndAmount = texture2D(linkFirstIndicesAndAmount, index);
  float iCount = linkFirstIJAndAmount.r;
  float jCount = linkFirstIJAndAmount.g;
  float linkAmount = linkFirstIJAndAmount.b;
  if (linkAmount > 0.0) {
    for (float i = 0.0; i < MAX_LINKS; i += 1.0) {
      if (i < linkAmount) {
        if (iCount >= linksTextureSize) {
          iCount = 0.0;
          jCount += 1.0;
        }
        vec2 linkTextureIndex = (vec2(iCount, jCount) + 0.5) / linksTextureSize;
        vec4 connectedPointIndex = texture2D(linkIndices, linkTextureIndex);
        vec4 biasAndStrength = texture2D(linkBiasAndStrength, linkTextureIndex);
        vec4 randomMinDistance = texture2D(linkRandomDistanceFbo, linkTextureIndex);
        float bias = biasAndStrength.r;
        float strength = biasAndStrength.g;
        float randomMinLinkDist = randomMinDistance.r * (linkDistRandomVariationRange.g - linkDistRandomVariationRange.r) + linkDistRandomVariationRange.r;
        randomMinLinkDist *= linkDistance;

        iCount += 1.0;

        vec4 connectedPointPosition = texture2D(position, (connectedPointIndex.rg + 0.5) / pointsTextureSize);
        float x = connectedPointPosition.x - (pointPosition.x + velocity.x);
        float y = connectedPointPosition.y - (pointPosition.y + velocity.y);
        float l = sqrt(x * x + y * y);
        l = max(l, randomMinLinkDist * 0.99);
        l = (l - randomMinLinkDist) / l;
        l *= linkSpring * alpha;
        l *= strength;
        l *= bias;
        x *= l;
        y *= l;
        velocity.x += x;
        velocity.y += y;
      }
    }
  }

  gl_FragColor = vec4(velocity.rg, 0.0, 0.0);
}
  `;
}
var pi;
(function(e) {
  e.OUTGOING = "outgoing", e.INCOMING = "incoming";
})(pi || (pi = {}));
var Do = class extends ur {
    constructor() {
      super(...arguments),
        this.linkFirstIndicesAndAmount = new Float32Array(),
        this.indices = new Float32Array(),
        this.maxPointDegree = 0;
    }
    create(t) {
      let {
        reglInstance: r,
        store: { pointsTextureSize: n, linksTextureSize: i },
        data: o,
      } = this;
      if (!n || !i) return;
      this.linkFirstIndicesAndAmount = new Float32Array(n * n * 4),
        this.indices = new Float32Array(i * i * 4);
      let s = new Float32Array(i * i * 4),
        a = new Float32Array(i * i * 4),
        l = t === pi.INCOMING
          ? o.groupedSourceToTargetLinks
          : o.groupedTargetToSourceLinks;
      this.maxPointDegree = 0;
      let u = 0;
      l.forEach((d, g) => {
        this.linkFirstIndicesAndAmount[g * 4 + 0] = u % i,
          this.linkFirstIndicesAndAmount[g * 4 + 1] = Math.floor(u / i),
          this.linkFirstIndicesAndAmount[g * 4 + 2] = d.size,
          d.forEach(w => {
            var C, Y;
            this.indices[u * 4 + 0] = w % n,
              this.indices[u * 4 + 1] = Math.floor(w / n);
            let me =
                (C = o.degree[o.getInputIndexBySortedIndex(w)]) !== null
                  && C !== void 0
                  ? C
                  : 0,
              ce =
                (Y = o.degree[o.getInputIndexBySortedIndex(g)]) !== null
                  && Y !== void 0
                  ? Y
                  : 0,
              ie = me / (me + ce),
              Le = 1 / Math.min(me, ce);
            Le = Math.sqrt(Le),
              s[u * 4 + 0] = ie,
              s[u * 4 + 1] = Le,
              a[u * 4] = this.store.getRandomFloat(0, 1),
              u += 1;
          }),
          this.maxPointDegree = Math.max(this.maxPointDegree, d.size);
      }),
        this.linkFirstIndicesAndAmountFbo = r.framebuffer({
          color: r.texture({
            data: this.linkFirstIndicesAndAmount,
            shape: [n, n, 4],
            type: "float",
          }),
          depth: !1,
          stencil: !1,
        }),
        this.indicesFbo = r.framebuffer({
          color: r.texture({
            data: this.indices,
            shape: [i, i, 4],
            type: "float",
          }),
          depth: !1,
          stencil: !1,
        }),
        this.biasAndStrengthFbo = r.framebuffer({
          color: r.texture({ data: s, shape: [i, i, 4], type: "float" }),
          depth: !1,
          stencil: !1,
        }),
        this.randomDistanceFbo = r.framebuffer({
          color: r.texture({ data: a, shape: [i, i, 4], type: "float" }),
          depth: !1,
          stencil: !1,
        });
    }
    initPrograms() {
      let { reglInstance: t, config: r, store: n, points: i } = this;
      this.runCommand = t({
        frag: () => Kx(this.maxPointDegree),
        vert: kt,
        framebuffer: () => i?.velocityFbo,
        primitive: "triangle strip",
        count: 4,
        attributes: { quad: Ct(t) },
        uniforms: {
          position: () => i?.previousPositionFbo,
          linkSpring: () => {
            var o;
            return (o = r.simulation) === null || o === void 0
              ? void 0
              : o.linkSpring;
          },
          linkDistance: () => {
            var o;
            return (o = r.simulation) === null || o === void 0
              ? void 0
              : o.linkDistance;
          },
          linkDistRandomVariationRange: () => {
            var o;
            return (o = r.simulation) === null || o === void 0 ? void 0
            : o.linkDistRandomVariationRange;
          },
          linkFirstIndicesAndAmount: () => this.linkFirstIndicesAndAmountFbo,
          linkIndices: () => this.indicesFbo,
          linkBiasAndStrength: () => this.biasAndStrengthFbo,
          linkRandomDistanceFbo: () => this.randomDistanceFbo,
          pointsTextureSize: () => n.pointsTextureSize,
          linksTextureSize: () => n.linksTextureSize,
          alpha: () => n.alpha,
        },
      });
    }
    run() {
      var t;
      (t = this.runCommand) === null || t === void 0 || t.call(this);
    }
    destroy() {
      vt(this.linkFirstIndicesAndAmountFbo),
        vt(this.indicesFbo),
        vt(this.biasAndStrengthFbo),
        vt(this.randomDistanceFbo);
    }
  },
  Gd = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
varying vec4 rgba;void main(){gl_FragColor=rgba;}`,
  Bd = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform float pointsTextureSize;uniform float levelTextureSize;uniform float cellSize;attribute vec2 indexes;varying vec4 rgba;void main(){vec4 pointPosition=texture2D(position,indexes/pointsTextureSize);rgba=vec4(pointPosition.rg,1.0,0.0);float n=floor(pointPosition.x/cellSize);float m=floor(pointPosition.y/cellSize);vec2 levelPosition=2.0*(vec2(n,m)+0.5)/levelTextureSize-1.0;gl_Position=vec4(levelPosition,0.0,1.0);gl_PointSize=1.0;}`,
  Jx = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform sampler2D levelFbo;uniform float level;uniform float levels;uniform float levelTextureSize;uniform float repulsion;uniform float alpha;uniform float spaceSize;uniform float theta;varying vec2 index;const float MAX_LEVELS_NUM=14.0;vec2 calcAdd(vec2 ij,vec2 pp){vec2 add=vec2(0.0);vec4 centermass=texture2D(levelFbo,ij);if(centermass.r>0.0&&centermass.g>0.0&&centermass.b>0.0){vec2 centermassPosition=vec2(centermass.rg/centermass.b);vec2 distVector=pp-centermassPosition;float l=dot(distVector,distVector);float dist=sqrt(l);if(l>0.0){float angle=atan(distVector.y,distVector.x);float c=alpha*repulsion*centermass.b;float distanceMin2=1.0;if(l<distanceMin2)l=sqrt(distanceMin2*l);float addV=c/sqrt(l);add=addV*vec2(cos(angle),sin(angle));}}return add;}void main(){vec4 pointPosition=texture2D(position,index);float x=pointPosition.x;float y=pointPosition.y;float left=0.0;float top=0.0;float right=spaceSize;float bottom=spaceSize;float n_left=0.0;float n_top=0.0;float n_right=0.0;float n_bottom=0.0;float cellSize=0.0;for(float i=0.0;i<MAX_LEVELS_NUM;i+=1.0){if(i<=level){left+=cellSize*n_left;top+=cellSize*n_top;right-=cellSize*n_right;bottom-=cellSize*n_bottom;cellSize=pow(2.0,levels-i-1.0);float dist_left=x-left;n_left=max(0.0,floor(dist_left/cellSize-theta));float dist_top=y-top;n_top=max(0.0,floor(dist_top/cellSize-theta));float dist_right=right-x;n_right=max(0.0,floor(dist_right/cellSize-theta));float dist_bottom=bottom-y;n_bottom=max(0.0,floor(dist_bottom/cellSize-theta));}}vec4 velocity=vec4(vec2(0.0),1.0,0.0);for(float i=0.0;i<12.0;i+=1.0){for(float j=0.0;j<4.0;j+=1.0){float n=left+cellSize*j;float m=top+cellSize*n_top+cellSize*i;if(n<(left+n_left*cellSize)&&m<bottom){velocity.xy+=calcAdd(vec2(n/cellSize,m/cellSize)/levelTextureSize,pointPosition.xy);}n=left+cellSize*i;m=top+cellSize*j;if(n<(right-n_right*cellSize)&&m<(top+n_top*cellSize)){velocity.xy+=calcAdd(vec2(n/cellSize,m/cellSize)/levelTextureSize,pointPosition.xy);}n=right-n_right*cellSize+cellSize*j;m=top+cellSize*i;if(n<right&&m<(bottom-n_bottom*cellSize)){velocity.xy+=calcAdd(vec2(n/cellSize,m/cellSize)/levelTextureSize,pointPosition.xy);}n=left+n_left*cellSize+cellSize*i;m=bottom-n_bottom*cellSize+cellSize*j;if(n<right&&m<bottom){velocity.xy+=calcAdd(vec2(n/cellSize,m/cellSize)/levelTextureSize,pointPosition.xy);}}}gl_FragColor=velocity;}`,
  ey = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform sampler2D levelFbo;uniform sampler2D randomValues;uniform float levelTextureSize;uniform float repulsion;uniform float alpha;varying vec2 index;vec2 calcAdd(vec2 ij,vec2 pp){vec2 add=vec2(0.0);vec4 centermass=texture2D(levelFbo,ij);if(centermass.r>0.0&&centermass.g>0.0&&centermass.b>0.0){vec2 centermassPosition=vec2(centermass.rg/centermass.b);vec2 distVector=pp-centermassPosition;float l=dot(distVector,distVector);float dist=sqrt(l);if(l>0.0){float angle=atan(distVector.y,distVector.x);float c=alpha*repulsion*centermass.b;float distanceMin2=1.0;if(l<distanceMin2)l=sqrt(distanceMin2*l);float addV=c/sqrt(l);add=addV*vec2(cos(angle),sin(angle));}}return add;}void main(){vec4 pointPosition=texture2D(position,index);vec4 random=texture2D(randomValues,index);vec4 velocity=vec4(0.0);velocity.xy+=calcAdd(pointPosition.xy/levelTextureSize,pointPosition.xy);velocity.xy+=velocity.xy*random.rg;gl_FragColor=velocity;}`,
  $s = class extends ur {
    constructor() {
      super(...arguments), this.levelsFbos = new Map(), this.quadtreeLevels = 0;
    }
    create() {
      let { reglInstance: t, store: r } = this;
      if (!r.pointsTextureSize) return;
      this.quadtreeLevels = Math.log2(r.adjustedSpaceSize);
      for (let i = 0; i < this.quadtreeLevels; i += 1) {
        let o = Math.pow(2, i + 1);
        this.levelsFbos.set(
          `level[${i}]`,
          t.framebuffer({
            shape: [o, o],
            colorType: "float",
            depth: !1,
            stencil: !1,
          }),
        );
      }
      let n = new Float32Array(r.pointsTextureSize * r.pointsTextureSize * 4);
      for (let i = 0; i < r.pointsTextureSize * r.pointsTextureSize; ++i) {
        n[i * 4] = r.getRandomFloat(-1, 1) * 1e-5,
          n[i * 4 + 1] = r.getRandomFloat(-1, 1) * 1e-5;
      }
      this.randomValuesFbo = t.framebuffer({
        color: t.texture({
          data: n,
          shape: [r.pointsTextureSize, r.pointsTextureSize, 4],
          type: "float",
        }),
        depth: !1,
        stencil: !1,
      });
    }
    initPrograms() {
      let { reglInstance: t, config: r, store: n, data: i, points: o } = this;
      this.clearLevelsCommand = t({
        frag: In,
        vert: kt,
        framebuffer: (s, a) => a.levelFbo,
        primitive: "triangle strip",
        count: 4,
        attributes: { quad: Ct(t) },
      }),
        this.calculateLevelsCommand = t({
          frag: Gd,
          vert: Bd,
          framebuffer: (s, a) => a.levelFbo,
          primitive: "points",
          count: () => i.nodes.length,
          attributes: { indexes: En(t, n.pointsTextureSize) },
          uniforms: {
            position: () => o?.previousPositionFbo,
            pointsTextureSize: () => n.pointsTextureSize,
            levelTextureSize: (s, a) => a.levelTextureSize,
            cellSize: (s, a) => a.cellSize,
          },
          blend: {
            enable: !0,
            func: { src: "one", dst: "one" },
            equation: { rgb: "add", alpha: "add" },
          },
          depth: { enable: !1, mask: !1 },
          stencil: { enable: !1 },
        }),
        this.forceCommand = t({
          frag: Jx,
          vert: kt,
          framebuffer: () => o?.velocityFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(t) },
          uniforms: {
            position: () => o?.previousPositionFbo,
            level: (s, a) => a.level,
            levels: this.quadtreeLevels,
            levelFbo: (s, a) => a.levelFbo,
            levelTextureSize: (s, a) => a.levelTextureSize,
            alpha: () => n.alpha,
            repulsion: () => {
              var s;
              return (s = r.simulation) === null || s === void 0
                ? void 0
                : s.repulsion;
            },
            spaceSize: () => n.adjustedSpaceSize,
            theta: () => {
              var s;
              return (s = r.simulation) === null || s === void 0 ? void 0
              : s.repulsionTheta;
            },
          },
          blend: {
            enable: !0,
            func: { src: "one", dst: "one" },
            equation: { rgb: "add", alpha: "add" },
          },
          depth: { enable: !1, mask: !1 },
          stencil: { enable: !1 },
        }),
        this.forceFromItsOwnCentermassCommand = t({
          frag: ey,
          vert: kt,
          framebuffer: () => o?.velocityFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(t) },
          uniforms: {
            position: () => o?.previousPositionFbo,
            randomValues: () => this.randomValuesFbo,
            levelFbo: (s, a) => a.levelFbo,
            levelTextureSize: (s, a) => a.levelTextureSize,
            alpha: () => n.alpha,
            repulsion: () => {
              var s;
              return (s = r.simulation) === null || s === void 0
                ? void 0
                : s.repulsion;
            },
            spaceSize: () => n.adjustedSpaceSize,
          },
          blend: {
            enable: !0,
            func: { src: "one", dst: "one" },
            equation: { rgb: "add", alpha: "add" },
          },
          depth: { enable: !1, mask: !1 },
          stencil: { enable: !1 },
        }),
        this.clearVelocityCommand = t({
          frag: In,
          vert: kt,
          framebuffer: () => o?.velocityFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(t) },
        });
    }
    run() {
      var t, r, n, i, o;
      let { store: s } = this;
      for (let a = 0; a < this.quadtreeLevels; a += 1) {
        (t = this.clearLevelsCommand) === null || t === void 0
          || t.call(this, { levelFbo: this.levelsFbos.get(`level[${a}]`) });
        let l = Math.pow(2, a + 1), u = s.adjustedSpaceSize / l;
        (r = this.calculateLevelsCommand) === null || r === void 0
          || r.call(this, {
            levelFbo: this.levelsFbos.get(`level[${a}]`),
            levelTextureSize: l,
            cellSize: u,
          });
      }
      (n = this.clearVelocityCommand) === null || n === void 0 || n.call(this);
      for (let a = 0; a < this.quadtreeLevels; a += 1) {
        let l = Math.pow(2, a + 1);
        (i = this.forceCommand) === null || i === void 0
        || i.call(this, {
          levelFbo: this.levelsFbos.get(`level[${a}]`),
          levelTextureSize: l,
          level: a,
        }),
          a === this.quadtreeLevels - 1
          && ((o = this.forceFromItsOwnCentermassCommand) === null
            || o === void 0
            || o.call(this, {
              levelFbo: this.levelsFbos.get(`level[${a}]`),
              levelTextureSize: l,
              level: a,
            }));
      }
    }
    destroy() {
      vt(this.randomValuesFbo),
        this.levelsFbos.forEach(t => {
          vt(t);
        }),
        this.levelsFbos.clear();
    }
  };
function ty(e, t) {
  e = Math.min(e, t);
  let r = t - e,
    n = `
    float dist = sqrt(l);
    if (dist > 0.0) {
      float c = alpha * repulsion * centermass.b;
      addVelocity += calcAdd(vec2(x, y), l, c);
      addVelocity += addVelocity * random.rg;
    }
  `;
  function i(o) {
    if (o >= t) return n;
    {
      let s = Math.pow(2, o + 1),
        a = new Array(o + 1 - r).fill(0).map((u, d) =>
          `pow(2.0, ${o - (d + r)}.0) * i${d + r}`
        ).join("+"),
        l = new Array(o + 1 - r).fill(0).map((u, d) =>
          `pow(2.0, ${o - (d + r)}.0) * j${d + r}`
        ).join("+");
      return `
      for (float ij${o} = 0.0; ij${o} < 4.0; ij${o} += 1.0) {
        float i${o} = 0.0;
        float j${o} = 0.0;
        if (ij${o} == 1.0 || ij${o} == 3.0) i${o} = 1.0;
        if (ij${o} == 2.0 || ij${o} == 3.0) j${o} = 1.0;
        float i = pow(2.0, ${e}.0) * n / width${o + 1} + ${a};
        float j = pow(2.0, ${e}.0) * m / width${o + 1} + ${l};
        float groupPosX = (i + 0.5) / ${s}.0;
        float groupPosY = (j + 0.5) / ${s}.0;
        
        vec4 centermass = texture2D(level[${o}], vec2(groupPosX, groupPosY));
        if (centermass.r > 0.0 && centermass.g > 0.0 && centermass.b > 0.0) {
          float x = centermass.r / centermass.b - pointPosition.r;
          float y = centermass.g / centermass.b - pointPosition.g;
          float l = x * x + y * y;
          if ((width${o + 1} * width${o + 1}) / theta < l) {
            ${n}
          } else {
            ${i(o + 1)}
          }
        }
      }
      `;
    }
  }
  return `
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D position;
uniform sampler2D randomValues;
uniform float spaceSize;
uniform float repulsion;
uniform float theta;
uniform float alpha;
uniform sampler2D level[${t}];
varying vec2 index;

vec2 calcAdd(vec2 xy, float l, float c) {
  float distanceMin2 = 1.0;
  if (l < distanceMin2) l = sqrt(distanceMin2 * l);
  float add = c / l;
  return add * xy;
}

void main() {
  vec4 pointPosition = texture2D(position, index);
  vec4 random = texture2D(randomValues, index);

  float width0 = spaceSize;

  vec2 velocity = vec2(0.0);
  vec2 addVelocity = vec2(0.0);

  ${
    new Array(t).fill(0).map((o, s) => `float width${s + 1} = width${s} / 2.0;`)
      .join(`
`)
  }

  for (float n = 0.0; n < pow(2.0, ${r}.0); n += 1.0) {
    for (float m = 0.0; m < pow(2.0, ${r}.0); m += 1.0) {
      ${i(r)}
    }
  }

  velocity -= addVelocity;

  gl_FragColor = vec4(velocity, 0.0, 0.0);
}
`;
}
var js = class extends ur {
    constructor() {
      super(...arguments), this.levelsFbos = new Map(), this.quadtreeLevels = 0;
    }
    create() {
      let { reglInstance: t, store: r } = this;
      if (!r.pointsTextureSize) return;
      this.quadtreeLevels = Math.log2(r.adjustedSpaceSize);
      for (let i = 0; i < this.quadtreeLevels; i += 1) {
        let o = Math.pow(2, i + 1);
        this.levelsFbos.set(
          `level[${i}]`,
          t.framebuffer({
            color: t.texture({
              data: new Float32Array(o * o * 4),
              shape: [o, o, 4],
              type: "float",
            }),
            depth: !1,
            stencil: !1,
          }),
        );
      }
      let n = new Float32Array(r.pointsTextureSize * r.pointsTextureSize * 4);
      for (let i = 0; i < r.pointsTextureSize * r.pointsTextureSize; ++i) {
        n[i * 4] = r.getRandomFloat(-1, 1) * 1e-5,
          n[i * 4 + 1] = r.getRandomFloat(-1, 1) * 1e-5;
      }
      this.randomValuesFbo = t.framebuffer({
        color: t.texture({
          data: n,
          shape: [r.pointsTextureSize, r.pointsTextureSize, 4],
          type: "float",
        }),
        depth: !1,
        stencil: !1,
      });
    }
    initPrograms() {
      var t, r;
      let { reglInstance: n, config: i, store: o, data: s, points: a } = this;
      this.clearLevelsCommand = n({
        frag: In,
        vert: kt,
        framebuffer: (l, u) => u.levelFbo,
        primitive: "triangle strip",
        count: 4,
        attributes: { quad: Ct(n) },
      }),
        this.calculateLevelsCommand = n({
          frag: Gd,
          vert: Bd,
          framebuffer: (l, u) => u.levelFbo,
          primitive: "points",
          count: () => s.nodes.length,
          attributes: { indexes: En(n, o.pointsTextureSize) },
          uniforms: {
            position: () => a?.previousPositionFbo,
            pointsTextureSize: () => o.pointsTextureSize,
            levelTextureSize: (l, u) => u.levelTextureSize,
            cellSize: (l, u) => u.cellSize,
          },
          blend: {
            enable: !0,
            func: { src: "one", dst: "one" },
            equation: { rgb: "add", alpha: "add" },
          },
          depth: { enable: !1, mask: !1 },
          stencil: { enable: !1 },
        }),
        this.quadtreeCommand = n({
          frag: ty(
            (r = (t = i.simulation) === null || t === void 0
                  ? void 0
                  : t.repulsionQuadtreeLevels) !== null && r !== void 0
              ? r
              : this.quadtreeLevels,
            this.quadtreeLevels,
          ),
          vert: kt,
          framebuffer: () => a?.velocityFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(n) },
          uniforms: {
            position: () => a?.previousPositionFbo,
            randomValues: () => this.randomValuesFbo,
            spaceSize: () => o.adjustedSpaceSize,
            repulsion: () => {
              var l;
              return (l = i.simulation) === null || l === void 0
                ? void 0
                : l.repulsion;
            },
            theta: () => {
              var l;
              return (l = i.simulation) === null || l === void 0
                ? void 0
                : l.repulsionTheta;
            },
            alpha: () => o.alpha,
            ...Object.fromEntries(this.levelsFbos),
          },
        });
    }
    run() {
      var t, r, n;
      let { store: i } = this;
      for (let o = 0; o < this.quadtreeLevels; o += 1) {
        (t = this.clearLevelsCommand) === null || t === void 0
          || t.call(this, { levelFbo: this.levelsFbos.get(`level[${o}]`) });
        let s = Math.pow(2, o + 1), a = i.adjustedSpaceSize / s;
        (r = this.calculateLevelsCommand) === null || r === void 0
          || r.call(this, {
            levelFbo: this.levelsFbos.get(`level[${o}]`),
            levelTextureSize: s,
            cellSize: a,
          });
      }
      (n = this.quadtreeCommand) === null || n === void 0 || n.call(this);
    }
    destroy() {
      vt(this.randomValuesFbo),
        this.levelsFbos.forEach(t => {
          vt(t);
        }),
        this.levelsFbos.clear();
    }
  },
  ry = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform float repulsion;uniform vec2 mousePos;varying vec2 index;void main(){vec4 pointPosition=texture2D(position,index);vec4 velocity=vec4(0.0);vec2 mouse=mousePos;vec2 distVector=mouse-pointPosition.rg;float dist=sqrt(dot(distVector,distVector));dist=max(dist,10.0);float angle=atan(distVector.y,distVector.x);float addV=100.0*repulsion/(dist*dist);velocity.rg-=addV*vec2(cos(angle),sin(angle));gl_FragColor=velocity;}`,
  Us = class extends ur {
    initPrograms() {
      let { reglInstance: t, config: r, store: n, points: i } = this;
      this.runCommand = t({
        frag: ry,
        vert: kt,
        framebuffer: () => i?.velocityFbo,
        primitive: "triangle strip",
        count: 4,
        attributes: { quad: Ct(t) },
        uniforms: {
          position: () => i?.previousPositionFbo,
          mousePos: () => n.mousePosition,
          repulsion: () => {
            var o;
            return (o = r.simulation) === null || o === void 0
              ? void 0
              : o.repulsionFromMouse;
          },
        },
      });
    }
    run() {
      var t;
      (t = this.runCommand) === null || t === void 0 || t.call(this);
    }
  },
  ny = typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
    ? window
    : typeof global < "u"
    ? global
    : typeof self < "u"
    ? self
    : {},
  Vd = { exports: {} };
(function(e, t) {
  (function(r, n) {
    e.exports = n();
  })(ny, function() {
    var r = `<div class="gl-box">
  <svg viewBox="0 0 55 60">
    <text x="27" y="56" class="gl-fps">00 FPS</text>
    <text x="28" y="8" class="gl-mem"></text>
    <rect x="0" y="14" rx="4" ry="4" width="55" height="32"></rect>
    <polyline class="gl-chart"></polyline>
  </svg>
  <svg viewBox="0 0 14 60" class="gl-cpu-svg">
    <line x1="7" y1="38" x2="7" y2="11" class="opacity"/>
    <line x1="7" y1="38" x2="7" y2="11" class="gl-cpu" stroke-dasharray="0 27"/>
    <path d="M5.35 43c-.464 0-.812.377-.812.812v1.16c-.783.1972-1.421.812-1.595 1.624h-1.16c-.435 0-.812.348-.812.812s.348.812.812.812h1.102v1.653H1.812c-.464 0-.812.377-.812.812 0 .464.377.812.812.812h1.131c.1943.783.812 1.392 1.595 1.595v1.131c0 .464.377.812.812.812.464 0 .812-.377.812-.812V53.15h1.653v1.073c0 .464.377.812.812.812.464 0 .812-.377.812-.812v-1.131c.783-.1943 1.392-.812 1.595-1.595h1.131c.464 0 .812-.377.812-.812 0-.464-.377-.812-.812-.812h-1.073V48.22h1.102c.435 0 .812-.348.812-.812s-.348-.812-.812-.812h-1.16c-.1885-.783-.812-1.421-1.595-1.624v-1.131c0-.464-.377-.812-.812-.812-.464 0-.812.377-.812.812v1.073H6.162v-1.073c0-.464-.377-.812-.812-.812zm.58 3.48h2.088c.754 0 1.363.609 1.363 1.363v2.088c0 .754-.609 1.363-1.363 1.363H5.93c-.754 0-1.363-.609-1.363-1.363v-2.088c0-.754.609-1.363 1.363-1.363z"/>
  </svg>
  <svg viewBox="0 0 14 60" class="gl-gpu-svg">
    <line x1="7" y1="38" x2="7" y2="11" class="opacity"/>
    <line x1="7" y1="38" x2="7" y2="11" class="gl-gpu" stroke-dasharray="0 27"/>
    <path d="M1.94775 43.3772a.736.736 0 10-.00416 1.472c.58535.00231.56465.1288.6348.3197.07015.18975.04933.43585.04933.43585l-.00653.05405v8.671a.736.736 0 101.472 0v-1.4145c.253.09522.52785.1495.81765.1495h5.267c1.2535 0 2.254-.9752 2.254-2.185v-3.105c0-1.2075-1.00625-2.185-2.254-2.185h-5.267c-.28865 0-.5635.05405-.8165.1495.01806-.16445.04209-.598-.1357-1.0787-.22425-.6072-.9499-1.2765-2.0125-1.2765zm2.9095 3.6455c.42435 0 .7659.36225.7659.8119v2.9785c0 .44965-.34155.8119-.7659.8119s-.7659-.36225-.7659-.8119v-2.9785c0-.44965.34155-.8119.7659-.8119zm4.117 0a2.3 2.3 0 012.3 2.3 2.3 2.3 0 01-2.3 2.3 2.3 2.3 0 01-2.3-2.3 2.3 2.3 0 012.3-2.3z"/>
  </svg>
</div>`,
      n = `#gl-bench {
  position:absolute;
  left:0;
  top:0;
  z-index:1000;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

#gl-bench div {
  position: relative;
  display: block;
  margin: 4px;
  padding: 0 7px 0 10px;
  background: #6c6;
  border-radius: 15px;
  cursor: pointer;
  opacity: 0.9;
}

#gl-bench svg {
  height: 60px;
  margin: 0 -1px;
}

#gl-bench text {
  font-size: 12px;
  font-family: Helvetica,Arial,sans-serif;
  font-weight: 700;
  dominant-baseline: middle;
  text-anchor: middle;
}

#gl-bench .gl-mem {
  font-size: 9px;
}

#gl-bench line {
  stroke-width: 5;
  stroke: #112211;
  stroke-linecap: round;
}

#gl-bench polyline {
  fill: none;
  stroke: #112211;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3.5;
}

#gl-bench rect {
  fill: #448844;
}

#gl-bench .opacity {
  stroke: #448844;
}
`;
    class i {
      constructor(s, a = {}) {
        this.css = n,
          this.svg = r,
          this.paramLogger = () => {},
          this.chartLogger = () => {},
          this.chartLen = 20,
          this.chartHz = 20,
          this.names = [],
          this.cpuAccums = [],
          this.gpuAccums = [],
          this.activeAccums = [],
          this.chart = new Array(this.chartLen),
          this.now = () =>
            performance && performance.now ? performance.now() : Date.now(),
          this.updateUI = () => {
            [].forEach.call(this.nodes["gl-gpu-svg"], w => {
              w.style.display = this.trackGPU ? "inline" : "none";
            });
          },
          Object.assign(this, a),
          this.detected = 0,
          this.finished = [],
          this.isFramebuffer = 0,
          this.frameId = 0;
        let l,
          u = 0,
          d,
          g = w => {
            ++u < 20
              ? l = requestAnimationFrame(g)
              : (this.detected = Math.ceil(1e3 * u / (w - d) / 70),
                cancelAnimationFrame(l)), d || (d = w);
          };
        if (requestAnimationFrame(g), s) {
          let w = async (Y, me) =>
              Promise.resolve(setTimeout(() => {
                s.getError();
                let ce = this.now() - Y;
                me.forEach((ie, Le) => {
                  ie && (this.gpuAccums[Le] += ce);
                });
              }, 0)),
            C = (Y, me, ce) =>
              function() {
                let ie = me.now();
                Y.apply(ce, arguments),
                  me.trackGPU
                  && me.finished.push(w(ie, me.activeAccums.slice(0)));
              };
          [
            "drawArrays",
            "drawElements",
            "drawArraysInstanced",
            "drawBuffers",
            "drawElementsInstanced",
            "drawRangeElements",
          ].forEach(Y => {
            s[Y] && (s[Y] = C(s[Y], this, s));
          }),
            s.getExtension = ((Y, me) =>
              function() {
                let ce = Y.apply(s, arguments);
                return ce
                  && ["drawElementsInstancedANGLE", "drawBuffersWEBGL"].forEach(
                    ie => {
                      ce[ie] && (ce[ie] = C(ce[ie], me, ce));
                    },
                  ),
                  ce;
              })(s.getExtension, this);
        }
        if (!this.withoutUI) {
          this.dom || (this.dom = document.body);
          let w = document.createElement("div");
          w.id = "gl-bench",
            this.dom.appendChild(w),
            this.dom.insertAdjacentHTML(
              "afterbegin",
              "<style id=\"gl-bench-style\">" + this.css + "</style>",
            ),
            this.dom = w,
            this.dom.addEventListener("click", () => {
              this.trackGPU = !this.trackGPU, this.updateUI();
            }),
            this.paramLogger = ((C, Y, me) => {
              let ce = [
                  "gl-cpu",
                  "gl-gpu",
                  "gl-mem",
                  "gl-fps",
                  "gl-gpu-svg",
                  "gl-chart",
                ],
                ie = Object.assign({}, ce);
              return ce.forEach(Le => ie[Le] = Y.getElementsByClassName(Le)),
                this.nodes = ie,
                (Le, _e, Re, Me, qe, We, rt) => {
                  ie["gl-cpu"][Le].style.strokeDasharray = (_e * .27).toFixed(0)
                    + " 100",
                    ie["gl-gpu"][Le].style.strokeDasharray =
                      (Re * .27).toFixed(0) + " 100",
                    ie["gl-mem"][Le].innerHTML = me[Le] ? me[Le] : Me
                      ? "mem: " + Me.toFixed(0) + "mb"
                      : "",
                    ie["gl-fps"][Le].innerHTML = qe.toFixed(0) + " FPS",
                    C(me[Le], _e, Re, Me, qe, We, rt);
                };
            })(this.paramLogger, this.dom, this.names),
            this.chartLogger = ((C, Y) => {
              let me = { "gl-chart": Y.getElementsByClassName("gl-chart") };
              return (ce, ie, Le) => {
                let _e = "", Re = ie.length;
                for (let Me = 0; Me < Re; Me++) {
                  let qe = (Le + Me + 1) % Re;
                  ie[qe] != null
                    && (_e = _e + " " + (55 * Me / (Re - 1)).toFixed(1) + ","
                      + (45 - ie[qe] * 22 / 60 / this.detected).toFixed(1));
                }
                me["gl-chart"][ce].setAttribute("points", _e),
                  C(this.names[ce], ie, Le);
              };
            })(this.chartLogger, this.dom);
        }
      }
      addUI(s) {
        this.names.indexOf(s) == -1
          && (this.names.push(s),
            this.dom
            && (this.dom.insertAdjacentHTML("beforeend", this.svg),
              this.updateUI()),
            this.cpuAccums.push(0),
            this.gpuAccums.push(0),
            this.activeAccums.push(!1));
      }
      nextFrame(s) {
        this.frameId++;
        let a = s || this.now();
        if (this.frameId <= 1) {
          this.paramFrame = this.frameId, this.paramTime = a;
        }
        else {
          let l = a - this.paramTime;
          if (l >= 1e3) {
            let u = this.frameId - this.paramFrame, d = u / l * 1e3;
            for (let g = 0; g < this.names.length; g++) {
              let w = this.cpuAccums[g] / l * 100,
                C = this.gpuAccums[g] / l * 100,
                Y = performance && performance.memory
                  ? performance.memory.usedJSHeapSize / (1 << 20)
                  : 0;
              this.paramLogger(g, w, C, Y, d, l, u),
                this.cpuAccums[g] = 0,
                Promise.all(this.finished).then(() => {
                  this.gpuAccums[g] = 0, this.finished = [];
                });
            }
            this.paramFrame = this.frameId, this.paramTime = a;
          }
        }
        if (!this.detected || !this.chartFrame) {
          this.chartFrame = this.frameId,
            this.chartTime = a,
            this.circularId = 0;
        }
        else {
          let l = a - this.chartTime, u = this.chartHz * l / 1e3;
          for (; --u > 0 && this.detected;) {
            let g = (this.frameId - this.chartFrame) / l * 1e3;
            this.chart[this.circularId % this.chartLen] = g;
            for (let w = 0; w < this.names.length; w++) {
              this.chartLogger(w, this.chart, this.circularId);
            }
            this.circularId++,
              this.chartFrame = this.frameId,
              this.chartTime = a;
          }
        }
      }
      begin(s) {
        this.updateAccums(s);
      }
      end(s) {
        this.updateAccums(s);
      }
      updateAccums(s) {
        let a = this.names.indexOf(s);
        a == -1 && (a = this.names.length, this.addUI(s));
        let l = this.now(), u = l - this.t0;
        for (let d = 0; d < a + 1; d++) {
          this.activeAccums[d] && (this.cpuAccums[d] += u);
        }
        this.activeAccums[a] = !this.activeAccums[a], this.t0 = l;
      }
    }
    return i;
  });
})(Vd);
var iy = Vd.exports,
  oy = `
  #gl-bench {
    position:absolute;
    right:0;
    top:0;
    z-index:1000;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
  #gl-bench div {
    position: relative;
    display: block;
    margin: 4px;
    padding: 0 7px 0 10px;
    background: #5f69de;
    border-radius: 15px;
    cursor: pointer;
    opacity: 0.9;
  }
  #gl-bench svg {
    height: 60px;
    margin: 0 -1px;
  }
  #gl-bench text {
    font-size: 12px;
    font-family: Helvetica,Arial,sans-serif;
    font-weight: 700;
    dominant-baseline: middle;
    text-anchor: middle;
  }
  #gl-bench .gl-mem {
    font-size: 9px;
  }
  #gl-bench line {
    stroke-width: 5;
    stroke: #112211;
    stroke-linecap: round;
  }
  #gl-bench polyline {
    fill: none;
    stroke: #112211;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3.5;
  }
  #gl-bench rect {
    fill: #8288e4;
  }
  #gl-bench .opacity {
    stroke: #8288e4;
  }
`,
  Go = class {
    constructor(t) {
      this.destroy();
      let r = t.getContext("webgl") || t.getContext("experimental-webgl");
      this.bench = new iy(r, { css: oy });
    }
    begin() {
      var t;
      (t = this.bench) === null || t === void 0 || t.begin("frame");
    }
    end(t) {
      var r, n;
      (r = this.bench) === null || r === void 0 || r.end("frame"),
        (n = this.bench) === null || n === void 0 || n.nextFrame(t);
    }
    destroy() {
      this.bench = void 0, Mt("#gl-bench").remove();
    }
  },
  qs = class {
    constructor() {
      this.completeLinks = new Set(),
        this.degree = [],
        this.groupedSourceToTargetLinks = new Map(),
        this.groupedTargetToSourceLinks = new Map(),
        this._nodes = [],
        this._links = [],
        this.idToNodeMap = new Map(),
        this.sortedIndexToInputIndexMap = new Map(),
        this.inputIndexToSortedIndexMap = new Map(),
        this.idToSortedIndexMap = new Map(),
        this.inputIndexToIdMap = new Map(),
        this.idToIndegreeMap = new Map(),
        this.idToOutdegreeMap = new Map();
    }
    get nodes() {
      return this._nodes;
    }
    get links() {
      return this._links;
    }
    get linksNumber() {
      return this.completeLinks.size;
    }
    setData(t, r) {
      this.idToNodeMap.clear(),
        this.idToSortedIndexMap.clear(),
        this.inputIndexToIdMap.clear(),
        this.idToIndegreeMap.clear(),
        this.idToOutdegreeMap.clear(),
        t.forEach((i, o) => {
          this.idToNodeMap.set(i.id, i),
            this.inputIndexToIdMap.set(o, i.id),
            this.idToIndegreeMap.set(i.id, 0),
            this.idToOutdegreeMap.set(i.id, 0);
        }),
        this.completeLinks.clear(),
        r.forEach(i => {
          let o = this.idToNodeMap.get(i.source),
            s = this.idToNodeMap.get(i.target);
          if (o !== void 0 && s !== void 0) {
            this.completeLinks.add(i);
            let a = this.idToOutdegreeMap.get(o.id);
            a !== void 0 && this.idToOutdegreeMap.set(o.id, a + 1);
            let l = this.idToIndegreeMap.get(s.id);
            l !== void 0 && this.idToIndegreeMap.set(s.id, l + 1);
          }
        }),
        this.degree = new Array(t.length),
        t.forEach((i, o) => {
          let s = this.idToOutdegreeMap.get(i.id),
            a = this.idToIndegreeMap.get(i.id);
          this.degree[o] = (s ?? 0) + (a ?? 0);
        }),
        this.sortedIndexToInputIndexMap.clear(),
        this.inputIndexToSortedIndexMap.clear(),
        Object.entries(this.degree).sort((i, o) => i[1] - o[1]).forEach(
          ([i], o) => {
            let s = +i;
            this.sortedIndexToInputIndexMap.set(o, s),
              this.inputIndexToSortedIndexMap.set(s, o),
              this.idToSortedIndexMap.set(this.inputIndexToIdMap.get(s), o);
          },
        ),
        this.groupedSourceToTargetLinks.clear(),
        this.groupedTargetToSourceLinks.clear(),
        r.forEach(i => {
          let o = this.idToSortedIndexMap.get(i.source),
            s = this.idToSortedIndexMap.get(i.target);
          if (o !== void 0 && s !== void 0) {
            this.groupedSourceToTargetLinks.get(o) === void 0
              && this.groupedSourceToTargetLinks.set(o, new Set());
            let a = this.groupedSourceToTargetLinks.get(o);
            a?.add(s),
              this.groupedTargetToSourceLinks.get(s) === void 0
              && this.groupedTargetToSourceLinks.set(s, new Set());
            let l = this.groupedTargetToSourceLinks.get(s);
            l?.add(o);
          }
        }),
        this._nodes = t,
        this._links = r;
    }
    getNodeById(t) {
      return this.idToNodeMap.get(t);
    }
    getNodeByIndex(t) {
      return this._nodes[t];
    }
    getSortedIndexByInputIndex(t) {
      return this.inputIndexToSortedIndexMap.get(t);
    }
    getInputIndexBySortedIndex(t) {
      return this.sortedIndexToInputIndexMap.get(t);
    }
    getSortedIndexById(t) {
      return t !== void 0 ? this.idToSortedIndexMap.get(t) : void 0;
    }
    getInputIndexById(t) {
      if (t === void 0) return;
      let r = this.getSortedIndexById(t);
      if (r !== void 0) return this.getInputIndexBySortedIndex(r);
    }
    getAdjacentNodes(t) {
      var r, n;
      let i = this.getSortedIndexById(t);
      if (i === void 0) return;
      let o =
          (r = this.groupedSourceToTargetLinks.get(i)) !== null && r !== void 0
            ? r
            : [],
        s =
          (n = this.groupedTargetToSourceLinks.get(i)) !== null && n !== void 0
            ? n : [];
      return [...new Set([...o, ...s])].map(a =>
        this.getNodeByIndex(this.getInputIndexBySortedIndex(a))
      );
    }
  },
  ay = `precision highp float;
#define GLSLIFY 1
varying vec4 rgbaColor;varying vec2 pos;varying float arrowLength;varying float linkWidthArrowWidthRatio;varying float smoothWidthRatio;varying float useArrow;float map(float value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}void main(){float opacity=1.0;vec3 color=rgbaColor.rgb;float smoothDelta=smoothWidthRatio/2.0;if(useArrow>0.5){float end_arrow=0.5+arrowLength/2.0;float start_arrow=end_arrow-arrowLength;float arrowWidthDelta=linkWidthArrowWidthRatio/2.0;float linkOpacity=rgbaColor.a*smoothstep(0.5-arrowWidthDelta,0.5-arrowWidthDelta-smoothDelta,abs(pos.y));float arrowOpacity=1.0;if(pos.x>start_arrow&&pos.x<start_arrow+arrowLength){float xmapped=map(pos.x,start_arrow,end_arrow,0.0,1.0);arrowOpacity=rgbaColor.a*smoothstep(xmapped-smoothDelta,xmapped,map(abs(pos.y),0.5,0.0,0.0,1.0));if(linkOpacity!=arrowOpacity){linkOpacity+=arrowOpacity;}}opacity=linkOpacity;}else opacity=rgbaColor.a*smoothstep(0.5,0.5-smoothDelta,abs(pos.y));gl_FragColor=vec4(color,opacity);}`,
  sy = `precision highp float;
#define GLSLIFY 1
attribute vec2 position,pointA,pointB;attribute vec4 color;attribute float width;attribute float arrow;uniform sampler2D positions;uniform sampler2D particleGreyoutStatus;uniform mat3 transform;uniform float pointsTextureSize;uniform float widthScale;uniform float nodeSizeScale;uniform float arrowSizeScale;uniform float spaceSize;uniform vec2 screenSize;uniform float ratio;uniform vec2 linkVisibilityDistanceRange;uniform float linkVisibilityMinTransparency;uniform float greyoutOpacity;uniform bool scaleNodesOnZoom;uniform float curvedWeight;uniform float curvedLinkControlPointDistance;uniform float curvedLinkSegments;varying vec4 rgbaColor;varying vec2 pos;varying float arrowLength;varying float linkWidthArrowWidthRatio;varying float smoothWidthRatio;varying float useArrow;float map(float value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}vec2 conicParametricCurve(vec2 A,vec2 B,vec2 ControlPoint,float t,float w){vec2 divident=(1.0-t)*(1.0-t)*A+2.0*(1.0-t)*t*w*ControlPoint+t*t*B;float divisor=(1.0-t)*(1.0-t)+2.0*(1.0-t)*t*w+t*t;return divident/divisor;}void main(){pos=position;vec2 pointTexturePosA=(pointA+0.5)/pointsTextureSize;vec2 pointTexturePosB=(pointB+0.5)/pointsTextureSize;vec4 greyoutStatusA=texture2D(particleGreyoutStatus,pointTexturePosA);vec4 greyoutStatusB=texture2D(particleGreyoutStatus,pointTexturePosB);vec4 pointPositionA=texture2D(positions,pointTexturePosA);vec4 pointPositionB=texture2D(positions,pointTexturePosB);vec2 a=pointPositionA.xy;vec2 b=pointPositionB.xy;vec2 xBasis=b-a;vec2 yBasis=normalize(vec2(-xBasis.y,xBasis.x));float linkDist=length(xBasis);float h=curvedLinkControlPointDistance;vec2 controlPoint=(a+b)/2.0+yBasis*linkDist*h;float linkDistPx=linkDist*transform[0][0];float linkWidth=width*widthScale;float k=2.0;float arrowWidth=max(5.0,linkWidth*k);arrowWidth*=arrowSizeScale;float arrowWidthPx=arrowWidth/transform[0][0];arrowLength=min(0.3,(0.866*arrowWidthPx*2.0)/linkDist);float smoothWidth=2.0;float arrowExtraWidth=arrowWidth-linkWidth;linkWidth+=smoothWidth/2.0;useArrow=arrow;if(useArrow>0.5){linkWidth+=arrowExtraWidth;}smoothWidthRatio=smoothWidth/linkWidth;linkWidthArrowWidthRatio=arrowExtraWidth/linkWidth;float linkWidthPx=linkWidth/transform[0][0];vec3 rgbColor=color.rgb;float opacity=color.a*max(linkVisibilityMinTransparency,map(linkDistPx,linkVisibilityDistanceRange.g,linkVisibilityDistanceRange.r,0.0,1.0));if(greyoutStatusA.r>0.0||greyoutStatusB.r>0.0){opacity*=greyoutOpacity;}rgbaColor=vec4(rgbColor,opacity);float t=position.x;float w=curvedWeight;float tPrev=t-1.0/curvedLinkSegments;float tNext=t+1.0/curvedLinkSegments;vec2 pointCurr=conicParametricCurve(a,b,controlPoint,t,w);vec2 pointPrev=conicParametricCurve(a,b,controlPoint,max(0.0,tPrev),w);vec2 pointNext=conicParametricCurve(a,b,controlPoint,min(tNext,1.0),w);vec2 xBasisCurved=pointNext-pointPrev;vec2 yBasisCurved=normalize(vec2(-xBasisCurved.y,xBasisCurved.x));pointCurr+=yBasisCurved*linkWidthPx*position.y;vec2 p=2.0*pointCurr/spaceSize-1.0;p*=spaceSize/screenSize;vec3 final=transform*vec3(p,1);gl_Position=vec4(final.rg,0,1);}`,
  fy = e => {
    let t = ci().exponent(2).range([0, 1]).domain([-1, 1]),
      r = Eo(0, e).map(i => -.5 + i / e);
    r.push(.5);
    let n = new Array(r.length * 2);
    return r.forEach((i, o) => {
      n[o * 2] = [t(i * 2), .5], n[o * 2 + 1] = [t(i * 2), -.5];
    }),
      n;
  },
  Hs = class extends ur {
    create() {
      this.updateColor(),
        this.updateWidth(),
        this.updateArrow(),
        this.updateCurveLineGeometry();
    }
    initPrograms() {
      let { reglInstance: t, config: r, store: n, data: i, points: o } = this,
        { pointsTextureSize: s } = n,
        a = [];
      i.completeLinks.forEach(u => {
        let d = i.getSortedIndexById(u.target),
          g = i.getSortedIndexById(u.source),
          w = g % s,
          C = Math.floor(g / s),
          Y = d % s,
          me = Math.floor(d / s);
        a.push([w, C]), a.push([Y, me]);
      });
      let l = t.buffer(a);
      this.drawCurveCommand = t({
        vert: sy,
        frag: ay,
        attributes: {
          position: { buffer: () => this.curveLineBuffer, divisor: 0 },
          pointA: {
            buffer: () => l,
            divisor: 1,
            offset: Float32Array.BYTES_PER_ELEMENT * 0,
            stride: Float32Array.BYTES_PER_ELEMENT * 4,
          },
          pointB: {
            buffer: () => l,
            divisor: 1,
            offset: Float32Array.BYTES_PER_ELEMENT * 2,
            stride: Float32Array.BYTES_PER_ELEMENT * 4,
          },
          color: {
            buffer: () => this.colorBuffer,
            divisor: 1,
            offset: Float32Array.BYTES_PER_ELEMENT * 0,
            stride: Float32Array.BYTES_PER_ELEMENT * 4,
          },
          width: {
            buffer: () => this.widthBuffer,
            divisor: 1,
            offset: Float32Array.BYTES_PER_ELEMENT * 0,
            stride: Float32Array.BYTES_PER_ELEMENT * 1,
          },
          arrow: {
            buffer: () => this.arrowBuffer,
            divisor: 1,
            offset: Float32Array.BYTES_PER_ELEMENT * 0,
            stride: Float32Array.BYTES_PER_ELEMENT * 1,
          },
        },
        uniforms: {
          positions: () => o?.currentPositionFbo,
          particleGreyoutStatus: () => o?.greyoutStatusFbo,
          transform: () => n.transform,
          pointsTextureSize: () => n.pointsTextureSize,
          nodeSizeScale: () => r.nodeSizeScale,
          widthScale: () => r.linkWidthScale,
          arrowSizeScale: () => r.linkArrowsSizeScale,
          spaceSize: () => n.adjustedSpaceSize,
          screenSize: () => n.screenSize,
          ratio: () => r.pixelRatio,
          linkVisibilityDistanceRange: () => r.linkVisibilityDistanceRange,
          linkVisibilityMinTransparency: () => r.linkVisibilityMinTransparency,
          greyoutOpacity: () => r.linkGreyoutOpacity,
          scaleNodesOnZoom: () => r.scaleNodesOnZoom,
          curvedWeight: () => r.curvedLinkWeight,
          curvedLinkControlPointDistance: () =>
            r.curvedLinkControlPointDistance,
          curvedLinkSegments: () => {
            var u;
            return r.curvedLinks
              ? (u = r.curvedLinkSegments) !== null && u !== void 0
                ? u
                : Xe.curvedLinkSegments
              : 1;
          },
        },
        cull: { enable: !0, face: "back" },
        blend: {
          enable: !0,
          func: {
            dstRGB: "one minus src alpha",
            srcRGB: "src alpha",
            dstAlpha: "one minus src alpha",
            srcAlpha: "one",
          },
          equation: { rgb: "add", alpha: "add" },
        },
        depth: { enable: !1, mask: !1 },
        count: () => {
          var u, d;
          return (d = (u = this.curveLineGeometry) === null || u === void 0
                  ? void 0
                  : u.length) !== null && d !== void 0 ? d : 0;
        },
        instances: () => i.linksNumber,
        primitive: "triangle strip",
      });
    }
    draw() {
      var t;
      !this.colorBuffer || !this.widthBuffer || !this.curveLineBuffer
        || (t = this.drawCurveCommand) === null || t === void 0 || t.call(this);
    }
    updateColor() {
      let { reglInstance: t, config: r, data: n } = this, i = [];
      n.completeLinks.forEach(o => {
        var s;
        let a = (s = mi(o, r.linkColor)) !== null && s !== void 0 ? s : Md,
          l = An(a);
        i.push(l);
      }), this.colorBuffer = t.buffer(i);
    }
    updateWidth() {
      let { reglInstance: t, config: r, data: n } = this, i = [];
      n.completeLinks.forEach(o => {
        let s = mi(o, r.linkWidth);
        i.push([s ?? zd]);
      }), this.widthBuffer = t.buffer(i);
    }
    updateArrow() {
      let { reglInstance: t, config: r, data: n } = this, i = [];
      n.completeLinks.forEach(o => {
        var s;
        let a = (s = mi(o, r.linkArrows)) !== null && s !== void 0
          ? s
          : Xe.arrowLinks;
        i.push([a ? 1 : 0]);
      }), this.arrowBuffer = t.buffer(i);
    }
    updateCurveLineGeometry() {
      let {
        reglInstance: t,
        config: { curvedLinks: r, curvedLinkSegments: n },
      } = this;
      this.curveLineGeometry = fy(r ? n ?? Xe.curvedLinkSegments : 1),
        this.curveLineBuffer = t.buffer(this.curveLineGeometry);
    }
    destroy() {
      Oo(this.colorBuffer),
        Oo(this.widthBuffer),
        Oo(this.arrowBuffer),
        Oo(this.curveLineBuffer);
    }
  };
function ly(e, t, r, n) {
  var i;
  if (r === 0) return;
  let o = new Float32Array(r * r * 4);
  for (let a = 0; a < e.nodes.length; ++a) {
    let l = e.getSortedIndexByInputIndex(a), u = e.nodes[a];
    if (u && l !== void 0) {
      let d = (i = mi(u, n, a)) !== null && i !== void 0 ? i : Rd, g = An(d);
      o[l * 4 + 0] = g[0],
        o[l * 4 + 1] = g[1],
        o[l * 4 + 2] = g[2],
        o[l * 4 + 3] = g[3];
    }
  }
  let s = t.texture({ data: o, width: r, height: r, type: "float" });
  return t.framebuffer({ color: s, depth: !1, stencil: !1 });
}
function uy(e, t, r) {
  if (r === 0) return;
  let n = new Float32Array(r * r * 4).fill(e ? 1 : 0);
  if (e) for (let o of e) n[o * 4] = 0;
  let i = t.texture({ data: n, width: r, height: r, type: "float" });
  return t.framebuffer({ color: i, depth: !1, stencil: !1 });
}
var cy = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
varying vec2 index;varying vec3 rgbColor;varying float alpha;const float smoothing=0.9;void main(){if(alpha==0.0){discard;}float r=0.0;float delta=0.0;vec2 cxy=2.0*gl_PointCoord-1.0;r=dot(cxy,cxy);float opacity=alpha*(1.0-smoothstep(smoothing,1.0,r));gl_FragColor=vec4(rgbColor,opacity);}`,
  dy = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
attribute vec2 indexes;uniform sampler2D positions;uniform sampler2D particleColor;uniform sampler2D particleGreyoutStatus;uniform sampler2D particleSize;uniform float ratio;uniform mat3 transform;uniform float pointsTextureSize;uniform float sizeScale;uniform float spaceSize;uniform vec2 screenSize;uniform float greyoutOpacity;uniform bool scaleNodesOnZoom;uniform float maxPointSize;varying vec2 index;varying vec3 rgbColor;varying float alpha;float pointSize(float size){float pSize;if(scaleNodesOnZoom){pSize=size*ratio*transform[0][0];}else{pSize=size*ratio*min(5.0,max(1.0,transform[0][0]*0.01));}return min(pSize,maxPointSize*ratio);}void main(){index=indexes;vec4 pointPosition=texture2D(positions,(index+0.5)/pointsTextureSize);vec2 point=pointPosition.rg;vec2 p=2.0*point/spaceSize-1.0;p*=spaceSize/screenSize;vec3 final=transform*vec3(p,1);gl_Position=vec4(final.rg,0,1);vec4 pSize=texture2D(particleSize,(index+0.5)/pointsTextureSize);float size=pSize.r*sizeScale;vec4 pColor=texture2D(particleColor,(index+0.5)/pointsTextureSize);rgbColor=pColor.rgb;gl_PointSize=pointSize(size);alpha=pColor.a;vec4 greyoutStatus=texture2D(particleGreyoutStatus,(index+0.5)/pointsTextureSize);if(greyoutStatus.r>0.0){alpha*=greyoutOpacity;}}`,
  hy = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform sampler2D particleSize;uniform float sizeScale;uniform float spaceSize;uniform vec2 screenSize;uniform float ratio;uniform mat3 transform;uniform vec2 selection[2];uniform bool scaleNodesOnZoom;uniform float maxPointSize;varying vec2 index;float pointSize(float size){float pSize;if(scaleNodesOnZoom){pSize=size*ratio*transform[0][0];}else{pSize=size*ratio*min(5.0,max(1.0,transform[0][0]*0.01));}return min(pSize,maxPointSize*ratio);}void main(){vec4 pointPosition=texture2D(position,index);vec2 p=2.0*pointPosition.rg/spaceSize-1.0;p*=spaceSize/screenSize;vec3 final=transform*vec3(p,1);vec4 pSize=texture2D(particleSize,index);float size=pSize.r*sizeScale;float left=2.0*(selection[0].x-0.5*pointSize(size))/screenSize.x-1.0;float right=2.0*(selection[1].x+0.5*pointSize(size))/screenSize.x-1.0;float top=2.0*(selection[0].y-0.5*pointSize(size))/screenSize.y-1.0;float bottom=2.0*(selection[1].y+0.5*pointSize(size))/screenSize.y-1.0;gl_FragColor=vec4(0.0,0.0,pointPosition.rg);if(final.x>=left&&final.x<=right&&final.y>=top&&final.y<=bottom){gl_FragColor.r=1.0;}}`,
  my = `precision mediump float;
#define GLSLIFY 1
uniform vec4 color;uniform float width;varying vec2 pos;varying float particleOpacity;const float smoothing=1.05;void main(){vec2 cxy=pos;float r=dot(cxy,cxy);float opacity=smoothstep(r,r*smoothing,1.0);float stroke=smoothstep(width,width*smoothing,r);gl_FragColor=vec4(color.rgb,opacity*stroke*color.a*particleOpacity);}`,
  py = `precision mediump float;
#define GLSLIFY 1
attribute vec2 quad;uniform sampler2D positions;uniform sampler2D particleColor;uniform sampler2D particleGreyoutStatus;uniform sampler2D particleSize;uniform mat3 transform;uniform float pointsTextureSize;uniform float sizeScale;uniform float spaceSize;uniform vec2 screenSize;uniform bool scaleNodesOnZoom;uniform float pointIndex;uniform float maxPointSize;uniform vec4 color;uniform float greyoutOpacity;varying vec2 pos;varying float particleOpacity;float pointSize(float size){float pSize;if(scaleNodesOnZoom){pSize=size*transform[0][0];}else{pSize=size*min(5.0,max(1.0,transform[0][0]*0.01));}return min(pSize,maxPointSize);}const float relativeRingRadius=1.3;void main(){pos=quad;vec2 ij=vec2(mod(pointIndex,pointsTextureSize),floor(pointIndex/pointsTextureSize))+0.5;vec4 pointPosition=texture2D(positions,ij/pointsTextureSize);vec4 pSize=texture2D(particleSize,ij/pointsTextureSize);vec4 pColor=texture2D(particleColor,ij/pointsTextureSize);particleOpacity=pColor.a;vec4 greyoutStatus=texture2D(particleGreyoutStatus,ij/pointsTextureSize);if(greyoutStatus.r>0.0){particleOpacity*=greyoutOpacity;}float size=(pointSize(pSize.r*sizeScale)*relativeRingRadius)/transform[0][0];float radius=size*0.5;vec2 a=pointPosition.xy;vec2 b=pointPosition.xy+vec2(0.0,radius);vec2 xBasis=b-a;vec2 yBasis=normalize(vec2(-xBasis.y,xBasis.x));vec2 point=a+xBasis*quad.x+yBasis*radius*quad.y;vec2 p=2.0*point/spaceSize-1.0;p*=spaceSize/screenSize;vec3 final=transform*vec3(p,1);gl_Position=vec4(final.rg,0,1);}`,
  vy = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
varying vec4 rgba;void main(){gl_FragColor=rgba;}`,
  gy = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform float pointsTextureSize;uniform sampler2D particleSize;uniform float sizeScale;uniform float spaceSize;uniform vec2 screenSize;uniform float ratio;uniform mat3 transform;uniform vec2 mousePosition;uniform bool scaleNodesOnZoom;uniform float maxPointSize;attribute vec2 indexes;varying vec4 rgba;float pointSize(float size){float pSize;if(scaleNodesOnZoom){pSize=size*ratio*transform[0][0];}else{pSize=size*ratio*min(5.0,max(1.0,transform[0][0]*0.01));}return min(pSize,maxPointSize*ratio);}float euclideanDistance(float x1,float x2,float y1,float y2){return sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));}void main(){vec4 pointPosition=texture2D(position,(indexes+0.5)/pointsTextureSize);vec2 p=2.0*pointPosition.rg/spaceSize-1.0;p*=spaceSize/screenSize;vec3 final=transform*vec3(p,1);vec4 pSize=texture2D(particleSize,indexes/pointsTextureSize);float size=pSize.r*sizeScale;float pointRadius=0.5*pointSize(size);vec2 pointScreenPosition=(final.xy+1.0)*screenSize/2.0;rgba=vec4(0.0);gl_Position=vec4(0.5,0.5,0.0,1.0);if(euclideanDistance(pointScreenPosition.x,mousePosition.x,pointScreenPosition.y,mousePosition.y)<pointRadius/ratio){float index=indexes.g*pointsTextureSize+indexes.r;rgba=vec4(index,pSize.r,pointPosition.xy);gl_Position=vec4(-0.5,-0.5,0.0,1.0);}gl_PointSize=1.0;}`,
  xy = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
varying vec4 rgba;void main(){gl_FragColor=rgba;}`,
  yy = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform float pointsTextureSize;uniform float spaceSize;uniform vec2 screenSize;uniform mat3 transform;attribute vec2 indexes;varying vec4 rgba;void main(){vec4 pointPosition=texture2D(position,(indexes+0.5)/pointsTextureSize);vec2 p=2.0*pointPosition.rg/spaceSize-1.0;p*=spaceSize/screenSize;vec3 final=transform*vec3(p,1);vec2 pointScreenPosition=(final.xy+1.0)*screenSize/2.0;float index=indexes.g*pointsTextureSize+indexes.r;rgba=vec4(index,1.0,pointPosition.xy);float i=(pointScreenPosition.x+0.5)/screenSize.x;float j=(pointScreenPosition.y+0.5)/screenSize.y;gl_Position=vec4(2.0*vec2(i,j)-1.0,0.0,1.0);gl_PointSize=1.0;}`;
function by(e, t, r) {
  let n = mi(e, t, r);
  return n ?? Nd;
}
function _y(e, t, r, n, i) {
  if (r === 0) return;
  let o = e.nodes.length, s = new Float32Array(r * r * 4);
  for (let l = 0; l < o; ++l) {
    let u = e.getSortedIndexByInputIndex(l), d = e.nodes[l];
    if (d && u !== void 0) {
      let g = by(d, n, l);
      s[u * 4] = g, i[l] = g;
    }
  }
  let a = t.texture({ data: s, width: r, height: r, type: "float" });
  return t.framebuffer({ color: a, depth: !1, stencil: !1 });
}
var Sy = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform sampler2D velocity;uniform float friction;uniform float spaceSize;varying vec2 index;void main(){vec4 pointPosition=texture2D(position,index);vec4 pointVelocity=texture2D(velocity,index);pointVelocity.rg*=friction;pointPosition.rg+=pointVelocity.rg;pointPosition.r=clamp(pointPosition.r,0.0,spaceSize);pointPosition.g=clamp(pointPosition.g,0.0,spaceSize);gl_FragColor=pointPosition;}`;
function wy(e, t) {
  let r = Math.ceil(Math.sqrt(e.length));
  return t.framebuffer({
    shape: [r, r],
    depth: !1,
    stencil: !1,
    colorType: "float",
  });
}
function Ty(e, t, r) {
  let n = Math.ceil(Math.sqrt(e.length));
  if (n === 0) return;
  let i = new Float32Array(n * n * 4).fill(-1);
  for (let [s, a] of e.entries()) {
    a !== void 0
      && (i[s * 4] = a % t,
        i[s * 4 + 1] = Math.floor(a / t),
        i[s * 4 + 2] = 0,
        i[s * 4 + 3] = 0);
  }
  let o = r.texture({ data: i, width: n, height: n, type: "float" });
  return r.framebuffer({ color: o, depth: !1, stencil: !1 });
}
var Ey = `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
uniform sampler2D position;uniform sampler2D trackedIndices;uniform float pointsTextureSize;varying vec2 index;void main(){vec4 trackedPointIndicies=texture2D(trackedIndices,index);if(trackedPointIndicies.r<0.0)discard;vec4 pointPosition=texture2D(position,(trackedPointIndicies.rg+0.5)/pointsTextureSize);gl_FragColor=vec4(pointPosition.rg,1.0,1.0);}`,
  Xs = class extends ur {
    constructor() {
      super(...arguments), this.trackedPositionsById = new Map();
    }
    create() {
      var t, r;
      let { reglInstance: n, store: i, data: o, config: s } = this,
        { pointsTextureSize: a, adjustedSpaceSize: l } = i;
      if (!a) return;
      let u = o.nodes.length, d = new Float32Array(a * a * 4);
      s.disableSimulation || this.rescaleInitialNodePositions();
      for (let g = 0; g < u; ++g) {
        let w = this.data.getSortedIndexByInputIndex(g), C = o.nodes[g];
        C && w !== void 0
          && (d[w * 4 + 0] = (t = C.x) !== null && t !== void 0
            ? t
            : l * i.getRandomFloat(.495, .505),
            d[w * 4 + 1] = (r = C.y) !== null && r !== void 0
              ? r
              : l * i.getRandomFloat(.495, .505));
      }
      this.currentPositionFbo = n.framebuffer({
        color: n.texture({ data: d, shape: [a, a, 4], type: "float" }),
        depth: !1,
        stencil: !1,
      }),
        this.config.disableSimulation
        || (this.previousPositionFbo = n.framebuffer({
          color: n.texture({ data: d, shape: [a, a, 4], type: "float" }),
          depth: !1,
          stencil: !1,
        }),
          this.velocityFbo = n.framebuffer({
            color: n.texture({
              data: new Float32Array(a * a * 4).fill(0),
              shape: [a, a, 4],
              type: "float",
            }),
            depth: !1,
            stencil: !1,
          })),
        this.selectedFbo = n.framebuffer({
          color: n.texture({ data: d, shape: [a, a, 4], type: "float" }),
          depth: !1,
          stencil: !1,
        }),
        this.hoveredFbo = n.framebuffer({
          shape: [2, 2],
          colorType: "float",
          depth: !1,
          stencil: !1,
        }),
        this.updateSize(),
        this.updateColor(),
        this.updateGreyoutStatus(),
        this.updateSampledNodesGrid();
    }
    initPrograms() {
      let { reglInstance: t, config: r, store: n, data: i } = this;
      r.disableSimulation
      || (this.updatePositionCommand = t({
        frag: Sy,
        vert: kt,
        framebuffer: () => this.currentPositionFbo,
        primitive: "triangle strip",
        count: 4,
        attributes: { quad: Ct(t) },
        uniforms: {
          position: () => this.previousPositionFbo,
          velocity: () => this.velocityFbo,
          friction: () => {
            var o;
            return (o = r.simulation) === null || o === void 0
              ? void 0
              : o.friction;
          },
          spaceSize: () => n.adjustedSpaceSize,
        },
      })),
        this.drawCommand = t({
          frag: cy,
          vert: dy,
          primitive: "points",
          count: () => i.nodes.length,
          attributes: { indexes: En(t, n.pointsTextureSize) },
          uniforms: {
            positions: () => this.currentPositionFbo,
            particleColor: () => this.colorFbo,
            particleGreyoutStatus: () => this.greyoutStatusFbo,
            particleSize: () => this.sizeFbo,
            ratio: () => r.pixelRatio,
            sizeScale: () => r.nodeSizeScale,
            pointsTextureSize: () => n.pointsTextureSize,
            transform: () => n.transform,
            spaceSize: () => n.adjustedSpaceSize,
            screenSize: () => n.screenSize,
            greyoutOpacity: () => r.nodeGreyoutOpacity,
            scaleNodesOnZoom: () => r.scaleNodesOnZoom,
            maxPointSize: () => n.maxPointSize,
          },
          blend: {
            enable: !0,
            func: {
              dstRGB: "one minus src alpha",
              srcRGB: "src alpha",
              dstAlpha: "one minus src alpha",
              srcAlpha: "one",
            },
            equation: { rgb: "add", alpha: "add" },
          },
          depth: { enable: !1, mask: !1 },
        }),
        this.findPointsOnAreaSelectionCommand = t({
          frag: hy,
          vert: kt,
          framebuffer: () => this.selectedFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(t) },
          uniforms: {
            position: () => this.currentPositionFbo,
            particleSize: () => this.sizeFbo,
            spaceSize: () => n.adjustedSpaceSize,
            screenSize: () => n.screenSize,
            sizeScale: () => r.nodeSizeScale,
            transform: () => n.transform,
            ratio: () => r.pixelRatio,
            "selection[0]": () => n.selectedArea[0],
            "selection[1]": () => n.selectedArea[1],
            scaleNodesOnZoom: () => r.scaleNodesOnZoom,
            maxPointSize: () => n.maxPointSize,
          },
        }),
        this.clearHoveredFboCommand = t({
          frag: In,
          vert: kt,
          framebuffer: this.hoveredFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(t) },
        }),
        this.findHoveredPointCommand = t({
          frag: vy,
          vert: gy,
          primitive: "points",
          count: () => i.nodes.length,
          framebuffer: () => this.hoveredFbo,
          attributes: { indexes: En(t, n.pointsTextureSize) },
          uniforms: {
            position: () => this.currentPositionFbo,
            particleSize: () => this.sizeFbo,
            ratio: () => r.pixelRatio,
            sizeScale: () => r.nodeSizeScale,
            pointsTextureSize: () => n.pointsTextureSize,
            transform: () => n.transform,
            spaceSize: () => n.adjustedSpaceSize,
            screenSize: () => n.screenSize,
            scaleNodesOnZoom: () => r.scaleNodesOnZoom,
            mousePosition: () => n.screenMousePosition,
            maxPointSize: () => n.maxPointSize,
          },
          depth: { enable: !1, mask: !1 },
        }),
        this.clearSampledNodesFboCommand = t({
          frag: In,
          vert: kt,
          framebuffer: () => this.sampledNodesFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(t) },
        }),
        this.fillSampledNodesFboCommand = t({
          frag: xy,
          vert: yy,
          primitive: "points",
          count: () => i.nodes.length,
          framebuffer: () => this.sampledNodesFbo,
          attributes: { indexes: En(t, n.pointsTextureSize) },
          uniforms: {
            position: () => this.currentPositionFbo,
            pointsTextureSize: () => n.pointsTextureSize,
            transform: () => n.transform,
            spaceSize: () => n.adjustedSpaceSize,
            screenSize: () => n.screenSize,
          },
          depth: { enable: !1, mask: !1 },
        }),
        this.drawHighlightedCommand = t({
          frag: my,
          vert: py,
          attributes: { quad: Ct(t) },
          primitive: "triangle strip",
          count: 4,
          uniforms: {
            color: t.prop("color"),
            width: t.prop("width"),
            pointIndex: t.prop("pointIndex"),
            positions: () => this.currentPositionFbo,
            particleColor: () => this.colorFbo,
            particleSize: () => this.sizeFbo,
            sizeScale: () => r.nodeSizeScale,
            pointsTextureSize: () => n.pointsTextureSize,
            transform: () => n.transform,
            spaceSize: () => n.adjustedSpaceSize,
            screenSize: () => n.screenSize,
            scaleNodesOnZoom: () => r.scaleNodesOnZoom,
            maxPointSize: () => n.maxPointSize,
            particleGreyoutStatus: () => this.greyoutStatusFbo,
            greyoutOpacity: () => r.nodeGreyoutOpacity,
          },
          blend: {
            enable: !0,
            func: {
              dstRGB: "one minus src alpha",
              srcRGB: "src alpha",
              dstAlpha: "one minus src alpha",
              srcAlpha: "one",
            },
            equation: { rgb: "add", alpha: "add" },
          },
          depth: { enable: !1, mask: !1 },
        }),
        this.trackPointsCommand = t({
          frag: Ey,
          vert: kt,
          framebuffer: () => this.trackedPositionsFbo,
          primitive: "triangle strip",
          count: 4,
          attributes: { quad: Ct(t) },
          uniforms: {
            position: () => this.currentPositionFbo,
            trackedIndices: () => this.trackedIndicesFbo,
            pointsTextureSize: () => n.pointsTextureSize,
          },
        });
    }
    updateColor() {
      let {
        reglInstance: t,
        config: r,
        store: { pointsTextureSize: n },
        data: i,
      } = this;
      n && (this.colorFbo = ly(i, t, n, r.nodeColor));
    }
    updateGreyoutStatus() {
      let { reglInstance: t, store: r } = this;
      this.greyoutStatusFbo = uy(r.selectedIndices, t, r.pointsTextureSize);
    }
    updateSize() {
      let {
        reglInstance: t,
        config: r,
        store: { pointsTextureSize: n },
        data: i,
      } = this;
      n
        && (this.sizeByIndex = new Float32Array(i.nodes.length),
          this.sizeFbo = _y(i, t, n, r.nodeSize, this.sizeByIndex));
    }
    updateSampledNodesGrid() {
      let {
          store: { screenSize: t },
          config: { nodeSamplingDistance: r },
          reglInstance: n,
        } = this,
        i = r ?? Math.min(...t) / 2,
        o = Math.ceil(t[0] / i),
        s = Math.ceil(t[1] / i);
      vt(this.sampledNodesFbo),
        this.sampledNodesFbo = n.framebuffer({
          shape: [o, s],
          depth: !1,
          stencil: !1,
          colorType: "float",
        });
    }
    trackPoints() {
      var t;
      !this.trackedIndicesFbo || !this.trackedPositionsFbo
        || (t = this.trackPointsCommand) === null || t === void 0
        || t.call(this);
    }
    draw() {
      var t, r, n;
      let {
        config: { renderHoveredNodeRing: i, renderHighlightedNodeRing: o },
        store: s,
      } = this;
      (t = this.drawCommand) === null || t === void 0 || t.call(this),
        (i ?? o) && s.hoveredNode
        && ((r = this.drawHighlightedCommand) === null || r === void 0
          || r.call(this, {
            width: .85,
            color: s.hoveredNodeRingColor,
            pointIndex: s.hoveredNode.index,
          })),
        s.focusedNode
        && ((n = this.drawHighlightedCommand) === null || n === void 0
          || n.call(this, {
            width: .75,
            color: s.focusedNodeRingColor,
            pointIndex: s.focusedNode.index,
          }));
    }
    updatePosition() {
      var t;
      (t = this.updatePositionCommand) === null || t === void 0 || t.call(this),
        this.swapFbo();
    }
    findPointsOnAreaSelection() {
      var t;
      (t = this.findPointsOnAreaSelectionCommand) === null || t === void 0
        || t.call(this);
    }
    findHoveredPoint() {
      var t, r;
      (t = this.clearHoveredFboCommand) === null || t === void 0
      || t.call(this),
        (r = this.findHoveredPointCommand) === null || r === void 0
        || r.call(this);
    }
    getNodeRadiusByIndex(t) {
      var r;
      return (r = this.sizeByIndex) === null || r === void 0 ? void 0 : r[t];
    }
    trackNodesByIds(t) {
      this.trackedIds = t.length ? t : void 0,
        this.trackedPositionsById.clear();
      let r = t.map(n => this.data.getSortedIndexById(n)).filter(n =>
        n !== void 0
      );
      vt(this.trackedIndicesFbo),
        this.trackedIndicesFbo = void 0,
        vt(this.trackedPositionsFbo),
        this.trackedPositionsFbo = void 0,
        r.length
        && (this.trackedIndicesFbo = Ty(
          r,
          this.store.pointsTextureSize,
          this.reglInstance,
        ),
          this.trackedPositionsFbo = wy(r, this.reglInstance)),
        this.trackPoints();
    }
    getTrackedPositions() {
      if (!this.trackedIds) return this.trackedPositionsById;
      let t = Pr(this.reglInstance, this.trackedPositionsFbo);
      return this.trackedIds.forEach((r, n) => {
        let i = t[n * 4], o = t[n * 4 + 1];
        i !== void 0 && o !== void 0
          && this.trackedPositionsById.set(r, [i, o]);
      }),
        this.trackedPositionsById;
    }
    getSampledNodePositionsMap() {
      var t, r, n;
      let i = new Map();
      if (!this.sampledNodesFbo) return i;
      (t = this.clearSampledNodesFboCommand) === null || t === void 0
      || t.call(this),
        (r = this.fillSampledNodesFboCommand) === null || r === void 0
        || r.call(this);
      let o = Pr(this.reglInstance, this.sampledNodesFbo);
      for (let s = 0; s < o.length / 4; s++) {
        let a = o[s * 4],
          l = !!o[s * 4 + 1],
          u = o[s * 4 + 2],
          d = o[s * 4 + 3];
        if (l && a !== void 0 && u !== void 0 && d !== void 0) {
          let g = this.data.getInputIndexBySortedIndex(a);
          if (g !== void 0) {
            let w = (n = this.data.getNodeByIndex(g)) === null || n === void 0
              ? void 0
              : n.id;
            w !== void 0 && i.set(w, [u, d]);
          }
        }
      }
      return i;
    }
    destroy() {
      vt(this.currentPositionFbo),
        vt(this.previousPositionFbo),
        vt(this.velocityFbo),
        vt(this.selectedFbo),
        vt(this.colorFbo),
        vt(this.sizeFbo),
        vt(this.greyoutStatusFbo),
        vt(this.hoveredFbo),
        vt(this.trackedIndicesFbo),
        vt(this.trackedPositionsFbo);
    }
    swapFbo() {
      let t = this.previousPositionFbo;
      this.previousPositionFbo = this.currentPositionFbo,
        this.currentPositionFbo = t;
    }
    rescaleInitialNodePositions() {
      let { nodes: t } = this.data, { spaceSize: r } = this.config;
      if (t.length === 0) return;
      let n = t.map(ce => ce.x).filter(ce => ce !== void 0);
      if (n.length === 0) return;
      let i = t.map(ce => ce.y).filter(ce => ce !== void 0);
      if (i.length === 0) return;
      let [o, s] = tn(n);
      if (o === void 0 || s === void 0) return;
      let [a, l] = tn(i);
      if (a === void 0 || l === void 0) return;
      let u = s - o,
        d = l - a,
        g = Math.max(u, d),
        w = (g - u) / 2,
        C = (g - d) / 2,
        Y = Cr().range([0, r ?? Xe.spaceSize]).domain([o - w, s + w]),
        me = Cr().range([0, r ?? Xe.spaceSize]).domain([a - C, l + C]);
      t.forEach(ce => {
        ce.x = Y(ce.x), ce.y = me(ce.y);
      });
    }
  },
  Ys = .001,
  Ws = 64,
  Zs = class {
    constructor() {
      this.pointsTextureSize = 0,
        this.linksTextureSize = 0,
        this.alpha = 1,
        this.transform = lr.create(),
        this.backgroundColor = [0, 0, 0, 0],
        this.screenSize = [0, 0],
        this.mousePosition = [0, 0],
        this.screenMousePosition = [0, 0],
        this.selectedArea = [[0, 0], [0, 0]],
        this.isSimulationRunning = !1,
        this.simulationProgress = 0,
        this.selectedIndices = null,
        this.maxPointSize = Ws,
        this.hoveredNode = void 0,
        this.focusedNode = void 0,
        this.adjustedSpaceSize = Xe.spaceSize,
        this.hoveredNodeRingColor = [1, 1, 1, jx],
        this.focusedNodeRingColor = [1, 1, 1, Ux],
        this.alphaTarget = 0,
        this.scaleNodeX = Cr(),
        this.scaleNodeY = Cr(),
        this.random = new Rs(),
        this.alphaDecay = t => 1 - Math.pow(Ys, 1 / t);
    }
    addRandomSeed(t) {
      this.random = this.random.clone(t);
    }
    getRandomFloat(t, r) {
      return this.random.float(t, r);
    }
    adjustSpaceSize(t, r) {
      t >= r
        ? (this.adjustedSpaceSize = r / 2,
          console.warn(
            `The \`spaceSize\` has been reduced to ${this.adjustedSpaceSize} due to WebGL limits`,
          ))
        : this.adjustedSpaceSize = t;
    }
    updateScreenSize(t, r) {
      let { adjustedSpaceSize: n } = this;
      this.screenSize = [t, r],
        this.scaleNodeX.domain([0, n]).range([(t - n) / 2, (t + n) / 2]),
        this.scaleNodeY.domain([n, 0]).range([(r - n) / 2, (r + n) / 2]);
    }
    scaleX(t) {
      return this.scaleNodeX(t);
    }
    scaleY(t) {
      return this.scaleNodeY(t);
    }
    setHoveredNodeRingColor(t) {
      let r = An(t);
      this.hoveredNodeRingColor[0] = r[0],
        this.hoveredNodeRingColor[1] = r[1],
        this.hoveredNodeRingColor[2] = r[2];
    }
    setFocusedNodeRingColor(t) {
      let r = An(t);
      this.focusedNodeRingColor[0] = r[0],
        this.focusedNodeRingColor[1] = r[1],
        this.focusedNodeRingColor[2] = r[2];
    }
    setFocusedNode(t, r) {
      t && r !== void 0 ? this.focusedNode = { node: t, index: r }
      : this.focusedNode = void 0;
    }
    addAlpha(t) {
      return (this.alphaTarget - this.alpha) * this.alphaDecay(t);
    }
  },
  Qs = class {
    constructor(t, r) {
      this.eventTransform = yr,
        this.behavior = Ds().scaleExtent([.001, 1 / 0]).on("start", n => {
          var i, o, s;
          this.isRunning = !0;
          let a = !!n.sourceEvent;
          (s = (o = (i = this.config) === null || i === void 0
                      ? void 0
                      : i.events) === null || o === void 0
                ? void 0
                : o.onZoomStart) === null || s === void 0 || s.call(o, n, a);
        }).on("zoom", n => {
          var i, o, s;
          this.eventTransform = n.transform;
          let {
              eventTransform: { x: a, y: l, k: u },
              store: { transform: d, screenSize: g },
            } = this,
            w = g[0],
            C = g[1];
          lr.projection(d, w, C),
            lr.translate(d, d, [a, l]),
            lr.scale(d, d, [u, u]),
            lr.translate(d, d, [w / 2, C / 2]),
            lr.scale(d, d, [w / 2, C / 2]),
            lr.scale(d, d, [1, -1]);
          let Y = !!n.sourceEvent;
          (s = (o = (i = this.config) === null || i === void 0
                      ? void 0
                      : i.events) === null || o === void 0
                ? void 0
                : o.onZoom)
              === null || s === void 0 || s.call(o, n, Y);
        }).on("end", n => {
          var i, o, s;
          this.isRunning = !1;
          let a = !!n.sourceEvent;
          (s = (o = (i = this.config) === null || i === void 0
                      ? void 0
                      : i.events) === null || o === void 0
                ? void 0
                : o.onZoomEnd) === null || s === void 0 || s.call(o, n, a);
        }),
        this.isRunning = !1,
        this.store = t,
        this.config = r;
    }
    getTransform(t, r, n = .1) {
      if (t.length === 0) return this.eventTransform;
      let { store: { screenSize: i } } = this,
        o = i[0],
        s = i[1],
        a = tn(t.map(ie => ie[0])),
        l = tn(t.map(ie => ie[1]));
      a[0] = this.store.scaleX(a[0]),
        a[1] = this.store.scaleX(a[1]),
        l[0] = this.store.scaleY(l[0]),
        l[1] = this.store.scaleY(l[1]);
      let u = o * (1 - n * 2) / (a[1] - a[0]),
        d = s * (1 - n * 2) / (l[0] - l[1]),
        g = Xx(r ?? Math.min(u, d), ...this.behavior.scaleExtent()),
        w = (a[1] + a[0]) / 2,
        C = (l[1] + l[0]) / 2,
        Y = o / 2 - w * g,
        me = s / 2 - C * g;
      return yr.translate(Y, me).scale(g);
    }
    getDistanceToPoint(t) {
      let { x: r, y: n, k: i } = this.eventTransform,
        o = this.getTransform([t], i),
        s = r - o.x,
        a = n - o.y;
      return Math.sqrt(s * s + a * a);
    }
    getMiddlePointTransform(t) {
      let { store: { screenSize: r }, eventTransform: { x: n, y: i, k: o } } =
          this,
        s = r[0],
        a = r[1],
        l = (s / 2 - n) / o,
        u = (a / 2 - i) / o,
        d = this.store.scaleX(t[0]),
        g = this.store.scaleY(t[1]),
        w = (l + d) / 2,
        C = (u + g) / 2,
        Y = 1,
        me = s / 2 - w * Y,
        ce = a / 2 - C * Y;
      return yr.translate(me, ce).scale(Y);
    }
    convertScreenToSpacePosition(t) {
      let { eventTransform: { x: r, y: n, k: i }, store: { screenSize: o } } =
          this,
        s = o[0],
        a = o[1],
        l = (t[0] - r) / i,
        u = (t[1] - n) / i,
        d = [l, a - u];
      return d[0] -= (s - this.store.adjustedSpaceSize) / 2,
        d[1] -= (a - this.store.adjustedSpaceSize) / 2,
        d;
    }
    convertSpaceToScreenPosition(t) {
      let r = this.eventTransform.applyX(this.store.scaleX(t[0])),
        n = this.eventTransform.applyY(this.store.scaleY(t[1]));
      return [r, n];
    }
    convertSpaceToScreenRadius(t) {
      let {
          config: { scaleNodesOnZoom: r },
          store: { maxPointSize: n },
          eventTransform: { k: i },
        } = this,
        o = t * 2;
      return r ? o *= i : o *= Math.min(5, Math.max(1, i * .01)),
        Math.min(o, n) / 2;
    }
  },
  Pd = class {
    constructor(t, r) {
      var n, i;
      this.config = new Gs(),
        this.graph = new qs(),
        this.requestAnimationFrameId = 0,
        this.isRightClickMouse = !1,
        this.store = new Zs(),
        this.zoomInstance = new Qs(this.store, this.config),
        this.hasParticleSystemDestroyed = !1,
        this._findHoveredPointExecutionCount = 0,
        this._isMouseOnCanvas = !1,
        this._isFirstDataAfterInit = !0,
        r && this.config.init(r);
      let o = t.clientWidth, s = t.clientHeight;
      t.width = o * this.config.pixelRatio,
        t.height = s * this.config.pixelRatio,
        t.style.width === "" && t.style.height === ""
        && Mt(t).style("width", "100%").style("height", "100%"),
        this.canvas = t,
        this.canvasD3Selection = Mt(t),
        this.canvasD3Selection.on("mouseenter.cosmos", () => {
          this._isMouseOnCanvas = !0;
        }).on("mouseleave.cosmos", () => {
          this._isMouseOnCanvas = !1;
        }),
        this.zoomInstance.behavior.on("start.detect", a => {
          this.currentEvent = a;
        }).on("zoom.detect", a => {
          !!a.sourceEvent && this.updateMousePosition(a.sourceEvent),
            this.currentEvent = a;
        }).on("end.detect", a => {
          this.currentEvent = a;
        }),
        this.canvasD3Selection.call(this.zoomInstance.behavior).on(
          "click",
          this.onClick.bind(this),
        ).on("mousemove", this.onMouseMove.bind(this)).on(
          "contextmenu",
          this.onRightClickMouse.bind(this),
        ),
        this.config.disableZoom && this.disableZoom(),
        this.setZoomLevel(
          (n = this.config.initialZoomLevel) !== null && n !== void 0 ? n : 1,
        ),
        this.reglInstance = (0, kd.default)({
          canvas: this.canvas,
          attributes: { antialias: !1, preserveDrawingBuffer: !0 },
          extensions: ["OES_texture_float", "ANGLE_instanced_arrays"],
        }),
        this.store.maxPointSize =
          ((i = this.reglInstance.limits.pointSizeDims[1]) !== null
              && i !== void 0
            ? i
            : Ws) / this.config.pixelRatio,
        this.store.adjustSpaceSize(
          this.config.spaceSize,
          this.reglInstance.limits.maxTextureSize,
        ),
        this.store.updateScreenSize(o, s),
        this.points = new Xs(
          this.reglInstance,
          this.config,
          this.store,
          this.graph,
        ),
        this.lines = new Hs(
          this.reglInstance,
          this.config,
          this.store,
          this.graph,
          this.points,
        ),
        this.config.disableSimulation
        || (this.forceGravity = new Vs(
          this.reglInstance,
          this.config,
          this.store,
          this.graph,
          this.points,
        ),
          this.forceCenter = new Bs(
            this.reglInstance,
            this.config,
            this.store,
            this.graph,
            this.points,
          ),
          this.forceManyBody = this.config.useQuadtree
            ? new js(
              this.reglInstance,
              this.config,
              this.store,
              this.graph,
              this.points,
            )
            : new $s(
              this.reglInstance,
              this.config,
              this.store,
              this.graph,
              this.points,
            ),
          this.forceLinkIncoming = new Do(
            this.reglInstance,
            this.config,
            this.store,
            this.graph,
            this.points,
          ),
          this.forceLinkOutgoing = new Do(
            this.reglInstance,
            this.config,
            this.store,
            this.graph,
            this.points,
          ),
          this.forceMouse = new Us(
            this.reglInstance,
            this.config,
            this.store,
            this.graph,
            this.points,
          )),
        this.store.backgroundColor = An(this.config.backgroundColor),
        this.config.highlightedNodeRingColor
          ? (this.store.setHoveredNodeRingColor(
            this.config.highlightedNodeRingColor,
          ),
            this.store.setFocusedNodeRingColor(
              this.config.highlightedNodeRingColor,
            ))
          : (this.config.hoveredNodeRingColor
            && this.store.setHoveredNodeRingColor(
              this.config.hoveredNodeRingColor,
            ),
            this.config.focusedNodeRingColor
            && this.store.setFocusedNodeRingColor(
              this.config.focusedNodeRingColor,
            )),
        this.config.showFPSMonitor && (this.fpsMonitor = new Go(this.canvas)),
        this.config.randomSeed !== void 0
        && this.store.addRandomSeed(this.config.randomSeed);
    }
    get progress() {
      return this.store.simulationProgress;
    }
    get isSimulationRunning() {
      return this.store.isSimulationRunning;
    }
    get maxPointSize() {
      return this.store.maxPointSize;
    }
    setConfig(t) {
      var r, n;
      let i = { ...this.config };
      this.config.init(t),
        i.linkColor !== this.config.linkColor && this.lines.updateColor(),
        i.nodeColor !== this.config.nodeColor && this.points.updateColor(),
        i.nodeSize !== this.config.nodeSize && this.points.updateSize(),
        i.linkWidth !== this.config.linkWidth && this.lines.updateWidth(),
        i.linkArrows !== this.config.linkArrows && this.lines.updateArrow(),
        (i.curvedLinkSegments !== this.config.curvedLinkSegments
          || i.curvedLinks !== this.config.curvedLinks)
        && this.lines.updateCurveLineGeometry(),
        i.backgroundColor !== this.config.backgroundColor
        && (this.store.backgroundColor = An(this.config.backgroundColor)),
        i.highlightedNodeRingColor !== this.config.highlightedNodeRingColor
        && (this.store.setHoveredNodeRingColor(
          this.config.highlightedNodeRingColor,
        ),
          this.store.setFocusedNodeRingColor(
            this.config.highlightedNodeRingColor,
          )),
        i.hoveredNodeRingColor !== this.config.hoveredNodeRingColor
        && this.store.setHoveredNodeRingColor(this.config.hoveredNodeRingColor),
        i.focusedNodeRingColor !== this.config.focusedNodeRingColor
        && this.store.setFocusedNodeRingColor(this.config.focusedNodeRingColor),
        (i.spaceSize !== this.config.spaceSize
          || i.simulation.repulsionQuadtreeLevels
            !== this.config.simulation.repulsionQuadtreeLevels)
        && (this.store.adjustSpaceSize(
          this.config.spaceSize,
          this.reglInstance.limits.maxTextureSize,
        ),
          this.resizeCanvas(!0),
          this.update(this.store.isSimulationRunning)),
        i.showFPSMonitor !== this.config.showFPSMonitor
        && (this.config.showFPSMonitor
          ? this.fpsMonitor = new Go(this.canvas)
          : ((r = this.fpsMonitor) === null || r === void 0 || r.destroy(),
            this.fpsMonitor = void 0)),
        i.pixelRatio !== this.config.pixelRatio
        && (this.store.maxPointSize =
          ((n = this.reglInstance.limits.pointSizeDims[1]) !== null
              && n !== void 0
            ? n
            : Ws) / this.config.pixelRatio),
        i.disableZoom !== this.config.disableZoom
        && (this.config.disableZoom ? this.disableZoom() : this.enableZoom());
    }
    setData(t, r, n = !0) {
      let {
        fitViewOnInit: i,
        fitViewDelay: o,
        fitViewByNodesInRect: s,
        initialZoomLevel: a,
      } = this.config;
      if (!t.length && !r.length) {
        this.destroyParticleSystem(),
          this.reglInstance.clear({
            color: this.store.backgroundColor,
            depth: 1,
            stencil: 0,
          });
        return;
      }
      this.graph.setData(t, r),
        this._isFirstDataAfterInit && i && a === void 0
        && (this._fitViewOnInitTimeoutID = window.setTimeout(() => {
          s
            ? this.setZoomTransformByNodePositions(s, void 0, void 0, 0)
            : this.fitView();
        }, o)),
        this._isFirstDataAfterInit = !1,
        this.update(n);
    }
    zoomToNodeById(t, r = 700, n = Fd, i = !0) {
      let o = this.graph.getNodeById(t);
      o && this.zoomToNode(o, r, n, i);
    }
    zoomToNodeByIndex(t, r = 700, n = Fd, i = !0) {
      let o = this.graph.getNodeByIndex(t);
      o && this.zoomToNode(o, r, n, i);
    }
    zoom(t, r = 0) {
      this.setZoomLevel(t, r);
    }
    setZoomLevel(t, r = 0) {
      r === 0
        ? this.canvasD3Selection.call(this.zoomInstance.behavior.scaleTo, t)
        : this.canvasD3Selection.transition().duration(r).call(
          this.zoomInstance.behavior.scaleTo,
          t,
        );
    }
    getZoomLevel() {
      return this.zoomInstance.eventTransform.k;
    }
    getNodePositions() {
      if (this.hasParticleSystemDestroyed) return {};
      let t = Pr(this.reglInstance, this.points.currentPositionFbo);
      return this.graph.nodes.reduce((r, n) => {
        let i = this.graph.getSortedIndexById(n.id),
          o = t[i * 4 + 0],
          s = t[i * 4 + 1];
        return o !== void 0 && s !== void 0 && (r[n.id] = { x: o, y: s }), r;
      }, {});
    }
    getNodePositionsMap() {
      let t = new Map();
      if (this.hasParticleSystemDestroyed) return t;
      let r = Pr(this.reglInstance, this.points.currentPositionFbo);
      return this.graph.nodes.reduce((n, i) => {
        let o = this.graph.getSortedIndexById(i.id),
          s = r[o * 4 + 0],
          a = r[o * 4 + 1];
        return s !== void 0 && a !== void 0 && n.set(i.id, [s, a]), n;
      }, t);
    }
    getNodePositionsArray() {
      let t = [];
      if (this.hasParticleSystemDestroyed) return [];
      let r = Pr(this.reglInstance, this.points.currentPositionFbo);
      t.length = this.graph.nodes.length;
      for (let n = 0; n < this.graph.nodes.length; n += 1) {
        let i = this.graph.getSortedIndexByInputIndex(n),
          o = r[i * 4 + 0],
          s = r[i * 4 + 1];
        o !== void 0 && s !== void 0 && (t[n] = [o, s]);
      }
      return t;
    }
    fitView(t = 250, r = .1) {
      this.setZoomTransformByNodePositions(
        this.getNodePositionsArray(),
        t,
        void 0,
        r,
      );
    }
    fitViewByNodeIds(t, r = 250, n = .1) {
      let i = this.getNodePositionsMap(),
        o = t.map(s => i.get(s)).filter(s => s !== void 0);
      this.setZoomTransformByNodePositions(o, r, void 0, n);
    }
    selectNodesInRange(t) {
      if (t) {
        let r = this.store.screenSize[1];
        this.store.selectedArea = [[t[0][0], r - t[1][1]], [
          t[1][0],
          r - t[0][1],
        ]], this.points.findPointsOnAreaSelection();
        let n = Pr(this.reglInstance, this.points.selectedFbo);
        this.store.selectedIndices = n.map((i, o) =>
          o % 4 === 0 && i !== 0 ? o / 4 : -1
        ).filter(i => i !== -1);
      }
      else this.store.selectedIndices = null;
      this.points.updateGreyoutStatus();
    }
    selectNodeById(t, r = !1) {
      var n;
      if (r) {
        let i = (n = this.graph.getAdjacentNodes(t)) !== null && n !== void 0
          ? n
          : [];
        this.selectNodesByIds([t, ...i.map(o => o.id)]);
      }
      else this.selectNodesByIds([t]);
    }
    selectNodeByIndex(t, r = !1) {
      let n = this.graph.getNodeByIndex(t);
      n && this.selectNodeById(n.id, r);
    }
    selectNodesByIds(t) {
      this.selectNodesByIndices(t?.map(r => this.graph.getSortedIndexById(r)));
    }
    selectNodesByIndices(t) {
      t
        ? t.length === 0
          ? this.store.selectedIndices = new Float32Array()
          : this.store.selectedIndices = new Float32Array(
            t.filter(r => r !== void 0),
          )
        : this.store.selectedIndices = null, this.points.updateGreyoutStatus();
    }
    unselectNodes() {
      this.store.selectedIndices = null, this.points.updateGreyoutStatus();
    }
    getSelectedNodes() {
      let { selectedIndices: t } = this.store;
      if (!t) return null;
      let r = new Array(t.length);
      for (let [n, i] of t.entries()) {
        if (i !== void 0) {
          let o = this.graph.getInputIndexBySortedIndex(i);
          o !== void 0 && (r[n] = this.graph.nodes[o]);
        }
      }
      return r;
    }
    getAdjacentNodes(t) {
      return this.graph.getAdjacentNodes(t);
    }
    setFocusedNodeById(t) {
      t === void 0 ? this.store.setFocusedNode()
      : this.store.setFocusedNode(
        this.graph.getNodeById(t),
        this.graph.getSortedIndexById(t),
      );
    }
    setFocusedNodeByIndex(t) {
      t === void 0 ? this.store.setFocusedNode()
      : this.store.setFocusedNode(this.graph.getNodeByIndex(t), t);
    }
    spaceToScreenPosition(t) {
      return this.zoomInstance.convertSpaceToScreenPosition(t);
    }
    spaceToScreenRadius(t) {
      return this.zoomInstance.convertSpaceToScreenRadius(t);
    }
    getNodeRadiusByIndex(t) {
      return this.points.getNodeRadiusByIndex(t);
    }
    getNodeRadiusById(t) {
      let r = this.graph.getInputIndexById(t);
      if (r !== void 0) return this.points.getNodeRadiusByIndex(r);
    }
    trackNodePositionsByIds(t) {
      this.points.trackNodesByIds(t);
    }
    trackNodePositionsByIndices(t) {
      this.points.trackNodesByIds(
        t.map(r => this.graph.getNodeByIndex(r)).filter(r => r !== void 0).map(
          r => r.id
        ),
      );
    }
    getTrackedNodePositionsMap() {
      return this.points.getTrackedPositions();
    }
    getSampledNodePositionsMap() {
      return this.points.getSampledNodePositionsMap();
    }
    start(t = 1) {
      var r, n;
      this.graph.nodes.length
        && (this.store.isSimulationRunning = !0,
          this.store.alpha = t,
          this.store.simulationProgress = 0,
          (n = (r = this.config.simulation).onStart) === null || n === void 0
          || n.call(r),
          this.stopFrames(),
          this.frame());
    }
    pause() {
      var t, r;
      this.store.isSimulationRunning = !1,
        (r = (t = this.config.simulation).onPause) === null || r === void 0
        || r.call(t);
    }
    restart() {
      var t, r;
      this.store.isSimulationRunning = !0,
        (r = (t = this.config.simulation).onRestart) === null || r === void 0
        || r.call(t);
    }
    step() {
      this.store.isSimulationRunning = !1, this.stopFrames(), this.frame();
    }
    destroy() {
      var t, r;
      window.clearTimeout(this._fitViewOnInitTimeoutID),
        this.stopFrames(),
        this.destroyParticleSystem(),
        (t = this.fpsMonitor) === null || t === void 0 || t.destroy(),
        (r = document.getElementById("gl-bench-style")) === null || r === void 0
        || r.remove();
    }
    create() {
      var t, r, n, i;
      this.points.create(),
        this.lines.create(),
        (t = this.forceManyBody) === null || t === void 0 || t.create(),
        (r = this.forceLinkIncoming) === null || r === void 0
        || r.create(pi.INCOMING),
        (n = this.forceLinkOutgoing) === null || n === void 0
        || n.create(pi.OUTGOING),
        (i = this.forceCenter) === null || i === void 0 || i.create(),
        this.hasParticleSystemDestroyed = !1;
    }
    destroyParticleSystem() {
      var t, r, n, i;
      this.hasParticleSystemDestroyed
        || (this.points.destroy(),
          this.lines.destroy(),
          (t = this.forceCenter) === null || t === void 0 || t.destroy(),
          (r = this.forceLinkIncoming) === null || r === void 0 || r.destroy(),
          (n = this.forceLinkOutgoing) === null || n === void 0 || n.destroy(),
          (i = this.forceManyBody) === null || i === void 0 || i.destroy(),
          this.reglInstance.destroy(),
          this.hasParticleSystemDestroyed = !0);
    }
    update(t) {
      let { graph: r } = this;
      this.store.pointsTextureSize = Math.ceil(Math.sqrt(r.nodes.length)),
        this.store.linksTextureSize = Math.ceil(Math.sqrt(r.linksNumber * 2)),
        this.destroyParticleSystem(),
        this.create(),
        this.initPrograms(),
        this.setFocusedNodeById(),
        this.store.hoveredNode = void 0,
        t ? this.start() : this.step();
    }
    initPrograms() {
      var t, r, n, i, o, s;
      this.points.initPrograms(),
        this.lines.initPrograms(),
        (t = this.forceGravity) === null || t === void 0 || t.initPrograms(),
        (r = this.forceLinkIncoming) === null || r === void 0
        || r.initPrograms(),
        (n = this.forceLinkOutgoing) === null || n === void 0
        || n.initPrograms(),
        (i = this.forceMouse) === null || i === void 0 || i.initPrograms(),
        (o = this.forceManyBody) === null || o === void 0 || o.initPrograms(),
        (s = this.forceCenter) === null || s === void 0 || s.initPrograms();
    }
    frame() {
      let {
        config: { simulation: t, renderLinks: r, disableSimulation: n },
        store: { alpha: i, isSimulationRunning: o },
      } = this;
      i < Ys && o && this.end(),
        this.store.pointsTextureSize
        && (this.requestAnimationFrameId = window.requestAnimationFrame(s => {
          var a, l, u, d, g, w, C, Y, me, ce, ie, Le, _e;
          (a = this.fpsMonitor) === null || a === void 0 || a.begin(),
            this.resizeCanvas(),
            this.findHoveredPoint(),
            n
            || (this.isRightClickMouse
              && (o || this.start(.1),
                (l = this.forceMouse) === null || l === void 0 || l.run(),
                this.points.updatePosition()),
              o && !this.zoomInstance.isRunning
              && (t.gravity
                && ((u = this.forceGravity) === null || u === void 0 || u.run(),
                  this.points.updatePosition()),
                t.center
                && ((d = this.forceCenter) === null || d === void 0 || d.run(),
                  this.points.updatePosition()),
                (g = this.forceManyBody) === null || g === void 0 || g.run(),
                this.points.updatePosition(),
                this.store.linksTextureSize
                && ((w = this.forceLinkIncoming) === null || w === void 0
                  || w.run(),
                  this.points.updatePosition(),
                  (C = this.forceLinkOutgoing) === null || C === void 0
                  || C.run(),
                  this.points.updatePosition()),
                this.store.alpha += this.store.addAlpha(
                  (Y = this.config.simulation.decay) !== null && Y !== void 0
                    ? Y
                    : Xe.simulation.decay,
                ),
                this.isRightClickMouse
                && (this.store.alpha = Math.max(this.store.alpha, .1)),
                this.store.simulationProgress = Math.sqrt(
                  Math.min(1, Ys / this.store.alpha),
                ),
                (ce = (me = this.config.simulation).onTick) === null
                || ce === void 0
                || ce.call(
                  me,
                  this.store.alpha,
                  (ie = this.store.hoveredNode) === null || ie === void 0
                    ? void 0 : ie.node,
                  this.store.hoveredNode
                    ? this.graph.getInputIndexBySortedIndex(
                      this.store.hoveredNode.index,
                    )
                    : void 0,
                  (Le = this.store.hoveredNode) === null || Le === void 0
                    ? void 0 : Le.position,
                )),
              this.points.trackPoints()),
            this.reglInstance.clear({
              color: this.store.backgroundColor,
              depth: 1,
              stencil: 0,
            }),
            r && this.store.linksTextureSize && this.lines.draw(),
            this.points.draw(),
            (_e = this.fpsMonitor) === null || _e === void 0 || _e.end(s),
            this.currentEvent = void 0,
            this.frame();
        }));
    }
    stopFrames() {
      this.requestAnimationFrameId
        && window.cancelAnimationFrame(this.requestAnimationFrameId);
    }
    end() {
      var t, r;
      this.store.isSimulationRunning = !1,
        this.store.simulationProgress = 1,
        (r = (t = this.config.simulation).onEnd) === null || r === void 0
        || r.call(t);
    }
    onClick(t) {
      var r, n, i, o;
      (n = (r = this.config.events).onClick) === null || n === void 0
        || n.call(
          r,
          (i = this.store.hoveredNode) === null || i === void 0
            ? void 0
            : i.node,
          this.store.hoveredNode
            ? this.graph.getInputIndexBySortedIndex(
              this.store.hoveredNode.index,
            )
            : void 0,
          (o = this.store.hoveredNode) === null || o === void 0 ? void 0
          : o.position,
          t,
        );
    }
    updateMousePosition(t) {
      if (!t || t.offsetX === void 0 || t.offsetY === void 0) return;
      let r = t.offsetX, n = t.offsetY;
      this.store.mousePosition = this.zoomInstance.convertScreenToSpacePosition(
        [r, n],
      ), this.store.screenMousePosition = [r, this.store.screenSize[1] - n];
    }
    onMouseMove(t) {
      var r, n, i, o;
      this.currentEvent = t,
        this.updateMousePosition(t),
        this.isRightClickMouse = t.which === 3,
        (n = (r = this.config.events).onMouseMove) === null || n === void 0
        || n.call(
          r,
          (i = this.store.hoveredNode) === null || i === void 0 ? void 0
          : i.node,
          this.store.hoveredNode
            ? this.graph.getInputIndexBySortedIndex(
              this.store.hoveredNode.index,
            ) : void 0,
          (o = this.store.hoveredNode) === null || o === void 0 ? void 0
          : o.position,
          this.currentEvent,
        );
    }
    onRightClickMouse(t) {
      t.preventDefault();
    }
    resizeCanvas(t = !1) {
      let r = this.canvas.width,
        n = this.canvas.height,
        i = this.canvas.clientWidth,
        o = this.canvas.clientHeight;
      if (
        t || r !== i * this.config.pixelRatio
        || n !== o * this.config.pixelRatio
      ) {
        let [s, a] = this.store.screenSize,
          { k: l } = this.zoomInstance.eventTransform,
          u = this.zoomInstance.convertScreenToSpacePosition([s / 2, a / 2]);
        this.store.updateScreenSize(i, o),
          this.canvas.width = i * this.config.pixelRatio,
          this.canvas.height = o * this.config.pixelRatio,
          this.reglInstance.poll(),
          this.canvasD3Selection.call(
            this.zoomInstance.behavior.transform,
            this.zoomInstance.getTransform([u], l),
          ),
          this.points.updateSampledNodesGrid();
      }
    }
    setZoomTransformByNodePositions(t, r = 250, n, i) {
      this.resizeCanvas();
      let o = this.zoomInstance.getTransform(t, n, i);
      this.canvasD3Selection.transition().ease(bo).duration(r).call(
        this.zoomInstance.behavior.transform,
        o,
      );
    }
    zoomToNode(t, r, n, i) {
      let { graph: o, store: { screenSize: s } } = this,
        a = Pr(this.reglInstance, this.points.currentPositionFbo),
        l = o.getSortedIndexById(t.id);
      if (l === void 0) return;
      let u = a[l * 4 + 0], d = a[l * 4 + 1];
      if (u === void 0 || d === void 0) return;
      let g = this.zoomInstance.getDistanceToPoint([u, d]),
        w = i ? n : Math.max(this.getZoomLevel(), n);
      if (g < Math.min(s[0], s[1])) {
        this.setZoomTransformByNodePositions([[u, d]], r, w);
      }
      else {
        let C = this.zoomInstance.getTransform([[u, d]], w),
          Y = this.zoomInstance.getMiddlePointTransform([u, d]);
        this.canvasD3Selection.transition().ease(ts).duration(r / 2).call(
          this.zoomInstance.behavior.transform,
          Y,
        ).transition().ease(rs).duration(r / 2).call(
          this.zoomInstance.behavior.transform,
          C,
        );
      }
    }
    disableZoom() {
      this.canvasD3Selection.call(this.zoomInstance.behavior).on(
        "wheel.zoom",
        null,
      );
    }
    enableZoom() {
      this.canvasD3Selection.call(this.zoomInstance.behavior);
    }
    findHoveredPoint() {
      var t, r, n, i, o;
      if (!this._isMouseOnCanvas) return;
      if (this._findHoveredPointExecutionCount < 2) {
        this._findHoveredPointExecutionCount += 1;
        return;
      }
      this._findHoveredPointExecutionCount = 0, this.points.findHoveredPoint();
      let s = !1, a = !1, l = Pr(this.reglInstance, this.points.hoveredFbo);
      if (l[1]) {
        let d = l[0],
          g = this.graph.getInputIndexBySortedIndex(d),
          w = g !== void 0 ? this.graph.getNodeByIndex(g) : void 0;
        ((t = this.store.hoveredNode) === null || t === void 0
              ? void 0
              : t.node) !== w && (s = !0);
        let C = l[2], Y = l[3];
        this.store.hoveredNode = w && { node: w, index: d, position: [C, Y] };
      }
      else this.store.hoveredNode && (a = !0), this.store.hoveredNode = void 0;
      s && this.store.hoveredNode
      && ((n = (r = this.config.events).onNodeMouseOver) === null
        || n === void 0
        || n.call(
          r,
          this.store.hoveredNode.node,
          this.graph.getInputIndexBySortedIndex(
            this.graph.getSortedIndexById(this.store.hoveredNode.node.id),
          ),
          this.store.hoveredNode.position,
          this.currentEvent,
        )),
        a
        && ((o = (i = this.config.events).onNodeMouseOut) === null
          || o === void 0 || o.call(i, this.currentEvent));
    }
  };
// export { Pd as Graph };
