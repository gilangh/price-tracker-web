# Project Structure

## Overview

The project follows a modular architecture using Next.js’s file-based routing and server-side rendering, with Tailwind CSS for styling. This structure ensures a clean separation of concerns and maintainability.

## Directory Layout

/project-root /components # Reusable UI components (e.g., BarcodeInput, ProductDisplay) /pages # Next.js pages (e.g., index.js for home, results.js for product display) /styles # Tailwind CSS configuration and global styles /utils # Utility functions (e.g., API calls, validation logic) /tests # Unit and integration tests package.json next.config.js tailwind.config.j

## Data Flow

1. **User Input:** The user enters a barcode on the home page.
2. **Validation & API Request:**
   - The barcode is validated on the client side.
   - A server-side or client-side API request is triggered to fetch product details.
3. **Rendering:**
   - Product details (name and price) are rendered dynamically on the results page.
4. **Error Handling:**
   - Any errors during validation or data fetching are captured and displayed with user-friendly messages.
