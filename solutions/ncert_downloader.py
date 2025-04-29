import os
import requests
from PIL import Image
from io import BytesIO
import argparse

# Mapping of chapter numbers to chapter titles for class 11 NCERT Physics
chapters = {
    # 1: "electric-charges-and-fields",
    # 2: "electrostatic-potential-and-capacitance",
    # 3: "current-electricity",
    # 4: "moving-charges-and-magnetism",
    # 5: "magnetism-and-matter",
    # 6: "electromagnetic-induction",
    # 7: "alternating-current",
    # 8: "electromagnetic-waves",
    # 9: "ray-optics-and-optical-instruments",
    # 10: "wave-optics",
    # 11: "dual-nature-of-radiation-and-matter",
    # 12: "atoms",
    # 13: "nuclei",
    14: "semiconductor-electronic-material-devices-and-simple-circuits"
}

BASE_URL = "https://www.vedantu.com/content-images/ncert-solutions/ncert-solutions-class-12-physics-chapter-{chapter}-{name}/{page}.webp"

def download_and_convert_webp(chapter_num, chapter_name, output_dir):
    chapter_dir = os.path.join(output_dir, f"{chapter_name}")
    os.makedirs(chapter_dir, exist_ok=True)

    page = 1
    while True:
        url = BASE_URL.format(chapter=chapter_num, name=chapter_name, page=page)
        try:
            response = requests.get(url)
            if response.status_code != 200:
                print(f"Page {page} not found for Chapter {chapter_num}. Moving to next chapter.")
                break

            image = Image.open(BytesIO(response.content)).convert("RGB")
            output_path = os.path.join(chapter_dir, f"page_{page}.png")
            image.save(output_path, "PNG")
            print(f"Saved Chapter {chapter_num} Page {page} as PNG.")

            page += 1

        except Exception as e:
            print(f"Error downloading Chapter {chapter_num} Page {page}: {e}")
            break

def main():
    parser = argparse.ArgumentParser(description="Download NCERT solution pages and convert to PNG")
    parser.add_argument("output_folder", help="Folder where the images will be saved")
    args = parser.parse_args()

    output_folder = args.output_folder
    os.makedirs(output_folder, exist_ok=True)

    for num, name in chapters.items():
        print(f"Processing Chapter {num}: {name.replace('-', ' ').title()}")
        download_and_convert_webp(num, name, output_folder)

if __name__ == "__main__":
    main()
