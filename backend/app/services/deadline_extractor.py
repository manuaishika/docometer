"""
Deadline Extractor - Extract deadlines from text
"""
import re
from datetime import datetime, timedelta
from dateutil import parser
import asyncio


class DeadlineExtractor:
    def __init__(self):
        # Common deadline patterns
        self.patterns = [
            r'deadline[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'due[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'submit[:\s]+by[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        ]
    
    async def extract(self, text: str) -> datetime | None:
        """Extract deadline from text"""
        if not text:
            return None
        
        # Try to find dates using patterns
        for pattern in self.patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                date_str = match.group(1) if match.groups() else match.group(0)
                try:
                    # Parse date
                    date = await asyncio.to_thread(parser.parse, date_str, fuzzy=True)
                    # Only return future dates
                    if date > datetime.now():
                        return date
                except:
                    continue
        
        return None
