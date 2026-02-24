export function calculateSEOScore(title: string, content: string): number {
    let score = 0;
  
    // Title length (ideal: 50-60 characters)
    if (title.length >= 50 && title.length <= 60) score += 10;
    else if (title.length > 30 && title.length < 70) score += 5;
  
    // Content length (ideal: >300 words)
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 300) score += 10;
    else if (wordCount >= 200) score += 5;
  
    // Keyword density (simplified)
    const keywords = title.toLowerCase().split(/\s+/);
    const keywordDensity = keywords.reduce((acc, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const count = (content.match(regex) || []).length;
      return acc + count;
    }, 0) / wordCount;
  
    if (keywordDensity >= 0.01 && keywordDensity <= 0.03) score += 10;
    else if (keywordDensity > 0 && keywordDensity <= 0.05) score += 5;
  
    return score;
  }