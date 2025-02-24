# User Flow

## User Journey

1. **Barcode Input:**

   - The user enters the barcode manually into the provided input field.
   - The system validates the barcode format and shows a loading indicator upon submission.

2. **API Request:**

   - The validated barcode is sent to the server via an API call.
   - The server processes the request and fetches product details (name and price).

3. **Results Display:**

   - On receiving a successful response, the product name and price are displayed.
   - If an error occurs (invalid barcode, product not found, or network issue), a clear error message is shown.

4. **Post-Search Actions:**
   - The user can choose to perform another search.
   - (Future Enhancement) Options for saving search history or comparing multiple products.

## Data Flow

1. **Input Stage:** User inputs a barcode.
2. **Processing Stage:**
   - Client-side validation is performed.
   - An API request is triggered to fetch the product data.
3. **Output Stage:**
   - Product information is rendered.
   - Errors (if any) are handled and displayed appropriately.
