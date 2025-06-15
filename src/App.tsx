import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Download, Share2, Sparkles, Dna, Instagram, AlertCircle, Heart, MessageCircle, Facebook, Twitter, User } from 'lucide-react';

interface PhotoSlot {
  id: string;
  label: string;
  description: string;
  file: File | null;
  preview: string | null;
  required: boolean;
}

interface PetDetails {
  especie: 'cachorro' | 'gato' | '';
  breed: string;
  sex: 'macho' | 'fêmea' | '';
  age: string;
}

interface TransformResult {
  success?: boolean;
  composite_image?: string;
  transformed_image?: string;
  prompt_used?: string;
  idade_humana?: number;
  message?: string;
  error?: string;
}

function App() {
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 'frontal', label: 'Foto Frontal', description: 'Rosto de frente (obrigatória)', file: null, preview: null, required: true },
    { id: 'focinho', label: 'Foto do Focinho', description: 'Close-up do nariz (opcional)', file: null, preview: null, required: false },
    { id: 'angulo', label: 'Foto em Ângulo', description: 'Rosto de lado (opcional)', file: null, preview: null, required: false }
  ]);
  
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [petDetails, setPetDetails] = useState<PetDetails>({
    especie: '',
    breed: '',
    sex: '',
    age: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TransformResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [petCount, setPetCount] = useState<number>(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Buscar contador de pets transformados
  useEffect(() => {
    const fetchPetCount = async () => {
      try {
        const response = await fetch('https://smartdog-backend-vlm0.onrender.com/api/pet-human-count');
        if (response.ok) {
          const data = await response.json();
          setPetCount(data.count || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar contador:', error);
      }
    };

    fetchPetCount();
  }, []);

  const handleFileSelect = (id: string, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setPhotos(prev => prev.map(photo => 
          photo.id === id ? { ...photo, file, preview } : photo
        ));
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleShowPetDetails = () => {
    const frontalPhoto = photos.find(p => p.id === 'frontal');
    if (!frontalPhoto?.file) {
      setError('A foto frontal é obrigatória para continuar.');
      return;
    }
    setShowPetDetails(true);
    setError(null);
  };

  // Gerar UUID único para sessão
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Nova função para enviar formulário usando DALL·E API
  const handleSubmitPetForm = async () => {
    if (!petDetails.especie || !petDetails.sex || !petDetails.breed.trim() || !petDetails.age.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!termsAccepted) {
      setError('Você deve aceitar os termos para continuar.');
      return;
    }

    const frontalPhoto = photos.find(p => p.id === 'frontal');
    if (!frontalPhoto?.file) {
      setError('A foto frontal é obrigatória para continuar.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setImageLoaded(false);
    setImageError(false);

    try {
      const formData = new FormData();
      
      // Adicionar apenas a imagem frontal (obrigatória)
      formData.append('frontal', frontalPhoto.file);
      
      // Adicionar dados do pet
      formData.append('session', generateSessionId());
      formData.append('breed', petDetails.breed);
      formData.append('sex', petDetails.sex);
      formData.append('age', petDetails.age);
      formData.append('especie', petDetails.especie);

      console.log('=== ENVIANDO PARA DALL·E API ===');
      console.log('Endpoint:', 'https://smartdog-backend-vlm0.onrender.com/api/transform-pet');
      console.log('Dados enviados:', {
        especie: petDetails.especie,
        breed: petDetails.breed,
        sex: petDetails.sex,
        age: petDetails.age,
        frontal: frontalPhoto.file.name
      });

      const response = await fetch('https://smartdog-backend-vlm0.onrender.com/api/transform-pet', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('=== RESPOSTA DALL·E API ===');
      console.log('Resposta completa:', data);
      console.log('success:', data.success);
      console.log('composite_image:', data.composite_image);
      console.log('transformed_image:', data.transformed_image);
      console.log('prompt_used:', data.prompt_used);
      console.log('idade_humana:', data.idade_humana);

      if (response.ok && data.success) {
        setResult(data);
        // Atualizar contador
        setPetCount(prev => prev + 1);
      } else {
        setError(data.error || data.message || 'Erro ao processar a transformação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição DALL·E:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const imageUrl = getImageUrl();
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'meu-pet-humano.jpg';
      link.target = '_blank';
      link.click();
    }
  };

  const handleShare = (platform: string) => {
    const imageUrl = getImageUrl();
    if (!imageUrl) {
      setError('Não há imagem para compartilhar. Transforme seu pet primeiro!');
      return;
    }

    const shareText = 'Veja como meu pet ficaria na versão humana! 🧬 Teste grátis em meupethumano.com';
    const encodedText = encodeURIComponent(shareText);
    const currentUrl = encodeURIComponent(window.location.href);
    const encodedImageUrl = encodeURIComponent(imageUrl);
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%20${encodedImageUrl}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedText}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${currentUrl}`, '_blank');
        break;
      case 'instagram':
        alert('📸 Para compartilhar no Instagram:\n\n1. Baixe a imagem usando o botão "Baixar Imagem"\n2. Abra o Instagram\n3. Crie um novo post ou story\n4. Adicione a imagem baixada\n5. Use o texto: "' + shareText + '"');
        break;
      case 'tiktok':
        alert('🎵 Para compartilhar no TikTok:\n\n1. Baixe a imagem usando o botão "Baixar Imagem"\n2. Abra o TikTok\n3. Crie um novo vídeo\n4. Adicione a imagem como fundo\n5. Use o texto: "' + shareText + '"');
        break;
    }
  };

  const resetApp = () => {
    setResult(null);
    setPhotos(photos.map(photo => ({ ...photo, file: null, preview: null })));
    setPetDetails({ especie: '', breed: '', sex: '', age: '' });
    setShowPetDetails(false);
    setTermsAccepted(false);
    setError(null);
    setImageLoaded(false);
    setImageError(false);
  };

  // Função para obter a URL da imagem transformada - DALL·E API
  const getImageUrl = (): string | null => {
    if (!result) return null;
    
    // Prioridade: composite_image ou transformed_image (campos do DALL·E)
    return result.composite_image || result.transformed_image || null;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    console.log('Imagem DALL·E carregada com sucesso!');
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
    console.error('Erro ao carregar imagem DALL·E:', getImageUrl());
  };

  const hasRequiredPhotos = photos.find(p => p.id === 'frontal')?.file !== null;
  const imageUrl = getImageUrl();
  const canShowButtons = imageUrl && imageLoaded && !imageError;

  // Debug: Log da resposta da API DALL·E
  useEffect(() => {
    if (result) {
      console.log('=== DEBUG RESPOSTA DALL·E ===');
      console.log('Resposta completa:', result);
      console.log('success:', result.success);
      console.log('composite_image:', result.composite_image);
      console.log('transformed_image:', result.transformed_image);
      console.log('prompt_used:', result.prompt_used);
      console.log('idade_humana:', result.idade_humana);
      console.log('URL escolhida:', getImageUrl());
      console.log('============================');
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Como seu pet seria se fosse humano?
            </h1>
            <Sparkles className="w-8 h-8 text-cyan-400 ml-3 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Envie fotos do seu pet e veja a mágica acontecer com IA DALL·E.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Dna className="w-6 h-6 text-green-400 animate-spin" />
              <span className="text-green-400 font-semibold">Tecnologia DALL·E Avançada</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Ícones fofos de cachorro e gato */}
              <div className="flex items-center space-x-1">
                <span className="text-2xl animate-bounce">🐕</span>
                <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
                <span className="text-2xl animate-bounce delay-150">😺</span>
              </div>
              <span className="text-cyan-400 font-semibold">{petCount.toLocaleString()} pets já transformados!</span>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {!result ? (
          <>
            {/* Upload Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-cyan-300">
                Carregue as Fotos do Seu Pet
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center justify-center">
                        {photo.label}
                      </h3>
                      <p className="text-sm text-gray-400">{photo.description}</p>
                    </div>

                    <div 
                      className="relative border-2 border-dashed border-gray-600 rounded-xl p-8 transition-all duration-300 group-hover:border-cyan-400/50 cursor-pointer"
                      onClick={() => fileInputRefs.current[photo.id]?.click()}
                    >
                      {photo.preview ? (
                        <div className="relative">
                          <img 
                            src={photo.preview} 
                            alt={`Preview ${photo.label}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                          <Camera className="absolute bottom-2 right-2 w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                          <p className="text-gray-400 group-hover:text-cyan-400 transition-colors text-sm">
                            Toque para capturar ou escolher foto
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      ref={el => fileInputRefs.current[photo.id] = el}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(photo.id, file);
                      }}
                    />

                    {/* Progress indicator */}
                    <div className="mt-4 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${photo.file ? 'bg-green-400' : 'bg-gray-600'} transition-colors`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Transform Button - BOTÃO SEMPRE COLORIDO! */}
            {!showPetDetails && (
              <div className="text-center mb-16">
                <button
                  onClick={handleShowPetDetails}
                  disabled={!hasRequiredPhotos}
                  className="perfect-colorful-button group relative inline-flex items-center justify-center px-16 py-8 text-2xl font-black rounded-full transition-all duration-500 transform hover:scale-110 active:scale-95 overflow-hidden shadow-2xl"
                >
                  {/* Shimmer overlay sempre ativo */}
                  <div className="shimmer-overlay"></div>
                  
                  <div className="relative flex items-center z-10">
                    <Sparkles className="w-10 h-10 mr-4 animate-spin text-white drop-shadow-lg" />
                    <span className="font-black tracking-wide text-white drop-shadow-lg">
                      ✨ Transformar em Humano ✨
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Pet Details Form */}
            {showPetDetails && (
              <section className="mb-12">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-cyan-300">
                    Detalhes do Seu Pet
                  </h2>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
                    {/* Espécie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Espécie <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={petDetails.especie}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, especie: e.target.value as 'cachorro' | 'gato' }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      >
                        <option value="">Selecione a espécie</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                      </select>
                    </div>

                    {/* Raça */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Raça <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.breed}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, breed: e.target.value }))}
                        placeholder="Ex: Labrador, Vira-lata, Persa..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Sexo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sexo <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={petDetails.sex}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, sex: e.target.value as 'macho' | 'fêmea' }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      >
                        <option value="">Selecione o sexo</option>
                        <option value="macho">Macho</option>
                        <option value="fêmea">Fêmea</option>
                      </select>
                    </div>

                    {/* Idade - CAMPO FLEXÍVEL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Idade <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.age}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Ex: 3 anos, 6 meses, 45 dias..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        💡 Você pode informar em dias, meses ou anos (ex: "2 anos", "8 meses", "30 dias")
                      </p>
                    </div>

                    {/* Terms and Privacy Checkbox */}
                    <div className="pt-4">
                      <label className="flex items-start space-x-4 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`
                            w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center
                            ${termsAccepted 
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-400 shadow-lg shadow-cyan-400/30' 
                              : 'border-gray-500 group-hover:border-cyan-400/50'
                            }
                          `}>
                            {termsAccepted && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                          Ao continuar, você concorda com os nossos{' '}
                          <a 
                            href="https://smartdog-backend-vlm0.onrender.com/termos-de-uso.html" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Termos de Uso
                          </a>
                          {' '}e{' '}
                          <a 
                            href="https://smartdog-backend-vlm0.onrender.com/politica-de-privacidade.html" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Política de Privacidade
                          </a>
                          .
                        </div>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        onClick={handleSubmitPetForm}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Dna className="w-6 h-6 mr-3 animate-spin inline" />
                            Transformando com DALL·E...
                          </>
                        ) : (
                          'Finalizar e Transformar em Humano'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 text-center">
                  <div className="relative mb-6">
                    <Dna className="w-16 h-16 text-cyan-400 mx-auto animate-spin" />
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-cyan-300">Transformando em humano</h3>
                  <p className="text-gray-300 mb-6">Pode demorar aproximadamente 2 minutos.</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Result Section */
          <section className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              🎉 Transformação DALL·E Completa!
            </h2>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
              {imageUrl ? (
                <div className="relative">
                  <img 
                    src={imageUrl} 
                    alt="Pet transformado em humano pelo DALL·E"
                    className="w-full max-w-md mx-auto rounded-xl shadow-2xl shadow-cyan-500/20"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ display: imageError ? 'none' : 'block' }}
                  />
                  {imageError && (
                    <div className="w-full max-w-md mx-auto h-64 flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <p className="text-red-300 text-lg font-semibold">
                          Ocorreu um erro ao transformar a imagem. Por favor, tente novamente.
                        </p>
                        <button
                          onClick={resetApp}
                          className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
                        >
                          Tentar Novamente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-md mx-auto h-64 flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-red-300 text-lg font-semibold">
                      Ocorreu um erro ao transformar a imagem. Por favor, tente novamente.
                    </p>
                    <button
                      onClick={resetApp}
                      className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                </div>
              )}
              
              {/* Informações adicionais - só aparece se imagem carregou */}
              {canShowButtons && (
                <div className="mt-6 space-y-4">
                  {/* Idade humana estimada */}
                  {result.idade_humana && (
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20">
                      <div className="flex items-center justify-center space-x-2">
                        <User className="w-6 h-6 text-blue-400" />
                        <span className="text-lg font-semibold text-blue-300">
                          Idade humana estimada: {result.idade_humana} anos
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Prompt usado pelo DALL·E */}
                  {result.prompt_used && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h4 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Prompt DALL·E usado:
                      </h4>
                      <p className="text-sm text-gray-300 italic">{result.prompt_used}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Download Button - só aparece se imagem carregou */}
            {canShowButtons && (
              <div className="mb-8">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 mx-auto"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Imagem DALL·E
                </button>
              </div>
            )}

            {/* Social Sharing Section - só aparece se imagem carregou */}
            {canShowButtons && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-6 text-cyan-300">
                  🚀 Compartilhe sua transformação DALL·E!
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-lg mx-auto">
                  {/* WhatsApp */}
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
                  >
                    <MessageCircle className="w-8 h-8 text-white mb-2 group-hover:animate-bounce" />
                    <span className="text-xs font-semibold text-white">WhatsApp</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleShare('facebook')}
                    className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
                  >
                    <Facebook className="w-8 h-8 text-white mb-2 group-hover:animate-bounce" />
                    <span className="text-xs font-semibold text-white">Facebook</span>
                  </button>

                  {/* Twitter/X */}
                  <button
                    onClick={() => handleShare('twitter')}
                    className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-gray-500/30"
                  >
                    <Twitter className="w-8 h-8 text-white mb-2 group-hover:animate-bounce" />
                    <span className="text-xs font-semibold text-white">X</span>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={() => handleShare('instagram')}
                    className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-400 hover:via-red-400 hover:to-yellow-400 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/30"
                  >
                    <Instagram className="w-8 h-8 text-white mb-2 group-hover:animate-bounce" />
                    <span className="text-xs font-semibold text-white">Instagram</span>
                  </button>

                  {/* TikTok */}
                  <button
                    onClick={() => handleShare('tiktok')}
                    className="group flex flex-col items-center justify-center p-4 bg-gradient-to-br from-black via-red-600 to-cyan-400 hover:from-gray-900 hover:via-red-500 hover:to-cyan-300 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
                  >
                    <Share2 className="w-8 h-8 text-white mb-2 group-hover:animate-bounce" />
                    <span className="text-xs font-semibold text-white">TikTok</span>
                  </button>
                </div>

                <p className="text-sm text-gray-400 mt-4 max-w-md mx-auto">
                  💡 Para Instagram e TikTok: baixe a imagem e compartilhe manualmente no app
                </p>
              </div>
            )}

            <button
              onClick={resetApp}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline"
            >
              Transformar outro pet
            </button>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <a 
                href="https://smartdog-backend-vlm0.onrender.com/termos-de-uso.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium text-lg"
              >
                Termos de Uso
              </a>
              <a 
                href="https://smartdog-backend-vlm0.onrender.com/politica-de-privacidade.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium text-lg"
              >
                Política de Privacidade
              </a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 Pet AI Transform. {petCount.toLocaleString()} pets já transformados!
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;