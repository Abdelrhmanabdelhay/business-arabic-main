export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url

  // Check for AWS Amplify-specific environment variables
  if (process.env.AWS_AMPLIFY_URL) {
    return `https://${process.env.AWS_AMPLIFY_URL}`;
  }

  // For branch deployments, Amplify sets BRANCH environment variable
  if (process.env.BRANCH) {
    // You might need to adjust this URL structure based on your Amplify setup
    return `https://${process.env.BRANCH}.${process.env.AWS_AMPLIFY_URL}`;
  }

  // Fallback for local development
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
