from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
from translator import translate_pptx, translate_docx, translate_pdf

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # React app local
    "http://localhost:5174",  # React app alternate port
    "http://localhost:3000",
    "*"  # Allow all origins for production (Vercel deployment)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Set to False when using wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def cleanup_files(*file_paths):
    """Delete files after they've been sent to the user"""
    for file_path in file_paths:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Cleaned up: {file_path}")
        except Exception as e:
            print(f"Error cleaning up {file_path}: {e}")

@app.post("/translate")
async def translate_presentation(background_tasks: BackgroundTasks, file: UploadFile = File(...), target_lang: str = "or"):
    # Generate unique filenames
    file_id = str(uuid.uuid4())
    input_filename = f"{file_id}_{file.filename}"
    
    # Determine output filename and function based on extension
    if file.filename.lower().endswith(".pptx"):
        output_filename = f"translated_{file_id}_{file.filename}"
        translate_func = translate_pptx
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    elif file.filename.lower().endswith(".docx"):
        output_filename = f"translated_{file_id}_{file.filename}"
        translate_func = translate_docx
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif file.filename.lower().endswith(".pdf"):
        # For PDF, the output is a DOCX
        output_filename = f"translated_{file_id}_{file.filename.replace('.pdf', '.docx')}"
        translate_func = translate_pdf
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        raise HTTPException(status_code=400, detail="Only .pptx, .docx, and .pdf files are allowed")
    
    input_path = os.path.join(UPLOAD_DIR, input_filename)
    output_path = os.path.join(UPLOAD_DIR, output_filename)

    try:
        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Perform translation
        # Note: translate_pdf signature matches others: (input, output, lang)
        # It handles the intermediate conversion internally.
        translate_func(input_path, output_path, target_lang)

        # Schedule cleanup of both input and output files after response is sent
        background_tasks.add_task(cleanup_files, input_path, output_path)

        # Return the translated file
        return FileResponse(output_path, media_type=media_type, filename=os.path.basename(output_path))

    except Exception as e:
        import traceback
        with open("error_log.txt", "w") as f:
            f.write(str(e))
            f.write("\n")
            traceback.print_exc(file=f)
        
        # Clean up files on error
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)
        
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
