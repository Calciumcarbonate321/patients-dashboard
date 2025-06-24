import requests

# Endpoint URL
url = "http://localhost:3000/api/readings/"  # Adjust as needed
for i in range(11,12):
    # File to upload
    file_path = "test.csv"  # Your CSV file path
    # Change the filename for each request
    upload_filename = f"test_{i}.csv"

    # Open and send as multipart/form-data
    with open(file_path, "rb") as f:
        files = {'file': (upload_filename, f, 'text/csv')}
        data = {'patientId': 1}
        response = requests.post(url, files=files, data=data)

    # Output response
    print("Status Code:", response.status_code)
    print("Response:", response.json())
