import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Function to handle API request to generate content ideas
const generateContentIdeas = async (prompt) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        n: 1,
        stop: ['\n\n'],
        max_tokens: 400
      })
    });

    const responseData = await response.json(); // Parse response as JSON
    console.log('Raw API response:', responseData);

    if (!response.ok) {
      console.error('Response not OK:', response.statusText);
      throw new Error('Failed to generate content ideas');
    }

    const finishReason = responseData.choices[0].finish_reason;
    if (finishReason !== 'stop') {
      console.error('Finish reason not stop:', finishReason);
      throw new Error('Incomplete response from OpenAI');
    }

    // Extract content and strip out markdown if present
    let content = responseData.choices[0].message.content;
    content = content.replace(/```json\n([\s\S]*?)\n```/, '$1'); // Remove markdown formatting
    console.log('Formatted Content:', content);

    const contentIdeas = JSON.parse(content).content_ideas; // Parse content as JSON and extract content_ideas
    return contentIdeas;
  } catch (error) {
    console.error('Error making API request:', error.message);
    throw new Error('Failed to generate content ideas');
  }
};

// Route handler for generating content ideas
app.post('/api/generate-content-ideas', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const contentIdeas = await generateContentIdeas(prompt);
    res.json({ content_ideas: contentIdeas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
