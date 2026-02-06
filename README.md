# MeBao Guardian Development Repository

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy `.env.example` to `.env` and fill in your SDK Key and backend address.
   ```bash
   VITE_BACKEND_URL=your_backend_address
   VITE_API_KEY=your_SDK_KEY
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Notes

- **Core Code**: Main logic is in `src/components/Guardian/index.tsx`.
- **Styles**: Edit `src/components/Guardian/styles.css`.
- **Backend Connection**: The project retains Socket.io and Fetch dependencies for communication with the main backend.
