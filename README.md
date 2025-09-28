# PlagExit - Assignment Plagiarism Detection

![Logo](./demo/logo.png)

---

## 📋 Summary

**PlagExit** is a smart plagiarism detection system designed to help professors catch copied assignments and grade them properly. The system does two main things: it finds students who copied from each other, and it automatically grades assignments by comparing them to the professor's model answers using machine learning. 

The plagiarism detection uses MinHash and LSH algorithms to quickly compare thousands of documents, while the grading system uses semantic similarity to understand if a student's answer means the same thing as the correct answer, even if they used different words.

---

## ✨ Features

- **Smart Plagiarism Detection**
  - Uses MinHash and LSH algorithms to find copied content quickly
  - Detects paraphrasing and word substitutions, not just exact matches
  - Shows which parts of assignments are similar to each other
  - Works with both text files and scanned PDFs (using OCR)

- **Intelligent Grading System**
  - Compares student answers to professor's model answers using AI
  - Uses semantic similarity to understand meaning, not just keywords  
  - Automatically reduces grades for plagiarized content
  - Handles different assignment difficulty levels (easy/medium/hard)

- **Easy-to-use Dashboards**
  - Professor dashboard shows all submissions with grades and plagiarism scores
  - Student dashboard for uploading assignments and viewing results
  - One-click Excel export for all assignment data
  - Clean, responsive design that works on phones and computers

- **Flexible System**
  - Upload assignments as PDF or text files
  - Set custom plagiarism thresholds for different assignment types
  - Bulk download all submissions for offline review
  - Automatic email notifications for new submissions

- **Production Ready**
  - Built with Flask backend and React frontend
  - Uses MongoDB Atlas cloud database for reliability
  - Everything runs in Docker containers for easy deployment
  - Handles hundreds of students and assignments without issues

---

## 🏗️ How It Works

The system has three main parts:

1. **Frontend (React)**: Students and professors interact through a clean web interface
2. **Backend (Flask + Python)**: Processes documents, runs plagiarism detection, and calculates grades
3. **Database (MongoDB Atlas)**: Stores all assignments, submissions, and results in the cloud

**The Process:**
1. Professor uploads assignment questions and model answers
2. Students upload their submissions (PDF or text files)
3. System extracts text from PDFs using OCR if needed
4. Plagiarism detection runs automatically, comparing all submissions
5. Grading happens by comparing each answer to the model answer using AI
6. Results show up instantly on both professor and student dashboards

**What Makes It Smart:**
- The plagiarism detection doesn't just look for exact matches - it finds paraphrased content too
- The grading system understands context and meaning, so students get credit for correct answers even if they phrase things differently
- Everything happens automatically, but professors can review and adjust grades manually if needed

---

## 🌍 Why This is Different

Most plagiarism checkers just tell you "this looks copied" but don't actually help with grading. This system does both:

- **Smart Detection**: Finds similarities even when students change words around or rephrase sentences
- **Real Grading**: Actually reads and understands answers, then compares them to what the professor wanted
- **Easy to Use**: Professors don't need to be tech experts - just upload files and get results
- **Scales Well**: Can handle entire classes without slowing down
- **Always Available**: Runs in the cloud so students can submit from anywhere, anytime
- **Complete Solution**: Everything from file upload to final grades in one system

This project addresses the gap where existing tools either catch plagiarism OR help with grading, but not both. This does everything in one place and works reliably.

---

## 🖼️ Screenshots

### Homepage
This is what you see when you first visit the site. Clean and simple.

![Homepage](./demo/homepage.png)

### More Homepage Features
Shows the features and what the system can do.

![Homepage 2](./demo/homepage2.png)

### Professor Dashboard - Overview
Professors can see all their assignments and how students are doing.

![Professor Dashboard](./demo/prof-dashboard-1.png)

### Professor Dashboard - Detailed View
This shows individual submissions with plagiarism scores and grades.

![Professor Dashboard Details](./demo/prof-dashboard-2.png)

### Student Dashboard
Students can upload their assignments here and see their results.

![Student Dashboard](./demo/student-dashboard-1.png)

### Excel Export
Export all the data to Excel for further analysis or record keeping.

![Excel Export](./demo/excel.png)

---

## 🛠️ Setup & Installation

### What You Need
- Docker Desktop (handles all the technical stuff automatically)
- MongoDB Atlas account (free tier works fine for most classes)
- About 10 minutes to get everything running

### Quick Setup

1. **Get the code:**
   ```bash
   git clone https://github.com/5hubham6/PlagExit---Assignment-Plagarism-Detection.git
   cd PlagExit---Assignment-Plagarism-Detection
   ```

2. **Configure your database:**
   - Create a free MongoDB Atlas cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Get your connection string (looks like `mongodb+srv://username:password@...`)
   - Copy `env.example` to `.env` and paste your connection string

3. **Start everything:**
   ```bash
   docker-compose up --build
   ```

4. **You're done!**
   - Open [http://localhost](http://localhost) to see the app
   - Register as a professor to create assignments
   - Students can register and start submitting

### For Development

If you want to modify the code:

```bash
# Run backend only (for Python development):
cd flask-server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Run frontend only (for React development):
cd client
npm install
npm start
```

### Common Issues

- **Port already in use**: Make sure nothing else is running on ports 80 or 5000
- **Database connection failed**: Double-check your MongoDB Atlas connection string
- **Docker won't start**: Make sure Docker Desktop is running
- **Upload not working**: Check that you have write permissions in the project folder

### Stopping Everything

Press `Ctrl+C` in the terminal, or run:
```bash
docker-compose down
```

---

## 🌐 Deploy to Production (FREE)

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app) and sign up
2. Click "Deploy from GitHub repo"
3. Select this repository
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `SECRET_KEY`: A random secret key for production
5. Railway will automatically build and deploy both frontend and backend
6. Your app will be live at `https://your-app-name.up.railway.app`

### Option 2: Render
1. Go to [render.com](https://render.com) and sign up
2. Create new "Web Service" from your GitHub repo
3. Set build command: `docker-compose build`
4. Set start command: `docker-compose up`
5. Add the same environment variables as above

### Option 3: Vercel + Railway
- **Frontend**: Deploy React app on [vercel.com](https://vercel.com)
- **Backend**: Deploy Flask API on [railway.app](https://railway.app)
- Update frontend API URL to point to Railway backend

**All these options are completely FREE for personal projects!**

---

## 🚀 How to Use

### For Professors
1. Register an account and log in
2. Create a new assignment with questions and model answers
3. Share the assignment code with your students
4. Students submit their work
5. View results on your dashboard - grades and plagiarism detection happen automatically
6. Export everything to Excel for your records

### For Students
1. Register with your student email
2. Enter the assignment code your professor gave you
3. Upload your assignment (PDF or text file)
4. See your grade and any feedback immediately
5. Check if your submission was flagged for similarity to others

### Tips for Best Results
- **Model answers**: Write clear, complete model answers - the grading quality depends on these
- **Assignment types**: Mark assignments as easy/medium/hard to adjust grading strictness
- **File formats**: PDFs work fine, but text files process faster
- **Plagiarism thresholds**: Start with default settings, adjust if you get too many false positives

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

