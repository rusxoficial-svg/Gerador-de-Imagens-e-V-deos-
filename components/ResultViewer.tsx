
import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Maximize2, Video, Play, Loader2, Film, Clock } from 'lucide-react';
import { VideoMovement, HistoryItem } from '../types';
import { VIDEO_MOVEMENT_OPTIONS } from '../constants';

interface ResultViewerProps {
  generatedImage: string | null;
  generatedVideo: string | null;
  isGenerating: boolean;
  isGeneratingVideo: boolean;
  onGenerateVideo: (movement: VideoMovement) => void;
  history: HistoryItem[];
  activeHistoryId: string | null;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ 
  generatedImage, 
  generatedVideo,
  isGenerating,
  isGeneratingVideo,
  onGenerateVideo,
  history,
  activeHistoryId,
  onSelectHistoryItem
}) => {
  const [selectedMovement, setSelectedMovement] = useState<VideoMovement>(VideoMovement.SLOW_TURN);
  const [viewMode, setViewMode] = useState<'image' | 'video'>('image');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-switch to video when it becomes available
  useEffect(() => {
    if (generatedVideo) {
      setViewMode('video');
    } else {
      // Reset to image if current item has no video
      setViewMode('image');
    }
  }, [generatedVideo]);

  const handleDownload = () => {
    if (viewMode === 'image' && generatedImage) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${generatedImage}`;
      link.download = `lumina-foto-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (viewMode === 'video' && generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `lumina-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex-1 bg-stone-950 relative flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
        <div className="pointer-events-auto flex gap-2">
            <span className="bg-stone-900/80 backdrop-blur-md text-stone-300 text-xs font-bold px-3 py-1.5 rounded-full border border-stone-800">
                MODO VISUALIZAÇÃO
            </span>
            {(generatedImage && generatedVideo) && (
              <div className="flex bg-stone-900/80 backdrop-blur-md rounded-full border border-stone-800 p-1">
                 <button 
                   onClick={() => setViewMode('image')}
                   className={`px-3 py-0.5 rounded-full text-xs font-medium transition-all ${viewMode === 'image' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'}`}
                 >
                   Foto
                 </button>
                 <button 
                   onClick={() => setViewMode('video')}
                   className={`px-3 py-0.5 rounded-full text-xs font-medium transition-all ${viewMode === 'video' ? 'bg-accent-600 text-white' : 'text-stone-400 hover:text-white'}`}
                 >
                   Vídeo
                 </button>
              </div>
            )}
        </div>
        {(generatedImage || generatedVideo) && (
            <div className="flex gap-3 pointer-events-auto">
                <button 
                    onClick={handleDownload}
                    className="p-2.5 bg-stone-900/80 hover:bg-stone-800 text-white rounded-full backdrop-blur-md border border-stone-700 transition-colors"
                    title="Baixar"
                >
                    <Download className="w-5 h-5" />
                </button>
            </div>
        )}
      </div>

      {/* Main Display Area */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-stone-950 pb-32">
        
        {isGenerating ? (
            <div className="text-center space-y-6 max-w-md w-full animate-pulse">
                <div className="aspect-[3/4] w-full bg-stone-900 rounded-lg border border-stone-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-800/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                </div>
                <div className="space-y-2">
                    <p className="text-accent-500 font-serif text-xl">Curando a estética...</p>
                    <p className="text-stone-500 text-sm">Nossa IA está compondo a iluminação e renderizando texturas.</p>
                </div>
            </div>
        ) : generatedImage ? (
            <div className="flex flex-col items-center gap-6 w-full max-w-4xl h-full justify-center">
                
                {/* Media Container */}
                <div className="relative shadow-2xl rounded-lg overflow-hidden border border-stone-800 group max-h-[60vh] lg:max-h-[65vh] transition-all">
                   {viewMode === 'image' ? (
                      <img 
                          src={`data:image/png;base64,${generatedImage}`} 
                          alt="Resultado Gerado" 
                          className="max-h-[60vh] lg:max-h-[65vh] w-auto object-contain"
                      />
                   ) : (
                      <div className="max-h-[60vh] lg:max-h-[65vh] aspect-[9/16] bg-black flex items-center justify-center relative min-w-[300px]">
                          {isGeneratingVideo ? (
                             <div className="flex flex-col items-center gap-4 p-8">
                                <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
                                <p className="text-accent-500 text-sm font-medium text-center">Criando movimento...<br/><span className="text-xs text-stone-500">(Isso pode levar 1-2 minutos)</span></p>
                             </div>
                          ) : generatedVideo ? (
                            <video 
                                src={generatedVideo} 
                                autoPlay 
                                loop 
                                controls
                                className="max-h-full w-full object-contain"
                            />
                          ) : (
                             <div className="text-stone-500 text-sm">Vídeo não gerado ainda.</div>
                          )}
                      </div>
                   )}
                </div>

                {/* Video Generator Controls (Only show when image exists) */}
                {generatedImage && !isGeneratingVideo && !generatedVideo && viewMode === 'image' && (
                    <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3 lg:p-4 flex items-center gap-4 w-full max-w-2xl shadow-lg backdrop-blur-sm animate-fade-in-up z-20">
                        <div className="p-2 lg:p-3 bg-stone-800 rounded-full text-accent-500">
                            <Video className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-serif text-sm">Criar Motion Video</h4>
                            <p className="text-stone-500 text-xs hidden sm:block">Dê vida à sua foto com movimentos leves e naturais.</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <select 
                                value={selectedMovement}
                                onChange={(e) => setSelectedMovement(e.target.value as VideoMovement)}
                                className="bg-stone-950 border border-stone-700 text-stone-300 text-xs rounded-md py-2 px-2 lg:px-3 outline-none focus:border-accent-500 max-w-[120px] sm:max-w-none"
                             >
                                {VIDEO_MOVEMENT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                             </select>
                             <button 
                                onClick={() => onGenerateVideo(selectedMovement)}
                                className="bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold py-2 px-3 lg:px-4 rounded-md flex items-center gap-2 transition-colors"
                             >
                                <Play className="w-3 h-3 fill-current" /> <span className="hidden sm:inline">Gerar Vídeo</span>
                             </button>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center space-y-4 max-w-md opacity-40">
                <div className="w-24 h-24 mx-auto rounded-full border-2 border-stone-700 flex items-center justify-center text-stone-700">
                    <Maximize2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif text-stone-300">Pronto para Criar</h3>
                <p className="text-stone-500">Faça upload de uma peça e configure o cenário para gerar imagens de alta moda.</p>
            </div>
        )}
      </div>

      {/* History Filmstrip */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-stone-950/90 backdrop-blur-md border-t border-stone-800 z-30 flex flex-col">
         <div className="px-4 py-1.5 flex items-center gap-2 border-b border-stone-800/50">
             <Clock className="w-3 h-3 text-stone-500" />
             <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Histórico da Sessão</span>
         </div>
         <div 
            className="flex-1 flex items-center gap-3 overflow-x-auto px-4 overflow-y-hidden"
            ref={scrollContainerRef}
         >
            {history.length === 0 ? (
                <div className="w-full text-center text-stone-600 text-sm italic">
                    Nenhum histórico recente.
                </div>
            ) : (
                history.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelectHistoryItem(item)}
                        className={`
                            relative group flex-shrink-0 h-16 w-12 lg:h-20 lg:w-16 rounded overflow-hidden border-2 transition-all
                            ${activeHistoryId === item.id 
                                ? 'border-accent-500 shadow-[0_0_10px_rgba(192,160,98,0.3)] scale-105 z-10' 
                                : 'border-stone-700 opacity-60 hover:opacity-100 hover:border-stone-500'}
                        `}
                    >
                        <img 
                            src={`data:image/png;base64,${item.generatedImage}`} 
                            alt="History Thumbnail" 
                            className="w-full h-full object-cover"
                        />
                        {item.generatedVideo && (
                            <div className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5">
                                <Video className="w-2 h-2 text-white" />
                            </div>
                        )}
                    </button>
                ))
            )}
         </div>
      </div>
    </div>
  );
};
