'use client';

import { useState, useRef } from 'react';
import { Upload, Clock, Download, Play, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider'; // 引入 useAuth

const VIDEO_GENERATION_COST = 10; // 每次生成消耗10积分
export default function VideoGenerator() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [imageAspectRatio, setImageAspectRatio] = useState('16:9');
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
    const [previewVideoAspectRatio, setPreviewVideoAspectRatio] = useState('1:1');
    const fileInputRef = useRef(null);
    const previewVideoRef = useRef(null);
    const { user, profile, updateProfile } = useAuth();
    // 添加这个函数
    const calculateAspectRatio = (width, height) => {
        const ratio = width / height;
        const ratios = [
            { value: '21:9', ratio: 21 / 9, name: '21:9' },
            { value: '16:9', ratio: 16 / 9, name: '16:9' },
            { value: '4:3', ratio: 4 / 3, name: '4:3' },
            { value: '1:1', ratio: 1 / 1, name: '1:1' },
            { value: '3:4', ratio: 3 / 4, name: '3:4' },
            { value: '9:16', ratio: 9 / 16, name: '9:16' },
            { value: '9:21', ratio: 9 / 21, name: '9:21' },
        ];
        // 找到最接近的比例
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

    // 添加处理预览视频点击的函数
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

    // 获取预览视频的比例
    const handlePreviewVideoLoadedMetadata = () => {
        const video = previewVideoRef.current;
        if (video) {
            const aspectRatio = calculateAspectRatio(video.videoWidth, video.videoHeight);
            setPreviewVideoAspectRatio(aspectRatio);
            console.log(`Preview video dimensions: ${video.videoWidth}x${video.videoHeight}, Aspect ratio: ${aspectRatio}`);
        }
    };

    // 根据比例返回对应的CSS类名
    const getAspectRatioClass = (ratio) => {
        switch (ratio) {
            case '21:9': return 'aspect-[21/9]';
            case '16:9': return 'aspect-video';
            case '4:3': return 'aspect-[4/3]';
            case '1:1': return 'aspect-square';
            case '3:4': return 'aspect-[3/4]';
            case '9:16': return 'aspect-[9/16]';
            case '9:21': return 'aspect-[9/21]';
            default: return 'aspect-video';
        }
    };
    const handleImageUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);

                // 计算图片比例
                const img = new Image();
                img.onload = () => {
                    const aspectRatio = calculateAspectRatio(img.width, img.height);
                    setImageAspectRatio(aspectRatio);
                    console.log(`Image dimensions: ${img.width}x${img.height}, Selected aspect ratio: ${aspectRatio}`);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
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

    // components/VideoGenerator.js

    const handleGenerate = async () => {
        if (!selectedImage) return;
        if (!user) {
            alert('Please login to generate a video.');
            return;
        }
        if (profile.credits < VIDEO_GENERATION_COST) {
            alert('Not enough credits. Please subscribe to a plan to get more.');
            return;
        }

        // 核心修改：在这里立即更新前端状态
        const newCredits = profile.credits - VIDEO_GENERATION_COST;
        updateProfile({ credits: newCredits });

        setIsGenerating(true);
        setGeneratedVideo(null);

        try {
            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: selectedImage,
                    duration: selectedDuration,
                    aspectRatio: imageAspectRatio,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // 如果后端出错，把积分还给用户
                updateProfile({ credits: profile.credits });
                throw new Error(errorData.error || 'Failed to generate video');
            }

            const data = await response.json();
            setGeneratedVideo(data.videoUrl);

        } catch (error) {
            console.error('Error generating video:', error);
            alert(`Failed to generate video: ${error.message}`);
            // 如果捕获到任何错误，也把积分还给用户
            updateProfile({ credits: profile.credits });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (generatedVideo) {
            // 创建指向我们自己服务器的下载链接
            const downloadUrl = `/api/download-video?videoUrl=${encodeURIComponent(
                generatedVideo
            )}`;
            // 直接让浏览器导航到这个链接，服务器会强制下载
            window.location.href = downloadUrl;
        }
    };
    return (
        <section id="generator" className="section-padding bg-gray-950">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side - Controls */}
                    <div className="space-y-8">
                        {/* Image Upload */}
                        <div className="card">
                            <h3 className="text-2xl font-semibold mb-6 text-white">
                                Upload Your Image
                            </h3>
                            <div
                                className={`upload-area ${dragActive ? 'border-blue-500 bg-blue-500/10' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                                {selectedImage ? (
                                    <div className="space-y-4">
                                        <img
                                            src={selectedImage}
                                            alt="Selected"
                                            className="max-w-full h-48 object-cover rounded-lg mx-auto"
                                        />
                                        <p className="text-green-400">Image uploaded successfully!</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(null);
                                            }}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                                        <div className="text-center">
                                            <p className="text-gray-300 mb-2">
                                                Drag and drop your image here, or click to select
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                Supports JPG, PNG, and other image formats
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Duration Selection */}
                        <div className="card">
                            <h3 className="text-2xl font-semibold mb-6 text-white flex items-center">
                                <Clock className="h-6 w-6 mr-2" />
                                Video Duration
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSelectedDuration(5)}
                                    className={`p-6 rounded-xl border-2 transition-all ${selectedDuration === 5
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                        }`}
                                >
                                    <div className="text-2xl font-bold">5s</div>
                                    <div className="text-sm mt-1">Quick Preview</div>
                                </button>
                                <button
                                    onClick={() => setSelectedDuration(10)}
                                    className={`p-6 rounded-xl border-2 transition-all ${selectedDuration === 10
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                        }`}
                                >
                                    <div className="text-2xl font-bold">10s</div>
                                    <div className="text-sm mt-1">Extended View</div>
                                </button>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!selectedImage || isGenerating || !user}
                            className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all ${!canGenerate
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'btn-primary'
                                }`}
                        >
                            {isGenerating ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Generating...
                                </div>
                            ) : (
                                `Create Video (Cost: ${VIDEO_GENERATION_COST} Credits)`
                            )}
                        </button>
                    </div>

                    {/* Right Side - Video Display */}
                    {/* Right Side - Video Display */}
                    <div className="card">
                        <h3 className="text-2xl font-semibold mb-6 text-white">
                            Video Preview
                        </h3>
                        <div className="video-container aspect-video">
                            {isGenerating ? (
                                <div className="flex items-center justify-center h-full bg-gray-800">
                                    <div className="text-center">
                                        <div className="loading-dots mb-4">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        <p className="text-gray-300">Creating your earth zoom out video...</p>
                                        <p className="text-gray-500 text-sm mt-2">This may take a few minutes</p>
                                    </div>
                                </div>
                            ) : generatedVideo ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className={`relative ${getAspectRatioClass(imageAspectRatio)} w-full max-w-full h-auto max-h-full rounded-lg overflow-hidden shadow-lg`}>
                                        <video
                                            src={generatedVideo}
                                            controls
                                            autoPlay  // <-- 新增：自动播放
                                            loop      // <-- 新增：循环播放
                                            muted     // <-- 新增：静音播放（很多浏览器要求静音才能自动播放）
                                            playsInline // <-- 新增：在移动设备上内联播放
                                            className="w-full h-full"
                                            poster="/preview-poster.jpg"
                                        />
                                        <button
                                            onClick={handleDownload}
                                            className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white p-2 rounded-lg transition-all"
                                        >
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="relative aspect-square h-full rounded-lg overflow-hidden shadow-lg">
                                        <video
                                            ref={previewVideoRef}
                                            src="/videos/preview.mp4"
                                            className="w-full h-full object-cover cursor-pointer"
                                            poster="/preview-poster.jpg"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            onClick={handlePreviewVideoClick}
                                            onLoadedMetadata={handlePreviewVideoLoadedMetadata}
                                        />
                                        {!isPreviewPlaying && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                                                <Play className="h-16 w-16 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {generatedVideo && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleDownload}
                                    className="btn-primary flex items-center mx-auto"
                                >
                                    <Download className="h-5 w-5 mr-2" />
                                    Download Video
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}