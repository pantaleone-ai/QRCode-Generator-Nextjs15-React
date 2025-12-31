# Free Custom QR Code Generator with Logo - Built with Next.js & React

![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)

A feature-rich, high-performance QR code generator built with the latest web technologies. This application allows users to create, customize, and download high-resolution QR codes with a custom logo overlay, colors, and high error correction for maximum scannability.

### [➡️ View the Live Demo](https://genqrai.vercel.app/)

---

## ✨ Key Features

This project is more than just a basic generator; it's a demonstration of robust front-end development techniques.

*   **Dynamic & Real-time Generation**: QR codes are generated instantly as you type, thanks to a debounced input for a smooth user experience.
*   **🎨 Full Customization**: Easily modify the foreground and background colors, and adjust the final image size.
*   **👤 Custom Logo Overlay**: A custom-drawn logo is dynamically and reliably composited onto the center of the QR code.
*   **🛡️ High Scannability**: Utilizes 'High' error correction (`level="H"`) and a manually controlled "quiet zone" (margin) to ensure the QR code works perfectly even with a logo overlay.
*   **💾 High-Resolution Export**: Download a crisp, high-DPI PNG of your QR code, perfect for both digital and print use.
*   **📋 Copy to Clipboard**: Instantly copy the generated QR code to your clipboard for quick sharing.
*   **🚀 SEO-Optimized**: Includes a detailed content section with FAQs and use-cases to improve search engine visibility.
*   **📱 Fully Responsive**: A clean, modern UI built with Tailwind CSS that works flawlessly on all devices.
*   **🔔 Modern UX**: Features non-disruptive toast notifications for user feedback instead of jarring alerts.

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Language**: JavaScript / JSX
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **QR Code Logic**: [qrcode.react](https://github.com/zpao/qrcode.react)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Deployment**: [Vercel](https://vercel.com/)

---

## 💡 The Core Logic: Reliable Logo Compositing

The most significant technical challenge in this project was reliably overlaying a custom logo onto the QR code without affecting scannability or creating race conditions. The solution is a robust two-canvas approach:

1.  **Hidden Canvas**: A hidden `<QRCodeCanvas>` component from `qrcode.react` is used to render the raw, edge-to-edge QR code (with `includeMargin={false}`).
2.  **Visible Canvas**: A second, user-facing `<canvas>` element serves as the final composition target.
3.  **Compositing with `useEffect`**: A `useEffect` hook orchestrates the process.
    *   It waits for the hidden canvas to be fully rendered.
    *   It then draws the hidden canvas onto the visible canvas, scaling it down slightly to create a perfect, manually-controlled margin (the "quiet zone").
    *   Finally, it calls a custom `drawLogo` function to paint the logo directly in the center of the visible canvas.

This method guarantees that the final image is perfectly centered, scannable, and matches exactly what the user sees on screen for downloads and copies.

---

## 🚀 Getting Started

You can easily run this project on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18.0 or later)
*   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/pantaleone-ai/qrgen-main.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd qrgen-main
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

![Screenshot of the QR Code Generator App|400x750,100%](https://pantaleone-net.s3.us-west-1.amazonaws.com/qr1.webp)

![Screenshot of the QR Code Generator App|400x750,100%](https://pantaleone-net.s3.us-west-1.amazonaws.com/qr2.webp)

![Screenshot of the QR Code Generator App|400x750,100%](https://pantaleone-net.s3.us-west-1.amazonaws.com/qr3.webp)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/pantaleone-ai/qrgen-main/issues).

## 📜 License

This project is distributed under the MIT License. See `LICENSE` for more information.

## 👤 Contact

**PantaleoneAI** - [pantaleone.net](https://pantaleone.net)
