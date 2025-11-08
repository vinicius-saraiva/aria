# Sailing Weather AI Assistant

An AI-powered sailing weather interpretation tool that helps sailors understand weather conditions using real-time data from earth.nullschool.net.

## Features

- 🗺️ **Interactive Weather Map**: Integrated earth.nullschool.net map showing real-time global wind patterns
- 💬 **AI Chat Assistant**: Chat with Claude AI about weather conditions and sailing advice
- 📍 **Location Selection**: Enter coordinates to view specific locations and ask targeted questions
- ⛵ **Sailing-Specific Analysis**: Get weather interpretations specifically tailored for sailing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key (get one at https://console.anthropic.com/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your Anthropic API key:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **View the Map**: The left side shows the earth.nullschool.net weather map with real-time wind patterns
2. **Select a Location**:
   - Enter latitude and longitude coordinates in the input fields at the top
   - Click "Go" to navigate to that location
3. **Chat with AI**:
   - Use the chat panel on the right to ask questions about weather conditions
   - The AI assistant will provide sailing-specific weather analysis
   - You can ask about wind patterns, weather systems, sailing conditions, and more

## Example Questions

- "What are the wind conditions at this location?"
- "Is it safe to sail here?"
- "Explain the weather pattern I'm seeing"
- "What's the Beaufort scale reading for these winds?"
- "Should I be concerned about any weather systems nearby?"

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude 3.5 Sonnet
- **Weather Data**: earth.nullschool.net

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Contributing

Feel free to submit issues or pull requests!

## License

MIT
