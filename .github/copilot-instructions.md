# AI Fraud Detection Center - Copilot Customization

This workspace contains a comprehensive fraud detection platform built with React, TypeScript, and modern Azure integration patterns.

## Project Overview

**AI Fraud Detection Center** is an enterprise-grade demo application that simulates a financial fraud detection system with:

- Executive Dashboard with real-time KPIs
- Advanced Alert Center with filtering and pagination
- Case Investigation with AI-powered analysis
- Transaction Simulator for testing
- Copilot Assistant for analysts
- AI Insights panel with recommendations
- 500 synthetic transactions dataset

## Key Technologies

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Ready for**: Azure AI Foundry, Microsoft Fabric, Power BI, Azure OpenAI

## Quick Start

```bash
npm install
npm run dev
```

The application will open at http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Lint code

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── data/           # Mock data generators
├── store/          # Zustand state management
├── types/          # TypeScript definitions
├── styles/         # Global CSS
└── App.tsx         # Root component
```

## Pages

1. **Dashboard** (`/`) - Executive overview with KPIs and charts
2. **Alert Center** (`/alerts`) - Interactive transaction table with filters
3. **Investigation** (`/investigation`) - Case details and AI analysis
4. **Simulator** (`/simulator`) - Generate synthetic transactions
5. **Copilot** (`/copilot`) - Chat-based analytics assistant
6. **Insights** (`/insights`) - AI recommendations and trends

## Data

500 synthetic transactions are auto-generated with:
- Risk scores (0-100)
- Multiple countries and channels
- Realistic fraud patterns
- Persistent storage in localStorage

## Azure Integration (Ready)

The application is prepared for integration with:

- **Azure AI Foundry**: Advanced scoring and analysis
- **Microsoft Fabric**: Real-time data processing
- **Azure OpenAI**: Enhanced text generation
- **Power BI**: Advanced dashboards
- **Azure Event Hub**: Real-time transaction ingestion

See README.md for detailed integration paths.

## Development Notes

- Dark theme by default
- Fully responsive design
- TypeScript strict mode enabled
- Tailwind CSS with custom colors
- Mock API ready for backend integration

## Notes for Copilot

When working in this workspace:

1. **Component Development**: Use React hooks and TypeScript strict types
2. **State Management**: Use Zustand store for all shared state
3. **Styling**: Always use Tailwind CSS classes; avoid inline styles
4. **Data**: Use generators in `src/data/generators.ts`
5. **Types**: Define interfaces in `src/types/index.ts`
6. **Performance**: Memoize expensive calculations
7. **Accessibility**: Include ARIA labels and semantic HTML

## Common Copilot Tasks

- Add new visualization to Dashboard
- Create new page component
- Add filter to Alert Center
- Modify Copilot responses
- Add new AI Insight type
- Customize color scheme
- Add animations
- Performance optimization

---

For full documentation, see [README.md](../README.md)
