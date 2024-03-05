from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain_community.llms import OpenAI
from langchain_community.callbacks import get_openai_callback
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/Users/prashant/Desktop/industry internship project/pdf/src/Backend'

api_key = "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"
embeddings = OpenAIEmbeddings(api_key=api_key)
llm = OpenAI(api_key=api_key)
knowledge_base = None

@app.route('/upload', methods=['POST']) 
def upload_file():
    global knowledge_base
    print(">>>", str(request.files))
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        pdf_reader = PdfReader(file_path)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ''
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text)
        knowledge_base = FAISS.from_texts(chunks, embeddings)

        return jsonify({'message': 'File uploaded successfully'}), 200
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/ask', methods=['POST'])
def ask_question():
    global knowledge_base
    if not knowledge_base:
        return jsonify({'error': 'No PDF uploaded or processed'}), 400

    data = request.get_json()
    if 'question' not in data:
        return jsonify({'error': 'No question provided'}), 400

    question = data['question']
    docs = knowledge_base.similarity_search(question)
    chain = load_qa_chain(llm, chain_type="stuff")
    with get_openai_callback() as cb:
        response = chain.run(input_documents=docs, question=question)
        return jsonify({'answer': response}), 200

if __name__ == '__main__':
    app.run(debug=True)
