import os

# Worker Options
workers = 4
worker_class = 'sync'
threads = 2
timeout = 120

# Server Socket
port = os.getenv("PORT", "5000")
bind = f"0.0.0.0:{port}"

# Server Mechanics
preload_app = True
daemon = False

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# App module specification
wsgi_app = 'app:app'

def on_starting(server):
    server.log.info("Starting Assignment Checker API server")
