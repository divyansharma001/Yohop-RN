import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DealState = 'live' | 'paused' | 'ended';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function DealStatusScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const dealName = name || 'Get it while 60% OFF';

  const totalDurationSec = 60 * 60; // 1 hour
  const [secondsLeft, setSecondsLeft] = useState(53 * 60 + 54);
  const [state, setState] = useState<DealState>('live');
  const [redeemed, setRedeemed] = useState(8);
  const maxRedemptions = 50;

  useEffect(() => {
    if (state !== 'live') return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setState('ended');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (state !== 'live') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, pulse]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 0.25],
  });

  const progress = useMemo(
    () => (totalDurationSec - secondsLeft) / totalDurationSec,
    [secondsLeft, totalDurationSec],
  );

  const ringSize = 220;
  const ringStroke = 8;
  const dotPositions = useMemo(() => {
    return new Array(12).fill(0).map((_, i) => i / 12);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.8}
          onPress={() => router.replace('/(merchant)' as never)}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Live Deal</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.bigTitle}>{dealName}</Text>

        <View style={styles.statusPillRow}>
          <View
            style={[
              styles.statusPill,
              state === 'live' && styles.statusPillLive,
              state === 'paused' && styles.statusPillPaused,
              state === 'ended' && styles.statusPillEnded,
            ]}>
            <View
              style={[
                styles.statusDot,
                state === 'live' && styles.statusDotLive,
                state === 'paused' && styles.statusDotPaused,
                state === 'ended' && styles.statusDotEnded,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                state === 'live' && styles.statusTextLive,
                state === 'paused' && styles.statusTextPaused,
                state === 'ended' && styles.statusTextEnded,
              ]}>
              {state === 'live' ? 'LIVE' : state === 'paused' ? 'PAUSED' : 'ENDED'}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          Free drink with every order. Dine-in only. Valid today — limited
          redemptions available.
        </Text>

        <View style={styles.expiresRow}>
          <Ionicons name="time-outline" size={13} color="#C4F27F" />
          <Text style={styles.expiresText}>
            Expires in 1 hour · Free drink reward active
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>VIEWS</Text>
            <Text style={styles.statValue}>158</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>CHECK-INS</Text>
            <Text style={styles.statValue}>57</Text>
          </View>
        </View>

        <View style={[styles.ringWrap, { width: ringSize, height: ringSize }]}>
          <View
            style={[
              styles.ringTrack,
              { width: ringSize, height: ringSize, borderRadius: ringSize / 2 },
            ]}
          />
          {dotPositions.map((p, i) => {
            const angle = p * Math.PI * 2 - Math.PI / 2;
            const radius = (ringSize - ringStroke - 8) / 2;
            const x = Math.cos(angle) * radius + ringSize / 2 - 4;
            const y = Math.sin(angle) * radius + ringSize / 2 - 4;
            const active = p <= progress;
            return (
              <View
                key={i}
                style={[
                  styles.ringDot,
                  active && styles.ringDotActive,
                  { left: x, top: y },
                ]}
              />
            );
          })}
          <View style={styles.ringCenter}>
            <Text style={styles.timeLeftLabel}>TIME LEFT</Text>
            <Text style={styles.timeLeftValue}>{formatTime(secondsLeft)}</Text>
            <Text style={styles.timeLeftSub}>of 60 min</Text>
          </View>
          {state === 'live' && (
            <Animated.View
              style={[
                styles.ringPulse,
                {
                  width: ringSize,
                  height: ringSize,
                  borderRadius: ringSize / 2,
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                },
              ]}
            />
          )}
        </View>

        <View style={styles.usesRow}>
          <Text style={styles.usesLabel}>Max uses</Text>
          <Text style={styles.usesCount}>
            <Text style={styles.usesCountAccent}>{redeemed}</Text> /{' '}
            {maxRedemptions} redeemed
          </Text>
        </View>
        <View style={styles.usesTrack}>
          <View
            style={[
              styles.usesFill,
              { width: `${(redeemed / maxRedemptions) * 100}%` },
            ]}
          />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              state === 'live' && styles.actionBtnActive,
            ]}
            activeOpacity={0.85}
            onPress={() => setState('live')}>
            <View
              style={[
                styles.actionDot,
                state === 'live' && styles.actionDotActive,
              ]}
            />
            <Text
              style={[
                styles.actionText,
                state === 'live' && styles.actionTextActive,
              ]}>
              LIVE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              state === 'paused' && styles.actionBtnPaused,
            ]}
            activeOpacity={0.85}
            onPress={() => setState(state === 'paused' ? 'live' : 'paused')}>
            <Ionicons
              name="pause"
              size={12}
              color={state === 'paused' ? '#FFB300' : 'rgba(255,255,255,0.7)'}
            />
            <Text
              style={[
                styles.actionText,
                state === 'paused' && styles.actionTextPaused,
              ]}>
              PAUSE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              state === 'ended' && styles.actionBtnEnded,
            ]}
            activeOpacity={0.85}
            onPress={() => setState('ended')}>
            <Ionicons
              name="stop"
              size={12}
              color={state === 'ended' ? '#E53935' : 'rgba(255,255,255,0.7)'}
            />
            <Text
              style={[
                styles.actionText,
                state === 'ended' && styles.actionTextEnded,
              ]}>
              END
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.dashboardBtn}
          activeOpacity={0.85}
          onPress={() => router.replace('/(merchant)' as never)}>
          <Text style={styles.dashboardText}>View live dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.createMoreRow}
          onPress={() => {
            setRedeemed((r) => Math.min(maxRedemptions, r + 1));
          }}>
          <Text style={styles.createMoreText}>Create another deal</Text>
        </TouchableOpacity>
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
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  topTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    alignItems: 'center',
  },
  bigTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 12,
  },
  statusPillRow: {
    marginTop: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusPillLive: {
    backgroundColor: 'rgba(196,242,127,0.12)',
    borderColor: 'rgba(196,242,127,0.5)',
  },
  statusPillPaused: {
    backgroundColor: 'rgba(255,179,0,0.12)',
    borderColor: 'rgba(255,179,0,0.5)',
  },
  statusPillEnded: {
    backgroundColor: 'rgba(229,57,53,0.12)',
    borderColor: 'rgba(229,57,53,0.5)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  statusDotLive: { backgroundColor: '#C4F27F' },
  statusDotPaused: { backgroundColor: '#FFB300' },
  statusDotEnded: { backgroundColor: '#E53935' },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.7)',
  },
  statusTextLive: { color: '#C4F27F' },
  statusTextPaused: { color: '#FFB300' },
  statusTextEnded: { color: '#E53935' },
  description: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 12,
  },
  expiresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  expiresText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statValue: {
    color: '#C4F27F',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
  },
  ringWrap: {
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringTrack: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  ringDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  ringDotActive: {
    backgroundColor: '#C4F27F',
    shadowColor: '#C4F27F',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLeftLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  timeLeftValue: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    marginTop: 4,
  },
  timeLeftSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  ringPulse: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#C4F27F',
  },
  usesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 28,
    marginBottom: 8,
  },
  usesLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
  },
  usesCount: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '600',
  },
  usesCountAccent: { color: '#C4F27F', fontWeight: '800' },
  usesTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  usesFill: {
    height: 6,
    backgroundColor: '#C4F27F',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 22,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actionBtnActive: {
    backgroundColor: 'rgba(196,242,127,0.12)',
    borderColor: '#C4F27F',
  },
  actionBtnPaused: {
    backgroundColor: 'rgba(255,179,0,0.12)',
    borderColor: '#FFB300',
  },
  actionBtnEnded: {
    backgroundColor: 'rgba(229,57,53,0.12)',
    borderColor: '#E53935',
  },
  actionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  actionDotActive: { backgroundColor: '#C4F27F' },
  actionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionTextActive: { color: '#C4F27F' },
  actionTextPaused: { color: '#FFB300' },
  actionTextEnded: { color: '#E53935' },
  dashboardBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  dashboardText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  createMoreRow: {
    paddingVertical: 14,
    marginTop: 2,
  },
  createMoreText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '600',
  },
});
