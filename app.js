(function () {
  'use strict';
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Console message */
  try {
    console.log('%cReading the source? Good.%c Creativity. Passion. Results. Let’s talk.\n%chttps://www.linkedin.com/in/markvecchiarelli',
      'font:800 15px Sora,Arial,sans-serif;color:#35C2F0', 'font:500 13px Arial,sans-serif;color:#FF2E93', 'font:12px monospace;color:#8793A0');
  } catch (e) {}

  /* Falling period */
  var dot = document.getElementById('dot');
  if (dot && !rm) {
    dot.addEventListener('click', function () {
      if (dot.classList.contains('fall')) return;
      dot.classList.add('fall');
      setTimeout(function () { dot.classList.remove('fall'); }, 1550);
    });
  }

  /* Tab title */
  var title = document.title;
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? 'Still here. Still passionate.' : title;
  });

  /* Konami code: up up down down left right left right b a */
  var seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var pos = 0, timer = null;
  document.addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = (k === seq[pos]) ? pos + 1 : (k === seq[0] ? 1 : 0);
    if (pos === seq.length) {
      pos = 0;
      var dk = document.querySelector('.dk');
      if (!dk) return;
      dk.classList.add('pink');
      clearTimeout(timer);
      timer = setTimeout(function () { dk.classList.remove('pink'); }, 5000);
    }
  });

  /* Animated gradient (WebGL) */
  var cv = document.getElementById('sh');
  if (!cv) return;
  var gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return;
  var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs = 'precision mediump float;uniform vec2 r;uniform float t;void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.);p+=.3*vec2(sin(p.y*3.+t*.25),cos(p.x*3.-t*.2));float a=.5+.5*sin(p.x*2.2+t*.18+sin(p.y*2.5-t*.15));float b=.5+.5*sin(p.y*2.8-t*.12+sin(p.x*2.+t*.2));float m=smoothstep(.5,1.,a*b+.15*(1.-uv.y));vec3 c1=vec3(.18,.71,.97);vec3 c2=vec3(.035,.265,.525);vec3 col=mix(c2,c1,m);float al=(smoothstep(.2,.9,a)*.34+m*.34)*(.3+.4*uv.y);gl_FragColor=vec4(col*al,al);}';
  function sh(ty, src) { var o = gl.createShader(ty); gl.shaderSource(o, src); gl.compileShader(o); return o; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr); gl.useProgram(pr);
  var bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var lp = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
  var ur = gl.getUniformLocation(pr, 'r'), ut = gl.getUniformLocation(pr, 't');
  function draw(tm) {
    var w = Math.max(2, Math.round(cv.clientWidth * 0.5)), h = Math.max(2, Math.round(cv.clientHeight * 0.5));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(ur, w, h); gl.uniform1f(ut, tm); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  draw(7.0);
  if (rm || !window.IntersectionObserver) return;
  var vis = false, last = 0;
  new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: 0.05 }).observe(cv);
  window.addEventListener('resize', function () { draw(performance.now() / 480); });
  (function loop(ts) {
    requestAnimationFrame(loop);
    if (!vis || document.hidden || ts - last < 33) return;
    last = ts; draw(ts / 480);
  })(0);
})();
