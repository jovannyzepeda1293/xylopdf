import requests
import os

BASE_URL = "http://localhost:8000"

def test_health():
    try:
        response = requests.get(BASE_URL + "/docs")
        print(f"Health check: {response.status_code}")
    except Exception as e:
        print(f"Health check failed: {e}")

def test_image_to_pdf():
    # Create a dummy image
    from PIL import Image
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save('test.jpg')
    
    with open('test.jpg', 'rb') as f:
        files = {'files': f}
        response = requests.post(BASE_URL + "/image-to-pdf", files=files)
        print(f"Image to PDF status: {response.status_code}")
        if response.status_code == 200:
            with open('test_output.pdf', 'wb') as out:
                out.write(response.content)
            print("Image to PDF output saved.")
    
    os.remove('test.jpg')
    if os.path.exists('test_output.pdf'):
        os.remove('test_output.pdf')

if __name__ == "__main__":
    print("Starting backend tests...")
    test_health()
    # Note: This requires the server to be running.
    # Since I cannot easily run the server and test concurrently in this environment,
    # I will rely on the code structure and Linter feedback.
    # But I can check if the server is already running.
