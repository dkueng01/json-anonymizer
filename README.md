# JSON Anonymizer

A fast, local, developer-focused tool built to anonymize, censor, and truncate JSON payloads. Perfect for sanitizing API responses or database dumps before sharing them in bug reports, documentation, or public forums.

## 🚀 Features

- **Real-time Processing:** Paste your JSON and watch it get anonymized instantly.
- **Advanced Code Editor:** Powered by `@monaco-editor/react` (the engine behind VS Code) for syntax highlighting, bracket matching, and auto-formatting.
- **Value Censoring:** Automatically converts strings to `***[length]***`, numbers to `9999`, and booleans to `false` to maintain data structure without revealing secrets.
- **Targeted Key Censorship:** Specify a comma-separated list of keys (e.g., `email, phone, ssn`) to rename those specific properties and hide their identities.
- **Array Truncation:** Limit massive arrays of objects to a specific length (up to 100). Enter `0` to keep the array length infinite.
- **Responsive UI:** Side-by-side view on desktop, stacked view on mobile. 100% viewport height utilization to eliminate wasted space.

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Components)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 📦 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/json-anonymizer.git
   cd json-anonymizer
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 💡 How to Use

1. **Paste Data:** Paste your raw JSON object or array into the **Input JSON** editor on the left.
2. **Format:** Click the `Format` button to pretty-print your input JSON.
3. **Censor Values:** Toggle "Censor Values" on or off depending on whether you want to obfuscate all values globally.
4. **Censor Keys:** Enter specific keys you want to hide (e.g., `id, secretToken`). The tool will rename them to `censored_key_[length]`.
5. **Truncate Arrays:** If you paste an array with thousands of items, set the **Max Array Length** to `5` or `10` to shrink the output. Set it to `0` to process all items.
6. **Copy Output:** Click `Copy` on the right side to copy the safe, anonymized JSON to your clipboard.