module.exports = "var PF=function(){var e=function(t,n){var r=e.resolve(t,n||\"/\"),i=e.modules[r];if(!i)throw new Error(\"Failed to resolve module \"+t+\", tried \"+r);var s=i._cached?i._cached:i();return s};return e.paths=[],e.modules={},e.extensions=[\".js\",\".coffee\"],e._core={assert:!0,events:!0,fs:!0,path:!0,vm:!0},e.resolve=function(){return function(t,n){function u(t){if(e.modules[t])return t;for(var n=0;n<e.extensions.length;n++){var r=e.extensions[n];if(e.modules[t+r])return t+r}}function a(t){t=t.replace(/\\/+$/,\"\");var n=t+\"/package.json\";if(e.modules[n]){var i=e.modules[n](),s=i.browserify;if(typeof s==\"object\"&&s.main){var o=u(r.resolve(t,s.main));if(o)return o}else if(typeof s==\"string\"){var o=u(r.resolve(t,s));if(o)return o}else if(i.main){var o=u(r.resolve(t,i.main));if(o)return o}}return u(t+\"/index\")}function f(e,t){var n=l(t);for(var r=0;r<n.length;r++){var i=n[r],s=u(i+\"/\"+e);if(s)return s;var o=a(i+\"/\"+e);if(o)return o}var s=u(e);if(s)return s}function l(e){var t;e===\"/\"?t=[\"\"]:t=r.normalize(e).split(\"/\");var n=[];for(var i=t.length-1;i>=0;i--){if(t[i]===\"node_modules\")continue;var s=t.slice(0,i+1).join(\"/\")+\"/node_modules\";n.push(s)}return n}n||(n=\"/\");if(e._core[t])return t;var r=e.modules.path();n=r.resolve(\"/\",n);var i=n||\"/\";if(t.match(/^(?:\\.\\.?\\/|\\/)/)){var s=u(r.resolve(i,t))||a(r.resolve(i,t));if(s)return s}var o=f(t,i);if(o)return o;throw new Error(\"Cannot find module '\"+t+\"'\")}}(),e.alias=function(t,n){var r=e.modules.path(),i=null;try{i=e.resolve(t+\"/package.json\",\"/\")}catch(s){i=e.resolve(t,\"/\")}var o=r.dirname(i),u=(Object.keys||function(e){var t=[];for(var n in e)t.push(n);return t})(e.modules);for(var a=0;a<u.length;a++){var f=u[a];if(f.slice(0,o.length+1)===o+\"/\"){var l=f.slice(o.length);e.modules[n+l]=e.modules[o+l]}else f===o&&(e.modules[n]=e.modules[o])}},e.define=function(t,n){var r=e._core[t]?\"\":e.modules.path().dirname(t),i=function(t){return e(t,r)};i.resolve=function(t){return e.resolve(t,r)},i.modules=e.modules,i.define=e.define;var s={exports:{}};e.modules[t]=function(){return e.modules[t]._cached=s.exports,n.call(s.exports,i,s,s.exports,r,t),e.modules[t]._cached=s.exports,s.exports}},typeof process==\"undefined\"&&(process={}),process.nextTick||(process.nextTick=function(){var e=[],t=typeof window!=\"undefined\"&&window.postMessage&&window.addEventListener;return t&&window.addEventListener(\"message\",function(t){if(t.source===window&&t.data===\"browserify-tick\"){t.stopPropagation();if(e.length>0){var n=e.shift();n()}}},!0),function(n){t?(e.push(n),window.postMessage(\"browserify-tick\",\"*\")):setTimeout(n,0)}}()),process.title||(process.title=\"browser\"),process.binding||(process.binding=function(t){if(t===\"evals\")return e(\"vm\");throw new Error(\"No such module\")}),process.cwd||(process.cwd=function(){return\".\"}),process.env||(process.env={}),process.argv||(process.argv=[]),e.define(\"path\",function(e,t,n,r,i){function s(e,t){var n=[];for(var r=0;r<e.length;r++)t(e[r],r,e)&&n.push(e[r]);return n}function o(e,t){var n=0;for(var r=e.length;r>=0;r--){var i=e[r];i==\".\"?e.splice(r,1):i===\"..\"?(e.splice(r,1),n++):n&&(e.splice(r,1),n--)}if(t)for(;n--;n)e.unshift(\"..\");return e}var u=/^(.+\\/(?!$)|\\/)?((?:.+?)?(\\.[^.]*)?)$/;n.resolve=function(){var e=\"\",t=!1;for(var n=arguments.length;n>=-1&&!t;n--){var r=n>=0?arguments[n]:process.cwd();if(typeof r!=\"string\"||!r)continue;e=r+\"/\"+e,t=r.charAt(0)===\"/\"}return e=o(s(e.split(\"/\"),function(e){return!!e}),!t).join(\"/\"),(t?\"/\":\"\")+e||\".\"},n.normalize=function(e){var t=e.charAt(0)===\"/\",n=e.slice(-1)===\"/\";return e=o(s(e.split(\"/\"),function(e){return!!e}),!t).join(\"/\"),!e&&!t&&(e=\".\"),e&&n&&(e+=\"/\"),(t?\"/\":\"\")+e},n.join=function(){var e=Array.prototype.slice.call(arguments,0);return n.normalize(s(e,function(e,t){return e&&typeof e==\"string\"}).join(\"/\"))},n.dirname=function(e){var t=u.exec(e)[1]||\"\",n=!1;return t?t.length===1||n&&t.length<=3&&t.charAt(1)===\":\"?t:t.substring(0,t.length-1):\".\"},n.basename=function(e,t){var n=u.exec(e)[2]||\"\";return t&&n.substr(-1*t.length)===t&&(n=n.substr(0,n.length-t.length)),n},n.extname=function(e){return u.exec(e)[3]||\"\"}}),e.define(\"/core/Node.js\",function(e,t,n,r,i){function s(e,t,n){this.x=e,this.y=t,this.walkable=n===undefined?!0:n}t.exports=s}),e.define(\"/core/Grid.js\",function(e,t,n,r,i){function o(e,t,n){this.width=e,this.height=t,this.nodes=this._buildNodes(e,t,n)}var s=e(\"./Node\");o.prototype._buildNodes=function(e,t,n){var r,i,o=new Array(t),u;for(r=0;r<t;++r){o[r]=new Array(e);for(i=0;i<e;++i)o[r][i]=new s(i,r)}if(n===undefined)return o;if(n.length!==t||n[0].length!==e)throw new Error(\"Matrix size does not fit\");for(r=0;r<t;++r)for(i=0;i<e;++i)n[r][i]&&(o[r][i].walkable=!1);return o},o.prototype.getNodeAt=function(e,t){return this.nodes[t][e]},o.prototype.isWalkableAt=function(e,t){return this.isInside(e,t)&&this.nodes[t][e].walkable},o.prototype.isInside=function(e,t){return e>=0&&e<this.width&&t>=0&&t<this.height},o.prototype.setWalkableAt=function(e,t,n){this.nodes[t][e].walkable=n},o.prototype.getNeighbors=function(e,t,n){var r=e.x,i=e.y,s=[],o=!1,u=!1,a=!1,f=!1,l=!1,c=!1,h=!1,p=!1,d=this.nodes;return this.isWalkableAt(r,i-1)&&(s.push(d[i-1][r]),o=!0),this.isWalkableAt(r+1,i)&&(s.push(d[i][r+1]),a=!0),this.isWalkableAt(r,i+1)&&(s.push(d[i+1][r]),l=!0),this.isWalkableAt(r-1,i)&&(s.push(d[i][r-1]),h=!0),t?(n?(u=h&&o,f=o&&a,c=a&&l,p=l&&h):(u=h||o,f=o||a,c=a||l,p=l||h),u&&this.isWalkableAt(r-1,i-1)&&s.push(d[i-1][r-1]),f&&this.isWalkableAt(r+1,i-1)&&s.push(d[i-1][r+1]),c&&this.isWalkableAt(r+1,i+1)&&s.push(d[i+1][r+1]),p&&this.isWalkableAt(r-1,i+1)&&s.push(d[i+1][r-1]),s):s},o.prototype.clone=function(){var e,t,n=this.width,r=this.height,i=this.nodes,u=new o(n,r),a=new Array(r),f;for(e=0;e<r;++e){a[e]=new Array(n);for(t=0;t<n;++t)a[e][t]=new s(t,e,i[e][t].walkable)}return u.nodes=a,u},t.exports=o}),e.define(\"/core/Heap.js\",function(e,t,n,r,i){(function(){var e,n,r,i,s,o,u,a,f,l,c,h,p,d,v;r=Math.floor,l=Math.min,n=function(e,t){return e<t?-1:e>t?1:0},f=function(e,t,i,s,o){var u;i==null&&(i=0),o==null&&(o=n);if(i<0)throw new Error(\"lo must be non-negative\");s==null&&(s=e.length);while(o(i,s)<0)u=r((i+s)/2),o(t,e[u])<0?s=u:i=u+1;return[].splice.apply(e,[i,i-i].concat(t)),t},o=function(e,t,r){return r==null&&(r=n),e.push(t),d(e,0,e.length-1,r)},s=function(e,t){var r,i;return t==null&&(t=n),r=e.pop(),e.length?(i=e[0],e[0]=r,v(e,0,t)):i=r,i},a=function(e,t,r){var i;return r==null&&(r=n),i=e[0],e[0]=t,v(e,0,r),i},u=function(e,t,r){var i;return r==null&&(r=n),e.length&&r(e[0],t)<0&&(i=[e[0],t],t=i[0],e[0]=i[1],v(e,0,r)),t},i=function(e,t){var i,s,o,u,a,f,l,c;t==null&&(t=n),f=function(){c=[];for(var t=0,n=r(e.length/2);0<=n?t<n:t>n;0<=n?t++:t--)c.push(t);return c}.apply(this).reverse(),l=[];for(s=0,u=f.length;s<u;s++)i=f[s],l.push(v(e,i,t));return l},p=function(e,t,r){var i;return r==null&&(r=n),i=e.indexOf(t),d(e,0,i,r),v(e,i,r)},c=function(e,t,r){var s,o,a,f,l;r==null&&(r=n),o=e.slice(0,t);if(!o.length)return o;i(o,r),l=e.slice(t);for(a=0,f=l.length;a<f;a++)s=l[a],u(o,s,r);return o.sort(r).reverse()},h=function(e,t,r){var o,u,a,c,h,p,d,v,m,g;r==null&&(r=n);if(t*10<=e.length){c=e.slice(0,t).sort(r);if(!c.length)return c;a=c[c.length-1],v=e.slice(t);for(h=0,d=v.length;h<d;h++)o=v[h],r(o,a)<0&&(f(c,o,0,null,r),c.pop(),a=c[c.length-1]);return c}i(e,r),g=[];for(u=p=0,m=l(t,e.length);0<=m?p<m:p>m;u=0<=m?++p:--p)g.push(s(e,r));return g},d=function(e,t,r,i){var s,o,u;i==null&&(i=n),s=e[r];while(r>t){u=r-1>>1,o=e[u];if(i(s,o)<0){e[r]=o,r=u;continue}break}return e[r]=s},v=function(e,t,r){var i,s,o,u,a;r==null&&(r=n),s=e.length,a=t,o=e[t],i=2*t+1;while(i<s)u=i+1,u<s&&!(r(e[i],e[u])<0)&&(i=u),e[t]=e[i],t=i,i=2*t+1;return e[t]=o,d(e,a,t,r)},e=function(){function e(e){this.cmp=e!=null?e:n,this.nodes=[]}return e.name=\"Heap\",e.push=o,e.pop=s,e.replace=a,e.pushpop=u,e.heapify=i,e.nlargest=c,e.nsmallest=h,e.prototype.push=function(e){return o(this.nodes,e,this.cmp)},e.prototype.pop=function(){return s(this.nodes,this.cmp)},e.prototype.peek=function(){return this.nodes[0]},e.prototype.contains=function(e){return this.nodes.indexOf(e)!==-1},e.prototype.replace=function(e){return a(this.nodes,e,this.cmp)},e.prototype.pushpop=function(e){return u(this.nodes,e,this.cmp)},e.prototype.heapify=function(){return i(this.nodes,this.cmp)},e.prototype.updateItem=function(e){return p(this.nodes,e,this.cmp)},e.prototype.clear=function(){return this.nodes=[]},e.prototype.empty=function(){return this.nodes.length===0},e.prototype.size=function(){return this.nodes.length},e.prototype.clone=function(){var t;return t=new e,t.nodes=this.nodes.slice(0),t},e.prototype.toArray=function(){return this.nodes.slice(0)},e.prototype.insert=e.prototype.push,e.prototype.remove=e.prototype.pop,e.prototype.top=e.prototype.peek,e.prototype.front=e.prototype.peek,e.prototype.has=e.prototype.contains,e.prototype.copy=e.prototype.clone,e}(),(typeof t!=\"undefined\"&&t!==null?t.exports:void 0)?t.exports=e:window.Heap=e}).call(this)}),e.define(\"/core/Util.js\",function(e,t,n,r,i){function s(e){var t=[[e.x,e.y]];while(e.parent)e=e.parent,t.push([e.x,e.y]);return t.reverse()}function o(e,t){var n=s(e),r=s(t);return n.concat(r.reverse())}function u(e){var t,n=0,r,i,s,o;for(t=1;t<e.length;++t)r=e[t-1],i=e[t],s=r[0]-i[0],o=r[1]-i[1],n+=Math.sqrt(s*s+o*o);return n}function a(e,t,n,r){var i=Math.abs,s=[],o,u,a,f,l,c;a=i(n-e),f=i(r-t),o=e<n?1:-1,u=t<r?1:-1,l=a-f;for(;;){s.push([e,t]);if(e===n&&t===r)break;c=2*l,c>-f&&(l-=f,e+=o),c<a&&(l+=a,t+=u)}return s}function f(e,t){var n=t.length,r=t[0][0],i=t[0][1],s=t[n-1][0],o=t[n-1][1],u,f,l,c,h,p,d,v,m,g,y,b,w;u=r,f=i,h=t[1][0],p=t[1][1],d=[[u,f]];for(v=2;v<n;++v){g=t[v],l=g[0],c=g[1],y=a(u,f,l,c),w=!1;for(m=1;m<y.length;++m){b=y[m];if(!e.isWalkableAt(b[0],b[1])){w=!0,d.push([h,p]),u=h,f=p;break}}w||(h=l,p=c)}return d.push([s,o]),d}n.backtrace=s,n.biBacktrace=o,n.pathLength=u,n.getLine=a,n.smoothenPath=f}),e.define(\"/core/Heuristic.js\",function(e,t,n,r,i){t.exports={manhattan:function(e,t){return e+t},euclidean:function(e,t){return Math.sqrt(e*e+t*t)},chebyshev:function(e,t){return Math.max(e,t)}}}),e.define(\"/finders/AStarFinder.js\",function(e,t,n,r,i){function a(e){e=e||{},this.allowDiagonal=e.allowDiagonal,this.dontCrossCorners=e.dontCrossCorners,this.heuristic=e.heuristic||u.manhattan}var s=e(\"../core/Heap\"),o=e(\"../core/Util\"),u=e(\"../core/Heuristic\");a.prototype.findPath=function(e,t,n,r,i){var u=new s(function(e,t){return e.f-t.f}),a=i.getNodeAt(e,t),f=i.getNodeAt(n,r),l=this.heuristic,c=this.allowDiagonal,h=this.dontCrossCorners,p=Math.abs,d=Math.SQRT2,v,m,g,y,b,w,E,S;a.g=0,a.f=0,u.push(a),a.opened=!0;while(!u.empty()){v=u.pop(),v.closed=!0;if(v===f)return o.backtrace(f);m=i.getNeighbors(v,c,h);for(y=0,b=m.length;y<b;++y){g=m[y];if(g.closed)continue;w=g.x,E=g.y,S=v.g+(w-v.x===0||E-v.y===0?1:d);if(!g.opened||S<g.g)g.g=S,g.h=g.h||l(p(w-n),p(E-r)),g.f=g.g+g.h,g.parent=v,g.opened?u.updateItem(g):(u.push(g),g.opened=!0)}}return[]},t.exports=a}),e.define(\"/finders/BestFirstFinder.js\",function(e,t,n,r,i){function o(e){s.call(this,e);var t=this.heuristic;this.heuristic=function(e,n){return t(e,n)*1e6}}var s=e(\"./AStarFinder\");o.prototype=new s,o.prototype.constructor=o,t.exports=o}),e.define(\"/finders/BreadthFirstFinder.js\",function(e,t,n,r,i){function o(e){e=e||{},this.allowDiagonal=e.allowDiagonal,this.dontCrossCorners=e.dontCrossCorners}var s=e(\"../core/Util\");o.prototype.findPath=function(e,t,n,r,i){var o=[],u=this.allowDiagonal,a=this.dontCrossCorners,f=i.getNodeAt(e,t),l=i.getNodeAt(n,r),c,h,p,d,v;o.push(f),f.opened=!0;while(o.length){p=o.shift(),p.closed=!0;if(p===l)return s.backtrace(l);c=i.getNeighbors(p,u,a);for(d=0,v=c.length;d<v;++d){h=c[d];if(h.closed||h.opened)continue;o.push(h),h.opened=!0,h.parent=p}}return[]},t.exports=o}),e.define(\"/finders/DijkstraFinder.js\",function(e,t,n,r,i){function o(e){s.call(this,e),this.heuristic=function(e,t){return 0}}var s=e(\"./AStarFinder\");o.prototype=new s,o.prototype.constructor=o,t.exports=o}),e.define(\"/finders/BiAStarFinder.js\",function(e,t,n,r,i){function a(e){e=e||{},this.allowDiagonal=e.allowDiagonal,this.dontCrossCorners=e.dontCrossCorners,this.heuristic=e.heuristic||u.manhattan}var s=e(\"../core/Heap\"),o=e(\"../core/Util\"),u=e(\"../core/Heuristic\");a.prototype.findPath=function(e,t,n,r,i){var u=function(e,t){return e.f-t.f},a=new s(u),f=new s(u),l=i.getNodeAt(e,t),c=i.getNodeAt(n,r),h=this.heuristic,p=this.allowDiagonal,d=this.dontCrossCorners,v=Math.abs,m=Math.SQRT2,g,y,b,w,E,S,x,T,N=1,C=2;l.g=0,l.f=0,a.push(l),l.opened=N,c.g=0,c.f=0,f.push(c),c.opened=C;while(!a.empty()&&!f.empty()){g=a.pop(),g.closed=!0,y=i.getNeighbors(g,p,d);for(w=0,E=y.length;w<E;++w){b=y[w];if(b.closed)continue;if(b.opened===C)return o.biBacktrace(g,b);S=b.x,x=b.y,T=g.g+(S-g.x===0||x-g.y===0?1:m);if(!b.opened||T<b.g)b.g=T,b.h=b.h||h(v(S-n),v(x-r)),b.f=b.g+b.h,b.parent=g,b.opened?a.updateItem(b):(a.push(b),b.opened=N)}g=f.pop(),g.closed=!0,y=i.getNeighbors(g,p,d);for(w=0,E=y.length;w<E;++w){b=y[w];if(b.closed)continue;if(b.opened===N)return o.biBacktrace(b,g);S=b.x,x=b.y,T=g.g+(S-g.x===0||x-g.y===0?1:m);if(!b.opened||T<b.g)b.g=T,b.h=b.h||h(v(S-e),v(x-t)),b.f=b.g+b.h,b.parent=g,b.opened?f.updateItem(b):(f.push(b),b.opened=C)}}return[]},t.exports=a}),e.define(\"/finders/BiBestFirstFinder.js\",function(e,t,n,r,i){function o(e){s.call(this,e);var t=this.heuristic;this.heuristic=function(e,n){return t(e,n)*1e6}}var s=e(\"./BiAStarFinder\");o.prototype=new s,o.prototype.constructor=o,t.exports=o}),e.define(\"/finders/BiBreadthFirstFinder.js\",function(e,t,n,r,i){function o(e){e=e||{},this.allowDiagonal=e.allowDiagonal,this.dontCrossCorners=e.dontCrossCorners}var s=e(\"../core/Util\");o.prototype.findPath=function(e,t,n,r,i){var o=i.getNodeAt(e,t),u=i.getNodeAt(n,r),a=[],f=[],l,c,h,p=this.allowDiagonal,d=this.dontCrossCorners,v=0,m=1,g,y;a.push(o),o.opened=!0,o.by=v,f.push(u),u.opened=!0,u.by=m;while(a.length&&f.length){h=a.shift(),h.closed=!0,l=i.getNeighbors(h,p,d);for(g=0,y=l.length;g<y;++g){c=l[g];if(c.closed)continue;if(c.opened){if(c.by===m)return s.biBacktrace(h,c);continue}a.push(c),c.parent=h,c.opened=!0,c.by=v}h=f.shift(),h.closed=!0,l=i.getNeighbors(h,p,d);for(g=0,y=l.length;g<y;++g){c=l[g];if(c.closed)continue;if(c.opened){if(c.by===v)return s.biBacktrace(c,h);continue}f.push(c),c.parent=h,c.opened=!0,c.by=m}}return[]},t.exports=o}),e.define(\"/finders/BiDijkstraFinder.js\",function(e,t,n,r,i){function o(e){s.call(this,e),this.heuristic=function(e,t){return 0}}var s=e(\"./BiAStarFinder\");o.prototype=new s,o.prototype.constructor=o,t.exports=o}),e.define(\"/finders/JumpPointFinder.js\",function(e,t,n,r,i){function a(e){e=e||{},this.heuristic=e.heuristic||u.manhattan}var s=e(\"../core/Heap\"),o=e(\"../core/Util\"),u=e(\"../core/Heuristic\");a.prototype.findPath=function(e,t,n,r,i){var u=this.openList=new s(function(e,t){return e.f-t.f}),a=this.startNode=i.getNodeAt(e,t),f=this.endNode=i.getNodeAt(n,r),l;this.grid=i,a.g=0,a.f=0,u.push(a),a.opened=!0;while(!u.empty()){l=u.pop(),l.closed=!0;if(l===f)return o.backtrace(f);this._identifySuccessors(l)}return[]},a.prototype._identifySuccessors=function(e){var t=this.grid,n=this.heuristic,r=this.openList,i=this.endNode.x,s=this.endNode.y,o,a,f,l,c,h=e.x,p=e.y,d,v,m,g,y,b,w,E=Math.abs,S=Math.max;o=this._findNeighbors(e);for(l=0,c=o.length;l<c;++l){a=o[l],f=this._jump(a[0],a[1],h,p);if(f){d=f[0],v=f[1],w=t.getNodeAt(d,v);if(w.closed)continue;y=u.euclidean(E(d-h),E(v-p)),b=e.g+y;if(!w.opened||b<w.g)w.g=b,w.h=w.h||n(E(d-i),E(v-s)),w.f=w.g+w.h,w.parent=e,w.opened?r.updateItem(w):(r.push(w),w.opened=!0)}}},a.prototype._jump=function(e,t,n,r){var i=this.grid,s=e-n,o=t-r,u,a;if(!i.isWalkableAt(e,t))return null;if(i.getNodeAt(e,t)===this.endNode)return[e,t];if(s!==0&&o!==0){if(i.isWalkableAt(e-s,t+o)&&!i.isWalkableAt(e-s,t)||i.isWalkableAt(e+s,t-o)&&!i.isWalkableAt(e,t-o))return[e,t]}else if(s!==0){if(i.isWalkableAt(e+s,t+1)&&!i.isWalkableAt(e,t+1)||i.isWalkableAt(e+s,t-1)&&!i.isWalkableAt(e,t-1))return[e,t]}else if(i.isWalkableAt(e+1,t+o)&&!i.isWalkableAt(e+1,t)||i.isWalkableAt(e-1,t+o)&&!i.isWalkableAt(e-1,t))return[e,t];if(s!==0&&o!==0){u=this._jump(e+s,t,e,t),a=this._jump(e,t+o,e,t);if(u||a)return[e,t]}return i.isWalkableAt(e+s,t)||i.isWalkableAt(e,t+o)?this._jump(e+s,t+o,e,t):null},a.prototype._findNeighbors=function(e){var t=e.parent,n=e.x,r=e.y,i=this.grid,s,o,u,a,f,l,c=[],h,p,d,v;if(t)s=t.x,o=t.y,f=(n-s)/Math.max(Math.abs(n-s),1),l=(r-o)/Math.max(Math.abs(r-o),1),f!==0&&l!==0?(i.isWalkableAt(n,r+l)&&c.push([n,r+l]),i.isWalkableAt(n+f,r)&&c.push([n+f,r]),(i.isWalkableAt(n,r+l)||i.isWalkableAt(n+f,r))&&c.push([n+f,r+l]),!i.isWalkableAt(n-f,r)&&i.isWalkableAt(n,r+l)&&c.push([n-f,r+l]),!i.isWalkableAt(n,r-l)&&i.isWalkableAt(n+f,r)&&c.push([n+f,r-l])):f===0?i.isWalkableAt(n,r+l)&&(i.isWalkableAt(n,r+l)&&c.push([n,r+l]),i.isWalkableAt(n+1,r)||c.push([n+1,r+l]),i.isWalkableAt(n-1,r)||c.push([n-1,r+l])):i.isWalkableAt(n+f,r)&&(i.isWalkableAt(n+f,r)&&c.push([n+f,r]),i.isWalkableAt(n,r+1)||c.push([n+f,r+1]),i.isWalkableAt(n,r-1)||c.push([n+f,r-1]));else{h=i.getNeighbors(e,!0);for(d=0,v=h.length;d<v;++d)p=h[d],c.push([p.x,p.y])}return c},t.exports=a}),e.define(\"/PathFinding.js\",function(e,t,n,r,i){t.exports={Node:e(\"./core/Node\"),Grid:e(\"./core/Grid\"),Heap:e(\"./core/Heap\"),Util:e(\"./core/Util\"),Heuristic:e(\"./core/Heuristic\"),AStarFinder:e(\"./finders/AStarFinder\"),BestFirstFinder:e(\"./finders/BestFirstFinder\"),BreadthFirstFinder:e(\"./finders/BreadthFirstFinder\"),DijkstraFinder:e(\"./finders/DijkstraFinder\"),BiAStarFinder:e(\"./finders/BiAStarFinder\"),BiBestFirstFinder:e(\"./finders/BiBestFirstFinder\"),BiBreadthFirstFinder:e(\"./finders/BiBreadthFirstFinder\"),BiDijkstraFinder:e(\"./finders/BiDijkstraFinder\"),JumpPointFinder:e(\"./finders/JumpPointFinder\")}}),e(\"/PathFinding.js\"),e(\"/PathFinding\")}()"