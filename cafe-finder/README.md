# Cafe Finder

A modern web application for finding cafes using natural language search powered by ChatGPT.

## Features

- **Natural Language Search**: Ask for cafes in plain English (e.g., "quiet place with good pastries")
- **Personalized Recommendations**: Filter cafes based on your preferences
- **Smart Relevance Scoring**: Cafes are scored based on how well they match your query and preferences
- **Detailed Cafe Information**: See images, menu items, reviews, and more
- **Bookmarking**: Save your favorite cafes for later

## Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```
   You can get an API key from [OpenAI's platform](https://platform.openai.com/api-keys)
4. Run `npm start` to start the development server

## Natural Language Search

This app uses ChatGPT to interpret search queries and match them with cafe information, including:
- Reviews
- Cafe descriptions
- Tags and vibe tags
- Menu items

For example, you could search for:
- "A quiet place to study with good wifi"
- "Coffee shop with outdoor seating and pastries"
- "Cozy cafe with specialty lattes"

## Smart Relevance Scoring

Each search result is scored out of 10 based on:

1. **Natural Language Understanding**: How well the cafe's information matches your search query
2. **User Preferences**: Your settings automatically boost scores for cafes that match your preferences:
   - Preferred seating (indoor/outdoor)
   - Payment method (cash/credit card)
   - Noise level (quiet/cafe sounds)
   - Price range ($/$$/etc.)
   - Accessibility needs

Cafes with scores of 8 or higher are marked as "Perfect Match" in the search results.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

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
