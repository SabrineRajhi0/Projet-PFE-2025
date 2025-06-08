import requests

def test_generate_quiz():
    url = "http://127.0.0.1:5001/generate-quiz"
    
    # Using a sample PDF from your uploads folder
    pdf_path = r"c:\ProjetBackend\PFE-V1-2025-main\ggestioncours\uploads\elements\1749044367120_Cours Physique Chapitre 4 La tension électrique - 1ère AS  (2010-2011) Mr Akermi Abdelkader.pdf"
    
    with open(pdf_path, 'rb') as pdf_file:
        files = {'file': ('test.pdf', pdf_file, 'application/pdf')}
        response = requests.post(url, files=files)
    
    print("Status Code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    test_generate_quiz()
