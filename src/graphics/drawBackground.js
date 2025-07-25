function getCSSVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function drawBackground(ctx, canvas) {
  const colorStart = getCSSVariable("--color-bg-start");
  const colorEnd = getCSSVariable("--color-bg-end");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
