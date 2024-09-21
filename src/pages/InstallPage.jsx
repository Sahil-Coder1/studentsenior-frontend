import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function InstallPage() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Listen for the `beforeinstallprompt` event
        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user's response
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA was installed');
        } else {
            console.log('PWA installation was dismissed');
        }
        // Reset the deferred prompt since it can only be used once.
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Install Our App</h1>
                <p className="mb-6">
                    Get a better experience by installing the Student Senior
                    app.
                </p>
                {isInstallable ? (
                    <button
                        onClick={handleInstallClick}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
                    >
                        Install App
                    </button>
                ) : (
                    <p>
                        App is already installed or not available for
                        installation.
                    </p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default InstallPage;