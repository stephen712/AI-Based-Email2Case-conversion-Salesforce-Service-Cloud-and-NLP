# AI-Based-Email2Case-conversion-Salesforce-Service-Cloud-and-NLP
An NLP-powered email to case solution using Salesforce and node.js. Performs AI tasks like Categorizes emails into desired categories,Sentiment analysis, entities, languages,key phrases, etc.. Demonstrates integration with Service Cloud and Omni-Channel for skills-based routing. Utilizes Flow for streamlined customer service and case management


NLP Email Classification for Salesforce Cases

This Node.js application leverages Natural Language Processing (NLP) to intelligently classify incoming emails and automatically create corresponding Salesforce Cases. It connects securely to Salesforce via OAuth 2.0, ensuring data privacy and authorization.

Features:
- Seamless Salesforce Integration: The app establishes a secure connection to Salesforce, allowing real-time case creation based on email content.
- NLP Classification: Utilizing Natural's BayesClassifier, the app accurately categorizes emails into predefined categories such as hardware, software, billing, and sales.
- Custom Object Training: The classifier is trained with custom object data from Salesforce, making it adaptable to your organization's unique terminology and language patterns.
- Dynamic Classifier Updates: Whenever new data is added to the custom object, the classifier is updated automatically to reflect the latest trends and changes.
- Efficient Keyword Filtering: The app removes less important words using Natural's built-in stopwords, enhancing classification accuracy.
- Extensible & Scalable: Built on Node.js, the app is modular and easy to scale, allowing for future enhancements and integrations.

Tech Stack: Node.js, Natural, Salesforce REST API

Author: Shashank Singh

