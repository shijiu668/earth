// src/components/VideoGenerator.js (FINAL VERSION)
'use client';

import { useState, useRef, useEffect } from 'react'; // <-- 1. 导入 useRef 和 useEffect
import { Upload, Clock, Download, Play, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';

const VIDEO_GENERATION_COST = 10;
export default function VideoGenerator() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [imageAspectRatio, setImageAspectRatio] = useState('16:9');
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
    const fileInputRef = useRef(null);
    const previewVideoRef = useRef(null);

    // 2. 为生成的视频播放器创建一个新的 ref
    const generatedVideoRef = useRef(null);

    const { user, profile, updateProfile } = useAuth();

    // 3. 添加这个 useEffect 钩子
    // 它的作用是：每当 generatedVideo 的值发生变化时，就执行其中的代码
    useEffect(() => {
        // 如果有了新的视频链接，并且播放器DOM元素已经准备好
        if (generatedVideo && generatedVideoRef.current) {
            // 手动命令播放器加载新的视频源并播放
            generatedVideoRef.current.load();
            generatedVideoRef.current.play().catch(error => {
                console.error("Auto-play was prevented:", error);
            });
        }
    }, [generatedVideo]); // 这个依赖项数组意味着只在 generatedVideo 变化时运行

    const calculateAspectRatio = (width, height) => {
        const ratio = width / height;
        const ratios = [
            { value: '16:9', ratio: 16 / 9 }, { value: '1:1', ratio: 1 }, { value: '9:16', ratio: 9 / 16 },
            { value: '4:3', ratio: 4 / 3 }, { value: '3:4', ratio: 3 / 4 },
        ];
        let closestRatio = ratios[0];
        let minDifference = Math.abs(ratio - ratios[0].ratio);
        ratios.forEach(r => {
            const difference = Math.abs(ratio - r.ratio);
            if (difference < minDifference) {
                minDifference = difference;
                closestRatio = r;
            }
        });
        return closestRatio.value;
    };

    const handlePreviewVideoClick = () => {
        const video = previewVideoRef.current;
        if (video) {
            if (video.paused) {
                video.play();
                setIsPreviewPlaying(true);
            } else {
                video.pause();
                setIsPreviewPlaying(false);
            }
        }
    };

    const getAspectRatioClass = (ratio) => {
        switch (ratio) {
            case '16:9': return 'aspect-video';
            case '1:1': return 'aspect-square';
            case '9:16': return 'aspect-[9/16]';
            case '4:3': return 'aspect-[4/3]';
            case '3:4': return 'aspect-[3/4]';
            default: return 'aspect-video';
        }
    };

    const handleImageUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
                const img = new Image();
                img.onload = () => {
                    const aspectRatio = calculateAspectRatio(img.width, img.height);
                    setImageAspectRatio(aspectRatio);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    const handleGenerate = async () => {
        if (!selectedImage || !user || !profile || profile.credits < VIDEO_GENERATION_COST) {
            alert(user ? 'Not enough credits.' : 'Please login to generate a video.');
            return;
        }
        const newCredits = profile.credits - VIDEO_GENERATION_COST;
        updateProfile({ credits: newCredits });
        setIsGenerating(true);
        setGeneratedVideo(null);
        try {
            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: selectedImage, duration: selectedDuration, aspectRatio: imageAspectRatio }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                updateProfile({ credits: profile.credits });
                throw new Error(errorData.error || 'Failed to generate video');
            }
            const data = await response.json();
            setGeneratedVideo(data.videoUrl);
        } catch (error) {
            alert(`Failed to generate video: ${error.message}`);
            updateProfile({ credits: profile.credits });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (generatedVideo) {
            const downloadUrl = `/api/download-video?videoUrl=${encodeURIComponent(generatedVideo)}`;
            window.location.href = downloadUrl;
        }
    };

    const canGenerate = selectedImage && !isGenerating && user && profile && profile.credits >= VIDEO_GENERATION_COST;

    return (
        <section id="generator" className="section-padding bg-gray-950">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side - Controls */}
                    <div className="space-y-8">
                        <div className="card">
                            <h3 className="text-2xl font-semibold mb-6 text-white">Upload Your Image</h3>
                            <div
                                className={`upload-area ${dragActive ? 'border-blue-500 bg-blue-500/10' : ''}`}
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                                {selectedImage ? (
                                    <div className="space-y-4">
                                        <img src={selectedImage} alt="Selected" className="max-w-full h-48 object-cover rounded-lg mx-auto" />
                                        <p className="text-green-400">Image uploaded successfully!</p>
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }} className="text-gray-400 hover:text-white transition-colors">
                                            Remove image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                                        <div className="text-center">
                                            <p className="text-gray-300 mb-2">Drag and drop your image here, or click to select</p>
                                            <p className="text-gray-500 text-sm">Supports JPG, PNG, and other image formats</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-2xl font-semibold mb-6 text-white flex items-center"><Clock className="h-6 w-6 mr-2" /> Video Duration</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[5, 10].map(duration => (
                                    <button
                                        key={duration} onClick={() => setSelectedDuration(duration)}
                                        className={`p-6 rounded-xl border-2 transition-all ${selectedDuration === duration ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-gray-600 hover:border-gray-500 text-gray-300'}`}
                                    >
                                        <div className="text-2xl font-bold">{duration}s</div>
                                        <div className="text-sm mt-1">{duration === 5 ? 'Quick Preview' : 'Extended View'}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleGenerate} disabled={!canGenerate} className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all ${!canGenerate ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'btn-primary'}`}>
                            {isGenerating ? <div className="flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Generating...</div> : `Create Video (Cost: ${VIDEO_GENERATION_COST} Credits)`}
                        </button>
                        {!user && <p className="text-center text-yellow-400 mt-4">Please log in to create a video.</p>}
                        {user && profile && profile.credits < VIDEO_GENERATION_COST && <p className="text-center text-red-400 mt-4">You don't have enough credits.</p>}
                    </div>

                    {/* Right Side - Video Display */}
                    <div className="card">
                        <h3 className="text-2xl font-semibold mb-6 text-white">Video Preview</h3>
                        <div className={`video-container ${getAspectRatioClass(imageAspectRatio)}`}>
                            {isGenerating ? (
                                <div className="flex items-center justify-center h-full bg-gray-800">
                                    <div className="text-center">
                                        <div className="loading-dots mb-4"><div></div><div></div><div></div><div></div></div>
                                        <p className="text-gray-300">Creating your earth zoom out video...</p>
                                        <p className="text-gray-500 text-sm mt-2">This may take a few minutes</p>
                                    </div>
                                </div>
                            ) : generatedVideo ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
                                        {/* 4. 将 ref 绑定到这个 video 元素，并确保有 autoPlay, loop, muted 属性 */}
                                        <video
                                            ref={generatedVideoRef}
                                            src={generatedVideo}
                                            controls
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full"
                                            poster="/preview-poster.jpg"
                                        />
                                        <button onClick={handleDownload} className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white p-2 rounded-lg transition-all">
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
                                        <video ref={previewVideoRef} src="/videos/preview.mp4" className="w-full h-full object-cover cursor-pointer" poster="/preview-poster.jpg" autoPlay loop muted playsInline onClick={handlePreviewVideoClick} />
                                        {!isPreviewPlaying && <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"><Play className="h-16 w-16 text-white" /></div>}
                                    </div>
                                </div>
                            )}
                        </div>
                        {generatedVideo && (
                            <div className="mt-6 text-center">
                                <button onClick={handleDownload} className="btn-primary flex items-center mx-auto"><Download className="h-5 w-5 mr-2" /> Download Video</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}