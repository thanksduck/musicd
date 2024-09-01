import os
import logging
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Configuration
DOWNLOAD_DIR = os.environ.get('DOWNLOAD_DIR', '/app/downloads')
TMP_DIR = os.path.join(DOWNLOAD_DIR, "tmp")
os.makedirs(TMP_DIR, exist_ok=True)

# Get cookies file path from environment variable
COOKIES_FILE = os.environ.get('COOKIES_FILE', './cookies.txt')

def download_audio(link):
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': os.path.join(TMP_DIR, '%(title)s.%(ext)s'),
        'cookiefile': COOKIES_FILE,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(link, download=True)
        audio_file = ydl.prepare_filename(info).replace('.webm', '.mp3')
    
    return audio_file

@app.route('/download', methods=['GET'])
def download_audio_route():
    link = request.args.get('link')
    
    if not link:
        logger.error("Missing YouTube link in request")
        return jsonify({"error": "Missing YouTube link"}), 400
    
    try:
        output_file = download_audio(link)
        return send_file(output_file, as_attachment=True, download_name="audio.mp3")
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return jsonify({"error": "An error occurred while processing your request"}), 500
    finally:
        # Clean up temporary files
        for file in os.listdir(TMP_DIR):
            try:
                os.remove(os.path.join(TMP_DIR, file))
            except Exception as e:
                logger.warning(f"Failed to remove file {file}: {str(e)}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))