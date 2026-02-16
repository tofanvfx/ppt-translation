# V2 Translate

A powerful web application for translating PowerPoint presentations, Word documents, and PDFs while preserving their original formatting.

## Features

- 📄 **Multiple File Formats**: Supports PPTX, DOCX, and PDF files
- 🌐 **Multi-Language Support**: Translate to Odia, Hindi, Bengali, Spanish, French, and more
- 🎨 **Format Preservation**: Maintains original formatting, styles, and layout
- 🔄 **Master Slide Translation**: Translates text in master slides, headers, and footers
- 🖼️ **Advanced Content Handling**: Handles tables, charts, grouped shapes, and complex layouts
- 🚀 **Fast Translation**: Uses parallel processing for optimal performance
- 🔒 **Privacy Focused**: Files are automatically deleted after translation

## Tech Stack

### Frontend
- React + Vite
- Axios for API calls
- React Dropzone for file uploads
- Lucide React for icons

### Backend
- FastAPI
- Python-PPTX for PowerPoint processing
- Python-DOCX for Word documents
- PDF2DOCX for PDF conversion
- Deep Translator for translation services

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variable: `VITE_API_URL` to your Render backend URL
4. Deploy

### Backend (Render)
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable if needed
7. Deploy

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Environment Variables

### Frontend
- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)

### Backend
- No environment variables required for basic operation
- CORS is configured for localhost and production domains

## Usage

1. Open the application in your browser
2. Drag and drop or select a PPTX, DOCX, or PDF file
3. Choose your target language
4. Click "Translate Now"
5. Download the translated file

## License

MIT License
