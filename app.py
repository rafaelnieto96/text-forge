from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import cohere
import re
from langchain.prompts import PromptTemplate

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize Cohere client
co = cohere.Client(os.getenv('COHERE_API_KEY'))

# Define prompt templates
email_campaign_template = PromptTemplate(
    input_variables=["product", "target", "tone"],
    template="""
<instruction>
You are an email marketing specialist with years of experience creating high-performance campaigns. Your task is to create a complete email campaign for {product} targeted at {target} with a {tone} tone.

Follow these critical rules:
<rules>
- Generate a COMPLETE campaign with all sections fully developed
- ALWAYS include all three sections: Subject Line, Email Body, and Call to Action
- The email MUST be complete and NEVER cut off mid-sentence
- Ensure the Call to Action is COMPLETE and ends properly
- Do not add explanatory text or comments about the email
- Do not use phrases like "here is" or "hope you like it" at the beginning or end
- DO NOT include XML tags like <product> or <audience> in your response
- Refer to the product by its name without any XML tags
- Ensure the email is persuasive and conversion-oriented
- ALWAYS write the content in English, regardless of input language
</rules>
</instruction>

<output_format>
1. Subject Line:
[Engaging subject line]

2. Email Body:
[Complete email text with well-structured paragraphs]

3. Call to Action:
[Clear and persuasive CTA appropriate for the product and audience]
</output_format>
"""
)

auto_reply_template = PromptTemplate(
    input_variables=["emailContent", "replyTone"],
    template="""
<instruction>
You are a customer service professional expert in drafting appropriate email responses. Your task is to generate a complete professional response to this email: "{emailContent}" with a {replyTone} tone.

Follow these critical rules:
<rules>
- Create a COMPLETE and well-structured response
- Always include greeting, body, and sign-off
- The response should NEVER be cut off mid-sentence
- Ensure the sign-off is COMPLETE and properly formatted
- Do not add explanatory text or comments about the email
- Do not use introductory phrases like "here is the response"
- DO NOT include XML tags in your response
- Ensure the text is professional and appropriate for the context
- ALWAYS write the content in English, regardless of input language
</rules>
</instruction>

<email_response>
1. Greeting:
[Appropriate greeting]

2. Body:
[Email body with content appropriate for responding to the email]

3. Sign-off:
[Professional sign-off with signature]
</email_response>
"""
)

email_writer_template = PromptTemplate(
    input_variables=["emailPurpose", "recipient", "writerTone", "keyPoints"],
    template="""
<instruction>
You are a business communication expert with extensive experience drafting effective emails. Your task is to write a complete professional email with these details:
- Purpose: {emailPurpose}
- Recipient: {recipient}
- Tone: {writerTone}
- Key points to include: {keyPoints}

Follow these critical rules:
<rules>
- Create a COMPLETE email with all sections fully developed
- Always include subject line, greeting, body paragraphs, and sign-off
- The email should NEVER be cut off mid-sentence
- Ensure the sign-off is COMPLETE and properly formatted
- Address ALL key points provided in the input
- Do not add explanatory text or comments about the email
- DO NOT include XML tags in your response
- Do not use phrases like "here is the requested email"
- ALWAYS write the content in English, regardless of input language
</rules>
</instruction>

<email_content>
1. Subject:
[Clear and relevant subject line]

2. Greeting:
[Appropriate greeting with recipient's name/title]

3. Body:
[Email body with all key points addressed in well-structured paragraphs]

4. Sign-off:
[Professional sign-off with signature]
</email_content>
"""
)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_text():
    data = request.json
    generator_type = data.get('type')
    
    print(f"Generating text with type: {generator_type}")
    print(f"Data received: {data}")
    
    if generator_type == 'email_campaign':
        # Use the Cohere client directly for more control over parameters
        formatted_prompt = email_campaign_template.format(
            product=data.get('product'),
            target=data.get('target'),
            tone=data.get('tone')
        )
        
        response = co.generate(
            prompt=formatted_prompt,
            model="command-r-plus",
            max_tokens=2000,
            temperature=0.2,
            stop_sequences=["</output_format>"]
        )
        # Use strip() to remove whitespace at the beginning and end
        response_text = response.generations[0].text.strip()
        
    elif generator_type == 'auto_reply':
        formatted_prompt = auto_reply_template.format(
            emailContent=data.get('emailContent'),
            replyTone=data.get('replyTone')
        )
        
        response = co.generate(
            prompt=formatted_prompt,
            model="command-r-plus",
            max_tokens=2000,
            temperature=0.2,
            stop_sequences=["</email_response>"]
        )
        response_text = response.generations[0].text.strip()
        
    elif generator_type == 'email_writer':
        formatted_prompt = email_writer_template.format(
            emailPurpose=data.get('emailPurpose'),
            recipient=data.get('recipient'),
            writerTone=data.get('writerTone'),
            keyPoints=data.get('keyPoints')
        )
        
        response = co.generate(
            prompt=formatted_prompt,
            model="command-r-plus",
            max_tokens=2000,
            temperature=0.2,
            stop_sequences=["</email_content>"]
        )
        response_text = response.generations[0].text.strip()
        
    else:
        return jsonify({'error': 'Invalid generator type'}), 400
    
    # Process response to clean up
    # 1. Remove introductory lines
    lines = response_text.split('\n')
    processed_lines = []
    for line in lines:
        if not line.startswith("Here's") and not line.startswith("I hope"):
            processed_lines.append(line)
    
    processed_response = '\n'.join(processed_lines)
    
    # 2. Remove any XML tags that might appear in the response
    processed_response = re.sub(r'<[^>]+>', '', processed_response)
    
    return jsonify({'response': processed_response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)