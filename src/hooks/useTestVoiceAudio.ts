import { useState } from 'react';

const useTestVoiceAudio = () => {
  const [isTestingVoice, setIsTestingVoice] = useState<string | null>(null);

  const testVoiceAudio = async (voiceId: string) => {
    setIsTestingVoice(voiceId);
    try {
      const response = await fetch(
        `http://localhost:8000/articles/test-voice`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            voice: voiceId,
            text: 'This is a sample of how this voice sounds.',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate test audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.addEventListener('ended', () => {
        setIsTestingVoice(null);
        URL.revokeObjectURL(audioUrl);
      });

      await audio.play();
    } catch (error) {
      console.error('Error testing voice:', error);
      setIsTestingVoice(null);
    }
  };

  return { isTestingVoice, testVoiceAudio };
};

export default useTestVoiceAudio;
