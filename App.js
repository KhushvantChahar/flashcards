import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

const Stack = createStackNavigator();

// QuestionBank Screen
const QuestionBankScreen = ({ navigation }) => {
  const [questionPairs, setQuestionPairs] = useState([{ question: '', answer: '' }]);

  const addQuestionPair = () => {
    if (questionPairs.length < 50) {
      setQuestionPairs([...questionPairs, { question: '', answer: '' }]);
    }
  };

  const updateQuestion = (index, text) => {
    const newPairs = [...questionPairs];
    newPairs[index].question = text;
    setQuestionPairs(newPairs);
  };

  const updateAnswer = (index, text) => {
    const newPairs = [...questionPairs];
    newPairs[index].answer = text;
    setQuestionPairs(newPairs);
  };

  const removeQuestionPair = (index) => {
    if (questionPairs.length > 1) {
      setQuestionPairs(questionPairs.filter((_, i) => i !== index));
    }
  };

  const submitQuestions = async () => {
    const validPairs = questionPairs.filter(pair => pair.question.trim() && pair.answer.trim());
    if (validPairs.length === 0) {
      Alert.alert('Error', 'Please add at least one question with an answer.');
      return;
    }
    try {
      await AsyncStorage.setItem('questions', JSON.stringify(validPairs));
      Alert.alert('Success', `${validPairs.length} questions saved!`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save questions.');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Question Bank</Text>
        <Text style={styles.subtitle}>Add up to 50 questions</Text>
      </View>
      <ScrollView style={styles.questionList} showsVerticalScrollIndicator={false}>
        {questionPairs.map((pair, index) => (
          <View key={index} style={styles.questionPair}>
            <Text style={styles.pairLabel}>Question {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter question"
              placeholderTextColor="#8B8B9E"
              value={pair.question}
              onChangeText={(text) => updateQuestion(index, text)}
            />
            <Text style={styles.pairLabel}>Answer {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter answer"
              placeholderTextColor="#8B8B9E"
              value={pair.answer}
              onChangeText={(text) => updateAnswer(index, text)}
            />
            {questionPairs.length > 1 && (
              <TouchableOpacity style={styles.removeButton} onPress={() => removeQuestionPair(index)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {questionPairs.length < 50 && (
          <TouchableOpacity style={styles.addButton} onPress={addQuestionPair}>
            <Text style={styles.addButtonText}>+ Add Question</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={submitQuestions}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

// Home Screen (Quiz)
const HomeScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedQuestions = await AsyncStorage.getItem('questions');
        if (storedQuestions) {
          setQuestions(JSON.parse(storedQuestions));
        }
        const storedScore = await AsyncStorage.getItem('score');
        if (storedScore) {
          setScore(parseInt(storedScore, 10));
        }
      } catch (error) {
        console.error('Failed to load data', error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      Alert.alert('Error', 'Please enter an answer.');
      return;
    }
    const correct = userAnswer.trim().toLowerCase() === questions[currentIndex].answer.trim().toLowerCase();
    const newScore = score + (correct ? 1 : -1);
    setScore(newScore);
    await AsyncStorage.setItem('score', newScore.toString());
    setUserAnswer('');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert('Quiz Complete', `Final Score: ${newScore}`, [
        { text: 'Restart', onPress: () => setCurrentIndex(0) },
        { text: 'OK' },
      ]);
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.addButtonTop} onPress={() => navigation.navigate('QuestionBank')}>
            <Text style={styles.addButtonTextTop}>+ Add Questions</Text>
          </TouchableOpacity>
          <Text style={styles.title}>FlashCards</Text>
          <Text style={styles.subtitle}>No questions yet. Add some to start!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <TouchableOpacity style={styles.addButtonTop} onPress={() => navigation.navigate('QuestionBank')}>
            <Text style={styles.addButtonTextTop}>+ Add</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Quiz</Text>
        <Text style={styles.subtitle}>Answer the question below</Text>
      </View>
      <View style={styles.quizContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{questions[currentIndex].question}</Text>
        </View>
        <TextInput
          style={styles.answerInput}
          placeholder="Your answer"
          placeholderTextColor="#8B8B9E"
          value={userAnswer}
          onChangeText={setUserAnswer}
          multiline
        />
        <TouchableOpacity style={styles.submitQuizButton} onPress={handleSubmit}>
          <Text style={styles.submitQuizButtonText}>Submit Answer</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {questions.length}
        </Text>
      </View>
    </View>
  );
};

// Main App
export default function App() {
  let [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0D0D1A' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QuestionBank" component={QuestionBankScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  screen: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  addButtonTop: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonTextTop: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#0D0D1A',
  },
  title: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 42,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#8B8B9E',
  },
  questionList: {
    flex: 1,
  },
  questionPair: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  pairLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2D2D44',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    marginBottom: 16,
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#0D0D1A',
  },
  submitButton: {
    backgroundColor: '#FFE66D',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#0D0D1A',
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  questionText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
  },
  answerInput: {
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 16,
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitQuizButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitQuizButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#0D0D1A',
  },
  progressText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#8B8B9E',
    textAlign: 'center',
  },
});

