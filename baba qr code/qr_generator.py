import qrcode
from PIL import Image

# URL to encode in QR code
url = "https://baba-engineering.onrender.com"

# Create QR code instance
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

# Add data to QR code
qr.add_data(url)
qr.make(fit=True)

# Create an image from the QR Code
img = qr.make_image(fill_color="black", back_color="white")

# Save the image
img.save("baba_qr_code.png")

print("QR code generated and saved as 'baba_qr_code.png'")
print("Scan this QR code to visit:", url)