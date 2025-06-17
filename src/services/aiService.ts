
// Mock AI service for tag generation
// In a real implementation, this would call OpenAI, Groq, or another AI API

interface BugContext {
  title: string;
  description: string;
  stepsToReproduce?: string;
}

export const generateAITags = async (bugContext: BugContext): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock AI tag generation based on content analysis
  const { title, description, stepsToReproduce } = bugContext;
  const content = `${title} ${description} ${stepsToReproduce || ''}`.toLowerCase();
  
  const tagRules = [
    { keywords: ['mobile', 'phone', 'tablet', 'ios', 'android'], tag: 'Mobile' },
    { keywords: ['ui', 'interface', 'button', 'form', 'layout', 'design'], tag: 'UI' },
    { keywords: ['performance', 'slow', 'memory', 'speed', 'timeout'], tag: 'Performance' },
    { keywords: ['api', 'backend', 'server', 'database', 'endpoint'], tag: 'Backend' },
    { keywords: ['browser', 'chrome', 'firefox', 'safari', 'edge'], tag: 'Browser' },
    { keywords: ['security', 'auth', 'login', 'password', 'permission'], tag: 'Security' },
    { keywords: ['email', 'notification', 'smtp', 'message'], tag: 'Email' },
    { keywords: ['export', 'import', 'file', 'upload', 'download'], tag: 'File Handling' },
    { keywords: ['crash', 'error', 'exception', 'bug', 'fail'], tag: 'Critical' },
    { keywords: ['data', 'sync', 'update', 'save', 'load'], tag: 'Data' }
  ];

  const suggestedTags: string[] = [];
  
  tagRules.forEach(rule => {
    if (rule.keywords.some(keyword => content.includes(keyword))) {
      suggestedTags.push(rule.tag);
    }
  });

  // Add some randomness to simulate AI creativity
  const additionalTags = ['Frontend', 'Testing', 'UX', 'Regression', 'Feature Request'];
  if (Math.random() > 0.7 && suggestedTags.length < 4) {
    const randomTag = additionalTags[Math.floor(Math.random() * additionalTags.length)];
    if (!suggestedTags.includes(randomTag)) {
      suggestedTags.push(randomTag);
    }
  }

  // Ensure we always return at least 2 tags
  if (suggestedTags.length === 0) {
    suggestedTags.push('General', 'Bug');
  } else if (suggestedTags.length === 1) {
    suggestedTags.push('Investigation');
  }

  return suggestedTags.slice(0, 5); // Limit to 5 tags max
};

// Real implementation would look like this:
/*
export const generateAITags = async (bugContext: BugContext): Promise<string[]> => {
  const prompt = `
    Identify relevant tags for the following bug report. Return 3-5 tags only.
    
    Bug Title: "${bugContext.title}"
    Description: "${bugContext.description}"
    ${bugContext.stepsToReproduce ? `Steps to Reproduce: "${bugContext.stepsToReproduce}"` : ''}
    
    Expected Output: ["UI", "Mobile", "Safari"]
  `;

  try {
    const response = await fetch('/api/ai/generate-tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates relevant tags for bug reports. Return only a JSON array of 3-5 short, relevant tags.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('AI tag generation failed:', error);
    return ['Bug', 'Investigation'];
  }
};
*/
