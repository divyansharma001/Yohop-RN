import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Method = 'nfc' | 'reference' | 'qr';

export default function CheckinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    eventId?: string;
    title?: string;
    tickets?: string;
  }>();
  const title = params.title || 'Sabrina Carpenter';
  const tickets = params.tickets || '1';
  const [selected, setSelected] = useState<Method | null>('nfc');

  const goVerify = () => {
    router.push({
      pathname: '/checkin-verify',
      params: { eventId: params.eventId ?? '', title, tickets },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCol}>
          <Text style={styles.topTitle}>Check-in</Text>
          <View style={styles.progressRow}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
        </View>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Choose check-in method</Text>
        <Text style={styles.sub}>How would you like to enter the venue?</Text>

        <View style={styles.ticketCard}>
          <View style={styles.ticketIcon}>
            <Ionicons name="ticket" size={18} color="#000" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ticketTitle}>{title}</Text>
            <Text style={styles.ticketMeta}>12 April · 6:00 PM</Text>
          </View>
          <View style={styles.ticketCount}>
            <Text style={styles.ticketCountText}>×{tickets}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Ready to Enter</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.methodCard, selected === 'nfc' && styles.methodCardActive]}
          onPress={() => setSelected('nfc')}>
          <View style={styles.methodTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>Tap to enter (NFC)</Text>
              <Text style={styles.methodSub}>
                Hold phone near entrance reader
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                selected === 'nfc' && styles.checkboxActive,
              ]}>
              {selected === 'nfc' && (
                <Ionicons name="checkmark" size={12} color="#000" />
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.nfcBtn}
            activeOpacity={0.85}
            onPress={goVerify}>
            <Ionicons name="radio-outline" size={14} color="#000" />
            <Text style={styles.nfcText}>Check-in now - NFC</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or use another method</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.methodCardSimple,
            selected === 'reference' && styles.methodCardActive,
          ]}
          onPress={() => setSelected('reference')}>
          <View style={styles.simpleIcon}>
            <Ionicons name="key-outline" size={18} color="#C4F27F" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>Booking reference</Text>
            <Text style={styles.methodSub}>Enter your 4-digit code</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="rgba(255,255,255,0.4)"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.methodCardSimple,
            selected === 'qr' && styles.methodCardActive,
          ]}
          onPress={() => setSelected('qr')}>
          <View style={styles.simpleIcon}>
            <Ionicons name="qr-code-outline" size={18} color="#C4F27F" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>QR code scan</Text>
            <Text style={styles.methodSub}>
              Show QR at the entrance gate
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="rgba(255,255,255,0.4)"
          />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.85}
          onPress={goVerify}>
          <Ionicons name="finger-print" size={14} color="#000" />
          <Text style={styles.ctaText}>Check-in Now</Text>
        </TouchableOpacity>
      </View>
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
  headerCol: {
    alignItems: 'center',
  },
  topTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  progressDot: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progressDotActive: { backgroundColor: '#C4F27F' },
  scroll: { paddingHorizontal: 18, paddingBottom: 100 },
  h1: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 10 },
  sub: { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 6 },
  ticketCard: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,242,127,0.3)',
  },
  ticketIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#C4F27F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
  ticketMeta: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    marginTop: 2,
  },
  ticketCount: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(196,242,127,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(196,242,127,0.4)',
  },
  ticketCountText: {
    color: '#C4F27F',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 22,
    marginBottom: 10,
  },
  methodCard: {
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  methodCardActive: {
    borderColor: '#C4F27F',
  },
  methodCardSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10,
  },
  methodTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  methodSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#C4F27F',
    borderColor: '#C4F27F',
  },
  nfcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#C4F27F',
  },
  nfcText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '600',
  },
  simpleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(196,242,127,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(196,242,127,0.3)',
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C4F27F',
  },
  ctaText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },
});
