'use client';

// External Dependencies
import { useState, useEffect, useRef } from 'react';
import {
  FastForward,
  Headphones,
  ListMusic,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
} from 'lucide-react';

// Internal Dependencies
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ArticleCard from './_components/article-card';
import { useArticleSubmission } from '@/hooks/useArticleSubmission';
import { useArticles } from '@/hooks/useArticles';
import { Article } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { getReadableVoiceName } from '@/lib/utils';
import { useDeleteArticle } from '@/hooks/useDeleteArticle';
import useTestVoiceAudio from '@/hooks/useTestVoiceAudio';

const Dashboard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [url, setUrl] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('en-US-Standard-A');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { data: articles, isLoading: isLoadingArticles } = useArticles();
  const {
    submitArticle,
    isLoading: isSubmitting,
    error,
    isSuccess,
  } = useArticleSubmission();
  const [audioError, setAudioError] = useState<string | null>(null);
  const { deleteArticle, isDeleting, error: deleteError } = useDeleteArticle();
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const { isTestingVoice, testVoiceAudio } = useTestVoiceAudio();

  const handleSubmit = async () => {
    if (!url.trim()) return;
    submitArticle(url, selectedVoice);
  };

  useEffect(() => {
    if (isSuccess) {
      setUrl('');
    }
  }, [isSuccess]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setCurrentTime(0);
    }
  };

  const togglePlayPause = async () => {
    if (audioRef.current && selectedArticle?.audio_url) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          setAudioError(null);
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        setAudioError('Unable to play audio. Please try again later.');
        setIsPlaying(false);
        console.error('Audio playback error:', error);
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(null);
  };

  useEffect(() => {
    if (audioRef.current) {
      const handleError = (e: ErrorEvent) => {
        setAudioError('Error loading audio file');
        setIsPlaying(false);
        console.error('Audio error:', e);
      };

      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener(
            'loadedmetadata',
            handleLoadedMetadata
          );
        }
      };
    }
  }, [selectedArticle]);

  const handleDeleteArticle = (articleId: string) => {
    deleteArticle(articleId);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);

      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + 15; // Skip forward 15 seconds
      if (newTime < duration) {
        audioRef.current.currentTime = newTime;
        setCurrentTime((newTime / duration) * 100); // Update current time percentage
      } else {
        audioRef.current.currentTime = duration; // If it exceeds duration, set to max
        setCurrentTime(100); // Update to 100%
      }
    }
  };

  const handleSpeedChange = (value: string) => {
    const speed = parseFloat(value);
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed; // Set the playback rate of the audio
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Headphones className="w-6 h-6" />
          <span>ArticleReader</span>
        </div>

        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <ListMusic className="w-4 h-4" />
            Playlist
          </Button>
        </div>

        {/* URL Input */}
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Paste article URL..."
            className="w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Select
            defaultValue="en-US-Standard-A"
            onValueChange={(value) => setSelectedVoice(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US-Standard-A">
                English US - Female (A)
              </SelectItem>
              <SelectItem value="en-US-Standard-B">
                English US - Male (B)
              </SelectItem>
              <SelectItem value="en-US-Standard-C">
                English US - Female (C)
              </SelectItem>
              <SelectItem value="en-US-Standard-D">
                English US - Male (D)
              </SelectItem>
              <SelectItem value="en-US-Standard-E">
                English US - Female (E)
              </SelectItem>
              <SelectItem value="en-US-Standard-F">
                English US - Female (F)
              </SelectItem>
              <SelectItem value="en-US-Standard-G">
                English US - Female (G)
              </SelectItem>
              <SelectItem value="en-US-Standard-H">
                English US - Female (H)
              </SelectItem>
              <SelectItem value="en-US-Standard-I">
                English US - Male (I)
              </SelectItem>
              <SelectItem value="en-US-Standard-J">
                English US - Male (J)
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            onClick={() => testVoiceAudio(selectedVoice)}
            disabled={isSubmitting || isTestingVoice !== null}
          >
            Play Voice
          </Button>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Article'}
          </Button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 flex-1">
          <div className="space-y-4">
            {isLoadingArticles ? (
              <div>Loading articles...</div>
            ) : (
              articles?.map((article, index) => (
                <ArticleCard
                  key={article.id || index}
                  article={article}
                  onClick={() => handleArticleSelect(article)}
                  isSelected={selectedArticle?.id === article.id}
                  onDelete={() => handleDeleteArticle(article.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Audio Player */}
        <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <audio
            ref={audioRef}
            src={selectedArticle?.audio_url}
            preload="metadata"
          />
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">
                    {selectedArticle?.title || 'No article selected'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedArticle
                      ? getReadableVoiceName(selectedArticle.speech_model)
                      : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Slider
                value={[duration ? (currentTime / duration) * 100 : 0]}
                max={100}
                step={1}
                className="w-full"
                onValueChange={handleSliderChange}
                disabled={!selectedArticle}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4">
              <Button variant="ghost" size="icon" disabled={!selectedArticle}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={!selectedArticle}
                onClick={handleRestart}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={togglePlayPause}
                disabled={!selectedArticle}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={!selectedArticle}
                onClick={handleSkipForward}
              >
                <FastForward className="w-4 h-4" />
              </Button>
              <Select defaultValue="1" onValueChange={handleSpeedChange}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x Speed</SelectItem>
                  <SelectItem value="1">1x Speed</SelectItem>
                  <SelectItem value="1.25">1.25x Speed</SelectItem>
                  <SelectItem value="1.5">1.5x Speed</SelectItem>
                  <SelectItem value="1.75">1.75x Speed</SelectItem>
                  <SelectItem value="2">2x Speed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {audioError && (
            <div className="text-red-500 text-sm text-center">{audioError}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
