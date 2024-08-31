import os
import subprocess
import random
from flask import Flask, request, send_file
import yt_dlp
from PIL import Image
import io

app = Flask(__name__)


DOWNLOAD_DIR = os.path.expanduser("~/Movies/Youtube-dl/test")
TMP_DIR = os.path.join(DOWNLOAD_DIR, "tmp")
os.makedirs(TMP_DIR, exist_ok=True)

def download_and_process_audio(link, quality="best", thumbnail_size=1000):
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': os.path.join(TMP_DIR, '%(title)s.%(ext)s'),
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(link, download=True)
        audio_file = ydl.prepare_filename(info).replace('.webm', '.mp3')

    # Download thumbnail
    ydl_opts = {
        'outtmpl': os.path.join(TMP_DIR, 'thumbnail.%(ext)s'),
        'skip_download': True,
        'writethumbnail': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([link])

    output_file = audio_file
    return output_file

@app.route('/download', methods=['GET'])
def download_audio():
    link = request.args.get('link')
    quality = request.args.get('quality', 'best')
    thumbnail_size = int(request.args.get('thumbnail_size', 1000))

    if not link:
        return "Missing YouTube link", 400

    try:
        output_file = download_and_process_audio(link, quality, thumbnail_size)
        return send_file(output_file, as_attachment=True)
    except Exception as e:
        return str(e), 500
    finally:
        # Clean up temporary files
        for file in os.listdir(TMP_DIR):
            os.remove(os.path.join(TMP_DIR, file))

if __name__ == '__main__':
    app.run(debug=True)