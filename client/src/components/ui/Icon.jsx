import {
  BookOpen, Calculator, Cpu, Languages, Atom, FlaskConical,
  Leaf, Landmark, BookText, Globe, GraduationCap, Sparkles,
  Microscope, Music, Palette, Dumbbell, Map, Code,
} from 'lucide-react';

// Faqat kerakli ikonkalarni import qilamiz (tree-shaking saqlanadi).
// Backenddan kelgan nom shu yerda bo'lmasa — BookOpen.
const MAP = {
  BookOpen, Calculator, Cpu, Languages, Atom, FlaskConical,
  Leaf, Landmark, BookText, Globe, GraduationCap, Sparkles,
  Microscope, Music, Palette, Dumbbell, Map, Code,
};

export const ICON_NAMES = Object.keys(MAP);

export default function Icon({ name, ...props }) {
  const Cmp = MAP[name] || BookOpen;
  return <Cmp {...props} />;
}
