import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OtpScreen() {
  const router = useRouter();
  const { phone, dial } = useLocalSearchParams<{ phone?: string; dial?: string }>();
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Image
        source={require('@/assets/images/green-icon.png')}
        style={styles.greenIcon}
        contentFit="contain"
      />

      <View style={styles.container}>
        <Text style={styles.title}>Enter your OTP</Text>
        <Text style={styles.subtitle}>We have sent your OTP on your mobile number</Text>

        <View style={styles.phoneRow}>
          <Text style={styles.phoneText}>
            {dial || '+44'} {phone || '123456789'}
          </Text>
          <Text style={styles.editLink} onPress={() => router.back()}>
            Edit mobile number
          </Text>
        </View>

        <Pressable style={styles.slotsRow} onPress={() => inputRef.current?.focus()}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.slot}>
              <Text style={styles.slotText}>{code[i] || ''}</Text>
              <View style={styles.slotLine} />
            </View>
          ))}
        </Pressable>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 4))}
          keyboardType="number-pad"
          maxLength={4}
          style={styles.hiddenInput}
          caretHidden
        />

        <TouchableOpacity
          style={styles.verifyButton}
          activeOpacity={0.8}
          onPress={() => router.push('/email')}>
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>

        <Text style={styles.resend}>
          {"Haven't recieved it yet? "}
          <Text style={styles.resendLink}>Resend</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greenIcon: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 200,
    height: 180,
    zIndex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 180,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    zIndex: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 2,
  },
  phoneText: {
    fontSize: 13,
    color: '#666',
    marginRight: 10,
  },
  editLink: {
    fontSize: 13,
    color: '#000',
    fontWeight: '700',
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  slot: {
    width: 54,
    alignItems: 'center',
  },
  slotText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    height: 28,
  },
  slotLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#000',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  verifyButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resend: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
  },
  resendLink: {
    color: '#000',
    fontWeight: '700',
  },
});
