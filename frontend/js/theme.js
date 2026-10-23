/**
 * WorkforceIQ — Theme Manager
 * Handles light/dark toggle, localStorage persistence,
 * and anti-flash early application.
 *
 * Attach to every page as the FIRST <script> in <head>.
 * Also injects the toggle button into the navbar automatically.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'wiq_theme';
    const DARK        = 'dark';
    const LIGHT       = 'light';

    /* ── Read saved preference ── */
    function getSaved() {
        try { return localStorage.getItem(STORAGE_KEY); }
        catch (_) { return null; }
    }

    function save(theme) {
        try { localStorage.setItem(STORAGE_KEY, theme); }
        catch (_) { /* localStorage unavailable — silent */ }
    }

    /* ── Apply theme to <html> ── */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    /* ── Get system preference ── */
    function systemPrefersDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /* ── Early application (anti-flash) ── */
    (function earlyApply() {
        // Add class to suppress transitions while theme is loading
        document.documentElement.classList.add('theme-loading');
        const saved = getSaved();
        const resolved = saved || (systemPrefersDark() ? DARK : LIGHT);
        applyTheme(resolved);
        // Remove class once CSS has painted
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.documentElement.classList.remove('theme-loading');
            });
        });
    })();

    /* ── Build and inject the toggle button ── */
    function injectToggle() {
        const navbar = document.querySelector('.navbar, nav.navbar');
        if (!navbar) return;
        if (document.getElementById('themeToggle')) return; // already injected

        const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT;

        const btn = document.createElement('button');
        btn.id = 'themeToggle';
        btn.setAttribute('aria-label', 'Toggle light/dark theme');
        btn.setAttribute('role', 'switch');
        btn.setAttribute('aria-checked', currentTheme === DARK ? 'true' : 'false');
        btn.setAttribute('type', 'button');
        btn.title = 'Toggle theme (light / dark)';
        btn.innerHTML = `
            <span class="theme-icon theme-icon-sun"  aria-hidden="true">☀️</span>
            <span class="theme-knob"></span>
            <span class="theme-icon theme-icon-moon" aria-hidden="true">🌙</span>
        `;

        btn.addEventListener('click', toggleTheme);
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });

        // Insert before the user-circle or profile-step (or at end of navbar)
        const targetAnchor = navbar.querySelector('.user-circle, .profile-step');
        if (targetAnchor) {
            navbar.insertBefore(btn, targetAnchor);
        } else {
            navbar.appendChild(btn);
        }

        // On auth pages that have no navbar, add a floating toggle instead
    }

    function injectAuthToggle() {
        // For login/register/forgot-password pages that have no .navbar
        const hasNavbar = document.querySelector('.navbar, nav.navbar');
        if (hasNavbar) return;
        if (document.getElementById('themeToggle')) return;

        const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT;
        const btn = document.createElement('button');
        btn.id = 'themeToggle';
        btn.setAttribute('aria-label', 'Toggle light/dark theme');
        btn.setAttribute('role', 'switch');
        btn.setAttribute('aria-checked', currentTheme === DARK ? 'true' : 'false');
        btn.setAttribute('type', 'button');
        btn.title = 'Toggle theme';
        btn.innerHTML = `
            <span class="theme-icon theme-icon-sun"  aria-hidden="true">☀️</span>
            <span class="theme-knob"></span>
            <span class="theme-icon theme-icon-moon" aria-hidden="true">🌙</span>
        `;
        // Float in top-right corner on auth pages
        btn.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;';
        btn.addEventListener('click', toggleTheme);
        document.body.appendChild(btn);
    }

    /* ── Toggle between light and dark ── */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || LIGHT;
        const next    = current === DARK ? LIGHT : DARK;
        applyTheme(next);
        save(next);
        updateToggleState(next);
        updateChartColors(next);
    }

    /* ── Update toggle button aria/visual state ── */
    function updateToggleState(theme) {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        btn.setAttribute('aria-checked', theme === DARK ? 'true' : 'false');
    }

    /* ── Update Chart.js charts if present ── */
    function updateChartColors(theme) {
        if (typeof Chart === 'undefined') return;
        const gridColor  = theme === DARK ? 'rgba(100,116,139,0.20)' : 'rgba(100,116,139,0.12)';
        const labelColor = theme === DARK ? '#94a3b8' : '#64748b';
        Chart.helpers.each(Chart.instances, function (chart) {
            if (!chart || !chart.options) return;
            // Update all axes
            ['x', 'y', 'r'].forEach(function (axis) {
                if (chart.options.scales && chart.options.scales[axis]) {
                    const sc = chart.options.scales[axis];
                    if (sc.grid)  sc.grid.color  = gridColor;
                    if (sc.ticks) sc.ticks.color = labelColor;
                }
            });
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels = chart.options.plugins.legend.labels || {};
                chart.options.plugins.legend.labels.color = labelColor;
            }
            chart.update('none');
        });
    }

    /* ── Run on DOM ready ── */
    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    onReady(function () {
        injectToggle();
        injectAuthToggle();
        // Update chart colors for the current theme on page load
        updateChartColors(document.documentElement.getAttribute('data-theme') || LIGHT);

        // Listen for system theme changes (in case user hasn't set a manual preference)
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                // Only follow system if user hasn't manually chosen
                if (!getSaved()) {
                    const next = e.matches ? DARK : LIGHT;
                    applyTheme(next);
                    updateToggleState(next);
                    updateChartColors(next);
                }
            });
        }
    });

    // Expose for external use (e.g. from within page JS)
    window.WorkforceTheme = { toggle: toggleTheme, apply: applyTheme };
})();
