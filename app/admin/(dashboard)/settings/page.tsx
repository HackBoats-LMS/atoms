"use client"

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [appName, setAppName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && data.settings) {
                    setAppName(data.settings.appName);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appName })
            });
            const data = await res.json();
            
            if (data.success) {
                setMessage("Settings updated successfully! Please refresh the page to see changes in the sidebar.");
            } else {
                setMessage("Failed to update settings.");
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Global Settings</h1>
                    <p className="text-gray-500 mt-2">Manage application-wide configurations.</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-3 ${message.includes('success') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Application Name</label>
                            <p className="text-xs text-gray-500 mb-3">This name will be displayed on the landing page, admin login, and sidebar.</p>
                            <input 
                                type="text" 
                                value={appName} 
                                onChange={(e) => setAppName(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={saving}
                            className={`w-full text-white font-bold py-3 rounded-lg transition shadow-sm ${saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
