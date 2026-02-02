import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

const { width, height } = Dimensions.get('window');

// Sample flashcard data
const sampleDecks = [
  {
    id: 1,
    title: 'JavaScript Basics',
    emoji: '⚡',
    color: '#FF6B6B',
    cards: [
      { front: 'What is a closure?', back: 'A function that has access to variables from its outer scope, even after the outer function has returned.' },
      { front: 'What is hoisting?', back: 'JavaScript\'s behavior of moving declarations to the top of their scope before execution.' },
      { front: 'What is the difference between let and var?', back: 'let is block-scoped and not hoisted, var is function-scoped and hoisted.' },
    ],
  },
  {
    id: 2,
    title: 'React Native',
    emoji: '📱',
    color: '#4ECDC4',
    cards: [
      { front: 'What is a component?', back: 'A reusable piece of UI that can manage its own state and receive props.' },
      { front: 'What is useState?', back: 'A React Hook that lets you add state to functional components.' },
      { front: 'What is the purpose of StyleSheet?', back: 'An abstraction similar to CSS that provides better performance through style optimization.' },
    ],
  },
  {
    id: 3,
    title: 'General Knowledge',
    emoji: '🌍',
    color: '#FFE66D',
    cards: [
      { front: 'What is the largest planet?', back: 'Jupiter' },
      { front: 'Who painted the Mona Lisa?', back: 'Leonardo da Vinci' },
      { front: 'What year did World War II end?', back: '1945' },
    ],
  },
];

// FlashCard Component
const FlashCard = ({ card, onFlip, isFlipped }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onFlip} style={styles.cardContainer}>
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <Text style={styles.cardLabel}>QUESTION</Text>
        <Text style={styles.cardText}>{card.front}</Text>
        <Text style={styles.tapHint}>Tap to flip</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.cardLabel}>ANSWER</Text>
        <Text style={styles.cardText}>{card.back}</Text>
        <Text style={styles.tapHint}>Tap to flip</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Deck Card Component
const DeckCard = ({ deck, onPress }) => (
  <TouchableOpacity
    style={[styles.deckCard, { borderLeftColor: deck.color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.deckEmoji}>
      <Text style={styles.emojiText}>{deck.emoji}</Text>
    </View>
    <View style={styles.deckInfo}>
      <Text style={styles.deckTitle}>{deck.title}</Text>
      <Text style={styles.deckCount}>{deck.cards.length} cards</Text>
    </View>
    <View style={[styles.deckArrow, { backgroundColor: deck.color + '20' }]}>
      <Text style={[styles.arrowText, { color: deck.color }]}>→</Text>
    </View>
  </TouchableOpacity>
);

// Home Screen
const HomeScreen = ({ onSelectDeck }) => (
  <View style={styles.screen}>
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello there! 👋</Text>
      <Text style={styles.title}>FlashCards</Text>
      <Text style={styles.subtitle}>Master anything, one card at a time</Text>
    </View>
    
    <View style={styles.statsContainer}>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>3</Text>
        <Text style={styles.statLabel}>Decks</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>9</Text>
        <Text style={styles.statLabel}>Cards</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>∞</Text>
        <Text style={styles.statLabel}>Potential</Text>
      </View>
    </View>

    <Text style={styles.sectionTitle}>Your Decks</Text>
    <ScrollView 
      style={styles.deckList} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.deckListContent}
    >
      {sampleDecks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} onPress={() => onSelectDeck(deck)} />
      ))}
    </ScrollView>
  </View>
);

// Study Screen
const StudyScreen = ({ deck, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setProgress((currentIndex + 1) / deck.cards.length);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setProgress((currentIndex - 1) / deck.cards.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setProgress(0);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.studyHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.deckTitleContainer}>
          <Text style={styles.studyDeckEmoji}>{deck.emoji}</Text>
          <Text style={styles.studyDeckTitle}>{deck.title}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: deck.color }]} />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {deck.cards.length}
        </Text>
      </View>

      <View style={styles.cardWrapper}>
        <FlashCard
          card={deck.cards[currentIndex]}
          onFlip={handleFlip}
          isFlipped={isFlipped}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, currentIndex === 0 && styles.controlButtonDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.controlButtonText, currentIndex === 0 && styles.controlButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentIndex === deck.cards.length - 1 ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.controlButtonPrimary, { backgroundColor: deck.color }]}
            onPress={handleRestart}
          >
            <Text style={styles.controlButtonTextPrimary}>Restart</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.controlButtonPrimary, { backgroundColor: deck.color }]}
            onPress={handleNext}
          >
            <Text style={styles.controlButtonTextPrimary}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Main App
export default function App() {
  const [selectedDeck, setSelectedDeck] = useState(null);
  
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
    <View style={styles.container}>
      <StatusBar style="light" />
      {selectedDeck ? (
        <StudyScreen deck={selectedDeck} onBack={() => setSelectedDeck(null)} />
      ) : (
        <HomeScreen onSelectDeck={setSelectedDeck} />
      )}
    </View>
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
  greeting: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#8B8B9E',
    marginBottom: 8,
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#8B8B9E',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2D2D44',
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  deckList: {
    flex: 1,
  },
  deckListContent: {
    paddingBottom: 40,
  },
  deckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  deckEmoji: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2D2D44',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emojiText: {
    fontSize: 24,
  },
  deckInfo: {
    flex: 1,
  },
  deckTitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deckCount: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#8B8B9E',
  },
  deckArrow: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studyHeader: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#8B8B9E',
  },
  deckTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studyDeckEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  studyDeckTitle: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 32,
    color: '#FFFFFF',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2D2D44',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#8B8B9E',
    textAlign: 'center',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: width - 48,
    height: height * 0.4,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  cardBack: {
    backgroundColor: '#2D2D44',
  },
  cardLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: '#8B8B9E',
    letterSpacing: 2,
    position: 'absolute',
    top: 24,
  },
  cardText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
  },
  tapHint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#5A5A6E',
    position: 'absolute',
    bottom: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 24,
  },
  controlButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlButtonPrimary: {
    minWidth: 140,
    alignItems: 'center',
  },
  controlButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#8B8B9E',
  },
  controlButtonTextDisabled: {
    color: '#5A5A6E',
  },
  controlButtonTextPrimary: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#0D0D1A',
  },
});

