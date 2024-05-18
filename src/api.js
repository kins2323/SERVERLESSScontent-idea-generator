import fetch from 'node-fetch';

// Function to make API request to OpenAI to generate content ideas
export const generateContentIdeas = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;

  const requestBody = {
    model: 'gpt-3.5-turbo', // preferred model
    messages: [{ role: 'system', content: 'You are an expert content strategist.' }, { role: 'user', content: prompt }],
    n: 1, // Number of chat completion choices to generate for each input message
    stop: '\n\n', // Stop generation after two consecutive line breaks
    max_tokens: 400, // Maximum number of tokens to generate in the chat completion
  };

  try {
    // Log API request data before sending
    console.log('API request data:', requestBody);

    // Send API request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`, // Use your API key from environment variable
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('Failed to generate content ideas');
    }

    // Log API response data after receiving
    const responseData = await response.json();
    console.log('API response data:', responseData);

    return responseData.choices[0].message.content; // Return the generated content
  } catch (error) {
    // Log errors
    console.error('Error making API request:', error);
    throw error; // Re-throw error for handling in the caller function
  }
};
