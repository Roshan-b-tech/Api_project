# Apify Integration Web App

A clean, minimal web application that demonstrates integration with the Apify platform. This app allows users to authenticate with their Apify API key, browse their actors, view input schemas dynamically, and execute actors with real-time results.

## Features

- **Secure Authentication**: Connect using your Apify API key
- **Dynamic Actor Loading**: Browse all actors from your Apify account
- **Runtime Schema Fetching**: View input schemas dynamically loaded from the Apify API
- **Single-Run Execution**: Execute actors with custom inputs and view results immediately
- **Error Handling**: Clear feedback for authentication failures, schema mismatches, and execution errors
- **Responsive Design**: Clean, modern UI that works on all devices

## Installation and Setup

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd apify-integration-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

## How to Use

1. **Get your Apify API Key**
   - Go to [Apify Console](https://console.apify.com/account/integrations)
   - Copy your API token

2. **Authenticate**
   - Enter your API key in the authentication form
   - Click "Connect" to authenticate

3. **Select an Actor**
   - Browse through your available actors
   - Click on any actor to select it

4. **View Schema & Execute**
   - The input schema will load automatically
   - Fill in the required parameters
   - Click "Execute Actor" to run it
   - View the results in real-time

## Technical Implementation

### Architecture
- **Frontend**: React with TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **API Integration**: Direct integration with Apify REST API
- **State Management**: React hooks for clean state handling

### Key Components
- `AuthForm`: Handles API key authentication
- `ActorSelector`: Displays and manages actor selection
- `SchemaViewer`: Dynamically renders input schemas
- `ExecutionPanel`: Manages actor execution and results
- `InputRenderer`: Dynamically generates form inputs based on schema

### Security Features
- API keys are handled securely in memory only
- All API calls use proper authentication headers
- Error messages provide clear feedback without exposing sensitive information

### Testing Actor
For testing purposes, you can use the "Web Scraper" actor which is commonly available in Apify accounts and has a well-defined input schema.

## Design Choices

- **Minimal Dependencies**: Uses only essential packages (React, TypeScript, Tailwind CSS)
- **Clean Architecture**: Modular components with clear separation of concerns
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-first approach with clean, modern aesthetics

## API Integration

The app integrates with these Apify API endpoints:
- `GET /v2/acts` - Fetch user's actors
- `GET /v2/acts/{actorId}/input-schema` - Get actor input schema
- `POST /v2/acts/{actorId}/runs` - Execute actor with inputs

All API calls include proper authentication and error handling.