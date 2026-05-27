import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DealPublishedScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const dealName = name || 'Your deal';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.closeBtn}
          activeOpacity={0.8}
          onPress={() => router.replace('/(merchant)' as never)}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.checkRing}>
          <View style={styles.checkInner}>
            <Ionicons name="checkmark" size={36} color="#000" />
          </View>
        </View>

        <Text style={styles.title}>Your deal is live!</Text>
        <Text style={styles.sub}>
          <Text style={styles.subAccent}>{dealName}</Text> is now visible to
          customers nearby for{' '}
          <Text style={styles.subAccent}>MM/DD/YYYY</Text>.{'\n'}
          Check-ins are being tracked in real time.
        </Text>

        <View style={styles.dealCard}>
          <View style={styles.dealTopRow}>
            <Text style={styles.dealTitle} numberOfLines={1}>
              {dealName.toUpperCase()}
            </Text>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>158</Text>
              <Text style={styles.statLabel}>Views so far</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>57</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>
                8<Text style={styles.statValueMuted}>/50</Text>
              </Text>
              <Text style={styles.statLabel}>Max uses</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: '#C4F27F' }]}>
                57:07
              </Text>
              <Text style={styles.statLabel}>Time left</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={11} color="#C4F27F" />
            <Text style={styles.metaText}>
              Expires in 1 hour · Free drink reward active
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() =>
            router.replace({
              pathname: '/deal-status',
              params: { name: dealName },
            })
          }>
          <Text style={styles.primaryText}>View live dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.replace('/merchant-deal')}>
          <Text style={styles.secondaryText}>Create another deal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  topRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  checkRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(196,242,127,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  checkInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#C4F27F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  sub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  subAccent: {
    color: '#C4F27F',
    fontWeight: '700',
  },
  dealCard: {
    width: '100%',
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,242,127,0.25)',
    marginTop: 22,
  },
  dealTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dealTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
    letterSpacing: 0.4,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#C4F27F',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  liveText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
    paddingVertical: 4,
  },
  statCol: {
    width: '50%',
    alignItems: 'flex-start',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  statValueMuted: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  metaText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 8,
  },
});
