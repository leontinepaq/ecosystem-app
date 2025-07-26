export const sprites = {};

const spriteNames = ["chicken", "fox", "snake"];

export function loadSprites(onComplete) {
  let loaded = 0;
  spriteNames.forEach((name) => {
    const img = new Image();
    img.src = `/assets/images/${name}.png`;
    img.onload = () => {
      loaded++;
      if (loaded === spriteNames.length && onComplete) {
        onComplete();
      }
    };
    img.onerror = () => {
      console.error(`❌ Failed to load ${img.src}`);
    };
    sprites[name] = img;
  });
}
