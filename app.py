from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import cohere
from langchain.llms import Cohere
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize Cohere client
co = cohere.Client(os.getenv('COHERE_API_KEY'))
llm = Cohere(cohere_api_key=os.getenv('COHERE_API_KEY'))

# Define prompt templates
email_campaign_template = PromptTemplate(
    input_variables=["product", "target_audience", "tone"],
    template="""Create a marketing email campaign for {product} targeting {target_audience} with a {tone} tone.
    Include:
    1. Subject line
    2. Email body
    3. Call to action
    Make it engaging and persuasive."""
)

auto_reply_template = PromptTemplate(
    input_variables=["email_content", "tone"],
    template="""Generate a professional email response to the following email with a {tone} tone:
    {email_content}
    Make it concise and appropriate."""
)

email_writer_template = PromptTemplate(
    input_variables=["purpose", "recipient", "tone", "key_points"],
    template="""Write a professional email with the following details:
    Purpose: {purpose}
    Recipient: {recipient}
    Tone: {tone}
    Key points to include: {key_points}
    Make it clear and well-structured."""
)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_text():
    data = request.json
    generator_type = data.get('type')
    
    if generator_type == 'email_campaign':
        chain = LLMChain(llm=llm, prompt=email_campaign_template)
        response = chain.run(
            product=data.get('product'),
            target_audience=data.get('target_audience'),
            tone=data.get('tone')
        )
    elif generator_type == 'auto_reply':
        chain = LLMChain(llm=llm, prompt=auto_reply_template)
        response = chain.run(
            email_content=data.get('email_content'),
            tone=data.get('tone')
        )
    elif generator_type == 'email_writer':
        chain = LLMChain(llm=llm, prompt=email_writer_template)
        response = chain.run(
            purpose=data.get('purpose'),
            recipient=data.get('recipient'),
            tone=data.get('tone'),
            key_points=data.get('key_points')
        )
    else:
        return jsonify({'error': 'Invalid generator type'}), 400
    
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True) 