import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Lesson } from '../data/lessons';
import { useSecStore } from '../store/useSecStore';
import { TypewriterText } from './TypewriterText';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

type ViewMode = 'selection' | 'theory' | 'challenge';

export const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [expandedHint, setExpandedHint] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [didUseHints, setDidUseHints] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  
  const { completeLesson, loseHeart, useCredit, stats } = useSecStore();

  // Typewriter logic moved to dedicated component

  const handleSubmit = () => {
    let correct = false;
    if (lesson.type === 'multiple-choice') {
      correct = selectedOption === lesson.answer;
    } else {
      correct = userInput.trim().toLowerCase() === lesson.answer.toLowerCase();
    }

    if (correct) {
      setIsSuccess(true);
      setIsFinished(true);
      completeLesson(lesson.id, 50, 10, didUseHints); 
    } else {
      loseHeart();
      setShowHint(true);
      if (stats.hearts <= 1) {
        Alert.alert("ERRO CRÍTICO", "Corações esgotados! Sincronize com o terminal para reiniciar.");
        onClose();
      }
    }
  };

  const toggleOptionHint = (option: string) => {
    if (expandedHint === option) {
      setExpandedHint(null);
    } else {
      if (stats.credits > 0) {
        const newCount = hintCount + 1;
        setHintCount(newCount);
        
        if (newCount > 3) {
          loseHeart();
          Alert.alert(
            "SISTEMA_SOBRECARREGADO", 
            "Dependência excessiva de dicas detectada. Perda de integridade do sistema (❤️ -1)."
          );
        }

        setExpandedHint(option);
        setDidUseHints(true);
        useCredit();
      } else {
        Alert.alert("SEM RECURSOS", "Você não tem Créditos de Shell (⚡) suficientes para acessar as dicas técnicas!");
      }
    }
  };

  const renderSelection = () => (
    <View style={styles.selectionContainer}>
      <Text style={styles.selectionTitle}>// SELECIONE_A_ABORDAGEM</Text>
      
      <TouchableOpacity 
        style={styles.selectionButton} 
        onPress={() => setViewMode('theory')}
        activeOpacity={0.7}
      >
        <Text style={styles.selectionButtonIcon}>📖</Text>
        <Text style={styles.selectionButtonText}>ESTUDAR CONCEITO</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ ...styles.selectionButton, borderColor: '#00d4ff' }} 
        onPress={() => setViewMode('challenge')}
        activeOpacity={0.7}
      >
        <Text style={styles.selectionButtonIcon}>⚡</Text>
        <Text style={styles.selectionButtonText}>INICIAR INVASÃO</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTheory = () => (
    <View style={styles.theoryWrapper}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionType}>// REPOSITÓRIO_DE_CONHECIMENTO</Text>
        <Text style={styles.questionText}>{lesson.title}</Text>
        <View style={styles.theoryBox}>
          <TypewriterText 
            text={lesson.theory} 
            speed={25} 
            style={styles.theoryText} 
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={() => setViewMode('challenge')}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>IR PARA O DESAFIO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChallenge = () => (
    <View style={styles.challengeWrapper}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionType}>
          {lesson.type === 'multiple-choice' ? '// VALIDAÇÃO_DE_CONCEITO' : '// ENTRADA_DE_COMANDO'}
        </Text>
        <Text style={styles.questionText}>{lesson.question}</Text>

        {lesson.type === 'multiple-choice' ? (
          <View style={styles.optionsContainer}>
            {lesson.options?.map((option) => (
              <View key={option} style={styles.optionWrapper}>
                <View style={styles.optionRow}>
                  <TouchableOpacity
                    style={selectedOption === option ? { ...styles.option, ...styles.optionSelected } : styles.option}
                    onPress={() => setSelectedOption(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={selectedOption === option ? { ...styles.optionText, ...styles.optionTextSelected } : styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                  
                  {lesson.optionHints && lesson.optionHints[option] && (
                    <TouchableOpacity 
                      onPress={() => toggleOptionHint(option)}
                      style={styles.infoIndicator}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name="information-circle" 
                        size={18} 
                        color={expandedHint === option ? '#00d4ff' : '#555555'} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
                
                {expandedHint === option && (
                  <View style={styles.optionHintBox}>
                    <Text style={styles.optionHintText}>{lesson.optionHints?.[option]}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.prompt}>$ </Text>
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Digite o comando..."
              placeholderTextColor="#a0a0a0"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
            />
          </View>
        )}

        {showHint ? (
          <View style={styles.hintContainer}>
            <View style={styles.hintHeader}>
              <Text style={{ color: "#00d4ff", fontSize: 16 }}>i </Text>
              <Text style={styles.hintTitle}>DICA_DE_SEGURANÇA</Text>
            </View>
            <Text style={styles.hintText}>{lesson.hint}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {!isFinished ? (
          <TouchableOpacity 
            style={
              (lesson.type === 'multiple-choice' ? !selectedOption : !userInput) 
                ? { ...styles.submitButton, ...styles.submitButtonDisabled } 
                : styles.submitButton
            } 
            onPress={handleSubmit}
            disabled={lesson.type === 'multiple-choice' ? !selectedOption : !userInput}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>EXECUTAR</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={{ ...styles.submitButton, ...styles.successButton }} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ color: "#a0a0a0", fontSize: 24 }}>X</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={{ ...styles.progressFill, width: '50%' }} />
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.hearts}>❤️ {stats.hearts}</Text>
            <Text style={styles.creditsHeader}>⚡ {stats.credits}</Text>
          </View>
        </View>

        {viewMode === 'selection' && renderSelection()}
        {viewMode === 'theory' && renderTheory()}
        {viewMode === 'challenge' && renderChallenge()}

        {isSuccess && (
          <View style={styles.successOverlay}>
             <Text style={{ color: "#00ff9f", fontSize: 64 }}>✔</Text>
             <Text style={styles.successText}>SISTEMA INVADIDO</Text>
             <Text style={styles.xpGain}>+50 XP | +10 BITS</Text>
             
             <TouchableOpacity 
               style={styles.successContinueButton} 
               onPress={onClose}
               activeOpacity={0.7}
             >
               <Text style={styles.successContinueText}>CONTINUAR</Text>
             </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 5,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
  },
  hearts: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  creditsHeader: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  content: {
    padding: 25,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    gap: 20,
  },
  selectionTitle: {
    color: '#00d4ff',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  selectionButton: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    padding: 25,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  selectionButtonIcon: {
    fontSize: 32,
  },
  selectionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RobotoMono_700Bold',
    flex: 1,
  },
  theoryWrapper: {
    flex: 1,
  },
  theoryBox: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    padding: 20,
    borderRadius: 8,
  },
  theoryText: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 15,
    lineHeight: 24,
  },
  challengeWrapper: {
    flex: 1,
  },
  questionType: {
    color: '#00d4ff',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 12,
    marginBottom: 10,
  },
  questionText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'RobotoMono_700Bold',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  optionWrapper: {
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  option: {
    flex: 1,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    padding: 18,
    borderRadius: 12,
  },
  optionSelected: {
    borderColor: '#00d4ff',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#00d4ff',
    fontWeight: 'bold',
  },
  infoIndicator: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionHintBox: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#080808',
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#444',
  },
  optionHintText: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'RobotoMono_400Regular',
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    padding: 15,
    borderRadius: 8,
  },
  prompt: {
    color: '#00d4ff',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 18,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 18,
    padding: 0,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  submitButton: {
    backgroundColor: '#00d4ff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#1a1a1a',
  },
  submitButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 2,
    fontFamily: 'RobotoMono_700Bold',
  },
  successButton: {
    backgroundColor: '#00ff9f',
  },
  hintContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
    borderRadius: 4,
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  hintTitle: {
    color: '#00d4ff',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 11,
  },
  hintText: {
    color: '#a0a0a0',
    fontSize: 14,
    lineHeight: 20,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  successText: {
    color: '#00ff9f',
    fontSize: 28,
    fontFamily: 'RobotoMono_700Bold',
    marginTop: 20,
    textAlign: 'center',
  },
  xpGain: {
    color: '#a0a0a0',
    marginTop: 10,
    fontFamily: 'RobotoMono_400Regular',
    marginBottom: 40,
  },
  successContinueButton: {
    backgroundColor: '#00ff66',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
  },
  successContinueText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'RobotoMono_700Bold',
    letterSpacing: 2,
  },
  skipButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  skipButtonText: {
    color: '#333',
    fontSize: 10,
    fontFamily: 'RobotoMono_400Regular',
  },
});
