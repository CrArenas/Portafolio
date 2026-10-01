import {
  siDocker,
  siExpo,
  siJavascript,
  siJenkins,
  siJsonwebtokens,
  siLaravel,
  siMysql,
  siPhp,
  siReact,
} from 'simple-icons';

// Logo de cada tecnología del `stack` de los artículos (simple-icons).
// Una tecnología sin logo aquí se muestra solo con su nombre.
const ICONS = {
  'Laravel':      siLaravel,
  'Blade':        siLaravel, // motor de plantillas de Laravel
  'PHP':          siPhp,
  'MySQL':        siMysql,
  'JWT':          siJsonwebtokens,
  'Docker':       siDocker,
  'Jenkins':      siJenkins,
  'JavaScript':   siJavascript,
  'React Native': siReact,
  'Expo':         siExpo,
};

// Los colores de marca casi negros no se ven sobre el fondo oscuro
const isTooDark = (hex) => {
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.2;
};

export function techLogo(name) {
  const icon = ICONS[name];
  if (!icon) return null;
  return { path: icon.path, color: isTooDark(icon.hex) ? 'var(--parchment)' : `#${icon.hex}` };
}
