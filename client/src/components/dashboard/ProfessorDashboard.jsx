import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import CreateAssignmentModal from './CreateAssignmentModal';
import './Dashboard.css';
import './DashboardTheme.css';
import '../LightTheme.css';
import { FaBook, FaCalendarAlt, FaChalkboardTeacher, FaBell, FaUserCircle, FaRegLifeRing, FaClipboardList, FaUsers, FaChartBar } from 'react-icons/fa';
import ProfessorProfile from './ProfessorProfile';
import ModernNavbar from '../ModernNavbar';
import * as XLSX from 'xlsx';

// Placeholder components for new pages
function StudentDirectoryPage() {
    return <div style={{ padding: 32 }}><h2 style={{ color: '#1976D2' }}>Student Directory</h2><p>Feature coming soon.</p></div>;
}
function TimetablePage() {
    const [section, setSection] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [timetables, setTimetables] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    React.useEffect(() => {
        fetchTimetables();
    }, []);

    const fetchTimetables = () => {
        setLoading(true);
        fetch('/api/timetable/list', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setTimetables(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load timetables');
                setLoading(false);
            });
    };

    const handleUpload = e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!section || !file) {
            setError('Section and PDF file are required');
            return;
        }
        const formData = new FormData();
        formData.append('section', section);
        formData.append('pdf', file);
        fetch('/api/timetable/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSuccess('Timetable uploaded successfully!');
                    setSection('');
                    setFile(null);
                    fetchTimetables();
                } else {
                    setError(data.error || 'Upload failed');
                }
            })
            .catch(() => setError('Upload failed'));
    };

    const handleDelete = section => {
        setError('');
        setSuccess('');
        fetch(`/api/timetable/${section}`, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSuccess('Timetable deleted');
                    fetchTimetables();
                } else {
                    setError(data.error || 'Delete failed');
                }
            })
            .catch(() => setError('Delete failed'));
    };

    return (
        <div style={{ padding: 32 }}>
            <h2 style={{ color: '#1976D2' }}>Timetable Management</h2>
            <form onSubmit={handleUpload} style={{ marginBottom: 32, display: 'flex', gap: 16, alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Section (e.g., A, B, C)"
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    style={{ padding: 8, borderRadius: 6, border: '1.5px solid #e0e0e0', minWidth: 120 }}
                />
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => setFile(e.target.files[0])}
                    style={{ padding: 8 }}
                />
                <button type="submit" className="theme-btn" style={{ background: '#1976D2', color: '#fff' }}>Upload</button>
            </form>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            {success && <div style={{ color: '#1976D2', marginBottom: 16 }}>{success}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8 }}>
                    <thead>
                        <tr style={{ background: '#F4F6FA' }}>
                            <th style={{ color: '#1976D2', fontWeight: 700, padding: 12, textAlign: 'left' }}>Section</th>
                            <th style={{ color: '#1976D2', fontWeight: 700, padding: 12, textAlign: 'left' }}>Upload Date</th>
                            <th style={{ color: '#1976D2', fontWeight: 700, padding: 12, textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetables.map(t => (
                            <tr key={t.section}>
                                <td style={{ padding: 12 }}>{t.section}</td>
                                <td style={{ padding: 12 }}>{new Date(t.upload_date).toLocaleString()}</td>
                                <td style={{ padding: 12 }}>
                                    <a href={`/api/timetable/${t.section}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2', marginRight: 16 }}>Download</a>
                                    <button onClick={() => handleDelete(t.section)} style={{ color: '#fff', background: '#dc3545', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
function ReportsPage() {
    return <div style={{ padding: 32 }}><h2 style={{ color: '#1976D2' }}>Reports</h2><p>Feature coming soon.</p></div>;
}
function NotificationsPage() {
    const [notifications, setNotifications] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [form, setForm] = React.useState({ section: '', title: '', message: '' });

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        setLoading(true);
        fetch('/api/notifications/professor', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setNotifications(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load notifications');
                setLoading(false);
            });
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.section || !form.title || !form.message) {
            setError('All fields are required');
            return;
        }
        fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSuccess('Notification created!');
                    setForm({ section: '', title: '', message: '' });
                    fetchNotifications();
                } else {
                    setError(data.error || 'Failed to create notification');
                }
            })
            .catch(() => setError('Failed to create notification'));
    };

    const handleDelete = id => {
        setError('');
        setSuccess('');
        fetch(`/api/notifications/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSuccess('Notification deleted');
                    fetchNotifications();
                } else {
                    setError(data.error || 'Delete failed');
                }
            })
            .catch(() => setError('Delete failed'));
    };

    return (
        <div style={{ padding: 32 }}>
            <h2 style={{ color: '#1976D2' }}>Notifications Management</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: 32, display: 'flex', gap: 16, alignItems: 'center' }}>
                <input
                    type="text"
                    name="section"
                    placeholder="Section (e.g., A, B, C)"
                    value={form.section}
                    onChange={handleChange}
                    style={{ padding: 8, borderRadius: 6, border: '1.5px solid #e0e0e0', minWidth: 120 }}
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    style={{ padding: 8, borderRadius: 6, border: '1.5px solid #e0e0e0', minWidth: 180 }}
                />
                <input
                    type="text"
                    name="message"
                    placeholder="Message"
                    value={form.message}
                    onChange={handleChange}
                    style={{ padding: 8, borderRadius: 6, border: '1.5px solid #e0e0e0', minWidth: 240 }}
                />
                <button type="submit" className="theme-btn" style={{ background: '#1976D2', color: '#fff' }}>Create</button>
            </form>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            {success && <div style={{ color: '#1976D2', marginBottom: 16 }}>{success}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : notifications.length === 0 ? (
                <div style={{ color: '#888' }}>No notifications created yet.</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8 }}>
                    <thead>
                        <tr style={{ background: '#F4F6FA' }}>
                            <th style={{ color: '#1976D2', fontWeight: 700, padding: 12, textAlign: 'left' }}>Section</th>
                            <th style={{ color: '#1976D2', fontWeight: 700, padding: 12, textAlign: 'left' }}>Title</th>
                            <th style={{ color: '#1976D2', fontWeight: 700, padding: 12, textAlign: 'left' }}>Message</th>
                            <th style={{ color: '#1976D2', fontWeight: 700, padding: 12, textAlign: 'left' }}>Date</th>
                            <th style={{ color: '#1976D2', fontWeight: 700, padding: 12, textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map(n => (
                            <tr key={n.id}>
                                <td style={{ padding: 12 }}>{n.section}</td>
                                <td style={{ padding: 12 }}>{n.title}</td>
                                <td style={{ padding: 12 }}>{n.message}</td>
                                <td style={{ padding: 12 }}>{n.date}</td>
                                <td style={{ padding: 12 }}>
                                    <button onClick={() => handleDelete(n.id)} style={{ color: '#fff', background: '#dc3545', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
function SupportPage() {
    return <div style={{ padding: 32 }}><h2 style={{ color: '#1976D2' }}>Support</h2><p>Feature coming soon.</p></div>;
}

const sidebarLinks = [
    { key: 'dashboard', icon: <FaClipboardList />, label: 'Assignments', path: 'dashboard' },
];

function SidebarLink({ icon, label, onClick, active }) {
    return (
        <div onClick={onClick} className={`sidebar-link${active ? ' active' : ''}`}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span>{label}</span>
        </div>
    );
}

// Replace the placeholder AssignmentsDashboardContent with the real dashboard UI
function AssignmentsDashboardContent({
    assignments,
    isLoading,
    onCreateAssignment,
    renderSubmissionsTable,
    stats,
    handleAssignmentSeverityChange,
    submissions
}) {
    const exportToExcel = (assignmentId, assignmentName, submissions) => {
        const assignmentSubmissions = submissions[assignmentId] || [];
        if (assignmentSubmissions.length === 0) {
            alert('No submissions to export.');
            return;
        }
        const data = assignmentSubmissions.map(sub => ({
            Student: sub.student_name,
            'Submitted At': new Date(sub.submitted_at).toLocaleString(),
            Status: sub.processing_status,
            'Plagiarism Result': sub.plagiarism_result,
            'Correctness Score': sub.correctness_score,
            'Correctness Label': sub.correctness_label,
            'Final Score': (sub.processing_status === 'Completed' && typeof sub.correctness_score === 'number')
                ? (sub.plagiarism_result === 'found'
                    ? (sub.correctness_score * (1 - getPenalty(sub.plagiarism_severity || 'medium'))).toFixed(1)
                    : sub.correctness_score.toFixed(1))
                : 'N/A'
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
        XLSX.writeFile(wb, `${assignmentName.replace(/\s+/g, '_')}_submissions.xlsx`);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <h1 style={{ fontWeight: 800, fontSize: '2.2rem', color: '#222' }}>Professor Dashboard</h1>
                <button className="theme-btn" style={{ background: '#1976D2', color: '#fff', fontWeight: 700 }} onClick={onCreateAssignment}>
                    + Create Assignment
                </button>
            </div>
            <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
                <div className="card" style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontWeight: 700 }}>Total Assignments</div>
                    <div style={{ fontWeight: 900, fontSize: '2rem', color: '#1976D2' }}>{stats.totalAssignments}</div>
                </div>
                <div className="card" style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontWeight: 700 }}>Active Assignments</div>
                    <div style={{ fontWeight: 900, fontSize: '2rem', color: '#1976D2' }}>{stats.activeAssignments}</div>
                </div>
                <div className="card" style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontWeight: 700 }}>Total Submissions</div>
                    <div style={{ fontWeight: 900, fontSize: '2rem', color: '#1976D2' }}>{stats.totalSubmissions}</div>
                </div>
                <div className="card" style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontWeight: 700 }}>High Plagiarism (&ge;40%)</div>
                    <div style={{ fontWeight: 900, fontSize: '2rem', color: '#c62828' }}>{stats.highPlagiarismCount}</div>
                </div>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#222', marginBottom: 16 }}>My Assignments</div>
            {isLoading ? (
                <div style={{ color: '#888', fontWeight: 700 }}>Loading assignments...</div>
            ) : assignments.length === 0 ? (
                <div style={{ color: '#888', fontWeight: 700 }}>No assignments created yet.</div>
            ) : (
                <div>
                    {assignments.map(assignment => (
                        <div key={assignment.id} className="assignment-card" style={{ marginBottom: 32 }}>
                            <div className="assignment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <h3 style={{ margin: 0, color: '#1976D2' }}>{assignment.name}</h3>
                                    <button
                                        onClick={() => exportToExcel(assignment.id, assignment.name, submissions)}
                                        style={{
                                            marginLeft: 8,
                                            background: '#21a366', // Excel green
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 4,
                                            padding: '4px 16px 4px 10px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontSize: 15
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
                                                <rect width="24" height="24" rx="4" fill="#21a366"/>
                                                <path d="M7 7H17V17H7V7Z" fill="#fff"/>
                                                <path d="M9.5 9.5L14.5 14.5M14.5 9.5L9.5 14.5" stroke="#21a366" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                            Export to Excel
                                        </span>
                                    </button>
                                </div>
                                <div style={{ color: '#888', fontWeight: 600 }}>
                                    Due: {new Date(assignment.due_date).toLocaleString()}
                                </div>
                            </div>
                            <div className="assignment-details" style={{ marginBottom: 16 }}>
                                <p style={{ margin: 0 }}>{assignment.description}</p>
                                <div style={{ marginTop: 8 }}>
                                    <a href={`/api/assignments/${assignment.id}/download`} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2', fontWeight: 600 }}>
                                        Download Question File
                                    </a>
                                </div>
                            </div>
                            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontWeight: 600, color: '#1976D2' }}>Plagiarism Penalty:</span>
                                {['easy', 'medium', 'hard'].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => handleAssignmentSeverityChange(assignment.id, level)}
                                        style={{
                                            background: (submissions[assignment.id] && submissions[assignment.id][0] && submissions[assignment.id][0].plagiarism_severity === level) ? (level === 'easy' ? '#4caf50' : level === 'medium' ? '#ff9800' : '#f44336') : '#e0e0e0',
                                            color: (submissions[assignment.id] && submissions[assignment.id][0] && submissions[assignment.id][0].plagiarism_severity === level) ? '#fff' : '#333',
                                            border: 'none',
                                            borderRadius: 4,
                                            padding: '2px 10px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: 13
                                        }}
                                    >
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div className="submissions-section">
                                <h4 style={{ color: '#1976D2', marginBottom: 8 }}>Submissions</h4>
                                {renderSubmissionsTable(assignment.id)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function extractTextFromPDF(file) {
    // Simulate PDF text extraction (replace with real extraction in backend integration)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Simulated extracted model answer from PDF.');
        }, 1000);
    });
}

function computeCorrectnessScore(modelAnswer, studentAnswer) {
    // Simulate a similarity score (replace with backend call for real semantic similarity)
    if (!modelAnswer || !studentAnswer) return 0;
    // Simple word overlap for mockup
    const modelWords = new Set(modelAnswer.toLowerCase().split(/\W+/));
    const studentWords = new Set(studentAnswer.toLowerCase().split(/\W+/));
    const common = [...studentWords].filter(w => modelWords.has(w));
    return Math.round((common.length / modelWords.size) * 100);
}

const ModelAnswerModal = ({ isOpen, onClose, onExtracted, studentAnswer }) => {
    const [pdfFile, setPdfFile] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [modelAnswer, setModelAnswer] = useState('');
    const [score, setScore] = useState(null);

    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]);
        setModelAnswer('');
        setScore(null);
    };

    const handleExtract = async () => {
        if (!pdfFile) return;
        setExtracting(true);
        const text = await extractTextFromPDF(pdfFile);
        setModelAnswer(text);
        setExtracting(false);
        if (studentAnswer) {
            setScore(computeCorrectnessScore(text, studentAnswer));
        }
        if (onExtracted) onExtracted(text);
    };

    useEffect(() => {
        if (modelAnswer && studentAnswer) {
            setScore(computeCorrectnessScore(modelAnswer, studentAnswer));
        }
    }, [modelAnswer, studentAnswer]);

    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Upload Model Answer PDF</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <button onClick={handleExtract} disabled={!pdfFile || extracting} style={{marginLeft: 8}}>
                        {extracting ? 'Extracting...' : 'Extract Text'}
                    </button>
                    {modelAnswer && (
                        <div style={{marginTop: 16}}>
                            <h4>Extracted Model Answer:</h4>
                            <textarea value={modelAnswer} readOnly rows={4} style={{width: '100%'}} />
                        </div>
                    )}
                    {score !== null && (
                        <div style={{marginTop: 16, fontWeight: 'bold'}}>
                            Correctness Score: <span style={{color: score >= 70 ? 'green' : score >= 40 ? 'orange' : 'red'}}>{score} / 100</span>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="close-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const submissionTableColumns = [
    { key: 'student_name', label: 'Student', width: 180 },
    { key: 'submitted_at', label: 'Submitted At', width: 180 },
    { key: 'processing_status', label: 'Status', width: 120 },
    { key: 'plagiarism_result', label: 'Plagiarism Result', width: 160 },
    { key: 'correctness_score', label: 'Correctness Score', width: 140 },
    { key: 'correctness_label', label: 'Correctness Label', width: 150 },
    { key: 'final_score', label: 'Final Score', width: 120 },
    { key: 'actions', label: 'Actions', width: 120 },
];

function getPenalty(severity) {
    if (severity === 'easy') return 0.10;
    if (severity === 'medium') return 0.25;
    if (severity === 'hard') return 0.50;
    return 0.25; // default
}

const ProfessorDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [setActiveTab] = useState('assignments');
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState('');
    const [isModelAnswerModalOpen, setIsModelAnswerModalOpen] = useState(false);
    const [selectedStudentAnswer, setSelectedStudentAnswer] = useState('');

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                console.log('No user found, redirecting to login');
                navigate('/login');
                return;
            }
            if (user.user_type !== 'professor') {
                console.log('User is not a professor, redirecting to student dashboard');
                navigate('/student/dashboard');
                return;
            }
            verifySession();
            fetchProfile();
        } catch (error) {
            console.error('Session verification error:', error);
            navigate('/login');
        }
    }, [navigate]);

    const verifySession = async () => {
        try {
            console.log('Verifying professor session...');
            const response = await fetch('http://localhost:5000/api/auth/check-session', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Session verification failed');
            }

            const data = await response.json();
            console.log('Session check response:', data);

            if (!data.logged_in || data.user_type !== 'professor') {
                console.log('Not logged in as professor, redirecting to login');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            fetchAssignments(); // Fetch professor-specific data
        } catch (error) {
            console.error('Session verification error:', error);
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/professor/assignments', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch assignments');
            }

            const data = await response.json();
            setAssignments(data);

            // Fetch submissions for each assignment
            data.forEach(assignment => {
                fetchSubmissions(assignment.id);
            });
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/assignments/${assignmentId}/submissions`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch submissions');
            }

            const data = await response.json();
            setSubmissions(prev => ({
                ...prev,
                [assignmentId]: data
            }));
        } catch (error) {
            console.error(`Error fetching submissions for assignment ${assignmentId}:`, error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleAssignmentCreated = (newAssignment) => {
        setAssignments([...assignments, newAssignment]);
    };

    const stats = {
        totalAssignments: assignments.length,
        activeAssignments: assignments.filter(a => a.status === 'Active').length,
        totalSubmissions: Object.values(submissions).flat().length,
        highPlagiarismCount: Object.values(submissions)
            .flat()
            .filter(s => s.plagiarism_score >= 40).length
    };

    const handleDeleteSubmission = async (submissionId, assignmentId) => {
        if (!window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/submissions/${submissionId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setSubmissions(prev => ({
                    ...prev,
                    [assignmentId]: prev[assignmentId].filter(s => s.id !== submissionId)
                }));
            } else {
                alert(data.error || 'Failed to delete submission');
            }
        } catch (error) {
            alert('Failed to delete submission');
        }
    };

    const handleAssignmentSeverityChange = (assignmentId, newSeverity) => {
        setSubmissions(prev => ({
            ...prev,
            [assignmentId]: prev[assignmentId].map(sub => ({
                ...sub,
                plagiarism_severity: newSeverity
            }))
        }));
    };

    const renderSubmissionsTable = (assignmentId) => {
        const assignmentSubmissions = submissions[assignmentId] || [];
        if (assignmentSubmissions.length === 0) {
            return <p>No submissions yet</p>;
        }
        return (
            <div className="submissions-table-wrapper" style={{ overflowX: 'auto', width: '100%' }}>
                <div className="submissions-table" style={{ minWidth: 1400 }}>
                    <div className="table-header">
                        {submissionTableColumns.map(col => (
                            <div key={col.key} className="col" style={{ width: col.width, minWidth: col.width, maxWidth: col.width }}>{col.label}</div>
                        ))}
                    </div>
                    {assignmentSubmissions.map(submission => {
                        const currentSeverity = (assignmentSubmissions[0] && assignmentSubmissions[0].plagiarism_severity) || 'medium';
                        const penalty = getPenalty(currentSeverity);
                        return (
                            <div key={submission.id} className="table-row">
                                {submissionTableColumns.map(col => {
                                    let value = null;
                                    if (col.key === 'student_name') value = submission.student_name;
                                    else if (col.key === 'submitted_at') value = new Date(submission.submitted_at).toLocaleString();
                                    else if (col.key === 'processing_status') value = <span className={`status ${submission.processing_status.toLowerCase()}`}>{submission.processing_status}</span>;
                                    else if (col.key === 'plagiarism_result') value = submission.processing_status === 'Completed'
                                        ? (submission.plagiarism_result
                                            ? <span className={`plagiarism-score ${submission.plagiarism_result === 'found' ? 'high' : 'low'}`}>{submission.plagiarism_result === 'found' ? 'Found' : 'Not Found'}</span>
                                            : (typeof submission.plagiarism_score === 'number'
                                                ? <span className={`plagiarism-score ${submission.plagiarism_score >= 70 ? 'high' : submission.plagiarism_score >= 40 ? 'medium' : 'low'}`}>{submission.plagiarism_score.toFixed(1)}%</span>
                                                : <span className="plagiarism-score">N/A</span>))
                                        : submission.processing_status;
                                    else if (col.key === 'correctness_score') value = submission.processing_status === 'Completed' && submission.correctness_score !== undefined && submission.correctness_score !== null
                                        ? <span style={{ color: submission.correctness_score >= 70 ? 'green' : submission.correctness_score >= 40 ? 'orange' : 'red', fontWeight: 600 }}>{submission.correctness_score.toFixed(1)}%</span>
                                        : submission.processing_status;
                                    else if (col.key === 'correctness_label') value = submission.processing_status === 'Completed' && submission.correctness_label
                                        ? <span>{submission.correctness_label}</span>
                                        : submission.processing_status;
                                    else if (col.key === 'final_score') value = submission.processing_status === 'Completed' && typeof submission.correctness_score === 'number'
                                        ? <span style={{ color: '#1976D2', fontWeight: 700 }}>
                                            {submission.plagiarism_result === 'found'
                                                ? (submission.correctness_score * (1 - penalty)).toFixed(1) + '%'
                                                : submission.correctness_score.toFixed(1) + '%'}
                                          </span>
                                        : <span style={{ color: '#888' }}>N/A</span>;
                                    else if (col.key === 'actions') value = (
                                        <button onClick={() => handleDeleteSubmission(submission.id, assignmentId)} style={{ color: '#fff', background: '#dc3545', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Delete</button>
                                    );
                                    else value = 'N/A';
                                    // For text content, add a title for full value on hover
                                    const plainText = typeof value === 'string' ? value : undefined;
                                    return <div key={col.key} className={`col ${col.key}`} style={{ width: col.width, minWidth: col.width, maxWidth: col.width }} title={plainText}>{value}</div>;
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const fetchProfile = async () => {
        setProfileLoading(true);
        setProfileError('');
        try {
            const response = await fetch('http://localhost:5000/api/professor/profile', { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            if (!data.success || !data.profile) throw new Error('Failed to load profile');
            setProfile(data.profile);
        } catch (error) {
            setProfileError('Failed to load profile');
        } finally {
            setProfileLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Top Bar */}
            <ModernNavbar
                user={profile}
                portalLabel="Professor Portal"
                onHome={() => navigate('/')}
                onLogout={handleLogout}
            />
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                {/* Sidebar */}
                <div className="sidebar">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px 24px 24px' }}>
                            <FaUserCircle size={28} color="#1976D2" />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#222' }}>{profile ? `${profile.firstName} ${profile.lastName}` : 'Professor'}</div>
                                <div style={{ fontSize: '0.92rem', color: '#888' }}>Dashboard</div>
                            </div>
                        </div>
                        <div style={{ padding: '0 12px' }}>
                            <div style={{ color: '#888', fontWeight: 600, fontSize: 13, margin: '16px 0 4px 8px', letterSpacing: 1 }}>MAIN</div>
                            {sidebarLinks.map(link => (
                                <SidebarLink
                                    key={link.key}
                                    icon={link.icon}
                                    label={link.label}
                                    onClick={() => navigate(link.path)}
                                    active={location.pathname === `/professor/${link.path}` || (link.key === 'dashboard' && (location.pathname === '/professor' || location.pathname === '/professor/dashboard'))}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="theme-card" style={{ maxWidth: 1200, width: '100%', margin: '32px auto', minHeight: 600 }}>
                    <Routes>
                        <Route path="dashboard" element={
                            <AssignmentsDashboardContent
                                assignments={assignments}
                                isLoading={isLoading}
                                onCreateAssignment={() => setIsModalOpen(true)}
                                renderSubmissionsTable={renderSubmissionsTable}
                                stats={stats}
                                handleAssignmentSeverityChange={handleAssignmentSeverityChange}
                                submissions={submissions}
                            />
                        } />
                        <Route path="*" element={<Navigate to="dashboard" />} />
                    </Routes>
                    <CreateAssignmentModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAssignmentCreated={handleAssignmentCreated}
                    />
                    <ModelAnswerModal
                        isOpen={isModelAnswerModalOpen}
                        onClose={() => setIsModelAnswerModalOpen(false)}
                        onExtracted={(text) => {
                            setSelectedStudentAnswer(text);
                        }}
                        studentAnswer={selectedStudentAnswer}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfessorDashboard;