# Smart Diagnose: A Multi-Disease Prediction Platform

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

A full-stack web application that leverages machine learning to provide early-stage predictions for multiple diseases based on user-provided data. This project demonstrates a modern, responsive frontend built with React and a powerful, multi-model backend API built with Flask.

**Live Demo:** [**smart-diagnose.vercel.app**](https://smart-diagnose.vercel.app/)

---

## About The Project

Smart Diagnose is an educational tool designed to showcase the power of combining modern web development with machine learning. Users can navigate a sleek, intuitive interface to select a disease, input relevant medical data, and receive an instant prediction along with a model confidence score.

### Key Features

* **Multi-Disease Support:** Easily switch between different prediction models for various diseases like Breast Cancer, Heart Disease, Diabetes, and more.
* **Dynamic UI:** The prediction form intelligently adapts to show only the required input fields for the selected disease model.
* **Instant Feedback:** Get predictions in real-time with a visual confidence meter and detailed information about the result.
* **Prediction History:** The last 5 predictions are automatically saved in the browser's local storage for easy review.
* **Fully Responsive:** A professional, mobile-first design that works beautifully on any device.
* **Modern Tech Stack:** Built with a fast React/Vite frontend and a robust Flask/Scikit-learn backend.

## Tech Stack

**Frontend:**
* React.js (with Vite)
* React Router for navigation
* Axios for API communication
* CSS for custom styling

**Backend:**
* Flask (Python Web Framework)
* Pandas for data manipulation
* Scikit-learn for machine learning
* Gunicorn as the production web server

**Deployment:**
* Frontend deployed on **Vercel**.
* Backend deployed on **Render**.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm (or yarn)
* Python 3.x and pip

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/pawang001/Smart-Diagnose.git
    cd Smart-Diagnose
    ```

2.  **Backend Setup:**
    ```sh
    cd Backend
    python -m venv venv
    .\venv\Scripts\activate  # On Windows
    # source venv/bin/activate  # On macOS/Linux
    pip install -r requirements.txt
    flask run --port=5001
    ```
    Your backend API should now be running on `http://127.0.0.1:5001`.

3.  **Frontend Setup** (in a new terminal):
    ```sh
    cd frontend
    npm install
    npm run dev
    ```
    Your frontend development server should now be running on `http://localhost:5173`.

## Disclaimer

This tool is for educational and informational purposes only and is **not a substitute for professional medical advice**, diagnosis, or treatment. Always consult with a qualified healthcare professional for any health concerns.

## Contact

Pawan Kumar Gupta - pawang1710@gmail.com
