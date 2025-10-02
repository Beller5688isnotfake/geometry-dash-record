import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Download, Monitor, MousePointer, Video, Settings, Info } from 'lucide-react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [clicks, setClicks] = useState([]);
  
  const videoRef = useRef();
  const chunksRef = useRef([]);
  const timerRef = useRef();

  useEffect(() => {
    // Check if screen recording is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setIsSupported(false);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    // Track clicks globally when recording
    const handleClick = (e) => {
      if (isRecording && !isPaused) {
        const clickData = {
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now(),
          id: Math.random().toString(36).substr(2, 9)
        };
        
        setClicks(prev => [...prev, clickData]);
        
        // Show click animation
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect';
        clickEffect.style.cssText = `
          position: fixed;
          top: ${e.clientY - 15}px;
          left: ${e.clientX - 15}px;
          width: 30px;
          height: 30px;
          border: 3px solid #ff4444;
          border-radius: 50%;
          background: rgba(255, 68, 68, 0.2);
          pointer-events: none;
          z-index: 10000;
          animation: clickPulse 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(clickEffect);
        
        setTimeout(() => {
          document.body.removeChild(clickEffect);
        }, 600);
      }
    };

    if (isRecording) {
      document.addEventListener('click', handleClick, true);
    }

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 30 }
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 44100
        }
      });

      setStream(displayStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = displayStream;
      }

      const recorder = new MediaRecorder(displayStream, {
        mimeType: 'video/webm; codecs=vp9'
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        chunksRef.current = [];
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      setMediaRecorder(recorder);
      recorder.start(100); // Record in 100ms chunks
      setIsRecording(true);
      setClicks([]);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Handle stream ending (user stops screen share)
      displayStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please make sure you grant screen sharing permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setIsRecording(false);
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `screen-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="text-red-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Not Supported</h2>
          <p className="text-gray-300 mb-4">
            Screen recording is not supported in your browser. Please use Chrome, Edge, or Firefox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Click & Record
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
          Record your screen with click visualization. Perfect for demonstrating issues, creating tutorials, or showing what happened during your Geometry Dash mod experience.
        </p>
        
        {/* Status indicators */}
        <div className="flex items-center justify-center space-x-6 text-sm mb-8">
          <div className={`flex items-center space-x-2 ${isRecording ? 'text-red-400' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isRecording ? 'Recording' : 'Ready'}</span>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{formatTime(recordingTime)}</span>
            </div>
          )}
          {clicks.length > 0 && (
            <div className="flex items-center space-x-2 text-green-400">
              <MousePointer size={16} />
              <span>{clicks.length} clicks tracked</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
              <Monitor size={24} />
              <span>Screen Recording Controls</span>
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <Play size={20} />
                  <span>Start Recording</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={stopRecording}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                  >
                    <Square size={20} />
                    <span>Stop Recording</span>
                  </button>
                  
                  {!isPaused ? (
                    <button
                      onClick={pauseRecording}
                      className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeRecording}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                    >
                      <Play size={16} />
                      <span>Resume</span>
                    </button>
                  )}
                </>
              )}

              {recordedBlob && (
                <button
                  onClick={downloadRecording}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>Download Video</span>
                </button>
              )}
            </div>

            {/* Preview */}
            {stream && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full rounded-lg border border-white/20"
                  style={{ maxHeight: '400px' }}
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm">
                  Live Preview
                </div>
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>REC {formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Info size={20} />
              <span>How it Works</span>
            </h3>
            
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Click "Start Recording"</p>
                  <p>Select the screen or window you want to record</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Click Around</p>
                  <p>Every click will show a red circle animation and be tracked</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Stop & Download</p>
                  <p>Stop recording and download your video file</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Perfect For:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Reporting Geode mod issues</li>
                <li>• Creating bug reports</li>
                <li>• Making tutorials</li>
                <li>• Showing gameplay problems</li>
              </ul>
            </div>
            
            {recordedBlob && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="text-white font-medium mb-2">Recording Complete!</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Your video is ready to download. File format: WebM (works on all modern browsers)
                </p>
                <button
                  onClick={downloadRecording}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Download size={16} />
                  <span>Download Video</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenRecorder;