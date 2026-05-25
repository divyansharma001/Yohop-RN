import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const canContinue = EMAIL_RE.test(email.trim());

  const onNext = () => {
    if (!canContinue) return;
    router.push({ pathname: '/password', params: { email: email.trim() } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Image
        source={require('@/assets/images/green-icon.png')}
        style={styles.greenIcon}
        contentFit="contain"
      />

      <View style={styles.container}>
        <Text style={styles.title}>What is your{'\n'}email address?</Text>

        <TextInput
          style={styles.input}
          placeholder="name@example.com"
          placeholderTextColor="#9A9A9A"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !canContinue && styles.nextButtonDisabled]}
          activeOpacity={0.8}
          onPress={onNext}
          disabled={!canContinue}>
          <Text style={styles.nextText}>Next</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
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
    top: 40,
    right: 20,
    width: 200,
    height: 180,
    zIndex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 140,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 28,
    lineHeight: 34,
    zIndex: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingHorizontal: 18,
    height: 48,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 22,
    height: 40,
    borderRadius: 20,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  nextText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
