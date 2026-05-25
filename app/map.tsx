import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type MapMode = 'standard' | 'dark' | 'satellite';
type TopTab = 'Hot Spots' | 'Leaderboard' | 'Friends';

const MAP_BACKGROUNDS: Record<MapMode, string> = {
  standard:
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=900&q=80',
  dark: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=900&q=80',
  satellite:
    'https://images.unsplash.com/photo-1495751171079-15ce9bbf4ddb?w=900&q=80',
};

type Friend = { id: string; xPct: number; yPct: number; avatar: string; size: number };
const FRIENDS: Friend[] = [
  {
    id: '1',
    xPct: 0.62,
    yPct: 0.22,
    size: 56,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    id: '2',
    xPct: 0.32,
    yPct: 0.34,
    size: 64,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
  {
    id: '3',
    xPct: 0.50,
    yPct: 0.42,
    size: 72,
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
  {
    id: '4',
    xPct: 0.20,
    yPct: 0.58,
    size: 56,
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
  },
  {
    id: '5',
    xPct: 0.70,
    yPct: 0.62,
    size: 60,
    avatar:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&q=80',
  },
  {
    id: '6',
    xPct: 0.42,
    yPct: 0.78,
    size: 60,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  },
];

const FILTER_CHIPS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'visited', label: 'Visited', icon: 'time-outline' },
  { key: 'popular', label: 'Popular', icon: 'people-outline' },
  { key: 'favorites', label: 'Favorites', icon: 'heart-outline' },
  { key: 'restaurants', label: 'Restaurants', icon: 'restaurant-outline' },
];

export default function MapScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TopTab>('Friends');
  const [mode, setMode] = useState<MapMode>('standard');
  const [activeChips, setActiveChips] = useState<Record<string, boolean>>({});

  const toggleChip = (k: string) =>
    setActiveChips((s) => ({ ...s, [k]: !s[k] }));

  const cycleMode = () => {
    setMode((m) =>
      m === 'standard' ? 'dark' : m === 'dark' ? 'satellite' : 'standard',
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <Image
        source={{ uri: MAP_BACKGROUNDS[mode] }}
        style={styles.mapBg}
        resizeMode="cover"
      />
      <View
        style={[
          styles.mapTint,
          mode === 'dark' && { backgroundColor: 'rgba(0,0,0,0.55)' },
          mode === 'standard' && { backgroundColor: 'rgba(15,30,60,0.45)' },
          mode === 'satellite' && { backgroundColor: 'rgba(0,0,0,0.15)' },
        ]}
      />

      {FRIENDS.map((f) => (
        <View
          key={f.id}
          style={[
            styles.bubble,
            {
              width: f.size,
              height: f.size,
              borderRadius: f.size / 2,
              left: f.xPct * SCREEN_W - f.size / 2,
              top: f.yPct * SCREEN_H - f.size / 2,
            },
          ]}>
          <Image source={{ uri: f.avatar }} style={styles.bubbleImg} />
        </View>
      ))}

      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.tabsBar}>
          {(['Hot Spots', 'Leaderboard', 'Friends'] as TopTab[]).map((t) => (
            <TouchableOpacity
              key={t}
              activeOpacity={0.85}
              onPress={() => {
                setTab(t);
                if (t === 'Hot Spots') {
                  router.push('/hotspots');
                } else if (t === 'Leaderboard') {
                  router.push({ pathname: '/hotspots', params: { tab: 'Leaderboard' } });
                }
              }}
              style={[styles.topTab, tab === t && styles.topTabActive]}>
              <Text style={[styles.topTabText, tab === t && styles.topTabTextActive]}>
                {t}
              </Text>
              {t === 'Friends' && (
                <View style={styles.friendsBadge}>
                  <Text style={styles.friendsBadgeText}>4</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}>
          {FILTER_CHIPS.map((c) => {
            const active = !!activeChips[c.key];
            return (
              <TouchableOpacity
                key={c.key}
                activeOpacity={0.85}
                onPress={() => toggleChip(c.key)}
                style={[styles.chip, active && styles.chipActive]}>
                <Ionicons
                  name={c.icon}
                  size={12}
                  color={active ? '#000' : '#fff'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={[styles.chip, styles.chipMore]} activeOpacity={0.85}>
            <Ionicons name="ellipsis-horizontal" size={14} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.rightControls}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={cycleMode}>
          <MaterialCommunityIcons name="satellite-variant" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
          <Ionicons name="speedometer-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabPrimary]} activeOpacity={0.85}>
          <Ionicons name="navigate" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomLeft}>
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.85}>
          <Ionicons name="search" size={16} color="#fff" />
          <View style={styles.searchDot} />
        </TouchableOpacity>
        <View style={styles.recentAvatars}>
          {FRIENDS.slice(0, 3).map((f, i) => (
            <Image
              key={f.id}
              source={{ uri: f.avatar }}
              style={[styles.recentAvatar, { marginLeft: i === 0 ? 0 : -10 }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a1428' },
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_W,
    height: SCREEN_H,
  },
  mapTint: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  tabsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.55)',
    marginHorizontal: 14,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
  },
  topTabActive: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  topTabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  topTabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  friendsBadge: {
    backgroundColor: '#C4F27F',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendsBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
  },
  chipsRow: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipActive: {
    backgroundColor: '#C4F27F',
    borderColor: '#C4F27F',
  },
  chipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#000',
  },
  chipMore: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bubble: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  bubbleImg: {
    width: '100%',
    height: '100%',
  },
  rightControls: {
    position: 'absolute',
    right: 12,
    bottom: 130,
    gap: 10,
  },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  fabPrimary: {
    backgroundColor: '#C4F27F',
    borderColor: '#C4F27F',
  },
  bottomLeft: {
    position: 'absolute',
    left: 14,
    bottom: 110,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchDot: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4F27F',
  },
  recentAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
