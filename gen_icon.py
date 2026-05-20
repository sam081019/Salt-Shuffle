import math, struct, zlib

W, H = 512, 512
ang = math.radians(42)
ca, sa = math.cos(ang), math.sin(ang)
ux, uy = 256, 412  # crossing point

def in_ellipse(x, y, cx, cy, rx, ry):
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1

def in_rrect(x, y, x1, y1, x2, y2, r=0):
    if x < x1 or x > x2 or y < y1 or y > y2:
        return False
    if x < x1 + r and y < y1 + r: return in_ellipse(x, y, x1+r, y1+r, r, r)
    if x > x2 - r and y < y1 + r: return in_ellipse(x, y, x2-r, y1+r, r, r)
    if x < x1 + r and y > y2 - r: return in_ellipse(x, y, x1+r, y2-r, r, r)
    if x > x2 - r and y > y2 - r: return in_ellipse(x, y, x2-r, y2-r, r, r)
    return True

def gauss(x, mu, amp, sig):
    return amp * math.exp(-0.5 * ((x - mu) / sig) ** 2)

def hat_hit(x, y):
    bump = (gauss(x, 256, 108, 30) +
            gauss(x, 160, 64, 24) +
            gauss(x, 352, 64, 24))
    hat_top = 165 - bump
    if bump >= 8 and hat_top <= y <= 166:
        return True
    if 213 <= x <= 299 and 158 <= y <= 262:
        return True
    if in_rrect(x, y, 160, 256, 352, 278, 10):
        return True
    return False

# Knife: rotate(-42) — same frame as the old fork
# World→local: fx = ca*dx - sa*dy,  fy = sa*dx + ca*dy
def knife_hit(x, y):
    dx, dy = x - ux, y - uy
    fx = ca * dx - sa * dy
    fy = sa * dx + ca * dy
    # Blade: tapers from 0 at tip (fy=-162) to 18 px wide at base (fy=-74).
    # Spine on positive-fx side, thin cutting edge on negative-fx side.
    if -162 <= fy <= -74:
        t = (fy + 162) / (162 - 74)   # 0 at tip, 1 at base
        spine = 14 * t
        edge  =  4 * t
        if -edge <= fx <= spine:
            return True
    # Handle
    if abs(fx) <= 11 and -78 <= fy <= 108:
        return True
    return False

# Spoon: rotate(+42) — visual CW 42° in y-down
# World→local: sx = ca*dx + sa*dy,  sy = -sa*dx + ca*dy
def spoon_hit(x, y):
    dx, dy = x - ux, y - uy
    sx =  ca * dx + sa * dy
    sy = -sa * dx + ca * dy
    if in_ellipse(sx, sy, 0, -130, 30, 44):
        return True
    if abs(sx) <= 11 and -78 <= sy <= 108:
        return True
    return False

print("Rendering 512×512…")
pixels = []
for y in range(H):
    row = []
    for x in range(W):
        if hat_hit(x, y) or knife_hit(x, y) or spoon_hit(x, y):
            row.append((255, 255, 255))
        else:
            row.append((17, 17, 17))
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
