#Project Setup & Development Guide
#Project Info

This is a modern web application built using a Vite + React stack and developed locally using Visual Studio Code (VS Code).

#How can I edit this code?

You can fully develop and manage this project locally using VS Code or any preferred IDE.

#Prerequisites

Make sure the following are installed on your system:

Node.js (v18 or above recommended)

npm (comes with Node.js)

Git

Visual Studio Code

Recommended: Install Node.js using nvm
https://github.com/nvm-sh/nvm#installing-and-updating

#Run the Project Locally (VS Code)

Follow these steps to run the project on your local machine:

# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate into the project folder
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev


#After running the server, open your browser and visit:

http://localhost:5173


The application supports hot reload, so changes will reflect instantly.

#Editing the Code

Open the project folder in VS Code

Modify files inside the src/ directory

Save changes to see real-time updates in the browser

Recommended VS Code extensions:

ES7+ React Snippets

Tailwind CSS IntelliSense

Prettier

ESLint

Project Technologies

This project uses the following technologies:

Vite – Fast build tool

React – Frontend framework

TypeScript – Type-safe JavaScript

Tailwind CSS – Utility-first styling

shadcn/ui – Reusable UI components

Build for Production

To create an optimized production build:

npm run build


The build files will be generated in the dist/ folder.

Deployment

You can deploy the dist/ folder to any hosting platform such as:

Vercel

Netlify

GitHub Pages

Firebase Hosting

AWS / Azure

Example (Vercel):

vercel deploy

Custom Domain

If deploying to platforms like Vercel or Netlify, you can easily connect a custom domain through their dashboard settings.

Version Control

After making changes:

git add .
git commit -m "Updated project"
git push
