export interface BlogPost {
    id: string;
    title: string;
    summary: string;
    content: Array<{
      type: 'paragraph' | 'image' | 'heading' | 'quote' | 'list';
      content: any;
    }>;
    image?: string;
    createdAt: string;
    readTime: number;
    category: string;
    author: {
      name: string;
      avatar: string;
      role: string;
    };
    tags: string[];
  }