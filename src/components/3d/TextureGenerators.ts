import * as THREE from 'three';

// Cache generated textures so we don't recreate them every frame
const textureCache = new Map<string, THREE.CanvasTexture>();

export function getCrispyBatterTexture(): THREE.CanvasTexture {
  if (textureCache.has('crispy-batter')) {
    return textureCache.get('crispy-batter')!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base golden-amber gradient
  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
  grad.addColorStop(0, '#f59e0b');
  grad.addColorStop(0.5, '#d97706');
  grad.addColorStop(0.8, '#b45309');
  grad.addColorStop(1, '#92400e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Micro-bubble fried pores
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 3.5 + 0.5;
    const opacity = Math.random() * 0.4 + 0.1;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.6 ? `rgba(254, 240, 138, ${opacity})` : `rgba(120, 53, 15, ${opacity})`;
    ctx.fill();
  }

  // Black pepper and mustard seed flecks
  for (let i = 0; i < 280; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.4 ? '#1c1917' : '#15803d';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set('crispy-batter', texture);
  return texture;
}

export function getPavBunTexture(): THREE.CanvasTexture {
  if (textureCache.has('pav-bun')) {
    return textureCache.get('pav-bun')!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Baked golden crust with soft buttery sheen
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#fde68a');
  grad.addColorStop(0.3, '#f59e0b');
  grad.addColorStop(0.7, '#d97706');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft bread crumb texture noise
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.18)' : 'rgba(146, 64, 14, 0.2)';
    ctx.fill();
  }

  // Toasted butter glaze spots
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.random() * 20 + 8, Math.random() * 12 + 4, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180, 83, 9, 0.25)';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('pav-bun', texture);
  return texture;
}

export function getGarlicChutneyPodiTexture(): THREE.CanvasTexture {
  if (textureCache.has('garlic-podi')) {
    return textureCache.get('garlic-podi')!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 256, 256);

  // Fiery red coarse podi powder & roasted garlic flakes
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 2 + 0.5, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.7 ? '#fef08a' : Math.random() > 0.4 ? '#991b1b' : '#b91c1c';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('garlic-podi', texture);
  return texture;
}

export function getNormalNoiseTexture(): THREE.CanvasTexture {
  if (textureCache.has('normal-noise')) {
    return textureCache.get('normal-noise')!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Normal map base: RGB (128, 128, 255)
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.floor(128 + (Math.random() * 60 - 30));
    const g = Math.floor(128 + (Math.random() * 60 - 30));
    ctx.fillStyle = `rgb(${r}, ${g}, 255)`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('normal-noise', texture);
  return texture;
}
