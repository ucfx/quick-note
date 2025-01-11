# Quick Note

A modern note-taking application built with Expo, React Native, and Supabase.

## Features

- Create and manage notes with titles and content
- Add tasks to notes
- Color-code notes for organization
- Tag-based organization
- Archive functionality
- Real-time sync with Supabase backend

## Tech Stack

- [Expo](https://expo.dev/) - React Native development framework
- [React Native](https://reactnative.dev/) - Cross-platform mobile development
- [Supabase](https://supabase.io/) - Backend as a Service (BaaS)
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing

## Project Structure

```
quick-note/
├── app/                # Application screens and routing
│   ├── (tabs)/         # Tab-based navigation
│   │   ├── _layout.tsx # Tab navigation layout
│   │   └── index.tsx   # Notes list screen
│   ├── note/           # Note-related screens
│   │   ├── [id]/       # Dynamic note view/edit
│   │   └── new.tsx     # New note creation
│   └── _layout.tsx     # Root layout
├── assets/             # Static assets
├── components/         # Reusable UI components
├── constants/          # App-wide constants
├── lib/                # Utility functions and configurations
├── supabase/           # Database migrations and configurations
└── types/              # TypeScript type definitions
```

## Getting Started

1. Clone the repository:
  ```bash
  git clone https://github.com/ucfx/quick-note.git
  cd quick-note
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Start the development server:
  ```bash
  npm start
  ```

4. Open the project in Expo Go app on your mobile device or use an emulator.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.