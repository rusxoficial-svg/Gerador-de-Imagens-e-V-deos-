
import React from 'react';
import { Upload, Settings, Camera, Sun, User, FileText, Sparkles, RotateCw, Lock, Unlock, Monitor } from 'lucide-react';
import { GenerationSettings, ScenarioType, ModelType, LightingStyle, ClothingView, AspectRatio } from '../types';
import { SCENARIO_OPTIONS, MODEL_OPTIONS, LIGHTING_OPTIONS, VIEW_OPTIONS, RATIO_OPTIONS } from '../constants';

interface ControlPanelProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  uploadedImage: string | null;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  setSettings,
  onUpload,
  isUploading,
  uploadedImage,
  onGenerate,
  isGenerating,
}) => {
  
  const handleChange = <K extends keyof GenerationSettings>(key: K, value: GenerationSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const togglePreserveModel = () => {
    setSettings(prev => ({ ...prev, preserveModel: !prev.preserveModel }));
  };

  return (
    <div className="w-full lg:w-96 bg-stone-900 border-r border-stone-800 h-full overflow-y-auto p-6 flex flex-col gap-8 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-6 h-6 text-accent-500" />
        <h2 className="text-2xl font-serif font-semibold text-white tracking-wide">Lumina AI</h2>
      </div>
      
      {/* Upload Section */}
      <section>
        <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Peça de Roupa (Source)
        </h3>
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isGenerating}
          />
          <div className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
            ${uploadedImage 
              ? 'border-accent-500/50 bg-stone-800/50' 
              : 'border-stone-700 hover:border-stone-500 bg-stone-800/30 hover:bg-stone-800'}
          `}>
            {uploadedImage ? (
               <div className="relative h-32 w-full overflow-hidden rounded-md">
                  <img src={uploadedImage} alt="Source" className="object-cover w-full h-full opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <p className="text-xs text-white font-medium">Clique para trocar</p>
                  </div>
               </div>
            ) : (
              <div className="py-4">
                <div className="mx-auto w-10 h-10 mb-2 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 group-hover:text-white transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm text-stone-300 font-medium">Carregar Roupa</p>
                <p className="text-xs text-stone-500 mt-1">JPG, PNG até 10MB</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Settings Section */}
      <section className="flex-1 space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-stone-500 font-bold mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Configurações
        </h3>

        {/* Clothing View / Angle */}
        <div className="space-y-1.5">
          <label className="text-sm text-stone-300 font-medium flex items-center gap-2">
            <RotateCw className="w-3.5 h-3.5 text-accent-500" /> Ângulo da Peça
          </label>
          <select
            value={settings.clothingView}
            onChange={(e) => handleChange('clothingView', e.target.value as ClothingView)}
            className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-shadow"
          >
            {VIEW_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-1.5">
          <label className="text-sm text-stone-300 font-medium flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5 text-accent-500" /> Proporção / Formato
          </label>
          <select
            value={settings.aspectRatio}
            onChange={(e) => handleChange('aspectRatio', e.target.value as AspectRatio)}
            className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-shadow"
          >
            {RATIO_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Scenario */}
        <div className="space-y-1.5">
          <label className="text-sm text-stone-300 font-medium flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-accent-500" /> Cenário / Ambiente
          </label>
          <select
            value={settings.scenario}
            onChange={(e) => handleChange('scenario', e.target.value as ScenarioType)}
            className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-shadow"
          >
            {SCENARIO_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Model */}
        <div className="space-y-1.5">
          <label className="text-sm text-stone-300 font-medium flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-accent-500" /> Modelo
          </label>
          <select
            value={settings.modelType}
            onChange={(e) => handleChange('modelType', e.target.value as ModelType)}
            className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            {MODEL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          
          {/* Preserve Model Toggle */}
          <button
            onClick={togglePreserveModel}
            className={`
                w-full mt-2 flex items-center justify-between px-3 py-2 rounded border text-xs transition-all
                ${settings.preserveModel 
                    ? 'bg-accent-900/30 border-accent-500/50 text-accent-200' 
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-800/80'}
            `}
          >
             <span className="flex items-center gap-2">
               {settings.preserveModel ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
               Preservar Identidade do Modelo
             </span>
             <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.preserveModel ? 'bg-accent-600' : 'bg-stone-600'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.preserveModel ? 'left-4.5' : 'left-0.5'}`} style={{ left: settings.preserveModel ? '18px' : '2px' }}></div>
             </div>
          </button>
          <p className="text-[10px] text-stone-500 px-1">
            Mantém as características faciais e corporais do modelo atual para as próximas fotos (beta).
          </p>
        </div>

        {/* Lighting */}
        <div className="space-y-1.5">
          <label className="text-sm text-stone-300 font-medium flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-accent-500" /> Iluminação
          </label>
          <select
            value={settings.lighting}
            onChange={(e) => handleChange('lighting', e.target.value as LightingStyle)}
            className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            {LIGHTING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Custom Prompt */}
        <div className="space-y-1.5">
          <label className="text-sm text-stone-300 font-medium flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-accent-500" /> Detalhes Adicionais
          </label>
          <textarea
            value={settings.customPrompt}
            onChange={(e) => handleChange('customPrompt', e.target.value)}
            placeholder="Ex: 'Batom vermelho', 'Segurando uma bolsa', 'Cabelo ao vento'..."
            className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2.5 text-sm text-white placeholder-stone-500 focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none resize-none h-20"
          />
        </div>
      </section>

      {/* Action Button */}
      <button
        onClick={onGenerate}
        disabled={!uploadedImage || isGenerating}
        className={`
          w-full py-3.5 rounded-md font-semibold tracking-wide transition-all duration-300 shadow-lg
          flex items-center justify-center gap-2
          ${!uploadedImage || isGenerating
            ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
            : 'bg-accent-600 hover:bg-accent-500 text-white hover:shadow-accent-500/20 transform hover:-translate-y-0.5'}
        `}
      >
        {isGenerating ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Gerando...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" /> Gerar Sessão de Fotos
          </>
        )}
      </button>
    </div>
  );
};
