import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Heart, 
  Users, 
  ArrowRight,
  CheckCircle,
  Target,
  AlertCircle
} from 'lucide-react';

interface RoadmapPhase {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  items: Array<{
    text: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }>;
  icon: React.ReactNode;
  color: string;
}

interface PhotoSlot {
  id: string;
  label: string;
  description: string;
  file: File | null;
  preview: string | null;
  required: boolean;
}

interface PetDetails {
  name: string;
  species: 'cachorro' | 'gato' | '';
  breed: string;
  sex: 'macho' | 'fêmea' | '';
  age: string;
}

interface UploadResult {
  success?: boolean;
  message?: string;
  error?: string;
}

function App() {
  const [visiblePhases, setVisiblePhases] = useState<number[]>([]);
  const [petCount, setPetCount] = useState<number>(0);
  
  // Upload states
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 'frontal', label: 'Imagem Frontal', description: 'Rosto da frente', file: null, preview: null, required: true },
    { id: 'focinho', label: 'Foto do Focinho', description: 'Close-up do Nariz', file: null, preview: null, required: true }
  ]);
  
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [petDetails, setPetDetails] = useState<PetDetails>({
    name: '',
    species: '',
    breed: '',
    sex: '',
    age: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Buscar contador de pets
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
        const savedCount = localStorage.getItem('petContributionCount');
        setPetCount(savedCount ? parseInt(savedCount) : 2847);
      }
    };

    fetchPetCount();
  }, []);

  // Animação de entrada das fases
  useEffect(() => {
    const timer = setInterval(() => {
      setVisiblePhases(prev => {
        if (prev.length < roadmapPhases.length) {
          return [...prev, prev.length];
        }
        clearInterval(timer);
        return prev;
      });
    }, 600);

    return () => clearInterval(timer);
  }, []);

  const roadmapPhases: RoadmapPhase[] = [
    {
      id: 1,
      title: "O focinho do seu pet pode salvar uma família",
      subtitle: "",
      description: "Envie duas fotos do seu pet e ajude a salvar animais perdidos.",
      status: 'in-progress',
      icon: <Camera className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      items: []
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Concluído</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Em andamento</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Planejado</span>
          </div>
        );
    }
  };

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
    const focinhoPhoto = photos.find(p => p.id === 'focinho');
    
    if (!frontalPhoto?.file || !focinhoPhoto?.file) {
      setError('Ambas as imagens (frontal e focinho) são obrigatórias para continuar.');
      return;
    }
    setShowPetDetails(true);
    setError(null);
  };

  // Gerar UUID único para sessão
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Função para enviar formulário - COM CONTADOR FUNCIONAL
  const handleSubmitPetForm = async () => {
    // Validação dos campos obrigatórios
    if (!petDetails.name.trim()) {
      setError('O nome do pet é obrigatório.');
      return;
    }
    
    if (!petDetails.species || !petDetails.sex || !petDetails.breed.trim() || !petDetails.age.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const frontalPhoto = photos.find(p => p.id === 'frontal');
    const focinhoPhoto = photos.find(p => p.id === 'focinho');
    
    if (!frontalPhoto?.file || !focinhoPhoto?.file) {
      setError('Ambas as imagens são obrigatórias para continuar.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Adicionar imagens
      formData.append('frontal', frontalPhoto.file);
      formData.append('focinho', focinhoPhoto.file);
      
      // Adicionar dados do pet
      formData.append('name', petDetails.name.trim());
      formData.append('session', generateSessionId());
      formData.append('breed', petDetails.breed.trim());
      formData.append('sex', petDetails.sex === 'fêmea' ? 'female' : 'male');
      formData.append('age', petDetails.age.trim());
      formData.append('species', petDetails.species);

      const response = await fetch('https://smartdog-backend-vlm0.onrender.com/api/upload-pet-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // CONTADOR FUNCIONAL: Incrementar sempre que o envio for bem-sucedido
      if (response.ok && data.success) {
        // Incrementar contador local IMEDIATAMENTE
        const newCount = petCount + 1;
        setPetCount(newCount);
        
        // Salvar no localStorage como backup
        localStorage.setItem('petContributionCount', newCount.toString());
        
        // Tentar atualizar contador no servidor (sem bloquear a UI)
        try {
          await fetch('https://smartdog-backend-vlm0.onrender.com/api/increment-pet-count', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ increment: 1 })
          });
        } catch (counterError) {
          console.warn('Erro ao atualizar contador no servidor:', counterError);
          // Não bloquear a experiência do usuário por erro no contador
        }
        
        // Mostrar tela de agradecimento
        setResult({ 
          success: true, 
          message: petDetails.name.trim() 
            ? `${petDetails.name} acabou de contribuir para ajudar uma família!`
            : 'Seu pet acabou de contribuir para ajudar uma família!'
        });
      } else {
        setError(data.error || data.message || 'Erro ao enviar as fotos. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetForm = () => {
    setResult(null);
    setPhotos(photos.map(photo => ({ ...photo, file: null, preview: null })));
    setPetDetails({ name: '', species: '', breed: '', sex: '', age: '' });
    setShowPetDetails(false);
    setError(null);
  };

  const hasRequiredPhotos = photos.every(photo => photo.file !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">
              Smartdog
            </h1>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <Camera className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{petCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Pets Contribuindo</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Roadmap Phases */}
        <section className="max-w-6xl mx-auto space-y-8 mb-16">
          {roadmapPhases.map((phase, index) => (
            <div
              key={phase.id}
              className={`roadmap-phase ${visiblePhases.includes(index) ? 'visible' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Phase Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white shadow-lg`}>
                      {phase.icon}
                    </div>
                    <div className="text-center mt-3">
                      <span className="text-sm font-bold text-gray-500">Fase {phase.id}</span>
                    </div>
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="mb-4 lg:mb-0">
                        {getStatusBadge(phase.status)}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      {phase.title}
                    </h3>
                    
                    {phase.subtitle && (
                      <p className="text-lg text-gray-600 mb-4 font-medium">
                        {phase.subtitle}
                      </p>
                    )}
                    
                    {phase.description && (
                      <div className="mb-6">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium text-sm leading-relaxed inline-block">
                          {phase.description}
                        </span>
                      </div>
                    )}

                    {/* Phase Items */}
                    {phase.items.length > 0 && (
                      <div className="space-y-3">
                        {phase.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center space-x-3"
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              item.status === 'completed' ? 'bg-green-500' :
                              item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-gray-700 font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Upload Section */}
        {!result ? (
          <section className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-white shadow-2xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6">
                  Seu pet pode ajudar?
                </h2>
              </div>

              {/* Error Message */}
              {error && (
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Upload Photos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {photo.label}
                      </h3>
                      <p className="text-sm text-gray-500">{photo.description}</p>
                    </div>

                    <div 
                      className="upload-area relative rounded-xl p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 cursor-pointer bg-gray-50 hover:bg-blue-50"
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
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 text-sm">
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
                      <div className={`w-3 h-3 rounded-full ${photo.file ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Button */}
              {!showPetDetails && (
                <div className="text-center mb-8">
                  <button
                    onClick={handleShowPetDetails}
                    disabled={!hasRequiredPhotos}
                    className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="w-6 h-6" />
                      <span>Contribuir com as imagens</span>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </button>
                </div>
              )}

              {/* Pet Details Form - TEXTO PRETO CORRIGIDO */}
              {showPetDetails && (
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-center mb-8 text-white">
                    Detalhes do Seu Pet
                  </h3>
                  
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 space-y-6">
                    {/* Nome do Pet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Pet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.name}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Luna, Thor, Nina..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Espécie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Espécie <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={petDetails.species}
                        onChange={(e) => {
                          const newSpecies = e.target.value as 'cachorro' | 'gato';
                          setPetDetails(prev => ({ 
                            ...prev, 
                            species: newSpecies,
                            breed: ''
                          }));
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      >
                        <option value="" className="text-gray-500">Selecione a espécie</option>
                        <option value="cachorro" className="text-gray-900">Cachorro</option>
                        <option value="gato" className="text-gray-900">Gato</option>
                      </select>
                    </div>

                    {/* Raça */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Raça <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.breed}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, breed: e.target.value }))}
                        placeholder="Ex: Labrador, SRD, Persa, etc..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Sexo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sexo <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={petDetails.sex}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, sex: e.target.value as 'macho' | 'fêmea' }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      >
                        <option value="" className="text-gray-500">Selecione o sexo</option>
                        <option value="macho" className="text-gray-900">Macho</option>
                        <option value="fêmea" className="text-gray-900">Fêmea</option>
                      </select>
                    </div>

                    {/* Idade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idade <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.age}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Ex: 3 anos, 6 meses, 45 dias..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        onClick={handleSubmitPetForm}
                        disabled={isProcessing}
                        className="professional-cta-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Heart className="w-6 h-6 mr-3 animate-pulse" />
                            Enviando contribuição...
                          </>
                        ) : (
                          'Finalizar'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          /* Result Section */
          <section className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-green-700">
                Obrigado pela contribuição!
              </h3>
              
              <h4 className="text-xl font-bold mb-4 text-green-600">
                {result.message}
              </h4>
              
              <p className="text-lg text-gray-700 mb-6">
                As fotos enviadas serão usadas para treinar uma inteligência artificial capaz de identificar animais perdidos.
              </p>
              
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-gray-700 font-semibold text-lg">
                  {petCount.toLocaleString()} pets já contribuíram!
                </span>
              </div>

              <button
                onClick={handleResetForm}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors underline"
              >
                Contribuir novamente
              </button>
            </div>
          </section>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
              <div className="relative mb-6">
                <Heart className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Enviando contribuição</h3>
              <p className="text-gray-600 mb-6">Seu pet está ajudando uma família!</p>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-gray-600 font-medium">
              Tecnologia desenvolvida com propósito social
            </span>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          
          <p className="text-gray-500">
            © 2024 Smartdog. Criando esperança com uma simples foto.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;