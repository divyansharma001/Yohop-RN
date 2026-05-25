import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegister } from '@/hooks/use-auth';

export default function NameScreen() {
  const router = useRouter();
  const { email, password } = useLocalSearchParams<{
    email?: string;
    password?: string;
  }>();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [error, setError] = useState<string | null>(null);
  const register = useRegister();

  const canContinue =
    first.trim().length > 0 &&
    last.trim().length > 0 &&
    !!email &&
    !!password &&
    !register.isPending;

  const onSubmit = async () => {
    if (!canContinue || !email || !password) return;
    setError(null);
    const name = `${first.trim()} ${last.trim()}`;
    try {
      await register.mutateAsync({ email, password, name });
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e?.message || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Image
        source={require('@/assets/images/green-icon.png')}
        style={styles.greenIcon}
        contentFit="contain"
      />

      <View style={styles.container}>
        <Text style={styles.title}>What&apos;s your{'\n'}name?</Text>

        <TextInput
          style={styles.input}
          placeholder="Please enter first name"
          placeholderTextColor="#9A9A9A"
          autoCapitalize="words"
          value={first}
          onChangeText={setFirst}
        />
        <TextInput
          style={[styles.input, styles.inputSpacing]}
          placeholder="Please enter surname"
          placeholderTextColor="#9A9A9A"
          autoCapitalize="words"
          value={last}
          onChangeText={setLast}
        />

        {error && <Text style={styles.error}>{error}</Text>}
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
          onPress={onSubmit}
          disabled={!canContinue}>
          {register.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.nextText}>Create account</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </>
          )}
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
  inputSpacing: {
    marginTop: 12,
  },
  error: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 12,
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
