import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const isValid = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

  const onNext = () => {
    if (!isValid) return;
    router.push({ pathname: '/name', params: { email, password } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Image
        source={require('@/assets/images/green-icon.png')}
        style={styles.greenIcon}
        contentFit="contain"
      />

      <View style={styles.container}>
        <Text style={styles.title}>Create account{'\n'}password</Text>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Please enter your password"
            placeholderTextColor="#9A9A9A"
            secureTextEntry={!show}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eye} onPress={() => setShow((s) => !s)}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.helper}>
          Your password must be atleast 8 characters long and contain at least one letter and one digit
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          activeOpacity={0.8}
          onPress={onNext}
          disabled={!isValid}>
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
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingLeft: 18,
    paddingRight: 48,
    height: 48,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
  eye: {
    position: 'absolute',
    right: 14,
    height: 48,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
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
