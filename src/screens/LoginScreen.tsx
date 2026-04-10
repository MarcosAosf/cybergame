import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { COLORS } from '../theme/colors';
import { TypewriterText } from '../components/TypewriterText';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('ACESSO_NEGADO', '// CREDENCIAIS_INVÁLIDAS_OU_INCOMPLETAS');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('--- [IDENTITY_VERIFIED]: Operator Authenticated ---');
    } catch (error: any) {
      console.error('--- [LOGIN_FAILURE]:', error.message);
      let errorMsg = '// FALHA_NA_CRIPTOGRAFIA / CHAVE_INCORRETA';
      if (error.code === 'auth/user-not-found') errorMsg = '// OPERADOR_NÃO_ENCONTRADO_NA_REDE';
      if (error.code === 'auth/wrong-password') errorMsg = '// CHAVE_DE_ACESSO_INVÁLIDA';
      Alert.alert('FALHA_NA_AUTENTICAÇÃO', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logoText}>◈ SECROAD_TERMINAL</Text>
            <TypewriterText 
              text="// AGUARDANDO_AUTENTICAÇÃO_DE_OPERADOR..." 
              speed={40} 
              style={styles.subtitle}
            />
          </View>

          <View style={styles.formSplitter}>
            <Text style={styles.splitterText}>---------------- IDENTITY_GATE ----------------</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>[ CANAL_DE_COMUNICAÇÃO ]</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.prompt}>$ </Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="operador@secroad.net"
                  placeholderTextColor="#222"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor={COLORS.success}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>[ CHAVE_DE_ACESSO ]</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.prompt}>$ </Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="********"
                  placeholderTextColor="#222"
                  secureTextEntry={true}
                  selectionColor={COLORS.success}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator animating={Boolean(loading)} color="#000" />
              ) : (
                <Text style={styles.loginButtonText}>[ ESTABELECER_CONEXÃO ]</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signupLink} 
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signupLinkText}>
                // NÃO_POSSUI_IDENTIDADE? <Text style={styles.highlight}>REGISTRAR_NOVO_OPERADOR</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>SYSTEM_STATUS: SECURE</Text>
            <Text style={styles.footerText}>ENCRYPTION: AES-256V</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 30,
    paddingTop: 80,
    flexGrow: 1,
  },
  header: {
    marginBottom: 40,
  },
  logoText: {
    color: COLORS.success,
    fontSize: 24,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: 'RobotoMono_400Regular',
    minHeight: 20,
  },
  formSplitter: {
    marginBottom: 30,
    alignItems: 'center',
  },
  splitterText: {
    color: '#1a1a1a',
    fontSize: 10,
    fontFamily: 'RobotoMono_400Regular',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: '#333',
    fontSize: 10,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 4,
    paddingHorizontal: 15,
    height: 55,
  },
  prompt: {
    color: COLORS.success,
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 18,
  },
  input: {
    flex: 1,
    color: COLORS.success,
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 14,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: COLORS.success,
    height: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: '#000',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 14,
    letterSpacing: 2,
  },
  signupLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  signupLinkText: {
    color: '#444',
    fontSize: 10,
    fontFamily: 'RobotoMono_400Regular',
  },
  highlight: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#0a0a0a',
  },
  footerText: {
    color: '#1a1a1a',
    fontSize: 9,
    fontFamily: 'RobotoMono_400Regular',
    marginBottom: 4,
    letterSpacing: 1,
  },
});
