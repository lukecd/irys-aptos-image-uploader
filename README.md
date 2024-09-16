# AdUploader Component

The `AdUploader` component is a React and TypeScript-based uploader for an Ad-tech application, it uses the [Aptos wallet](https://aptosfoundation.org/) and [Irys for permanent onchain storage.](https://docs.irys.xyz/) It allows users to pick an image, enter metadata about an ad, and upload the file to the Irys network. The component dynamically checks the file size and handles payment if the size exceeds the 100 KiB free upload limit size on Irys.

## Features

- **Image Picker**: Users can select an image to upload.
- **Metadata Input**: Text fields for ad metadata such as title, campaign name, advertiser ID, etc.
- **File Size Check**: Automatically checks if the total upload size is under 100 KiB to determine if a payment is needed.
- **Payment Handling**: If the file size exceeds 100 KiB, calculates the required funding and handles the payment.
- **Upload to Irys**: Uploads the image and metadata tags to Irys and displays the resulting URL.

## Installation

To install and run the example, follow these steps:

1. **Clone the repository**:

2. **Install the dependencies**:

    Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:

    ```bash
    npm install
    ```

3. **Run the Development Server**:

    To run the example locally, use:

    ```bash
    npm run dev
    ```

    This command starts a development server. Open [http://localhost:3000](http://localhost:3000) in your browser to see the `AdUploader` component in action.

## Usage

To use the `AdUploader` component, you must import it into your React application and [ensure your project is set up to connect to Irys + Aptos](https://docs.irys.xyz/build/d/irys-in-the-browser#aptos) using the `@irys/web-upload` and `@aptos-labs/wallet-adapter-react` packages.

### Example

```tsx
import React from "react";
import AdUploader from "./components/AdUploader";

const App: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ad Uploader Example</h1>
      <AdUploader />
    </div>
  );
};

export default App;
```