import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

const SIZE = 25;

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function isFinderRegion(x: number, y: number, size: number): 'inner' | 'mid' | 'outer' | null {
  const corners: [number, number][] = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];
  for (const [cx, cy] of corners) {
    const dx = x - cx;
    const dy = y - cy;
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) continue;
    if (dx === 0 || dy === 0 || dx === 6 || dy === 6) return 'outer';
    if (dx === 1 || dy === 1 || dx === 5 || dy === 5) return 'mid';
    if (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) return 'inner';
    return 'mid';
  }
  return null;
}

export function FakeQR({ seed, size = 220 }: { seed: string; size?: number }) {
  const cell = size / SIZE;
  const matrix = useMemo(() => {
    const rng = lcg(hashSeed(seed));
    const grid: boolean[][] = [];
    for (let y = 0; y < SIZE; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < SIZE; x++) {
        row.push(rng() < 0.48);
      }
      grid.push(row);
    }
    return grid;
  }, [seed]);

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, padding: cell / 2 },
      ]}>
      {matrix.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((on, x) => {
            const finder = isFinderRegion(x, y, SIZE);
            let bg = on ? '#000' : 'transparent';
            if (finder === 'outer' || finder === 'inner') bg = '#000';
            else if (finder === 'mid') bg = 'transparent';
            return (
              <View
                key={x}
                style={{
                  width: cell,
                  height: cell,
                  backgroundColor: bg,
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  row: { flexDirection: 'row' },
});
