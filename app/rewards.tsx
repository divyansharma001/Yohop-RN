import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = 'rewards' | 'badges';

type Reward = {
  id: string;
  title: string;
  meta: string;
  cost: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  state: 'redeem' | 'joined' | 'locked' | 'used';
};

const REWARDS: Reward[] = [
  {
    id: '1',
    title: 'Free Cocktail',
    meta: 'Haus Khas Social · valid today',
    cost: 200,
    icon: 'wine-outline',
    iconBg: 'rgba(196,242,127,0.18)',
    iconColor: '#C4F27F',
    state: 'redeem',
  },
  {
    id: '2',
    title: '50 Bounty Points',
    meta: 'Active · 2 friends joined',
    cost: 0,
    icon: 'sparkles-outline',
    iconBg: 'rgba(255,179,0,0.18)',
    iconColor: '#FFB300',
    state: 'joined',
  },
  {
    id: '3',
    title: '20% Off Next Visit',
    meta: 'Across 40+ venues',
    cost: 250,
    icon: 'pricetag-outline',
    iconBg: 'rgba(174,128,255,0.22)',
    iconColor: '#AE80FF',
    state: 'redeem',
  },
  {
    id: '4',
    title: 'Priority Booking',
    meta: 'Skip the wait once',
    cost: 400,
    icon: 'flash-outline',
    iconBg: 'rgba(196,242,127,0.18)',
    iconColor: '#C4F27F',
    state: 'redeem',
  },
];

type Badge = {
  id: string;
  title: string;
  meta: string;
  icon: keyof typeof Ionicons.glyphMap;
  earned: boolean;
};

const BADGES: Badge[] = [
  { id: '1', title: 'Hot Streak', meta: '7 days in a row', icon: 'flame', earned: true },
  { id: '2', title: 'Explorer', meta: '10 venues visited', icon: 'compass', earned: true },
  { id: '3', title: 'Top 10', meta: 'Reach top 10 this month', icon: 'trophy', earned: false },
  { id: '4', title: 'Legend', meta: 'Hit Level 5', icon: 'medal', earned: false },
];

export default function RewardsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('rewards');

  const totalPoints = 2400;
  const goal = 5000;
  const pct = Math.min(100, (totalPoints / goal) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Your Rewards</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.totalValue}>
              {totalPoints.toLocaleString()}
            </Text>
            <Text style={styles.totalLabel}>TOTAL POINTS</Text>
          </View>
          <View style={styles.proBadge}>
            <Ionicons name="diamond" size={10} color="#C4F27F" />
            <Text style={styles.proBadgeText}>Pro Member</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>
            {totalPoints.toLocaleString()} pts
          </Text>
          <Text style={styles.progressLabel}>
            Gold at {goal.toLocaleString()} pts
          </Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'rewards' && styles.tabActive]}
            onPress={() => setTab('rewards')}
            activeOpacity={0.85}>
            <Text
              style={[styles.tabText, tab === 'rewards' && styles.tabTextActive]}>
              Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'badges' && styles.tabActive]}
            onPress={() => setTab('badges')}
            activeOpacity={0.85}>
            <Text
              style={[styles.tabText, tab === 'badges' && styles.tabTextActive]}>
              Badges
            </Text>
          </TouchableOpacity>
        </View>

        {tab === 'rewards' && (
          <View style={{ gap: 10 }}>
            {REWARDS.map((r) => (
              <View key={r.id} style={styles.rewardCard}>
                <View style={[styles.rewardIcon, { backgroundColor: r.iconBg }]}>
                  <Ionicons name={r.icon} size={18} color={r.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardTitle}>{r.title}</Text>
                  <Text style={styles.rewardMeta}>{r.meta}</Text>
                  {r.cost > 0 ? (
                    <Text style={styles.rewardCost}>{r.cost} pts</Text>
                  ) : null}
                </View>
                {r.state === 'redeem' && (
                  <TouchableOpacity style={styles.redeemBtn} activeOpacity={0.85}>
                    <Text style={styles.redeemText}>Redeem</Text>
                  </TouchableOpacity>
                )}
                {r.state === 'joined' && (
                  <View style={styles.joinedPill}>
                    <Text style={styles.joinedText}>Joined</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {tab === 'rewards' && <Text style={styles.badgesHeader}>BADGES EARNED</Text>}

        {(tab === 'badges' || tab === 'rewards') && (
          <View style={styles.badgeGrid}>
            {BADGES.map((b) => (
              <View
                key={b.id}
                style={[styles.badgeCard, !b.earned && styles.badgeCardLocked]}>
                <View
                  style={[
                    styles.badgeIcon,
                    !b.earned && styles.badgeIconLocked,
                  ]}>
                  <Ionicons
                    name={b.icon}
                    size={22}
                    color={b.earned ? '#C4F27F' : 'rgba(255,255,255,0.35)'}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeTitle,
                    !b.earned && { color: 'rgba(255,255,255,0.4)' },
                  ]}>
                  {b.title}
                </Text>
                <Text
                  style={[
                    styles.badgeMeta,
                    !b.earned && { color: 'rgba(255,255,255,0.3)' },
                  ]}>
                  {b.meta}
                </Text>
                {!b.earned && (
                  <View style={styles.lockIcon}>
                    <Ionicons name="lock-closed" size={10} color="rgba(255,255,255,0.4)" />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  scroll: { paddingHorizontal: 18, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  totalValue: {
    color: '#C4F27F',
    fontSize: 30,
    fontWeight: '900',
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(196,242,127,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(196,242,127,0.4)',
  },
  proBadgeText: {
    color: '#C4F27F',
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#C4F27F',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabActive: {
    backgroundColor: '#C4F27F',
    borderColor: '#C4F27F',
  },
  tabText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: { color: '#000' },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  rewardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  rewardMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 2,
  },
  rewardCost: {
    color: '#C4F27F',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  redeemBtn: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C4F27F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  joinedPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,179,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,179,0,0.4)',
  },
  joinedText: {
    color: '#FFB300',
    fontSize: 11,
    fontWeight: '800',
  },
  badgesHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 24,
    marginBottom: 10,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    minHeight: 130,
  },
  badgeCardLocked: {
    opacity: 0.55,
  },
  badgeIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(196,242,127,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(196,242,127,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  badgeIconLocked: {
    backgroundColor: '#1a1a1a',
    borderColor: 'rgba(255,255,255,0.06)',
  },
  badgeTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
