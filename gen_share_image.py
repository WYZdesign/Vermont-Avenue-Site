"""Generate a 1200x630 branded share image for Vermont Avenue Records.
Logo (images/label-art.jpg) centered on ink bg + 'Created by musicians, for musicians' tagline.
Output: images/og-share.jpg"""
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
W, H = 1200, 630
INK = (11, 9, 8)
AMBER = (255, 162, 51)
CREAM = (241, 232, 214)
FOG = (167, 155, 136)

img = Image.new("RGB", (W, H), INK)
draw = ImageDraw.Draw(img)
# force exact ink by painting a background rect (eliminates any PIL default)
draw.rectangle((0, 0, W, H), fill=INK)

# center logo at 60% width, square crop
logo_path = os.path.join(ROOT, "images/label-art.jpg")
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGB")
    # center-crop to square
    ls = min(logo.size)
    lx = (logo.width - ls) // 2
    ly = (logo.height - ls) // 2
    logo = logo.crop((lx, ly, lx + ls, ly + ls))
    logo_size = int(W * 0.52)
    logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
    # add subtle amber inner rim
    rim = Image.new("RGB", (logo_size + 12, logo_size + 12), INK)
    ring = Image.new("RGBA", rim.size, (0,0,0,0))
    rd = ImageDraw.Draw(ring)
    rd.ellipse((0,0,ring.size[0]-1,ring.size[1]-1), outline=AMBER + (180,), width=6)
    rim.paste(logo, (6, 6))
    img.paste(rim, ((W - logo_size - 12)//2, (H - logo_size - 12)//2 - 30))

# tagline beneath
tag = "Created by musicians, for musicians"
try:
    f_path = next(p for p in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/SFNS.ttf",
        os.path.join(ROOT, "fonts/SpaceGrotesk-Bold.ttf"),
    ] if os.path.exists(p))
    f = ImageFont.FreeTypeFont(f_path, 26)
    small = ImageFont.FreeTypeFont(f_path, 18)
except Exception:
    f = ImageFont.load_default()
    small = f

tw = draw.textlength(tag, font=f)
draw.text(((W - tw)//2, H - 150), tag, fill=CREAM, font=f)
sub = "Vermont Avenue Records"
sw = draw.textlength(sub, font=small)
draw.text(((W - sw)//2, H - 110), sub, fill=FOG, font=small)

out = os.path.join(ROOT, "images/og-share.png")
img.save(out, "PNG", optimize=True)
print("wrote", out, os.path.getsize(out), "bytes")
