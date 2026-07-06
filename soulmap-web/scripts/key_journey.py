from PIL import Image, ImageDraw
import os

# Remove the flat white background from decor objects using a flood fill
# seeded from each corner. This keeps interior light details (flowers, moss)
# that a global luminance key would wrongly erase.
FILES = ["journey-start.png", "journey-goal.png"]
BASE = os.path.join("public", "journey")
SENTINEL = (255, 0, 255)
THRESH = 60  # color distance tolerance for the flood

for name in FILES:
    path = os.path.join(BASE, name)
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    rgb = img.convert("RGB")
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for s in seeds:
        ImageDraw.floodfill(rgb, s, SENTINEL, thresh=THRESH)
    src = rgb.load()
    px = img.load()
    for y in range(h):
        for x in range(w):
            if src[x, y] == SENTINEL:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)
    img.save(path)
    print(f"keyed {name} ({w}x{h})")
