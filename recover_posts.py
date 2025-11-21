import xml.etree.ElementTree as ET
import os
from datetime import datetime
import re

# Parse the atom.xml file
tree = ET.parse('atom.xml')
root = tree.getroot()

# Namespace map
ns = {'atom': 'http://www.w3.org/2005/Atom'}

# Directory for posts
output_dir = 'content/blog'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def slugify(title):
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug

for entry in root.findall('atom:entry', ns):
    title = entry.find('atom:title', ns).text
    published = entry.find('atom:updated', ns).text
    content = entry.find('atom:content', ns).text
    
    # Parse date
    # Format: 2013-07-02T16:06:00+05:30
    dt = datetime.fromisoformat(published)
    date_str = dt.strftime('%Y-%m-%d %H:%M')
    
    slug = slugify(title)
    filename = f"{output_dir}/{slug}.md"
    
    # Create Markdown content
    # We are keeping the content as HTML for now because converting perfectly to MD is hard without a library like markdownify
    # Pelican can render HTML in Markdown files if we leave it as is, or we can use the 'html' format.
    # But let's try to keep it simple. We will wrap the content in a way Pelican understands.
    # Actually, Pelican supports Markdown files with HTML inside.
    
    md_content = f"""Title: {title}
Date: {date_str}
Category: Blog
Slug: {slug}

{content}
"""
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(md_content)
        
    print(f"Recovered: {title} -> {filename}")
