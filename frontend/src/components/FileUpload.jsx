import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ onFileSelect, selectedFile, error }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div className={`dropzone ${isDragActive ? 'active' : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {selectedFile ? (
                    <>
                        <FileText size={48} color="#a855f7" />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>{selectedFile.name}</p>
                            <p style={{ color: '#94a3b8', margin: '0.5rem 0' }}>
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: '#4ade80' }}>
                                <CheckCircle size={16} />
                                <span>Ready to translate</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Upload size={48} color={isDragActive ? '#a855f7' : '#94a3b8'} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 500, margin: 0 }}>
                                {isDragActive ? "Drop the file here" : "Drag & drop PPTX, DOCX, or PDF"}
                            </p>
                            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>or click to browse</p>
                        </div>
                    </>
                )}

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginTop: '1rem' }}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
