from PIL import Image
import os

# Make the near-white background of the decor PNGs transparent.
# Uses luminance-based alpha so soft watercolor edges fade smoothly.
FILES = ["decor-leaf.png", "decor-blossom.png"]
BASE = os.path.join("public", "pillars")

# Pixels brighter than HI become fully transparent; darker than LO stay opaque.
HI = 244  # near-white -> transparent
LO = 205  # clearly part of the art -> keep

for name in FILES:
    path = os.path.join(BASE, name)
    img = Image.open(path).convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if lum >= HI:
                px[x, y] = (r, g, b, 0)
            elif lum > LO:
                # linear fade in the transition band
                alpha = int(255 * (HI - lum) / (HI - LO))
                px[x, y] = (r, g, b, alpha)
    img.save(path)
    print(f"keyed {name} ({w}x{h})")
