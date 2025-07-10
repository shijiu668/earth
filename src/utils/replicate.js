import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateEarthZoomOutVideo(imageData, duration = 5, aspectRatio = '16:9') {
    const prompt = `Movie-level extremely fast image reduction, presented in stages, maintain smooth fluid camera movement throughout, no jump cuts, seamless scale transitions:
Stage 1: Quickly zoom out to a bird's-eye view and expand the surroundings to match the uploaded image.
Stage 2: The environment is shrinking faster and faster, and expanding to an infinite distance around it.
Stage 3: The perspective is quickly raised to the map perspective, showing the details of the map, and the original scene no longer exists.
Stage 4: The perspective is quickly raised to the atmospheric perspective, passing through the looming clouds.
Stage 5: The viewing angle is quickly zoomed out to show the curvature of the Earth.
Stage 6: Finally ending with complete Earth planet alone in space.`;

    try {
        const input = {
            image: imageData,
            prompt: prompt,
            duration: duration,
            fps: 24,
            resolution: "480p",
            aspect_ratio: aspectRatio,
            camera_fixed: false,
            seed: Math.floor(Math.random() * 1000000), // Random seed for variation
        };

        console.log('Starting video generation with input:', {
            ...input,
            image: 'base64_data_truncated',
        });

        const output = await replicate.run("bytedance/seedance-1-lite", { input });

        if (!output) {
            throw new Error('No output received from Replicate');
        }

        return output;
    } catch (error) {
        console.error('Error generating video with Replicate:', error);
        throw new Error(`Video generation failed: ${error.message}`);
    }
}

export default replicate;