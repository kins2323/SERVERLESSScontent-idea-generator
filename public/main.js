// Function to handle form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();

  // Display loader
  displayLoader(true);

  // Retrieve form data
  const form = document.getElementById('content-idea-form');
  const formData = new FormData(form);

  // Extract form data
  const topic = formData.get('topic');
  const audience = formData.get('audience');
  const platform = formData.get('platform');
  const keywords = formData.get('keywords');
  const objective = formData.get('objective');

  // Prepare prompt for API request
  const prompt = `
    You are an expert content strategist specializing in generating engaging content ideas for various platforms and audiences.
    Please brainstorm 3 compelling content ideas based on the following:
    * **Topic:** ${topic}
    * **Target Audience:** ${audience}
    * **Platform:** ${platform}
    * **Keywords:** ${keywords}
    * **Objective:** ${objective}
    Respond strictly with a JSON object containing a list called "content_ideas". Each item in the list should be a dictionary with the following keys:
    * "Headline": A concise and captivating headline that sparks interest.
    * "Format": The most suitable content format for the platform (blog post, short video, image post, etc.).
    * "KeyPoints": A list of 2-3 bullet points outlining the main ideas or takeaways of the content.
  `;

  try {
    // Send request to the backend API
    const response = await fetch('/api/generate-content-ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content ideas');
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('API response:', data);

    // Display the content ideas
    displayContentIdeas(data.content_ideas);
  } catch (error) {
    console.error('Error generating content ideas:', error);
  } finally {
    // Hide loader
    displayLoader(false);
  }
};

// Function to display content ideas on the page
const displayContentIdeas = (ideas) => {
  const resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = ''; // Clear previous results

  ideas.forEach((idea, index) => {
    const ideaElement = document.createElement('div');
    ideaElement.classList.add('idea');
    ideaElement.innerHTML = `
      <h3>Idea ${index + 1}</h3>
      <p><strong>Headline:</strong> ${idea.Headline}</p>
      <p><strong>Format:</strong> ${idea.Format}</p>
      <p><strong>Key Points:</strong></p>
      <ul>
        ${idea.KeyPoints.map(point => `<li>${point}</li>`).join('')}
      </ul>
    `;
    resultContainer.appendChild(ideaElement);
  });
};

// Function to display or hide the loader
const displayLoader = (show) => {
  const loader = document.getElementById('loader');
  loader.style.display = show ? 'flex' : 'none';
};

// Attach form submit event listener
const form = document.getElementById('content-idea-form');
form.addEventListener('submit', handleFormSubmit);
