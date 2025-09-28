# PlagExit - Assignment Plagiarism Detection

![Logo](./demo/logo.png)

---

## 📋 Summary

**PlagExit** is a next-generation, scalable web platform that empowers educators to uphold academic integrity with confidence. Leveraging state-of-the-art NLP, a modern microservices-inspired stack, and a beautiful user experience, this project is built for real-world impact and seamless deployment at scale.

---

## ✨ Features

- **Advanced Plagiarism Detection**
  - Combines MinHash+LSH for high-accuracy detection
  - Smart preprocessing: lowercasing, punctuation & stopword removal, shingling
  - Flags all matching submissions, not just the latest
- **User-Friendly Dashboard**
  - Professor dashboard with sortable, filterable tables
  - Delete submissions with a single click
  - Export results to Excel (with Excel-style button)
- **Plagiarism Severity Management**
  - Assignment-level severity bar (easy/medium/hard)
  - Severity directly impacts final score calculation
- **Elegant UI/UX**
  - Responsive, clean, and modern design
  - Fixed-width columns, ellipsis, and tooltips for clarity
- **Cloud-Ready & Scalable**
  - Dockerized backend, frontend, and MongoDB Atlas for easy, global deployment
  - Uses service names for seamless inter-container communication
  - Data persistence with Docker volumes
- **Extensible**
  - Easily add new detection algorithms or integrate with other systems

---

## 🏗️ Architecture

- **Backend:** Flask (Python 3.10), Gunicorn, MongoDB Atlas, Poppler, Tesseract
- **Frontend:** React 18, Material-UI, served with Nginx
- **Database:** MongoDB Atlas (cloud-hosted)
- **Containerization:** Docker & Docker Compose

```
[User] ⇄ [Frontend (React + Nginx)] ⇄ [Backend (Flask API)] ⇄ [MongoDB Atlas]
```

---

## 🌍 Scalability 

- **Cloud-Native:** Connects to MongoDB Atlas for high availability and global access.
- **Stateless API:** Backend can be scaled horizontally with zero downtime.
- **Persistent Storage:** Data is safe and accessible from anywhere.
- **Secure & Configurable:** All secrets and URIs managed via environment variables.
- **CI/CD Friendly:** Dockerized for seamless integration into any deployment pipeline.

---

## 🖼️ Screenshots

### Dashboard
![Dashboard](./demo/dashboard.png)

### Plagiarism Detection
![Detection](./demo/detection.png)

### Export to Excel
![Export](./demo/excel.png)

---

## 🛠️ Setup & Installation

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- A [MongoDB Atlas](https://www.mongodb.com/atlas/database) cluster

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/5hubham6/PlagExit---Assignment-Plagarism-Detection.git
   cd PlagExit---Assignment-Plagarism-Detection
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your actual values
   nano .env  # or use your preferred editor
   ```

3. **Configure your .env file:**
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/plagexit_db?retryWrites=true&w=majority
   
   # Flask Configuration
   SECRET_KEY=your-super-secret-key-here-change-this-in-production
   ```

4. **Build and run all services:**
   ```bash
   docker-compose up --build
   ```

5. **Access the application:**
   - **Frontend:** [http://localhost](http://localhost)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)
   - **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

### Development Mode

For development with hot reloading:

```bash
# Backend only
cd flask-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend only
cd client
npm install
npm start
```

### Stopping the Application

- **Stop containers:** Press `Ctrl+C` in the terminal
- **Remove containers and networks:**
  ```bash
  docker-compose down
  ```
- **Remove everything including volumes:**
  ```bash
  docker-compose down -v --remove-orphans
  ```

### Troubleshooting

1. **Port conflicts:** Ensure ports 80 and 5000 are available
2. **MongoDB connection:** Verify your Atlas connection string
3. **Build issues:** Try `docker-compose build --no-cache`
4. **Permission issues:** Ensure Docker has proper permissions

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes | - |
| `SECRET_KEY` | Flask secret key for sessions | Yes | - |
| `FLASK_ENV` | Flask environment (production/development) | No | production |
| `FRONTEND_URLS` | Allowed frontend URLs for CORS | No | http://localhost |
| `PRODUCTION_DOMAINS` | Production domains for CORS (comma-separated) | No | - |

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

