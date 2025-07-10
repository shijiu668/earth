'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export default function VideoShowcase() {
    const [playingVideos, setPlayingVideos] = useState(new Set([1, 2, 3])); // 默认所有视频都在播放
    const videoRefs = useRef({});

    const showcaseVideos = [
        {
            id: 1,
            src: '/videos/sample1.mp4',
            title: 'Urban Landscape Earth Zoom Out',
            description: 'From city streets to cosmic perspective',
            thumbnail: '/thumbnails/sample1.jpg',
        },
        {
            id: 2,
            src: '/videos/sample2.mp4',
            title: 'Nature Scene Earth Zoom Out',
            description: 'From forest floor to planetary view',
            thumbnail: '/thumbnails/sample2.jpg',
        },
        {
            id: 3,
            src: '/videos/sample3.mp4',
            title: 'Beach Sunset Earth Zoom Out',
            description: 'From ocean waves to space overview',
            thumbnail: '/thumbnails/sample3.jpg',
        },
    ];

    const handleVideoToggle = (videoId) => {
        const video = videoRefs.current[videoId];
        if (video) {
            if (playingVideos.has(videoId)) {
                video.pause();
                setPlayingVideos(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(videoId);
                    return newSet;
                });
            } else {
                video.play();
                setPlayingVideos(prev => new Set(prev).add(videoId));
            }
        }
    };

    // 添加useEffect来确保视频在组件挂载后自动播放
    useEffect(() => {
        Object.values(videoRefs.current).forEach(video => {
            if (video) {
                video.play().catch(console.error);
            }
        });
    }, []);

    return (
        <section id="showcase" className="section-padding">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                        Featured Earth Zoom Out Videos
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Explore stunning examples of earth zoom out videos created with our AI technology.
                        Each video showcases the incredible journey from ground level to the cosmic perspective of our planet.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {showcaseVideos.map((video) => (
                        <div key={video.id} className="card group hover:scale-105 transition-transform duration-300">
                            <div className="relative video-container mb-6">
                                <video
                                    ref={(el) => videoRefs.current[video.id] = el}
                                    src={video.src}
                                    className="w-full h-full object-cover cursor-pointer"
                                    loop
                                    muted
                                    playsInline
                                    autoPlay
                                    poster={video.thumbnail}
                                    onClick={() => handleVideoToggle(video.id)}
                                />
                                {!playingVideos.has(video.id) && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                                        <Play className="h-12 w-12 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {video.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-300 mb-8">
                        Ready to create your own earth zoom out video?
                    </p>
                    <a href="#generator" className="btn-primary">
                        Start Creating Now
                    </a>
                </div>
            </div>
        </section>
    );
}