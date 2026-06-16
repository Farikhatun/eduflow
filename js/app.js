// Main Application
let appInitialized = false;

async function initApp() {
    if (appInitialized) return;
    
    try {
        // Initialize data manager
        const result = await dataManager.init();
        if (!result.isOk) {
            console.error('Data SDK init failed');
            showToast('Gagal terhubung ke database');
            return;
        }

        // Add data listener
        dataManager.addListener((data) => {
            renderAll();
        });

        // Initialize UI
        lucide.createIcons();
        appInitialized = true;
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('App init error:', error);
        showToast('Error initializing app: ' + error.message);
    }
}

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Handle window resize for icon refresh
window.addEventListener('resize', function() {
    lucide.createIcons();
});

// Export for debugging
window.appInitialized = appInitialized;
