// =====================================================
// WORKFORCEIQ - SKILLS MANAGEMENT
// Automatic Performance-Based Scoring
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {
    "use strict";

    /* ==========================================
       USER
    ========================================== */
    const loggedInUser =
        JSON.parse(localStorage.getItem("workforceLoggedInUser")) || null;

    if (!loggedInUser || !loggedInUser.id) {
        window.location.href = "login.html";
        return;
    }

    const userId = Number(loggedInUser.id);

    /* ==========================================
       PROFILE
    ========================================== */
    const profile =
        JSON.parse(localStorage.getItem("workforceProfile")) || {};

    const career = profile.career || "Java Backend Developer";

    /* ==========================================
       AVAILABLE SKILLS BY CAREER
    ========================================== */
    const availableSkills = {
        "Java Backend Developer": [
            "Java Fundamentals",
            "OOP",
            "Data Structures",
            "SQL",
            "REST API",
            "Spring Boot",
            "Git"
        ],
        "Frontend Developer": [
            "HTML",
            "CSS",
            "JavaScript",
            "Git",
            "React",
            "REST API"
        ],
        "Data Analyst": [
            "Python",
            "SQL",
            "Statistics",
            "Excel",
            "Data Visualization",
            "Power BI"
        ],
        "Cloud Engineer": [
            "Linux",
            "Networking",
            "Git",
            "AWS",
            "Docker",
            "Kubernetes"
        ]
    };

    /* ==========================================
       ELEMENTS
    ========================================== */
    const skillSelect = document.getElementById("skillSelect");
    const skillsList = document.getElementById("skillsList");
    const careerDisplay = document.getElementById("targetCareer");

    let addSkillButton = document.getElementById("addSkillButton");
    if (!addSkillButton) {
        document.querySelectorAll("button").forEach(function (button) {
            const text = button.textContent.trim().toLowerCase();
            if (text.includes("add skill")) {
                addSkillButton = button;
            }
        });
    }

    let skills = [];

    /* ==========================================
       CAREER DISPLAY
    ========================================== */
    if (careerDisplay) {
        careerDisplay.textContent = career || "Not selected";
    }

    /* ==========================================
       LOAD SKILL OPTIONS
    ========================================== */
    function loadSkillOptions() {
        if (!skillSelect) return;

        skillSelect.innerHTML = `<option value="">Select a skill</option>`;
        const careerSkills = availableSkills[career] || [
            "Java", "OOP", "DSA", "SQL", "DBMS", "Git", "HTML", "CSS", "JavaScript",
            "Python", "C++", "AWS", "REST API", "Spring Boot", "Docker", "React"
        ];

        careerSkills.forEach(function (skill) {
            const option = document.createElement("option");
            option.value = skill;
            option.textContent = skill;
            skillSelect.appendChild(option);
        });
    }

    /* ==========================================
       LOAD SKILLS FROM BACKEND
    ========================================== */
    async function loadSkillsFromBackend() {
        try {
            const _base = window.API_URL || "http://localhost:8080/api";
            const response = await fetch(`${_base}/user-skills/user/${userId}`);
            if (!response.ok) {
                throw new Error("Unable to load skills from server.");
            }

            const data = await response.json();

            skills = data.map(function (skill) {
                return {
                    id: skill.id,
                    name: skill.skillName,
                    confidence: Number(skill.confidence) || 0,
                    performanceScore: (skill.performanceScore !== null && skill.performanceScore !== undefined)
                        ? Number(skill.performanceScore)
                        : null,
                    evidenceStrength: skill.evidenceStrength || "None",
                    evidenceCount: Number(skill.evidenceCount) || 0,
                    lastAssessedAt: skill.lastAssessedAt
                };
            });

            localStorage.setItem("workforceSkills", JSON.stringify(skills));
            renderSkills();

        } catch (error) {
            console.warn("Backend loading error, checking fallback:", error);
            const saved = JSON.parse(localStorage.getItem("workforceSkills")) || [];
            skills = saved;
            renderSkills();
        }
    }

    /* ==========================================
       STATUS HELPER
    ========================================== */
    function getStatus(performanceScore, evidenceCount) {
        if (performanceScore === null || evidenceCount === 0) {
            return "NOT ASSESSED";
        }
        if (performanceScore >= 80) {
            return "STRONG";
        }
        if (performanceScore >= 50) {
            return "DEVELOPING";
        }
        return "BASIC";
    }

    /* ==========================================
       ADD SKILL (No manual confidence required)
    ========================================== */
    async function addSkill(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const skillName = skillSelect ? skillSelect.value.trim() : "";
        if (!skillName) {
            alert("Please select a skill to add.");
            return;
        }

        const existingSkill = skills.find(function (skill) {
            return skill.name.toLowerCase() === skillName.toLowerCase();
        });

        if (existingSkill) {
            alert(`"${skillName}" is already in your skills profile.`);
            return;
        }

        try {
            if (addSkillButton) {
                addSkillButton.disabled = true;
                addSkillButton.textContent = "Adding...";
            }

            const response = await fetch((window.API_URL || "http://localhost:8080/api") + "/user-skills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId,
                    skillName: skillName
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Unable to add skill.");
            }

            const savedSkill = await response.json();

            skills.push({
                id: savedSkill.id,
                name: savedSkill.skillName,
                confidence: Number(savedSkill.confidence) || 0,
                performanceScore: (savedSkill.performanceScore !== null && savedSkill.performanceScore !== undefined)
                    ? Number(savedSkill.performanceScore)
                    : null,
                evidenceStrength: savedSkill.evidenceStrength || "None",
                evidenceCount: Number(savedSkill.evidenceCount) || 0,
                lastAssessedAt: savedSkill.lastAssessedAt
            });

            localStorage.setItem("workforceSkills", JSON.stringify(skills));
            renderSkills();

            if (skillSelect) {
                skillSelect.value = "";
            }

        } catch (error) {
            console.error("Add skill error:", error);
            alert(error.message || "Failed to add skill.");
        } finally {
            if (addSkillButton) {
                addSkillButton.disabled = false;
                addSkillButton.textContent = "+ Add Skill";
            }
        }
    }

    /* ==========================================
       DELETE SKILL
    ========================================== */
    async function deleteSkill(skillName) {
        const confirmed = confirm(`Remove "${skillName}" from your skills profile?`);
        if (!confirmed) return;

        try {
            const response = await fetch(
                `${window.API_URL || "http://localhost:8080/api"}/user-skills/user/${userId}/skill/${encodeURIComponent(skillName)}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Unable to delete skill.");
            }

            skills = skills.filter(function (skill) {
                return skill.name.toLowerCase() !== skillName.toLowerCase();
            });

            localStorage.setItem("workforceSkills", JSON.stringify(skills));
            renderSkills();

        } catch (error) {
            console.error("Delete error:", error);
            alert(error.message || "Unable to delete skill.");
        }
    }

    /* ==========================================
       RENDER SKILLS
    ========================================== */
    function renderSkills() {
        if (!skillsList) return;
        skillsList.innerHTML = "";

        if (skills.length === 0) {
            skillsList.innerHTML = `
                <div class="empty-state">
                    <div>🎯</div>
                    <h3>No skills added yet</h3>
                    <p>Select a skill above to begin tracking your performance.</p>
                </div>
            `;
            updateSkillCountDisplay(0);
            return;
        }

        updateSkillCountDisplay(skills.length);

        skills.forEach(function (skill) {
            const hasEvidence = skill.performanceScore !== null && (skill.evidenceCount || 0) > 0;
            const status = getStatus(skill.performanceScore, skill.evidenceCount);
            const strength = skill.evidenceStrength || "None";
            const scoreDisplay = hasEvidence ? `${Math.round(skill.performanceScore)}%` : "Not assessed";
            const progressPercent = hasEvidence ? Math.round(skill.performanceScore) : 0;
            const statusClass = status.toLowerCase().replace(/\s+/g, '-');

            const card = document.createElement("div");
            card.className = "skill-card";

            card.innerHTML = `
                <div class="skill-card-main">
                    <div>
                        <h3>${escapeHTML(skill.name)}</h3>
                        <div class="skill-badges">
                            <span class="skill-status status-${statusClass}">
                                ${status}
                            </span>
                            <span class="strength-badge strength-${strength.toLowerCase()}">
                                Evidence: ${strength}
                            </span>
                            <span class="evidence-count-badge">
                                📋 ${skill.evidenceCount || 0} ${skill.evidenceCount === 1 ? 'record' : 'records'}
                            </span>
                        </div>
                    </div>

                    <div class="skill-score-box">
                        <strong class="${hasEvidence ? 'score-highlight' : 'score-empty score-unassessed'}">
                            ${scoreDisplay}
                        </strong>
                        <span>Performance Score</span>
                        <button type="button" class="view-breakdown-link" data-skill="${encodeURIComponent(skill.name)}" title="View score breakdown for ${escapeHTML(skill.name)}">
                            View Breakdown →
                        </button>
                    </div>
                </div>

                <div class="skill-progress">
                    <div class="skill-progress-bar" style="width: ${progressPercent}%;"></div>
                </div>

                <div class="skill-card-actions">
                    <button type="button" class="breakdown-btn" data-skill="${encodeURIComponent(skill.name)}" title="View score breakdown & weights for ${escapeHTML(skill.name)}">
                        🔍 View Breakdown & Formula
                    </button>
                    <a href="evidence.html?skill=${encodeURIComponent(skill.name)}" class="add-evidence-btn">
                        + Add Evidence
                    </a>
                    <button type="button" class="delete-skill-button" data-skill="${encodeURIComponent(skill.name)}">
                        Remove
                    </button>
                </div>
            `;

            skillsList.appendChild(card);
        });
    }

    // Attach robust event delegation to skillsList for both clicks and keyboard navigation
    if (skillsList) {
        skillsList.addEventListener("click", function (e) {
            const breakdownBtn = e.target.closest(".breakdown-btn, .view-breakdown-link");
            if (breakdownBtn) {
                e.preventDefault();
                e.stopPropagation();
                const skillName = decodeURIComponent(breakdownBtn.getAttribute("data-skill") || "");
                if (skillName) {
                    openBreakdownModal(skillName);
                }
                return;
            }

            const deleteBtn = e.target.closest(".delete-skill-button");
            if (deleteBtn) {
                e.preventDefault();
                e.stopPropagation();
                const skillName = decodeURIComponent(deleteBtn.getAttribute("data-skill") || "");
                if (skillName) {
                    deleteSkill(skillName);
                }
                return;
            }
        });

        skillsList.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                const breakdownBtn = e.target.closest(".breakdown-btn, .view-breakdown-link");
                if (breakdownBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const skillName = decodeURIComponent(breakdownBtn.getAttribute("data-skill") || "");
                    if (skillName) {
                        openBreakdownModal(skillName);
                    }
                }
            }
        });
    }

    function updateSkillCountDisplay(count) {
        const countElements = [
            document.getElementById("skillsCount"),
            document.getElementById("skillCount"),
            document.getElementById("skillsCountDisplay")
        ];

        countElements.forEach(function (el) {
            if (el) {
                el.textContent = `${count} ${count === 1 ? 'Skill' : 'Skills'}`;
            }
        });
    }

    /* ==========================================
       BREAKDOWN MODAL
    ========================================== */
    window._lastFocusedElement = null;

    window.openBreakdownModal = async function (skillName) {
        const modal = document.getElementById("breakdownModal");
        if (!modal) return;

        // Ensure modal is directly attached to <body> so parent transforms/filters cannot interfere with fixed positioning
        if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }

        // Save last focused element for restoration
        window._lastFocusedElement = document.activeElement;

        const nameEl = document.getElementById("modalSkillName");
        const strengthEl = document.getElementById("modalStrengthBadge");
        const countEl = document.getElementById("modalEvidenceCountBadge");
        const provisionalEl = document.getElementById("modalProvisionalBadge");
        const lastAssessedEl = document.getElementById("modalLastAssessedAt");
        const scoreEl = document.getElementById("modalPerformanceScore");
        const statusEl = document.getElementById("modalStatusLabel");
        const formulaEl = document.getElementById("modalFormulaExplanation");
        const categoriesList = document.getElementById("modalCategoriesList");
        const missingBox = document.getElementById("modalMissingBox");
        const missingList = document.getElementById("modalMissingList");
        const recordEvidenceBtn = document.getElementById("modalRecordEvidenceBtn");

        if (nameEl) nameEl.textContent = skillName;
        if (scoreEl) {
            scoreEl.textContent = "Loading...";
            scoreEl.className = "";
        }
        if (strengthEl) {
            strengthEl.textContent = "Loading...";
            strengthEl.className = "strength-badge strength-none";
        }
        if (countEl) countEl.textContent = "📋 Loading...";
        if (provisionalEl) provisionalEl.style.display = "none";
        if (lastAssessedEl) lastAssessedEl.style.display = "none";
        if (statusEl) statusEl.textContent = "Loading...";
        if (formulaEl) formulaEl.textContent = "Calculating latest performance score from server...";
        if (categoriesList) categoriesList.innerHTML = "<p style='color: var(--text-muted); font-size: 13px;'>Loading breakdown...</p>";
        if (missingBox) missingBox.style.display = "none";

        // Update Record Evidence button link
        if (recordEvidenceBtn) {
            recordEvidenceBtn.href = `evidence.html?skill=${encodeURIComponent(skillName)}`;
            recordEvidenceBtn.textContent = `+ Record Evidence for ${skillName}`;
        }

        // Lock background scroll and open modal as centered fixed overlay
        document.body.style.overflow = "hidden";
        modal.classList.add("active");
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");

        // Focus close button for accessibility
        const closeBtn = document.getElementById("modalCloseBtn") || document.getElementById("modalFooterCloseBtn");
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 50);
        }

        try {
            const response = await fetch(
                `${window.API_URL || "http://localhost:8080/api"}/user-skills/user/${userId}/skill/${encodeURIComponent(skillName)}/breakdown`
            );

            if (!response.ok) {
                throw new Error("Server responded with HTTP " + response.status);
            }

            const data = await response.json();

            if (nameEl) nameEl.textContent = data.skillName || skillName;

            const strength = data.evidenceStrength || "None";
            if (strengthEl) {
                strengthEl.textContent = `Evidence: ${strength}`;
                strengthEl.className = `strength-badge strength-${strength.toLowerCase()}`;
            }

            if (countEl) {
                const count = Number(data.evidenceCount) || 0;
                countEl.textContent = `📋 ${count} ${count === 1 ? 'record' : 'records'}`;
            }

            if (provisionalEl) {
                if (data.isProvisional) {
                    provisionalEl.style.display = "inline-flex";
                    provisionalEl.textContent = "⚠️ Provisional";
                    provisionalEl.title = "Score is provisional until evidence is recorded across other categories";
                } else {
                    provisionalEl.style.display = "none";
                }
            }

            if (lastAssessedEl) {
                if (data.lastAssessedAt) {
                    const dt = new Date(data.lastAssessedAt);
                    lastAssessedEl.style.display = "inline-block";
                    lastAssessedEl.textContent = `🕒 Last assessed: ${dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
                } else {
                    lastAssessedEl.style.display = "none";
                }
            }

            const isAssessed = data.performanceScore !== null && (data.evidenceCount || 0) > 0;
            if (isAssessed) {
                if (scoreEl) {
                    scoreEl.textContent = `${Math.round(data.performanceScore)}%`;
                    scoreEl.className = "modal-score-highlight";
                }
                if (statusEl) statusEl.textContent = data.statusLabel || "Assessed";
                if (formulaEl) formulaEl.textContent = data.formulaExplanation || "Calculated using WorkforceIQ Evidence-Based Weighting Model.";
            } else {
                if (scoreEl) {
                    scoreEl.textContent = "Not assessed";
                    scoreEl.className = "modal-score-unassessed";
                }
                if (statusEl) statusEl.textContent = "Not Assessed";
                if (formulaEl) {
                    formulaEl.textContent = "Not assessed: Not enough valid evidence has been recorded for this skill yet. Scores are calculated automatically from recorded tests, assignments, projects, practical coding, and learning activities once verified evidence is provided.";
                }
            }

            // Render categories with real scores, base weights, and effective weights
            if (categoriesList) {
                categoriesList.innerHTML = "";
                (data.categories || []).forEach(function (cat) {
                    const item = document.createElement("div");
                    item.className = "category-item";

                    const hasCatEvidence = cat.hasEvidence && cat.score !== null;
                    const scoreText = hasCatEvidence
                        ? `<strong>${Math.round(cat.score)}%</strong>`
                        : `<span class="category-missing">No evidence (Not counted)</span>`;

                    const basePct = Math.round(cat.baseWeight * 100);
                    const effPct = (cat.effectiveWeight * 100).toFixed(1);
                    const effWeightText = hasCatEvidence
                        ? `Effective weight: ${effPct}% (Base: ${basePct}%) · ${cat.evidenceCount || 0} ${cat.evidenceCount === 1 ? 'record' : 'records'}`
                        : `Base weight: ${basePct}% (Not yet counted) · 0 records`;

                    const progressWidth = hasCatEvidence ? Math.min(100, Math.max(0, Math.round(cat.score))) : 0;

                    item.innerHTML = `
                        <div class="category-header">
                            <div>
                                <strong>${escapeHTML(cat.displayName)}</strong>
                                <small class="category-weight">${effWeightText}</small>
                            </div>
                            <div class="category-score-val">
                                ${scoreText}
                            </div>
                        </div>
                        <div class="category-progress-track">
                            <div class="category-progress-fill" style="width: ${progressWidth}%;"></div>
                        </div>
                    `;
                    categoriesList.appendChild(item);
                });
            }

            // Missing categories section
            if (missingBox && missingList) {
                if (data.missingCategories && data.missingCategories.length > 0) {
                    missingBox.style.display = "block";
                    missingList.innerHTML = "";
                    data.missingCategories.forEach(function (cat) {
                        const li = document.createElement("li");
                        li.textContent = cat;
                        missingList.appendChild(li);
                    });
                    const addLink = missingBox.querySelector(".add-evidence-link");
                    if (addLink) {
                        addLink.href = `evidence.html?skill=${encodeURIComponent(skillName)}`;
                        addLink.textContent = `+ Add evidence for ${skillName} now →`;
                    }
                } else {
                    missingBox.style.display = "none";
                }
            }

        } catch (error) {
            console.warn("Modal fetch warning, checking local profile data:", error);
            // Search in local skills cache
            const localSkill = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
            if (localSkill) {
                if (nameEl) nameEl.textContent = localSkill.name;
                const strength = localSkill.evidenceStrength || "None";
                if (strengthEl) {
                    strengthEl.textContent = `Evidence: ${strength}`;
                    strengthEl.className = `strength-badge strength-${strength.toLowerCase()}`;
                }
                if (countEl) countEl.textContent = `📋 ${localSkill.evidenceCount || 0} records`;

                const hasEv = localSkill.performanceScore !== null && (localSkill.evidenceCount || 0) > 0;
                if (hasEv) {
                    if (scoreEl) {
                        scoreEl.textContent = `${Math.round(localSkill.performanceScore)}%`;
                        scoreEl.className = "modal-score-highlight";
                    }
                    if (statusEl) statusEl.textContent = getStatus(localSkill.performanceScore, localSkill.evidenceCount);
                    if (formulaEl) formulaEl.textContent = "Score recorded in your profile. Real-time dynamic category weight distribution will sync when connected to the backend server.";
                } else {
                    if (scoreEl) {
                        scoreEl.textContent = "Not assessed";
                        scoreEl.className = "modal-score-unassessed";
                    }
                    if (statusEl) statusEl.textContent = "Not Assessed";
                    if (formulaEl) {
                        formulaEl.textContent = "Not assessed: Not enough valid evidence has been recorded for this skill yet. Scores are calculated automatically from recorded tests, assignments, projects, practical coding, and learning activities.";
                    }
                }

                if (categoriesList) {
                    categoriesList.innerHTML = `
                        <div class="category-item">
                            <div class="category-header">
                                <div>
                                    <strong>Evidence-Based Weight Distribution</strong>
                                    <small class="category-weight">Tests (35%), Projects (30%), Practical Coding (20%), Learning (15%)</small>
                                </div>
                            </div>
                        </div>
                    `;
                }

                if (missingBox && missingList) {
                    if (!hasEv) {
                        missingBox.style.display = "block";
                        missingList.innerHTML = "<li>Tests and Assignments (Base: 35%)</li><li>Projects (Base: 30%)</li><li>Practical Coding (Base: 20%)</li><li>Learning & Practice Activities (Base: 15%)</li>";
                        const addLink = missingBox.querySelector(".add-evidence-link");
                        if (addLink) {
                            addLink.href = `evidence.html?skill=${encodeURIComponent(skillName)}`;
                            addLink.textContent = `+ Add evidence for ${skillName} now →`;
                        }
                    } else {
                        missingBox.style.display = "none";
                    }
                }
            } else {
                if (formulaEl) formulaEl.textContent = "Error loading breakdown: " + error.message;
            }
        }
    };

    window.closeBreakdownModal = function () {
        const modal = document.getElementById("breakdownModal");
        if (modal) {
            modal.classList.remove("active");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
        }
        // Restore background scrolling
        document.body.style.overflow = "";

        // Restore focus to triggering element
        if (window._lastFocusedElement && typeof window._lastFocusedElement.focus === "function") {
            try {
                window._lastFocusedElement.focus();
            } catch (err) {
                // Ignore focus restoration errors
            }
        }
    };

    // Close modal on escape key
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
            const m = document.getElementById("breakdownModal");
            if (m && (m.style.display === "flex" || m.classList.contains("active"))) {
                window.closeBreakdownModal();
            }
        }
    });

    // Close modal when clicking overlay, but NOT when clicking inside modal card
    const modal = document.getElementById("breakdownModal");
    if (modal) {
        // Ensure direct body attachment
        if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }

        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                window.closeBreakdownModal();
            }
        });

        const modalBox = modal.querySelector(".modal-box");
        if (modalBox) {
            modalBox.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }

        const closeBtnHeader = document.getElementById("modalCloseBtn");
        if (closeBtnHeader) {
            closeBtnHeader.addEventListener("click", function (e) {
                e.preventDefault();
                window.closeBreakdownModal();
            });
        }

        const closeBtnFooter = document.getElementById("modalFooterCloseBtn");
        if (closeBtnFooter) {
            closeBtnFooter.addEventListener("click", function (e) {
                e.preventDefault();
                window.closeBreakdownModal();
            });
        }
    }

    function escapeHTML(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* ==========================================
       INITIALIZE
    ========================================== */
    window.addSkill = addSkill;
    window.deleteSkill = deleteSkill;
    window.continueToEvidence = function () {
        window.location.href = "evidence.html";
    };

    // Bind Add Skill button via event listener (not inline onclick)
    if (addSkillButton) {
        addSkillButton.addEventListener("click", addSkill);
    }

    // Bind Continue to Evidence button
    const continueBtn = document.getElementById("continueButton");
    if (continueBtn) {
        continueBtn.addEventListener("click", function (e) {
            e.preventDefault();
            window.continueToEvidence();
        });
    }

    // Wire confidence slider display
    const confidenceRange = document.getElementById("confidenceRange");
    const confidenceValueEl = document.getElementById("confidenceValue");
    if (confidenceRange && confidenceValueEl) {
        confidenceRange.addEventListener("input", function () {
            confidenceValueEl.textContent = confidenceRange.value + "%";
        });
    }

    loadSkillOptions();
    await loadSkillsFromBackend();
});