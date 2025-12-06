import cv2
import numpy as np
import os
import glob

def make_outline_for_image(input_path: str, suffix: str = "-outline"):
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"⚠️  Could not read {input_path}, skipping.")
        return

    print(f"Processing: {input_path}")

    # convert to grayscale (handle RGB or RGBA)
    if len(img.shape) == 3 and img.shape[2] == 4:
        gray = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
    elif len(img.shape) == 3 and img.shape[2] == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img

    # blur slightly to reduce noise
    gray_blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # edge detection
    edges = cv2.Canny(gray_blur, 50, 150)

    # thicken lines
    kernel = np.ones((2, 2), np.uint8)
    edges_dilated = cv2.dilate(edges, kernel, iterations=1)

    # create transparent RGBA with black lines
    h, w = edges_dilated.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)  # transparent

    ys, xs = np.where(edges_dilated > 0)
    rgba[ys, xs, 0] = 0   # R
    rgba[ys, xs, 1] = 0   # G
    rgba[ys, xs, 2] = 0   # B
    rgba[ys, xs, 3] = 255 # A

    base, ext = os.path.splitext(os.path.basename(input_path))
    out_name = f"{base}{suffix}.png"
    cv2.imwrite(out_name, rgba)

    print(f"✅ Saved: {out_name}")

def main():
    # all PNG files in this folder
    png_files = glob.glob("*.png")

    if not png_files:
        print("No PNG files found in this folder.")
        return

    for f in png_files:
        # skip files that look like they're already outlines
        if f.endswith("-outline.png") or f.endswith("-template.png"):
            print(f"Skipping already-processed file: {f}")
            continue
        make_outline_for_image(f)

if __name__ == "__main__":
    main()
