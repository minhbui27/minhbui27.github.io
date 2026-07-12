#!/usr/bin/env python3
"""Local preview server that disables browser caching.

Usage: python3 serve.py [port]   (default 8000)

Plain `python3 -m http.server` lets the browser cache images, so replacing
an imgN.jpg keeps showing the old picture. This sends Cache-Control:
no-store on everything, so a normal reload always fetches fresh files.
"""

import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
print(f'Serving on http://localhost:{port} (caching disabled)')
http.server.ThreadingHTTPServer(('', port), NoCacheHandler).serve_forever()
