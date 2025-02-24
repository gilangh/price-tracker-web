# Barcode Price Tracker

A simple, efficient, and user-friendly web application that empowers users to quickly retrieve product details by entering a barcode.

## Features

- Manual barcode input with validation
- Real-time product information lookup
- Responsive design for all devices
- Error handling and user feedback
- Performance optimized

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS for styling
- ESLint & Prettier for code quality

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with required environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
  ├── app/           # Next.js app router pages
  ├── components/    # Reusable React components
  ├── utils/         # Utility functions
  ├── types/         # TypeScript type definitions
  ├── hooks/         # Custom React hooks
  ├── styles/        # Global styles
  └── lib/           # External library configurations
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `NEXT_PUBLIC_APP_NAME` - Application name
- `API_TIMEOUT` - API request timeout in milliseconds

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
