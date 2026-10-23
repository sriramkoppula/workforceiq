// ============================================
// WORKFORCEIQ - EVIDENCE MANAGEMENT
// Automatic Backend Score Recalculation
// ============================================

const API_URL = window.API_URL || "http://localhost:8080/api";

let currentUser = null;
let userSkills = [];
let allEvidence = [];

// ============================================
// GET CURRENT USER
// ============================================
function getCurrentUser() {
    const loggedIn = JSON.parse(localStorage.getItem("workforceLoggedInUser"));
    const registered = JSON.parse(localStorage.getItem("workforceRegisteredUser"));
    return loggedIn || registered || null;
}

// ============================================
// SKILL LOADER STATUS BANNER HELPER
// ============================================
function renderSkillLoaderStatus(type, message, actionHtml = "") {
    const select = document.getElementById("skillSelect");
    if (!select) return;

    let banner = document.getElementById("skillLoaderStatus");
    if (!banner) {
        banner = document.createElement("div");
        banner.id = "skillLoaderStatus";
        select.parentNode.insertBefore(banner, select.nextSibling);
    }

    if (!message) {
        banner.style.display = "none";
        banner.className = "skill-loader-status";
        banner.innerHTML = "";
        return;
    }

    banner.className = `skill-loader-status status-${type}`;
    banner.style.display = "block";
    banner.innerHTML = `<span>${message}</span>${actionHtml ? ` <span class="status-action">${actionHtml}</span>` : ""}`;
}

// ============================================
// LOAD USER SKILLS
// ============================================
async function loadSkills() {
    const skillSelect = document.getElementById("skillSelect");
    if (!skillSelect) return;

    // 1. Authentication Check
    if (!currentUser || !currentUser.id) {
        skillSelect.disabled = true;
        skillSelect.innerHTML = `<option value="">Authentication required — please log in</option>`;
        renderSkillLoaderStatus(
            "error",
            "Authentication required: Please log in to load your skills and add performance evidence.",
            `<a href="login.html" class="status-link">Log in now →</a>`
        );
        return;
    }

    // 2. Loading State
    skillSelect.disabled = true;
    skillSelect.innerHTML = `<option value="">Loading your skills from server...</option>`;
    renderSkillLoaderStatus("loading", "Connecting to server and fetching profile skills...");

    try {
        const response = await fetch(`${API_URL}/user-skills/user/${currentUser.id}`, {
            headers: {
                "Accept": "application/json"
            }
        });

        // 3. Server / HTTP Error Handling
        if (!response.ok) {
            let errorDetail = `HTTP ${response.status}`;
            try {
                const text = await response.text();
                if (text && text.length < 120) errorDetail += ` - ${text}`;
            } catch (_) {}

            if (response.status === 401 || response.status === 403) {
                skillSelect.disabled = true;
                skillSelect.innerHTML = `<option value="">Session expired — please log in again</option>`;
                renderSkillLoaderStatus(
                    "error",
                    "Session expired. Please log in again to manage skill evidence.",
                    `<a href="login.html" class="status-link">Log in →</a>`
                );
                return;
            }

            throw new Error(`Server responded with ${errorDetail}`);
        }

        const data = await response.json();
        userSkills = Array.isArray(data) ? data : [];

        // Check URL parameters early
        const params = new URLSearchParams(window.location.search);
        const requestedSkill = params.get("skill");
        const requestedType = params.get("type");

        // 4. Empty Results (Server returned 200 OK, but 0 skills added yet)
        if (userSkills.length === 0) {
            skillSelect.disabled = false;
            skillSelect.innerHTML = `<option value="">No skills in profile yet</option>`;

            if (requestedSkill) {
                // If the user arrived with a target skill from practice/assessment, add it
                const option = document.createElement("option");
                option.value = requestedSkill;
                option.textContent = `${requestedSkill} (Target Skill)`;
                skillSelect.appendChild(option);
                skillSelect.value = requestedSkill;

                renderSkillLoaderStatus(
                    "info",
                    `Recording evidence for <strong>${escapeHTML(requestedSkill)}</strong>. Remember to add it to your profile.`,
                    `<a href="skills.html" class="status-link">Add to Skills →</a>`
                );
            } else {
                renderSkillLoaderStatus(
                    "empty",
                    "You have not added any skills to your profile yet.",
                    `<a href="skills.html" class="status-link">Add skills now →</a>`
                );
            }

            if (requestedType) {
                const typeSelect = document.getElementById("evidenceType");
                if (typeSelect) typeSelect.value = requestedType;
            }

            handlePendingEvidence(requestedSkill, requestedType);
            return;
        }

        // 5. Success State: Populate Skills Dropdown
        skillSelect.disabled = false;
        skillSelect.innerHTML = `<option value="">Select skill (${userSkills.length} available)</option>`;

        userSkills.forEach(skill => {
            const option = document.createElement("option");
            option.value = skill.skillName;
            option.textContent = skill.skillName;
            skillSelect.appendChild(option);
        });

        // Handle requested skill from URL query
        if (requestedSkill) {
            const exists = userSkills.some(s => s.skillName.toLowerCase() === requestedSkill.toLowerCase());
            if (exists) {
                const matched = userSkills.find(s => s.skillName.toLowerCase() === requestedSkill.toLowerCase());
                skillSelect.value = matched.skillName;
            } else {
                const option = document.createElement("option");
                option.value = requestedSkill;
                option.textContent = `${requestedSkill} (Target Skill)`;
                skillSelect.appendChild(option);
                skillSelect.value = requestedSkill;
            }
        }

        if (requestedType) {
            const typeSelect = document.getElementById("evidenceType");
            if (typeSelect) typeSelect.value = requestedType;
        }

        // Clear status banner on successful load
        renderSkillLoaderStatus("", "");

        // Check for pending items
        handlePendingEvidence(requestedSkill, requestedType);

    } catch (error) {
        console.error("Error loading skills:", error);
        skillSelect.disabled = true;
        skillSelect.innerHTML = `<option value="">Server connection error — unable to load skills</option>`;
        renderSkillLoaderStatus(
            "error",
            `⚠️ Server connection error: Could not load skills from backend (${error.message}).`,
            `<button type="button" class="btn-retry-skills" onclick="loadSkills()">Retry</button>`
        );
    }
}
window.loadSkills = loadSkills;

// ============================================
// HANDLE PENDING EVIDENCE
// Populates the form from localStorage pending items
// Uses the actual form fields that exist in evidence.html
// ============================================
function handlePendingEvidence(requestedSkill, requestedType) {
    const scoreInput = document.getElementById("evidenceScore");
    const descInput = document.getElementById("evidenceDescription");
    const typeSelect = document.getElementById("evidenceType");
    const skillSelect = document.getElementById("skillSelect");

    // 1. Pending Assessment
    const pendingAssessment = JSON.parse(localStorage.getItem("workforcePendingAssessment"));
    if (pendingAssessment) {
        if (skillSelect && pendingAssessment.skill) skillSelect.value = pendingAssessment.skill;
        if (typeSelect) typeSelect.value = "assessment";
        // score is a percentage (0-100)
        if (scoreInput) scoreInput.value = pendingAssessment.score || 0;
        if (descInput) descInput.value = `Completed on ${pendingAssessment.date || new Date().toLocaleDateString()} with score ${pendingAssessment.score}%.`;
        localStorage.removeItem("workforcePendingAssessment");
        return;
    }

    // 2. Pending Project
    const pendingProject = JSON.parse(localStorage.getItem("workforcePendingProject"));
    if (pendingProject) {
        if (skillSelect && pendingProject.skill) skillSelect.value = pendingProject.skill;
        if (typeSelect) typeSelect.value = "project";
        if (scoreInput) scoreInput.value = pendingProject.score || 85;
        if (descInput) descInput.value = `Completed project: ${pendingProject.title || ''}`;
        localStorage.removeItem("workforcePendingProject");
        return;
    }

    // 3. Pending Practice (solved/total → percentage)
    const pendingPractice = JSON.parse(localStorage.getItem("workforcePendingPractice"));
    if (pendingPractice) {
        if (skillSelect && pendingPractice.skill) skillSelect.value = pendingPractice.skill;
        if (typeSelect) typeSelect.value = "problems";
        const total = pendingPractice.total || 1;
        const solved = pendingPractice.solved || 0;
        const pct = Math.round((solved / total) * 100);
        if (scoreInput) scoreInput.value = pct;
        if (descInput) descInput.value = `Solved ${solved}/${total} coding problems.`;
        localStorage.removeItem("workforcePendingPractice");
    }
}

// ============================================
// FIELD ERROR HELPERS
// Show/clear inline errors below form fields
// ============================================
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    let errEl = document.getElementById(fieldId + "_err");
    if (!errEl) {
        errEl = document.createElement("small");
        errEl.id = fieldId + "_err";
        errEl.style.cssText = "color: #dc2626; font-size: 12px; margin-top: 4px; display: block;";
        field.parentNode.insertBefore(errEl, field.nextSibling);
    }
    errEl.textContent = message;
    field.style.borderColor = "#dc2626";
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + "_err");
    if (errEl) errEl.textContent = "";
    if (field) field.style.borderColor = "";
}

// ============================================
// LOAD EVIDENCE
// ============================================
async function loadEvidence() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_URL}/evidence/user/${currentUser.id}`);
        if (!response.ok) {
            throw new Error("Unable to load evidence");
        }

        allEvidence = await response.json();
        localStorage.setItem("workforceEvidence", JSON.stringify(allEvidence));

        renderEvidence();
        await loadBackendReadiness();

    } catch (error) {
        console.error("Error loading evidence:", error);
        allEvidence = JSON.parse(localStorage.getItem("workforceEvidence")) || [];
        renderEvidence();
        await loadBackendReadiness();
    }
}

// ============================================
// ADD EVIDENCE
// Reads from the actual HTML fields: #evidenceScore (0-100%),
// #evidenceType, #skillSelect, #evidenceDescription.
// Sends score directly — backend handles marks/max internally.
// ============================================
async function addEvidence() {
    const skillSelect    = document.getElementById("skillSelect");
    const evidenceType   = document.getElementById("evidenceType");
    const scoreInput     = document.getElementById("evidenceScore");
    const description    = document.getElementById("evidenceDescription");
    const addButton      = document.getElementById("addEvidenceButton");

    // Prevent double-submission
    if (addButton && addButton.disabled) return;

    const skillName = skillSelect ? skillSelect.value.trim() : "";
    const type      = evidenceType ? evidenceType.value.trim() : "";
    const scoreRaw  = scoreInput ? scoreInput.value.trim() : "";
    const scoreVal  = parseFloat(scoreRaw);
    const desc      = description ? description.value.trim() : "";

    // --- Clear previous field errors ---
    clearFieldError("skillSelect");
    clearFieldError("evidenceType");
    clearFieldError("evidenceScore");

    let hasError = false;

    if (!skillName) {
        showFieldError("skillSelect", "Please select the skill this evidence measures.");
        hasError = true;
    }
    if (!type) {
        showFieldError("evidenceType", "Please select an evidence type.");
        hasError = true;
    }
    if (scoreRaw === "" || isNaN(scoreVal)) {
        showFieldError("evidenceScore", "Please enter a score between 0 and 100.");
        hasError = true;
    } else if (scoreVal < 0 || scoreVal > 100) {
        showFieldError("evidenceScore", "Score must be between 0 and 100.");
        hasError = true;
    }

    if (hasError) return;

    const score = Math.round(scoreVal); // integer 0-100

    // Type labels used for auto-generated title
    const typeLabels = {
        assessment: "Assessment",
        project: "Project",
        problems: "Coding Problems",
        practice: "Recent Practice"
    };

    const evidenceData = {
        userId:       Number(currentUser.id),
        skillName:    skillName,
        evidenceType: type,
        title:        `${typeLabels[type] || type} — ${skillName}`,
        score:        score,
        // marksObtained and maxMarks omitted — backend derives them from score
        description:  desc,
        isVerified:   true
    };

    // Show saving state
    const originalLabel = addButton ? addButton.textContent : "+ Add Evidence";
    if (addButton) {
        addButton.disabled = true;
        addButton.textContent = "Saving…";
    }

    // Inline status banner
    let statusBanner = document.getElementById("evidenceSubmitStatus");
    if (!statusBanner) {
        statusBanner = document.createElement("div");
        statusBanner.id = "evidenceSubmitStatus";
        statusBanner.style.cssText = "margin-top: 12px; padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;";
        if (addButton) addButton.parentNode.insertBefore(statusBanner, addButton.nextSibling);
    }
    statusBanner.style.display = "block";
    statusBanner.style.background = "var(--bg-surface-2, #f4f4f5)";
    statusBanner.style.color = "var(--text-secondary, #52525b)";
    statusBanner.textContent = "Saving evidence and recalculating score…";

    try {
        const response = await fetch(`${API_URL}/evidence`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evidenceData)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || `Server error ${response.status}`);
        }

        const data = await response.json();
        const savedEvidence = data.evidence || data;

        allEvidence.unshift(savedEvidence);
        localStorage.setItem("workforceEvidence", JSON.stringify(allEvidence));

        // Reset form fields
        if (scoreInput)   scoreInput.value = "";
        if (description)  description.value = "";
        if (skillSelect)  skillSelect.value = "";
        if (evidenceType) evidenceType.value = "";

        // Clear any lingering field errors after successful submit
        clearFieldError("skillSelect");
        clearFieldError("evidenceType");
        clearFieldError("evidenceScore");

        statusBanner.style.background = "#f0fdf4";
        statusBanner.style.color = "#166534";
        statusBanner.textContent = `✓ Evidence recorded for "${skillName}" (Score: ${score}%). Score recalculated.`;

        setTimeout(() => { if (statusBanner) statusBanner.style.display = "none"; }, 5000);

        renderEvidence();
        await loadBackendReadiness();

    } catch (error) {
        console.error("Add evidence error:", error);
        statusBanner.style.background = "#fef2f2";
        statusBanner.style.color = "#991b1b";
        statusBanner.textContent = `⚠ Unable to save evidence: ${error.message}`;
    } finally {
        if (addButton) {
            addButton.disabled = false;
            addButton.textContent = originalLabel;
        }
    }
}

// ============================================
// RENDER EVIDENCE
// ============================================
function renderEvidence() {
    const container = document.getElementById("evidenceList");
    const countElement = document.getElementById("evidenceCount");

    if (!container) return;

    if (countElement) {
        countElement.textContent = `${allEvidence.length} ${allEvidence.length === 1 ? 'Record' : 'Records'}`;
    }

    if (allEvidence.length === 0) {
        container.innerHTML = `
            <div class="empty-evidence">
                <div>🔍</div>
                <h3>No performance evidence recorded yet</h3>
                <p>Record tests, projects, coding problems, or practice activities to measure your skills.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    allEvidence.forEach(evidence => {
        const item = document.createElement("div");
        item.className = "evidence-item";

        const date = evidence.createdAt
            ? new Date(evidence.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString();

        const typeLabels = {
            assessment: "Test / Assessment",
            assignment: "Assignment",
            project: "Project",
            problems: "Practical Coding",
            practice: "Learning Activity"
        };

        const categoryLabel = typeLabels[evidence.evidenceType] || evidence.evidenceType;

        const marksInfo = (evidence.marksObtained !== null && evidence.marksObtained !== undefined && evidence.maxMarks)
            ? `Marks: <strong>${evidence.marksObtained} / ${evidence.maxMarks}</strong> (${evidence.score}%)`
            : `Score: <strong>${evidence.score}%</strong>`;

        item.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <h3 style="margin: 0;">${escapeHTML(evidence.skillName)}</h3>
                    <span class="category-badge">${categoryLabel}</span>
                    ${evidence.isVerified ? '<span class="verified-tag">✓ Verified</span>' : ''}
                </div>
                ${evidence.title ? `<strong style="color: #334155; font-size: 14px;">${escapeHTML(evidence.title)}</strong>` : ''}
                <p style="margin: 4px 0; color: #475569; font-size: 13px;">
                    ${marksInfo}
                </p>
                ${evidence.description ? `<p style="margin: 4px 0; font-size: 13px; color: #64748b;">${escapeHTML(evidence.description)}</p>` : ''}
                ${evidence.evidenceUrl ? `<p style="margin: 4px 0;"><a href="${escapeHTML(evidence.evidenceUrl)}" target="_blank" rel="noopener" style="font-size: 12px; color: #4338ca; text-decoration: underline;">🔗 View Submission Link</a></p>` : ''}
                <small style="color: #94a3b8; font-size: 11px;">Recorded on ${date}</small>
            </div>
            <button type="button" class="delete-evidence" data-id="${evidence.id}">
                Delete
            </button>
        `;

        const deleteButton = item.querySelector(".delete-evidence");
        deleteButton.addEventListener("click", () => deleteEvidence(evidence.id));
        container.appendChild(item);
    });
}

// ============================================
// DELETE EVIDENCE
// ============================================
async function deleteEvidence(id) {
    if (!confirm("Are you sure you want to delete this performance evidence record? Your skill score will be automatically recalculated.")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/evidence/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete evidence record.");
        }

        allEvidence = allEvidence.filter(e => e.id !== id);
        localStorage.setItem("workforceEvidence", JSON.stringify(allEvidence));

        renderEvidence();
        await loadBackendReadiness();

    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete evidence: " + error.message);
    }
}

// ============================================
// LOAD READINESS FROM BACKEND
// ============================================
async function loadBackendReadiness() {
    const scoreElement = document.getElementById("overallScore");
    const messageElement = document.getElementById("scoreMessage");

    if (!scoreElement || !messageElement || !currentUser) return;

    try {
        const response = await fetch(`${API_URL}/user-skills/user/${currentUser.id}/performance-summary`);
        if (!response.ok) {
            throw new Error("Unable to fetch summary");
        }

        const summary = await response.json();
        const readiness = summary.readinessScore !== null && summary.readinessScore !== undefined
            ? Math.round(summary.readinessScore)
            : 0;

        scoreElement.textContent = `${readiness}%`;

        if (readiness >= 80) {
            messageElement.textContent = `Excellent readiness for ${summary.targetCareer || 'your career'}. Keep practicing and maintaining strong performance.`;
        } else if (readiness >= 50) {
            messageElement.textContent = `Developing readiness for ${summary.targetCareer || 'your career'}. Record more project and practical evidence to close gaps.`;
        } else {
            messageElement.textContent = `Early stage for ${summary.targetCareer || 'your target career'}. Complete assessments and coding problems to build evidence.`;
        }

        localStorage.setItem("workforceReadiness", readiness);

    } catch (error) {
        console.warn("Backend summary error, fallback:", error);
    }
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener("DOMContentLoaded", async function () {
    currentUser = getCurrentUser();

    if (!currentUser) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    // Wire Add Evidence button
    const addButton = document.getElementById("addEvidenceButton");
    if (addButton) {
        addButton.addEventListener("click", addEvidence);
    }

    // Clear inline error on score field when user types
    const scoreInput = document.getElementById("evidenceScore");
    if (scoreInput) {
        scoreInput.addEventListener("input", function () {
            clearFieldError("evidenceScore");
        });
    }

    // Clear select errors on change
    const skillSelectEl = document.getElementById("skillSelect");
    if (skillSelectEl) {
        skillSelectEl.addEventListener("change", function () {
            clearFieldError("skillSelect");
        });
    }
    const evidenceTypeEl = document.getElementById("evidenceType");
    if (evidenceTypeEl) {
        evidenceTypeEl.addEventListener("change", function () {
            clearFieldError("evidenceType");
        });
    }

    const readinessBtn = document.getElementById("viewReadinessButton");
    if (readinessBtn) {
        readinessBtn.addEventListener("click", function () {
            window.location.href = "dashboard.html";
        });
    }

    await loadSkills();
    await loadEvidence();
});

function escapeHTML(value) {
    if (!value) return "";
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}