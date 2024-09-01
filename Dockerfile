FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN python -m venv venv && \
    venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app.py .

# Create downloads directory
RUN mkdir -p /app/downloads

# Set environment variables
ENV DOWNLOAD_DIR=/app/downloads
ENV PORT=9191

# Expose port
EXPOSE 9191

# Run the application using the virtual environment's Python
CMD ["venv/bin/python", "app.py"]