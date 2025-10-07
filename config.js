// Configuration for AI Image Generation Services
// This file contains the configuration for various AI image generation APIs

const API_CONFIG = {
    // Currently supported AI image generation services
    SERVICES: {
        OPENAI_DALLE: {
            name: "OpenAI DALL-E",
            endpoint: "https://api.openai.com/v1/images/generations",
            requiresAuth: true,
            maxPromptLength: 1000,
            supportedSizes: ["1024x1024", "1024x1792", "1792x1024"],
            recommendedSize: "1024x1792" // 2:3 aspect ratio for posters
        },
        REPLICATE: {
            name: "Replicate",
            endpoint: "https://api.replicate.com/v1/predictions",
            requiresAuth: true,
            models: {
                "stable-diffusion": "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
                "midjourney-style": "tstramer/midjourney-diffusion:436b051ebd8f68d23e83d22de5e198e0995357afef113768c20f0b6fcef23c8b"
            },
            maxPromptLength: 500,
            supportedSizes: ["512x512", "768x768", "512x768", "768x512"]
        },
        HUGGING_FACE: {
            name: "Hugging Face",
            endpoint: "https://api-inference.huggingface.co/models",
            requiresAuth: true,
            models: {
                "stable-diffusion": "runwayml/stable-diffusion-v1-5",
                "stable-diffusion-xl": "stabilityai/stable-diffusion-xl-base-1.0"
            },
            maxPromptLength: 77 // tokens
        },
        DEMO_MODE: {
            name: "Demo Mode (Placeholder Images)",
            endpoint: null,
            requiresAuth: false,
            description: "Uses placeholder images for demonstration purposes"
        }
    },
    
    // Current active service (change this to switch between services)
    ACTIVE_SERVICE: "DEMO_MODE",
    
    // API Keys (these should be set via environment variables in production)
    API_KEYS: {
        OPENAI: process.env.OPENAI_API_KEY || null,
        REPLICATE: process.env.REPLICATE_API_TOKEN || null,
        HUGGING_FACE: process.env.HUGGING_FACE_API_KEY || null
    },
    
    // Default generation parameters
    DEFAULTS: {
        imageSize: "1024x1792", // 2:3 aspect ratio for posters
        quality: "high",
        style: "vintage poster",
        numberOfImages: 1,
        guidanceScale: 7.5, // For Stable Diffusion
        steps: 50 // Number of inference steps
    },
    
    // Prompt enhancement templates for different styles
    STYLE_TEMPLATES: {
        vintage_poster: "vintage travel poster, mid-century modern style, {MAIN_PROMPT}, retro typography, geometric shapes, nostalgic 1960s aesthetic, professional poster design, high quality, detailed illustration",
        artistic: "artistic interpretation, {MAIN_PROMPT}, creative composition, enhanced colors, stylized elements, artistic flair",
        minimal: "minimalist design, {MAIN_PROMPT}, clean composition, simple elements, modern aesthetic, uncluttered",
        enhanced_vintage: "ultra-detailed vintage poster, {MAIN_PROMPT}, rich textures, authentic 1960s style, museum quality, professional design"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} else {
    window.API_CONFIG = API_CONFIG;
}