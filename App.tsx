
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ResultViewer } from './components/ResultViewer';
import { GenerationSettings, ScenarioType, ModelType, LightingStyle, AspectRatio, ClothingView, VideoMovement } from './types';
import { generateFashionImage, generateFashionVideo } from './services/geminiService';

const DEFAULT_SETTINGS: GenerationSettings = {
  scenario: ScenarioType.STUDIO_MINIMAL,
  modelType: ModelType.FEMALE_YOUNG,
  lighting: LightingStyle.SOFT_BOX,
  aspectRatio: AspectRatio.PORTRAIT,
  clothingView: ClothingView.FRONT,
  customPrompt: '',
  seed: Math.floor(Math.random() * 1000000),
  preserveModel: false,
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setGeneratedImage(null); // Reset previous result on new upload
        setGeneratedVideo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null); // Reset video when new image is generated

    try {
      // Determine seed: if preserving, use current; otherwise generate new
      const effectiveSeed = settings.preserveModel 
        ? settings.seed 
        : Math.floor(Math.random() * 2147483647);
      
      // Update state with the used seed so it's visible/lockable
      setSettings(prev => ({ ...prev, seed: effectiveSeed }));

      const base64Result = await generateFashionImage(uploadedImage, {
        ...settings,
        seed: effectiveSeed
      });
      setGeneratedImage(base64Result);
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar imagem. Verifique sua chave de API ou tente uma imagem diferente.");
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedImage, settings]);

  const handleGenerateVideo = useCallback(async (movement: VideoMovement) => {
    if (!generatedImage) return;
    
    setIsGeneratingVideo(true);
    setError(null);

    try {
      const videoUrl = await generateFashionVideo(generatedImage, movement);
      setGeneratedVideo(videoUrl);
    } catch (err: any) {
      console.error(err);
      setError("Falha ao gerar vídeo. Certifique-se de que selecionou uma Chave de API válida no diálogo pop-up.");
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [generatedImage]);

  return (
    <div className="flex h-screen w-screen bg-stone-950 text-stone-200 overflow-hidden">
      
      {/* Mobile/Tablet check (Simple warning for very small screens) */}
      <div className="lg:hidden absolute inset-0 z-50 bg-stone-950 flex items-center justify-center p-8 text-center">
         <div>
            <h1 className="text-2xl font-serif mb-2">Recomendado uso em Desktop</h1>
            <p className="text-stone-400">Para a melhor experiência de estúdio, por favor use uma tela maior para visualizar os detalhes em alta resolução.</p>
         </div>
      </div>

      {/* Left Panel: Controls */}
      <ControlPanel 
        settings={settings}
        setSettings={setSettings}
        onUpload={handleUpload}
        isUploading={false}
        uploadedImage={uploadedImage}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* Right Panel: Viewer */}
      <div className="flex-1 relative">
        {error && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-xl backdrop-blur-sm border border-red-400/20 flex items-center gap-3 animate-fade-in-down">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="hover:text-red-100">✕</button>
          </div>
        )}
        <ResultViewer 
          generatedImage={generatedImage}
          generatedVideo={generatedVideo} 
          isGenerating={isGenerating}
          isGeneratingVideo={isGeneratingVideo}
          onGenerateVideo={handleGenerateVideo}
        />
      </div>
    </div>
  );
};

export default App;
