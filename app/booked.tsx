import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABLE_NUMBER = '002';
const QR_URI = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=TABLE-${TABLE_NUMBER}`;

export default function BookedScreen() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const onDone = () => {
    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <TouchableOpacity
        onPress={() => router.back()}
        hitSlop={10}
        style={styles.close}>
        <Ionicons name="close" size={22} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Your Table is Booked</Text>

      <View style={styles.middle}>
        {step === 1 && <BunnyIllustration />}
        {step === 2 && (
          <View style={styles.qrWrap}>
            <Image source={{ uri: QR_URI }} style={styles.qr} />
            <Text style={styles.qrNote}>
              Show this QR code at the reception while checking in
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.tableNum}>Table Number - {TABLE_NUMBER}</Text>
        <TouchableOpacity
          style={styles.doneBtn}
          activeOpacity={0.9}
          onPress={onDone}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
}

function BunnyIllustration() {
  return (
    <View style={styles.bunnyStage}>
      <View style={styles.rays} />
      <Text style={styles.confettiLeft}>🎉</Text>
      <Text style={styles.confettiRight}>🎊</Text>
      <Text style={styles.bunny}>🐰</Text>
      <View style={styles.reservedSign}>
        <Text style={styles.reservedText}>RESERVED</Text>
      </View>
      <View style={styles.table}>
        <Text style={styles.candles}>🕯️🌹🕯️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    marginTop: 6,
    marginLeft: 20,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bunnyStage: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rays: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#FFE8A3',
    opacity: 0.55,
  },
  bunny: {
    fontSize: 110,
    marginTop: -30,
  },
  reservedSign: {
    position: 'absolute',
    top: 130,
    backgroundColor: '#D9A441',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8B5A2B',
  },
  reservedText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  table: {
    position: 'absolute',
    bottom: 20,
    width: 200,
    height: 28,
    backgroundColor: '#F4D3DD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candles: {
    fontSize: 18,
    marginTop: -18,
  },
  confettiLeft: {
    position: 'absolute',
    top: 20,
    left: 10,
    fontSize: 28,
  },
  confettiRight: {
    position: 'absolute',
    top: 20,
    right: 10,
    fontSize: 28,
  },
  qrWrap: {
    alignItems: 'center',
  },
  qr: {
    width: 220,
    height: 220,
  },
  qrNote: {
    marginTop: 14,
    fontSize: 11,
    color: '#6B6B6B',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottom: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  tableNum: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 14,
  },
  doneBtn: {
    backgroundColor: '#000',
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: 'center',
    width: '88%',
  },
  doneText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000',
    marginTop: 10,
  },
});
