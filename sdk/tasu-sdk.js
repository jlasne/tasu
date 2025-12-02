// tasu-sdk.js - Client-side click tracking SDK

(function () {
    'use strict';

    // Configuration will be populated by init()
    let config = {
        projectId: null,
        endpoint: 'https://api.eu-west-1.aws.tinybird.co/v0/events?name=events',
        token: 'REPLACE_WITH_YOUR_INGEST_TOKEN' // Public write-only token
    };

    const CONSTANTS = {
        OFFLINE_QUEUE_KEY: 'tasu_offline_queue',
        MAX_QUEUE_SIZE: 100
    };

    // Public API
    window.Tasu = {
        init: function (options) {
            if (!options || !options.projectId) {
                console.error('Tasu: projectId is required');
                return;
            }
            config.projectId = options.projectId;
            if (options.token) config.token = options.token; // Allow overriding token if needed

            // Start tracking
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startTracking);
            } else {
                startTracking();
            }

            console.log('Tasu initialized for project:', config.projectId);
        }
    };

    function startTracking() {
        attachClickListeners();
        setupMutationObserver();
        processOfflineQueue();

        // Periodic queue processing
        setInterval(processOfflineQueue, 30000);
    }

    // Generate or retrieve session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('tasu_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('tasu_session_id', sessionId);
        }
        return sessionId;
    }

    // Generate user ID (persistent across sessions)
    function getUserId() {
        let userId = localStorage.getItem('tasu_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('tasu_user_id', userId);
        }
        return userId;
    }

    // Get element identifier
    function getElementIdentifier(element) {
        if (element.id) return `#${element.id}`;
        if (element.name) return `[name="${element.name}"]`;
        if (element.getAttribute('aria-label')) return `[aria-label="${element.getAttribute('aria-label')}"]`;

        const text = element.textContent?.trim().substring(0, 30) || '';
        if (text) return text;

        const classes = element.className ? `.${element.className.split(' ')[0]}` : '';
        return `${element.tagName.toLowerCase()}${classes}`;
    }

    // Get CSS selector path
    function getSelectorPath(element) {
        if (element.id) return `#${element.id}`;

        const path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            if (element.className) {
                const classes = element.className.split(' ').filter(c => c).slice(0, 2);
                if (classes.length) selector += `.${classes.join('.')}`;
            }
            path.unshift(selector);
            element = element.parentNode;
            if (path.length >= 3) break;
        }
        return path.join(' > ');
    }

    // Track click event
    async function trackClick(element) {
        if (!config.projectId) return; // Don't track if not initialized

        const payload = {
            project_id: config.projectId,
            feature_name: getElementIdentifier(element),
            selector: getSelectorPath(element),
            timestamp: new Date().toISOString(),
            user_id: getUserId(),
            session_id: getSessionId(),
            url: window.location.href,
            website_domain: window.location.hostname,
            element_type: element.tagName.toLowerCase(),
            element_text: element.textContent?.trim().substring(0, 100) || ''
        };

        try {
            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            processOfflineQueue();
        } catch (error) {
            console.warn('Tasu: Failed to track click, queuing for later:', error);
            queueOfflineEvent(payload);
        }
    }

    // Queue event for offline retry
    function queueOfflineEvent(payload) {
        try {
            const queue = JSON.parse(localStorage.getItem(CONSTANTS.OFFLINE_QUEUE_KEY) || '[]');
            queue.push(payload);

            if (queue.length > CONSTANTS.MAX_QUEUE_SIZE) {
                queue.shift();
            }

            localStorage.setItem(CONSTANTS.OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        } catch (e) {
            console.error('Tasu: Failed to queue event:', e);
        }
    }

    // Process offline queue
    async function processOfflineQueue() {
        if (!config.projectId) return;

        try {
            const queue = JSON.parse(localStorage.getItem(CONSTANTS.OFFLINE_QUEUE_KEY) || '[]');
            if (queue.length === 0) return;

            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(queue)
            });

            if (response.ok) {
                localStorage.removeItem(CONSTANTS.OFFLINE_QUEUE_KEY);
            }
        } catch (e) {
            // Silently fail
        }
    }

    // Check if element is clickable
    function isClickable(element) {
        const clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
        const clickableRoles = ['button', 'link', 'menuitem', 'tab'];

        return clickableTags.includes(element.tagName) ||
            clickableRoles.includes(element.getAttribute('role')) ||
            element.onclick !== null ||
            element.getAttribute('onclick') !== null ||
            window.getComputedStyle(element).cursor === 'pointer';
    }

    // Attach listeners
    function attachClickListeners() {
        document.querySelectorAll('*').forEach(element => {
            if (isClickable(element) && !element.hasAttribute('data-tasu-tracked')) {
                element.setAttribute('data-tasu-tracked', 'true');
                element.addEventListener('click', () => trackClick(element), { passive: true });
            }
        });
    }

    // Mutation Observer
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (isClickable(node) && !node.hasAttribute('data-tasu-tracked')) {
                            node.setAttribute('data-tasu-tracked', 'true');
                            node.addEventListener('click', () => trackClick(node), { passive: true });
                        }
                        node.querySelectorAll?.('*').forEach(child => {
                            if (isClickable(child) && !child.hasAttribute('data-tasu-tracked')) {
                                child.setAttribute('data-tasu-tracked', 'true');
                                child.addEventListener('click', () => trackClick(child), { passive: true });
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})();
