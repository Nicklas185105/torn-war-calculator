# Torn Faction War Overview

## Supabase

Generate types from supabase with the following:

```bash
npx supabase gen types typescript --project-id <id> > database.types.ts
```

## Localtunnel for Clerk

To start a new localtunnel so we can use the webhooks locally:

```bash
lt --port 3000 --subdomain long-suns-laugh
```

## Project Goal

This project aims to provide Torn factions with a comprehensive and user-friendly web application to get a quick overview of their ranked war status. The application fetches and displays detailed war reports, including faction scores, member contributions, and other relevant statistics, allowing faction members to analyze their performance and strategize accordingly.

## Project Structure

The project is organized into the following structure:

```plaintext
torn-war-calculator/
│
├── api/                # Vercel serverless functions
│   ├── fetchWarReport.ts
│   └── ...other functions
│
├── public/             # React public directory
│   └── ...public files
│
├── src/                # React source files
│   ├── components/     # React components
│   ├── utils/          # Utility functions
│   ├── App.tsx
│   ├── index.tsx
│   └── ...other source files
│
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
├── vercel.json         # Vercel configuration
└── ...other project files
```

## Key Directories and Files

* **api/**: Contains the serverless functions deployed on Vercel. These functions handle API requests to fetch war reports from the Torn API.
* **public/**: Contains the public assets and files for the React application.
* **src/**: Contains the source code for the React application, including components, styles, and other assets.
* **package.json**: Lists project metadata, dependencies, and scripts for building and deploying the application.
* **vercel.json**: Configuration file for Vercel to specify the settings for serverless functions.

## Hosting

### Frontend

The frontend of the application is a React app hosted on GitHub Pages. This ensures a cost-effective and reliable way to serve the static content of the application. You can access it [here](https://nicklas185105.github.io/torn-war-calculator/).

### Backend

The backend consists of serverless functions hosted on Vercel. These functions handle API requests to the Torn API and process the data to be displayed in the frontend.

## Development and Deployment

### Development Setup

1. Clone the Repository:

```bash
git clone <https://github.com/><username>/my-project.git
cd my-project
```

2. Install Dependencies:

```bash
npm install
```

3. Environment Variables:

Create a .env file in the root directory with the following content:

```plaintext
REACT_APP_API_URL=<http://localhost:3000/api>
```

4. Start the Development Server:

Read more in the section [Running and Testing Serverless Functions Locally](#running-and-testing-serverless-functions-locally)

## Deployment

### Deploying the Frontend to GitHub Pages

Deploy to GitHub Pages:

```bash
npm run deploy
```

> *The project will be build automatically because of a **predeploy** script*

### Deploying the Backend to Vercel

1. Set Up Vercel:
   * Create an account on [Vercel](https://vercel.com/) and connect your GitHub repository.
2. Configure Serverless Functions:
   * Ensure your api/ directory contains the serverless functions.
   * Create a vercel.json file to specify function settings.

```json
{
  "functions": {
    "api/*.ts": {
      "memory": 128,
      "maxDuration": 10
    }
  }
}
```

3. Deploy:
   * Push your code to GitHub, and Vercel will automatically detect and deploy the serverless functions.

## Running and Testing Serverless Functions Locally

To run and test your serverless functions locally, follow these steps:

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Run Vercel Development Server:

Navigate to your project directory and run the development server:

```bash
vercel dev
```

4. Accessing Your Serverless Functions Locally:

Your serverless functions will be available at [localhost API](http://localhost:3000/api/). For example, if you have a function named fetchWarReport.js in your api directory, you can access it at:

```plaintext
http://localhost:3000/api/fetchWarReport
```

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please create an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
