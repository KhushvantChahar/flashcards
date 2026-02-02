# FlashCard App 📚

A beautiful, cross-platform flashcard application built with React Native and Expo.

## Features

- 🎴 **Interactive Flashcards** - Tap to flip cards with smooth animations
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 🎨 **Modern UI** - Dark theme with vibrant accent colors
- 📊 **Progress Tracking** - Visual progress bar while studying
- 📚 **Multiple Decks** - Organize cards into themed decks

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI (optional, can use npx)

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd FlashCardApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your device:
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Web Browser**: Press `w` in the terminal
   - **Physical Device**: Scan the QR code with Expo Go app

## Project Structure

```
FlashCardApp/
├── App.js              # Main application component
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration
├── package.json        # Dependencies and scripts
├── assets/             # Images and icons
└── README.md           # This file
```

## Sample Decks Included

1. **JavaScript Basics** ⚡ - Core JS concepts
2. **React Native** 📱 - Mobile development fundamentals
3. **General Knowledge** 🌍 - Fun trivia questions

## Customization

### Adding New Decks

Edit the `sampleDecks` array in `App.js`:

```javascript
const sampleDecks = [
  {
    id: 4,
    title: 'Your New Deck',
    emoji: '🆕',
    color: '#9B59B6',
    cards: [
      { front: 'Question 1', back: 'Answer 1' },
      { front: 'Question 2', back: 'Answer 2' },
    ],
  },
  // ... existing decks
];
```

### Changing Theme Colors

The color scheme is defined in the `styles` object. Key colors:
- Background: `#0D0D1A`
- Card Background: `#1A1A2E`
- Secondary: `#2D2D44`
- Text: `#FFFFFF`
- Muted Text: `#8B8B9E`

## Built With

- [React Native](https://reactnative.dev/) - Mobile framework
- [Expo](https://expo.dev/) - Development platform
- [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) - Display font
- [Nunito](https://fonts.google.com/specimen/Nunito) - Body font

## License

This project is open source and available under the MIT License.

