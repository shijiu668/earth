import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateEarthZoomOutVideo(imageData, duration = 5, aspectRatio = '16:9') {
    const prompt = `Cinematic light-speed continuous zoom out, presented in stages, maintain smooth fluid camera movement throughout, no jump cuts, seamless scale transitions. During the zoom out process, the proportions between the original scene and expanded scenes must be realistic and true to life. The relative positions and proportions of characters and environment must remain unchanged throughout the process:
Stage 1: Quickly zoom out to a bird's-eye view, and expand the surrounding environment based on the image.
Stage 2: Zoom out at an increasingly faster pace, and infinitely expand the image outward in all directions, expanding to reveal entire city scenes or vast forest landscapes or mountain range vistas or coastal environments, with the original scene completely invisible.
Stage 3: Zoom out at maximum speed continuously, with the original scene completely invisible, now able to see the ground map as it appears from a satellite view looking down, revealing the Americas.
Stage 4: Zoom out at maximum speed continuously, showing clouds being passed through during the process, revealing cloud layers and passing through them, now able to see the outline of Earth.
Stage 5: Finally ending with complete Earth planet alone in space.`;

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