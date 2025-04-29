import os
import sys
from PIL import Image
from pathlib import Path

def make_pdf_from_images(image_dir, output_path):
    # Collect images sorted by page number
    image_files = sorted(
        [f for f in os.listdir(image_dir) if f.startswith("page_") and f.endswith(".png")],
        key=lambda x: int(x.split('_')[1].split('.')[0])
    )

    if not image_files:
        print(f"No page_*.png files found in {image_dir}")
        return

    images = []
    for img_name in image_files:
        img_path = os.path.join(image_dir, img_name)
        img = Image.open(img_path).convert("RGB")
        images.append(img)

    # Save images as PDF
    pdf_path = output_path / (Path(image_dir).name + ".pdf")
    images[0].save(pdf_path, save_all=True, append_images=images[1:])
    print(f"Saved PDF: {pdf_path}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python script.py <parent_directory>")
        return

    parent_dir = sys.argv[1]
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    for subdir in os.listdir(parent_dir):
        subdir_path = os.path.join(parent_dir, subdir)
        if os.path.isdir(subdir_path):
            make_pdf_from_images(subdir_path, output_dir)

if __name__ == "__main__":
    main()
