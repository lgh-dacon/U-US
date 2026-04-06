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

import { useRouter } from 'expo-router';

import { signUpWithEmail, verifySignupOtp, resendSignupOtp } from '../services/authService';
import { ensureProfile } from '../services/profileService';
import { useAppData } from '../context/AppDataProvider';

type Step = 'form' | 'verify';

export default function SignUpScreen() {
  const router = useRouter();
  const { login } = useAppData();

  const [step, setStep] = useState<Step>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (): { label: string; color: string; progress: number } => {
    if (password.length === 0) return { label: '', color: '#E0E0E0', progress: 0 };
    if (password.length < 4) return { label: 'Weak', color: '#FF4444', progress: 0.25 };
    if (password.length < 8) return { label: 'Medium', color: '#FFAA00', progress: 0.5 };
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    if (password.length >= 8 && hasNumber && hasSpecial)
      return { label: 'Strong', color: '#22CC66', progress: 1 };
    return { label: 'Good', color: '#88CC00', progress: 0.75 };
  };

  const strength = getPasswordStrength();

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const { data, error } = await signUpWithEmail(email.trim(), password, fullName.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Error', error.message);
      return;
    }

    if (data.user) {
      await ensureProfile({
        id: data.user.id,
        email: data.user.email,
        fullName: fullName.trim(),
      });
    }

    if (data.session) {
      await login(data.session);
      router.replace('/(tabs)/planet');
      return;
    }

    Alert.alert(
      'Verification Sent',
      'A verification code has been sent to your email.',
      [{ text: 'OK', onPress: () => setStep('verify') }],
    );
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    const { data, error } = await verifySignupOtp(email.trim(), otpCode);
    setLoading(false);

    if (error) {
      Alert.alert('Verification Error', error.message);
      return;
    }

    if (data.user) {
      await ensureProfile({
        id: data.user.id,
        email: data.user.email,
        fullName: fullName.trim(),
      });
    }

    await login(data.session ?? null);
    router.replace('/(tabs)/planet');
  };

  const handleResendCode = async () => {
    setLoading(true);
    const { error } = await resendSignupOtp(email.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Sent', 'A new verification code has been sent to your email.');
    }
  };

  if (step === 'verify') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <Pressable style={styles.backButton} onPress={() => setStep('form')}>
            <Text style={styles.backArrow}>{'<'}</Text>
          </Pressable>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>{'<*>'}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>

          {/* OTP Input */}
          <Text style={styles.label}>Verification Code</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>{'#'}</Text>
            <TextInput
              style={styles.input}
              placeholder="000000"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
            />
          </View>

          {/* Verify button */}
          <Pressable style={styles.primaryButton} onPress={handleVerifyOtp} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>
            )}
          </Pressable>

          {/* Resend */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomLabel}>Didn't receive the code? </Text>
            <Pressable onPress={handleResendCode}>
              <Text style={styles.bottomLink}>Resend</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back to home */}
        <Pressable style={styles.backButton} onPress={() => router.replace('/onboarding')}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </Pressable>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>{'<*>'}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Register</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>{'?뫀'}</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>{'??}</Text>
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

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>{'?뵏'}</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>{'?뵍'}</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Password strength */}
        {password.length > 0 && (
          <View style={styles.strengthRow}>
            <Text style={styles.strengthLabel}>Password strength: </Text>
            <Text style={[styles.strengthValue, { color: strength.color }]}>
              {strength.label}
            </Text>
          </View>
        )}
        {password.length > 0 && (
          <View style={styles.strengthBarBg}>
            <View
              style={[
                styles.strengthBarFill,
                { width: `${strength.progress * 100}%`, backgroundColor: strength.color },
              ]}
            />
          </View>
        )}

        {/* Sign Up button */}
        <Pressable style={styles.primaryButton} onPress={handleSignUp} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          )}
        </Pressable>

        {/* Bottom link */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomLabel}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.bottomLink}>Log in</Text>
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
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 28,
  },
  emailHighlight: {
    color: '#000000',
    fontWeight: '600',
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

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  strengthLabel: {
    fontSize: 13,
    color: '#666666',
  },
  strengthValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  strengthBarBg: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
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

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
