import React, { useState } from 'react';
import axios from 'axios';
import { Download, RefreshCw, Languages } from 'lucide-react';
import FileUpload from './components/FileUpload';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [targetLang, setTargetLang] = useState('or');
    const [isTranslating, setIsTranslating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setError(null);
        setDownloadUrl(null);
        setProgress(0);
    };

    const handleTranslate = async () => {
        if (!selectedFile) return;

        setIsTranslating(true);
        setError(null);
        setProgress(10); // Start progress

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('target_lang', targetLang);

        try {
            // Simulate progress for better UX since we don't have real-time progress from backend yet
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 500);

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.post(`${API_URL}/translate`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob', // Important for downloading files
            });

            clearInterval(interval);
            setProgress(100);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);
        } catch (err) {
            console.error(err);
            setError("Translation failed. Please try again.");
            setProgress(0);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleDownload = () => {
        if (downloadUrl && selectedFile) {
            const link = document.createElement('a');
            link.href = downloadUrl;

            let extension = "pptx";
            if (selectedFile.name.toLowerCase().endsWith(".docx") || selectedFile.name.toLowerCase().endsWith(".pdf")) {
                extension = "docx";
            }

            // Remove original extension and append new one
            const originalName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
            link.setAttribute('download', `translated_${originalName}.${extension}`);

            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }
    };

    return (
        <div className="container">
            <h1>PPTX Translator</h1>
            <p className="subtitle">Translate your presentations instantly while preserving formatting.</p>

            <div className="card">
                <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    error={error}
                />

                {selectedFile && !downloadUrl && (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Languages size={20} color="#cbd5e1" />
                                <select
                                    className="language-select"
                                    value={targetLang}
                                    onChange={(e) => setTargetLang(e.target.value)}
                                    disabled={isTranslating}
                                >
                                    <option value="or">Odia (ଓଡ଼ିଆ)</option>
                                    <option value="hi">Hindi (हिंदी)</option>
                                    <option value="bn">Bengali (বাংলা)</option>
                                    <option value="es">Spanish (Español)</option>
                                    <option value="fr">French (Français)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            className="btn"
                            onClick={handleTranslate}
                            disabled={isTranslating}
                        >
                            {isTranslating ? (
                                <>
                                    <div className="spinner"></div>
                                    Translating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={20} />
                                    Translate Now
                                </>
                            )}
                        </button>
                    </div>
                )}

                {isTranslating && (
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                {downloadUrl && (
                    <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s' }}>
                        <div style={{ color: '#4ade80', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            Translation Complete!
                        </div>
                        <button className="btn" onClick={handleDownload}>
                            <Download size={20} />
                            Download Translated PPTX
                        </button>
                        <button
                            className="btn"
                            onClick={() => {
                                setSelectedFile(null);
                                setDownloadUrl(null);
                                setProgress(0);
                            }}
                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', marginLeft: '1rem' }}
                        >
                            Translate Another
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
