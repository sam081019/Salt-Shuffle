import math, struct, zlib

W, H = 512, 512
ang = math.radians(42)
ca, sa = math.cos(ang), math.sin(ang)
ux, uy = 256, 418  # crossing point

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

def hat_hit(x, y):
    # Three puffs: large center + two smaller sides
    if in_ellipse(x, y, 256, 108, 74, 74):   # large center puff
        return True
    if in_ellipse(x, y, 176, 152, 55, 55):   # left small puff
        return True
    if in_ellipse(x, y, 336, 152, 55, 55):   # right small puff
        return True
    # Cylindrical body — narrower than puff cluster, connects to brim
    if 210 <= x <= 302 and 178 <= y <= 290:
        return True
    # Flat brim — wider than cylinder
    if in_rrect(x, y, 150, 282, 362, 314, 12):
        return True
    return False

# Fork: SVG rotate(-42) — visual CCW 42° in y-down
# World→local: fx = ca*dx - sa*dy,  fy = sa*dx + ca*dy
def fork_hit(x, y):
    dx, dy = x - ux, y - uy
    fx = ca * dx - sa * dy
    fy = sa * dx + ca * dy
    # 3 tines at fx = -24, 0, +24, each 11 wide, fy in [-175, -98]
    if -175 <= fy <= -98:
        if abs(fx + 24) <= 11 or abs(fx) <= 11 or abs(fx - 24) <= 11:
            return True
    # Handle: |fx| <= 14, fy in [-100, 115]
    if abs(fx) <= 14 and -100 <= fy <= 115:
        return True
    return False

# Spoon: SVG rotate(+42) — visual CW 42° in y-down
# World→local: sx = ca*dx + sa*dy,  sy = -sa*dx + ca*dy
def spoon_hit(x, y):
    dx, dy = x - ux, y - uy
    sx =  ca * dx + sa * dy
    sy = -sa * dx + ca * dy
    # Bowl ellipse at local (0, -140), rx=38, ry=54
    if in_ellipse(sx, sy, 0, -140, 38, 54):
        return True
    # Handle: |sx| <= 14, sy in [-88, 115]
    if abs(sx) <= 14 and -88 <= sy <= 115:
        return True
    return False

print("Rendering 512×512…")
pixels = []
for y in range(H):
    row = []
    for x in range(W):
        if hat_hit(x, y) or fork_hit(x, y) or spoon_hit(x, y):
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
