import React, { useEffect, useState } from "react";
import ScreeningModal from "../components/ScreeningModal";
import {
    FaUsers,
    FaClipboardList,
    FaChartBar,
    FaTachometerAlt,
    FaBuilding,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const [candidates, setCandidates] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState("Candidates");

    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLink, setInviteLink] = useState("");

    async function fetchCandidates() {
        try {
            const res = await fetch(`${API_URL}/api/candidates`);
            const data = await res.json();
            setCandidates(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCandidates();
    }, []);

    async function sendInvite() {
        if (!inviteEmail) {
            alert("Enter candidate email");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/invite?email=${inviteEmail}`,
                {
                    method: "POST"
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Candidate invited successfully");
                setInviteLink(data.interview_link);
                setInviteEmail("");
                fetchCandidates();
            } else {
                alert(data.detail);
            }
        } catch (error) {
            console.log(error);
            alert("Backend not connected");
        }
    }

    async function deleteCandidate(id) {
        const confirmDelete = window.confirm("Delete this candidate?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${API_URL}/candidates/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                alert("Candidate deleted");
                fetchCandidates();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getStatusStyle = (status) => {
        const base = {
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: "600"
        };
        if (String(status).toLowerCase() === "completed") {
            return { ...base, background: "#dcfce7", color: "#166534" };
        }
        if (String(status).toLowerCase() === "pending") {
            return { ...base, background: "#fef9c3", color: "#854d0e" };
        }
        return { ...base, background: "#f3f4f6", color: "#374151" };
    };

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f8fafc",
                fontFamily: "system-ui, sans-serif"
            }}
        >
            {/* SIDEBAR */}
            <div
                style={{
                    width: "260px",
                    background: "#1c2d63",
                    color: "white",
                    padding: "30px 20px",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <h2 style={{ color: "white", marginBottom: "40px", fontSize: "1.5rem", fontWeight: "bold", paddingLeft: "16px" }}>
                    AI INTERVIEW SCREENING
                </h2>

                <SidebarItem
                    icon={<FaUsers />}
                    text="Candidates"
                    active={activeMenu === "Candidates"}
                    onClick={() => setActiveMenu("Candidates")}
                />
                <SidebarItem
                    icon={<FaClipboardList />}
                    text="Assessments"
                    active={activeMenu === "Assessments"}
                    onClick={() => setActiveMenu("Assessments")}
                />
                <SidebarItem
                    icon={<FaChartBar />}
                    text="Reports"
                    active={activeMenu === "Reports"}
                    onClick={() => setActiveMenu("Reports")}
                />
                <SidebarItem
                    icon={<FaTachometerAlt />}
                    text="Dashboard"
                    active={activeMenu === "Dashboard"}
                    onClick={() => setActiveMenu("Dashboard")}
                />
                <SidebarItem
                    icon={<FaBuilding />}
                    text="Departments"
                    active={activeMenu === "Departments"}
                    onClick={() => setActiveMenu("Departments")}
                />
                <SidebarItem
                    icon={<FaCog />}
                    text="Settings"
                    active={activeMenu === "Settings"}
                    onClick={() => setActiveMenu("Settings")}
                />

                <div style={{ flex: 1 }} />

                <SidebarItem
                    icon={<FaSignOutAlt />}
                    text="Logout"
                    onClick={() => alert("Logout")}
                />
            </div>

            {/* MAIN CONTENT COMPONENT */}
            <div
                style={{
                    flex: 1,
                    padding: "40px",
                    width: "100%",
                    boxSizing: "border-box"
                }}
            >
                {/* 1. CANDIDATES COMPONENT VIEW */}
                {activeMenu === "Candidates" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                            <div>
                                <h1 style={{ fontSize: "1.8rem", margin: 0, fontWeight: "700", color: "#0f172a" }}>Video Bot AI Screening</h1>
                                <p style={{ color: "#64748b", marginTop: "5px" }}>Manage and review your AI automated video interviews.</p>
                            </div>
                            <button
                                onClick={() => setShowInvite(true)}
                                style={{ background: "#2563eb", color: "white", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
                            >
                                + Invite Candidate
                            </button>
                        </div>

                        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                            <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0" }}>
                                <h2 style={{ fontSize: "1.2rem", margin: 0, fontWeight: "600" }}>Candidates List</h2>
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        <th style={{ padding: "14px 24px", color: "#64748b", fontWeight: "600", fontSize: "0.85rem" }}>Name</th>
                                        <th style={{ padding: "14px 24px", color: "#64748b", fontWeight: "600", fontSize: "0.85rem" }}>Email</th>
                                        <th style={{ padding: "14px 24px", color: "#64748b", fontWeight: "600", fontSize: "0.85rem" }}>Status</th>
                                        <th style={{ padding: "14px 24px", color: "#64748b", fontWeight: "600", fontSize: "0.85rem" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading...</td></tr>
                                    ) : candidates.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No candidates found</td></tr>
                                    ) : (
                                        candidates.map(candidate => (
                                            <tr key={candidate.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                                <td style={{ padding: "16px 24px", fontWeight: "500" }}>{candidate.name}</td>
                                                <td style={{ padding: "16px 24px", color: "#64748b" }}>{candidate.email}</td>
                                                <td style={{ padding: "16px 24px" }}><span style={getStatusStyle(candidate.status || "Pending")}>{candidate.status || "Pending"}</span></td>
                                                <td style={{ padding: "16px 24px" }}>
                                                    <button onClick={() => setSelected(candidate)} style={{ marginRight: "10px", padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>View</button>
                                                    <button onClick={() => deleteCandidate(candidate.id)} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 2. ASSESSMENTS COMPONENT VIEW */}
                {activeMenu === "Assessments" && (
                    <div>
                        <h1 style={{ fontSize: "1.8rem", margin: "0 0 20px 0", fontWeight: "700", color: "#0f172a" }}>Assessment Management Engine</h1>
                        
                        {/* Tab Headers */}
                        <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid #e2e8f0", marginBottom: "25px", paddingBottom: "5px" }}>
                            <button style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Video Bot Screening Questions</button>
                            <button style={{ background: "transparent", color: "#94a3b8", border: "none", padding: "10px 16px", fontWeight: "500", cursor: "pointer" }}>MCQ Objective Assessments</button>
                        </div>

                        {/* Configuration Dropdowns Selector Bar */}
                        <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", gap: "20px", alignItems: "flex-end", marginBottom: "25px" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>Target Department</label>
                                <select style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}><option>Operations</option></select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>Sub-Department Track</label>
                                <select style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}><option>HR</option></select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>Experience Level</label>
                                <select style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}><option>Fresher(0)</option></select>
                            </div>
                            <button style={{ background: "#2563eb", color: "white", padding: "11px 24px", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Save Configuration</button>
                        </div>

                        {/* Parameter Questions List */}
                        <div style={{ background: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", fontWeight: "700" }}>Operations - HR (Fresher(0)) Interview Parameters</h3>
                            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 15px 0" }}>Configure custom question limits seamlessly. Changes apply to newly generated invite links.</p>
                            <button style={{ background: "#f1f5f9", border: "none", padding: "8px 14px", borderRadius: "6px", color: "#475569", fontWeight: "600", cursor: "pointer", marginBottom: "20px" }}>+ Add Target Question</button>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {[
                                    "Tell us about yourself and what motivated you to pursue a career in HR operations?",
                                    "How do you prioritize your daily tasks when faced with multiple competing deadlines?",
                                    "Describe your familiarity with basic office productivity tools and spreadsheets.",
                                    "How do you maintain focus and accuracy when performing repetitive data entry tasks?",
                                    "What step would you take if you were unsure how to handle a candidate documentation issue?"
                                ].map((q, idx) => (
                                    <div key={idx} style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "14px 20px", borderRadius: "8px", border: "1px solid #e2e8f0", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <span style={{ background: "#e2e8f0", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>{idx + 1}</span>
                                            <span style={{ fontSize: "0.95rem", color: "#1e293b", fontWeight: "500" }}>{q}</span>
                                        </div>
                                        <span style={{ color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem" }}>✕</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. REPORTS COMPONENT VIEW */}
                {activeMenu === "Reports" && (
                    <div>
                        <h1 style={{ fontSize: "1.8rem", margin: "0 0 25px 0", fontWeight: "700", color: "#0f172a" }}>Candidate Evaluation Reports Hub</h1>
                        <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            <input 
                                type="text" 
                                placeholder="🔍 Search finalized profiles..." 
                                style={{ width: "100%", maxWidth: "340px", padding: "10px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "24px", outline: "none" }}
                            />
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                        <th style={{ padding: "12px 10px", color: "#94a3b8", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase" }}>Candidate Name</th>
                                        <th style={{ padding: "12px 10px", color: "#94a3b8", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase" }}>Sub Dept Track</th>
                                        <th style={{ padding: "12px 10px", color: "#94a3b8", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase" }}>Evaluation Dossier</th>
                                        <th style={{ padding: "12px 10px", color: "#94a3b8", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase" }}>Action Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "20px 10px", fontWeight: "700", color: "#1e293b" }}>James Anderson</td>
                                        <td style={{ padding: "20px 10px", color: "#475569" }}>Engineering - Full Stack</td>
                                        <td style={{ padding: "20px 10px" }}><button style={{ background: "#edf2ff", color: "#364fc7", border: "none", padding: "6px 12px", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Review Report</button></td>
                                        <td style={{ padding: "20px 10px" }}><button style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "6px 12px", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>View/Edit Remarks</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 4. DEPARTMENTS COMPONENT VIEW */}
                {activeMenu === "Departments" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                            <h1 style={{ fontSize: "1.8rem", margin: 0, fontWeight: "700", color: "#0f172a" }}>Departments</h1>
                            <button style={{ background: "#2563eb", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>+ Add Department Map</button>
                        </div>

                        <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            {/* Filter Bar Elements */}
                            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                                <select style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}><option>All Departments</option></select>
                                <select style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}><option>All Sub Departments</option></select>
                                <select style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}><option>All Experience Tracks</option></select>
                            </div>

                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        <th style={{ padding: "14px 24px", color: "#64748b", fontSize: "0.85rem", fontWeight: "600" }}>Department Name</th>
                                        <th style={{ padding: "14px 24px", color: "#64748b", fontSize: "0.85rem", fontWeight: "600" }}>Sub-Departments Configured</th>
                                        <th style={{ padding: "14px 24px", color: "#64748b", fontSize: "0.85rem", fontWeight: "600" }}>Target Experience Tracks</th>
                                        <th style={{ padding: "14px 24px", color: "#64748b", fontSize: "0.85rem", fontWeight: "600" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                        <td style={{ padding: "20px 24px", fontWeight: "700", color: "#1e293b" }}>Engineering</td>
                                        <td style={{ padding: "20px 24px", color: "#475569" }}>Frontend, Backend, Full Stack, QA / Testing</td>
                                        <td style={{ padding: "20px 24px", color: "#475569" }}>Junior (1-3 Y), Mid-Level (3-5 Y), Senior (5+ Y), Lead (10+ Y)</td>
                                        <td style={{ padding: "20px 24px" }}><button style={{ color: "#dc2626", background: "#fef2f2", border: "none", padding: "6px 12px", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Remove</button></td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                        <td style={{ padding: "20px 24px", fontWeight: "700", color: "#1e293b" }}>Design</td>
                                        <td style={{ padding: "20px 24px", color: "#475569" }}>UI/UX, Visual Brand Art</td>
                                        <td style={{ padding: "20px 24px", color: "#475569" }}>Fresher (0 Y), Junior (1-3 Y), Senior (5+ Y)</td>
                                        <td style={{ padding: "20px 24px" }}><button style={{ color: "#dc2626", background: "#fef2f2", border: "none", padding: "6px 12px", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Remove</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* FALLBACK PLACEHOLDERS FOR DASHBOARD & SETTINGS */}
                {activeMenu === "Dashboard" && <DashboardCard title="Dashboard Overview" text="Interview analytics and statistics will appear here." />}
                {activeMenu === "Settings" && <DashboardCard title="Settings" text="Application settings will appear here." />}

                {/* SCREENING MODAL */}
                {selected && <ScreeningModal candidate={selected} close={() => setSelected(null)} />}

                {/* INVITE MODAL */}
                {showInvite && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                        <div style={{ background: "white", padding: "30px", borderRadius: "12px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
                            <h2 style={{ margin: "0 0 10px 0" }}>Invite Candidate</h2>
                            <input
                                type="email"
                                placeholder="candidate@email.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                style={{ width: "100%", padding: "12px", marginTop: "15px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                            />
                            {inviteLink && (
                                <div style={{ marginTop: "15px", background: "#f0fdf4", padding: "12px", borderRadius: "6px", border: "1px solid #bbf7d0", fontSize: "0.9rem" }}>
                                    <strong>Interview Link:</strong><br />
                                    <a href={inviteLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb", wordBreak: "break-all" }}>{inviteLink}</a>
                                </div>
                            )}
                            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                <button onClick={sendInvite} style={{ background: "#2563eb", color: "white", padding: "10px 16px", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Send Invite</button>
                                <button onClick={() => { setShowInvite(false); setInviteLink(""); }} style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "10px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// SIDEBAR ITEM
function SidebarItem({ icon, text, active, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                marginBottom: "5px",
                cursor: "pointer",
                borderRadius: "6px",
                background: active ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: active ? "white" : "#94a3b8",
                fontWeight: active ? "600" : "500",
                transition: "all 0.2s"
            }}
        >
            <span style={{ display: "flex", fontSize: "1.1rem" }}>{icon}</span>
            <span style={{ fontSize: "0.95rem" }}>{text}</span>
        </div>
    );
}

// COMMON CARD
function DashboardCard({ title, text }) {
    return (
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", fontWeight: "700" }}>
                {title}
            </h2>
            <p style={{ color: "#64748b", margin: 0 }}>
                {text}
            </p>
        </div>
    );
}

export default Dashboard;