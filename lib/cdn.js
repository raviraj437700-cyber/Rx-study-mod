const cache = {};
export function loadScript(src) {
  if (!cache[src]) {
    cache[src] = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = () => { delete cache[src]; rej(new Error("Could not load a required library. Check your internet and try again.")); };
      document.head.appendChild(s);
    });
  }
  return cache[src];
        }
