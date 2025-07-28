<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# JSON Side-by-Side Filter

A powerful and intuitive web application built with **React** that allows users to upload a JSON file, interactively select which keys to keep, and see a live, side-by-side preview of the filtered output.

---

## ✨ Features

- **Interactive Side-by-Side View:** Instantly see the original uploaded JSON next to the filtered output.
- **Live Filtering:** The filtered JSON view updates in real-time as you select or deselect keys.
- **Hierarchical Key Tree:** Displays all keys from the JSON in a nested, expandable tree structure, making it easy to navigate complex data.
- **Bulk Selection:** "Select All" and "Deselect All" buttons for quick actions.
- **Search Functionality:** Easily find specific keys within the tree by searching.
- **Download Filtered JSON:** Export the filtered data as a new, clean JSON file.
- **File Upload:** Simple drag-and-drop or file selection for your JSON files.
- **Responsive Design:** A clean, modern interface that works on different screen sizes.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (includes npm)

### Installation

#### 1. Clone the repository (or create a new project)

If you have cloned this repository, navigate into the project directory.  
If you are starting from scratch, create a new React app:

```bash
npx create-react-app json-filter-app
cd json-filter-app
```

#### 2. Install Tailwind CSS

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.  
Follow the [official guide](https://tailwindcss.com/docs/guides/create-react-app) to install it in your React project.

#### 3. Replace the code

Copy the code from `App.js` provided in the project files into your `src/App.js`.

#### 4. Run the application

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📝 How to Use

1. **Upload a JSON file** using the "Upload JSON" button in the header.
2. Once loaded, you will see the **original JSON on the left** and the **filtered JSON on the right**.
3. In the center panel, use the **checkboxes** to select or deselect the keys you want to keep.
    - Clicking a parent key will toggle the selection for itself and all its children.
4. Use the **search bar** to quickly find specific keys.
5. The filtered JSON view on the right will **update in real-time**.
6. Once you are satisfied with the result, click the **"Download Filtered"** button to save the new JSON file.

---

Enjoy filtering your JSON files
>>>>>>> 5960327 (Initial commit)
