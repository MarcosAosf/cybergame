import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { COLORS } from '../theme/colors';
import { TypewriterText } from '../components/TypewriterText';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const SignUpScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('ERRO_DE_SISTEMA', '// TODOS_OS_CAMPOS_SÃO_ESTRITAMENTE_OBRIGATÓRIOS');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('FALHA_DE_SINCRONIA', '// AS_CHAVES_DE_ACESSO_NÃO_CONFEREM');
      return;
    }

    setLoading(true);
    try {
      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Auth Profile
      await updateProfile(user, { displayName: name });

      // 3. Create Firestore Document (Base Stats Phase 40)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        userName: name,
        userEmail: email,
        userXP: 0,
        userBits: 0,
        userRank: 'Recruta',
        completedNodes: [],
        breachLogs: [],
        emergencyTasksCompleted: 0,
        createdAt: serverTimestamp(),
      });

      console.log('--- [IDENTITY_CREATED]: New Operator Registered ---');
    } catch (error: any) {
      console.error('--- [SIGNUP_ERROR]:', error.message);
      Alert.alert('FALHA_NO_REGISTRO', `// ${error.code?.toUpperCase() || 'ERRO_DE_HARDWARE'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        enabled={true}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logoText}>◈ REGISTRO_DE_OPERADOR</Text>
            <Text style={styles.subtitle}>
              // CRIANDO_NOVA_IDENTIDADE_NA_REDE...
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>[ ALIAS_DE_OPERADOR ]</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.prompt}>$ </Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex: Ghost_Commander"
                  placeholderTextColor="#222"
                  autoCapitalize="words"
                  selectionColor={COLORS.success}
                />
              </View>
            </View>

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
              <Text style={styles.label}>[ CHAVE_DE_ACESSO_MESTRA ]</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.prompt}>$ </Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="No mínimo 6 caracteres"
                  placeholderTextColor="#222"
                  secureTextEntry={true}
                  autoCorrect={false}
                  spellCheck={false}
                  multiline={false}
                  editable={true}
                  selectionColor={COLORS.success}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>[ CONFIRMAR_CHAVE ]</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.prompt}>$ </Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repita a chave"
                  placeholderTextColor="#222"
                  secureTextEntry={true}
                  autoCorrect={false}
                  spellCheck={false}
                  multiline={false}
                  editable={true}
                  selectionColor={COLORS.success}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.signupButton} 
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator 
                  animating={Boolean(loading)} 
                  hidesWhenStopped={Boolean(true)}
                  color="#000" 
                />
              ) : (
                <Text style={styles.signupButtonText}>[ INICIALIZAR_IDENTIDADE ]</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginLink} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginLinkText}>
                // JÁ_POSSUI_ACESSO? <Text style={styles.highlight}>VOLTAR_AO_TERMINAL_DE_LOGIN</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>SECURE_PROTOCOL: ENABLED</Text>
            <Text style={styles.footerText}>ENCRYPTION: RSA-4096 / AES-256</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    marginBottom: 40,
  },
  logoText: {
    color: COLORS.success,
    fontSize: 22,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: 'RobotoMono_400Regular',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#333',
    fontSize: 10,
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 6,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 8,
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
  signupButton: {
    backgroundColor: COLORS.success,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#000',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 14,
    letterSpacing: 2,
  },
  loginLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#444',
    fontSize: 10,
    fontFamily: 'RobotoMono_400Regular',
    textAlign: 'center',
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
