/**
 * Project data for the portfolio constellation view.
 * Extracted for reusability and testability.
 */

export const projects = [
    {
        id: 1,
        title: 'AGROSCAN',
        category: 'COMPUTER VISION',
        tag: 'CV',
        description: 'AI-powered plant disease detection system achieving 96% accuracy. Uses convolutional neural networks to analyze leaf images and identify crop diseases in real-time.',
        tech: ['TensorFlow', 'OpenCV', 'Python', 'Flask'],
        color: '#10b981',
        stats: { accuracy: '96%', images: '50K+' },
        link: '#'
    },
    {
        id: 2,
        title: 'SENTIMENTX',
        category: 'NATURAL LANGUAGE PROCESSING',
        tag: 'NLP',
        description: 'Real-time sentiment analysis engine for social media. Processes thousands of tweets to extract customer insights and emotional trends using transformer models.',
        tech: ['PyTorch', 'Transformers', 'Pandas', 'Streamlit'],
        color: '#3b82f6',
        stats: { tweets: '100K+', models: '3' },
        link: '#'
    },
    {
        id: 3,
        title: 'PRICE ENGINE',
        category: 'MACHINE LEARNING',
        tag: 'ML',
        description: 'Advanced housing price prediction model using ensemble learning. Incorporates geographical, temporal, and market factors for accurate property valuations.',
        tech: ['Scikit-learn', 'XGBoost', 'SQL', 'API'],
        color: '#f59e0b',
        stats: { features: '50+', error: '±5%' },
        link: '#'
    },
    {
        id: 4,
        title: 'TRAFFIC_AI',
        category: 'IOT & AI',
        tag: 'IOT',
        description: 'Smart traffic management system integrating computer vision with IoT sensors. Optimizes traffic flow and reduces congestion by 30% in pilot areas.',
        tech: ['YOLO', 'IoT', 'Edge AI', 'MQTT'],
        color: '#ec4899',
        stats: { reduction: '30%', devices: '20+' },
        link: '#'
    },
]
