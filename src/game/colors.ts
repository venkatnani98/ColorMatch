export const COLORS = [
  {id: 'red', label: 'RED', hex: '#E53935', textHex: '#FFFFFF'},
  {id: 'blue', label: 'BLUE', hex: '#1E88E5', textHex: '#FFFFFF'},
  {id: 'green', label: 'GREEN', hex: '#43A047', textHex: '#FFFFFF'},
  {id: 'yellow', label: 'YELLOW', hex: '#FDD835', textHex: '#1F2937'},
  {id: 'purple', label: 'PURPLE', hex: '#8E24AA', textHex: '#FFFFFF'},
  {id: 'orange', label: 'ORANGE', hex: '#FB8C00', textHex: '#1F2937'},
] as const;

export type ColorId = (typeof COLORS)[number]['id'];
export type ColorCount = 4 | 6;

export const colorById: Record<ColorId, (typeof COLORS)[number]> =
  Object.fromEntries(COLORS.map(color => [color.id, color])) as Record<
    ColorId,
    (typeof COLORS)[number]
  >;

export function getColorIds(colorCount: ColorCount): ColorId[] {
  return COLORS.slice(0, colorCount).map(color => color.id);
}

