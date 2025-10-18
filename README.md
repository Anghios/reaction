# Reaction Game

An interactive web application to measure your reaction time. Test your reflexes and compete against your own records.

## 🎮 [LIVE DEMO](https://reaction.anghios.es/)

## Features

- Intuitive interface with color transitions
- State system: wait (red) → react (green)
- Early click detection
- Real-time statistics panel
- **Data persistence**: Your stats are automatically saved in localStorage
- Personalized messages based on your performance
- Responsive and modern design
- Iconify icons
- **GitHub stars counter**: Shows repository stars in real-time
- Direct link to the repository from the interface
- Mobile touch support
- Keyboard support (spacebar)
- PWA ready with dynamic theme colors

## Technologies

- **React** - UI Framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Main icons
- **Iconify** - Icon library

## Installation

Clone the repository:

```bash
git clone https://github.com/Anghios/reaction.git
cd reaction
```

Install dependencies:

```bash
npm install
```

## Usage

### Development mode

To run the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for production

To build the application:

```bash
npm run build
```

This will generate a `/dist` folder with optimized files ready for production.

### Deploy

Upload the contents of the generated `/dist` folder to your hosting or web server.

## How to play

1. Click on the screen to start
2. Wait for the background to turn green (don't click on red!)
3. Click or press spacebar as fast as possible when you see green
4. Check your statistics and try to beat your record

## Performance ranges

- **Under 200ms**: Amazing! Ninja reflexes
- **200-250ms**: Excellent! Very fast
- **250-300ms**: Well done! Good time
- **300-400ms**: Not bad, you can improve
- **Over 400ms**: A bit slow, try again

## License

MIT
