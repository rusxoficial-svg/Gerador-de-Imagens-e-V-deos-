
import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationSettings, ClothingView, VideoMovement, AspectRatio } from "../types";
import { VIDEO_MOVEMENT_OPTIONS } from "../constants";

// Helper to ensure API Key is selected for Veo
const ensureApiKey = async () => {
  if ('aistudio' in window && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }
};

const getClient = async (isVideo = false) => {
  if (isVideo) {
    await ensureApiKey();
  }
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Chave de API não encontrada. Por favor, defina process.env.API_KEY ou selecione uma chave.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFashionImage = async (
  inputImageBase64: string,
  settings: GenerationSettings
): Promise<string> => {
  const client = await getClient(false);

  // Clean base64 string if it contains data URI prefix
  const cleanBase64 = inputImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  // Define pose and view instruction based on settings
  let poseInstruction = "";
  if (settings.clothingView === ClothingView.BACK) {
    poseInstruction = "A imagem de entrada mostra as COSTAS (parte traseira) da roupa. O modelo DEVE ser gerado virado DE COSTAS para a câmera. A estampa da imagem de entrada deve aparecer nas COSTAS do modelo.";
  } else {
    poseInstruction = "O modelo deve estar de frente. A estampa da imagem de entrada deve aparecer no PEITO/FRENTE da roupa.";
  }

  // Map Aspect Ratio to specific framing instructions
  const ratioInstructions: Record<AspectRatio, string> = {
    [AspectRatio.SQUARE]: "Formato Quadrado (1:1). Composição centralizada, ideal para redes sociais.",
    [AspectRatio.PORTRAIT]: "Formato Retrato Vertical (3:4). Enquadramento de moda editorial, corpo inteiro ou plano americano.",
    [AspectRatio.LANDSCAPE]: "Formato Paisagem (16:9). Enquadramento cinematográfico amplo (wide shot) com espaço negativo no ambiente."
  };

  const framingInstruction = ratioInstructions[settings.aspectRatio] || ratioInstructions[AspectRatio.PORTRAIT];

  // REINFORCED PROMPT FOR PRODUCT FIDELITY
  const prompt = `
    ATUE COMO UM SISTEMA DE "VIRTUAL TRY-ON" (PROVADOR VIRTUAL) DE ALTA PRECISÃO.
    
    OBJETIVO PRIMÁRIO: Vestir o modelo digital com a peça de roupa fornecida, mantendo 100% de fidelidade à estampa, logotipo e design gráfico original.

    ENTRADA (SOURCE): A imagem fornecida contém a "Verdade Absoluta" sobre a aparência da roupa.
    
    REGRAS DE OURO (FIDELIDADE DE ESTAMPA):
    1. PROIBIDO ALTERAR A ESTAMPA: Não tente "melhorar", "recriar" ou "interpretar" o desenho. Copie os gráficos exatamente como são.
    2. PRESERVAÇÃO DE TEXTO: Se houver texto escrito na roupa, a ortografia deve permanecer IDÊNTICA. Não altere as letras.
    3. GEOMETRIA NATURAL: A única modificação permitida na estampa é a distorção natural causada pelas curvas do corpo, músculos e dobras do tecido.
    4. CORES EXATAS: Mantenha a paleta de cores original da roupa.

    CONFIGURAÇÃO DO MODELO E AMBIENTE:
    - Modelo: ${settings.modelType}
    - Pose: ${poseInstruction}
    - Cenário: ${settings.scenario}
    - Iluminação: ${settings.lighting}
    - Enquadramento/Proporção: ${framingInstruction}
    - Estilo: Fotografia comercial 8k, foco nítido na textura do tecido.
    
    ${settings.customPrompt ? `INSTRUÇÕES ADICIONAIS: ${settings.customPrompt}` : ''}

    Resumo: O modelo deve parecer estar usando EXATAMENTE a mesma peça física da foto de referência.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG/PNG compatible
              data: cleanBase64,
            },
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
        seed: settings.seed,
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("Nenhuma imagem foi gerada.");
    }

    const firstPart = candidates[0].content.parts[0];
    if (!firstPart || !firstPart.inlineData || !firstPart.inlineData.data) {
      throw new Error("Formato de resposta inválido da IA.");
    }

    return firstPart.inlineData.data;

  } catch (error) {
    console.error("Erro na API Gemini:", error);
    throw error;
  }
};

export const generateFashionVideo = async (
  imageResultBase64: string,
  movement: VideoMovement
): Promise<string> => {
  try {
    // 1. Initialize Client (triggers API Key selection if needed)
    const client = await getClient(true);

    // 2. Get Prompt
    const movementOption = VIDEO_MOVEMENT_OPTIONS.find(opt => opt.value === movement);
    const prompt = movementOption?.prompt || "Fashion cinematic video";

    // 3. Start Operation
    // Using 'veo-3.1-fast-generate-preview' for better speed/latency for previews
    let operation = await client.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: imageResultBase64,
        mimeType: 'image/png', // The generated output from the previous step is usually PNG (if we converted it or if Gemini returned it)
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Vertical video for fashion/social media
      }
    });

    // 4. Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await client.operations.getVideosOperation({ operation: operation });
    }

    // 5. Fetch Video Content
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Falha ao recuperar a URI do vídeo gerado.");
    }

    // Fetch with API Key
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
      throw new Error("Falha ao baixar o arquivo de vídeo.");
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error: any) {
    console.error("Erro ao gerar vídeo:", error);
    // Handle specific API key error to reset selection
    if (error.message?.includes("Requested entity was not found") && 'aistudio' in window && window.aistudio) {
        // @ts-ignore
       if(window.aistudio.resetApiKey) window.aistudio.resetApiKey();
    }
    throw error;
  }
};
