import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { signInWithEmail } from '../services/authService';
import { useAppData } from '../context/AppDataProvider';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAppData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { data, error } = await signInWithEmail(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Login Error', error.message);
      return;
    }

    await login(data.session);
    router.replace('/(tabs)/planet');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </Pressable>

        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>{'<*>'}</Text>
        </View>

        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>please login to your account</Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>@</Text>
          <TextInput
            style={styles.input}
            placeholder="alina.solvaeica@gmail.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>*</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <Pressable
          style={styles.rememberRow}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkmark}>V</Text>}
          </View>
          <Text style={styles.rememberText}>Remember me</Text>
        </Pressable>

        <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Login</Text>
          )}
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={[styles.socialButton, styles.kakaoButton]}>
          <Text style={styles.socialButtonText}>Continue with Kakaotalk</Text>
        </Pressable>

        <Pressable style={[styles.socialButton, styles.naverButton, { marginTop: 12 }]}>
          <Text style={[styles.socialButtonText, { color: '#FFFFFF' }]}>Continue with Naver</Text>
        </Pressable>

        <Pressable style={[styles.socialButton, { marginTop: 12 }]}>
          <Text style={styles.socialIcon}>G</Text>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </Pressable>

        <Pressable style={[styles.socialButton, { marginTop: 12 }]}>
          <Text style={styles.socialIcon}>A</Text>
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </Pressable>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomLabel}>New user? </Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text style={styles.bottomLink}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '300',
  },
  logoContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    fontSize: 18,
    color: '#999999',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    padding: 0,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rememberText: {
    fontSize: 14,
    color: '#333333',
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#999999',
    fontSize: 13,
    marginHorizontal: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    borderColor: '#FEE500',
  },
  naverButton: {
    backgroundColor: '#03C75A',
    borderColor: '#03C75A',
  },
  socialIcon: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: '700',
  },
  socialButtonText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  bottomLabel: {
    color: '#666666',
    fontSize: 14,
  },
  bottomLink: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
