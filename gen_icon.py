import math, struct, zlib

W, H = 512, 512

# Mood board palette — exact hex values
BG      = (245, 239, 228)  # #F5EFE4  linen cream  (background)
TERRA   = (200,  85,  61)  # #C8553D  sun-dried terra  (jar body)
FOREST  = ( 61,  90,  64)  # #3D5A40  bay forest   (cap)
MUSTARD = (232, 177,  79)  # #E8B14F  turmeric gold (label stripe)
INK     = ( 43,  38,  32)  # #2B2620  ink          (label borders)
CREAM   = (251, 246, 236)  # #FBF6EC  paper cream  (holes)

def in_ellipse(x, y, cx, cy, rx, ry):
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1

def in_rrect(x, y, x1, y1, x2, y2, r=0):
    if x < x1 or x > x2 or y < y1 or y > y2:
        return False
    if x < x1+r and y < y1+r: return in_ellipse(x, y, x1+r, y1+r, r, r)
    if x > x2-r and y < y1+r: return in_ellipse(x, y, x2-r, y1+r, r, r)
    if x < x1+r and y > y2-r: return in_ellipse(x, y, x1+r, y2-r, r, r)
    if x > x2-r and y > y2-r: return in_ellipse(x, y, x2-r, y2-r, r, r)
    return True

def pixel_color(x, y):
    # ── Holes on cap (three cream dots — the universal salt signal)
    if in_ellipse(x, y, 222, 164, 10, 10): return CREAM
    if in_ellipse(x, y, 256, 164, 10, 10): return CREAM
    if in_ellipse(x, y, 290, 164, 10, 10): return CREAM

    # ── Cap (forest green, sits on top of body)
    if in_rrect(x, y, 182, 128, 330, 202, 20): return FOREST

    # ── Jar body with mustard label stripe in the middle
    in_body = in_rrect(x, y, 170, 194, 342, 416, 28)
    if in_body:
        # thin ink rule at label edges
        if 278 <= y <= 282: return INK
        if 330 <= y <= 334: return INK
        # mustard label band
        if 282 <= y <= 330: return MUSTARD
        return TERRA

    # ── Linen cream background
    return BG

print("Rendering 512×512…")
pixels = []
for y in range(H):
    row = []
    for x in range(W):
        row.append(pixel_color(x, y))
    pixels.append(row)

def write_png(pixels, w, h, path):
    def chunk(t, d):
        c = t + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    raw = bytearray()
    for row in pixels:
        raw.append(0)
        for r, g, b in row:
            raw += bytes([r, g, b])
    with open(path, 'wb') as f:
        f.write(
            b'\x89PNG\r\n\x1a\n' +
            chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)) +
            chunk(b'IDAT', zlib.compress(bytes(raw))) +
            chunk(b'IEND', b'')
        )
    print(f"Written {path}")

write_png(pixels, W, H, 'icon-512.png')
