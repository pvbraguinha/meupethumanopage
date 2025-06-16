import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Heart, 
  Users, 
  Trophy, 
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Rocket,
  Brain,
  Globe,
  Gift,
  Sparkles,
  MapPin,
  Shield
} from 'lucide-react';

interface RoadmapPhase {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'in-progress' | 'upcoming';
  items: Array<{
    text: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }>;
  bgColor: string;
  iconColor: string;
}

function App() {
  const [visiblePhases, setVisiblePhases] = useState<number[]>([]);
  const [petCount, setPetCount] = useState<number>(0);

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
    }, 400);

    return () => clearInterval(timer);
  }, []);

  const roadmapPhases: RoadmapPhase[] = [
    {
      id: 1,
      title: "Resgate o Futuro dos Pets",
      subtitle: "Uploads feitos por tutores e ONGs",
      description: "Criação da maior base de focinhos da Europa e América Latina",
      icon: <span className="text-3xl">🐾</span>,
      status: 'in-progress',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      iconColor: 'text-blue-600',
      items: [
        { text: "Uploads feitos por tutores e ONGs", status: 'completed' },
        { text: "Criação da maior base de focinhos da Europa e América Latina", status: 'in-progress' },
        { text: "Treinamento do modelo de IA", status: 'in-progress' }
      ]
    },
    {
      id: 2,
      title: "Treine a Inteligência",
      subtitle: "Lançamento do MVP com reconhecimento de focinho",
      description: "Backend e upload no S3 funcionando",
      icon: <span className="text-3xl">🧠</span>,
      status: 'completed',
      bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
      iconColor: 'text-green-600',
      items: [
        { text: "Backend e upload no S3 funcionando", status: 'completed' },
        { text: "Testes com ONGs parceiras", status: 'completed' }
      ]
    },
    {
      id: 3,
      title: "Conexão Global",
      subtitle: "Expansão para clínicas e prefeituras",
      description: "Cadastro massivo de pets",
      icon: <span className="text-3xl">🌍</span>,
      status: 'upcoming',
      bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
      iconColor: 'text-purple-600',
      items: [
        { text: "Expansão para clínicas e prefeituras", status: 'upcoming' },
        { text: "Cadastro massivo de pets", status: 'upcoming' }
      ]
    },
    {
      id: 4,
      title: "Reconhecer e Recompensar",
      subtitle: "Contribuintes ganham selos digitais",
      description: "ONGs destacadas e NFT de identidade animal (opcional)",
      icon: <span className="text-3xl">🎁</span>,
      status: 'upcoming',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      iconColor: 'text-yellow-600',
      items: [
        { text: "Contribuintes ganham selos digitais", status: 'upcoming' },
        { text: "ONGs destacadas", status: 'upcoming' },
        { text: "NFT de identidade animal (opcional)", status: 'upcoming' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleContributeClick = () => {
    // Redirecionar para a página de upload
    window.location.href = '/upload';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce delay-1000">🐕</div>
        <div className="absolute top-40 right-20 text-3xl animate-bounce delay-2000">😺</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-bounce delay-3000">❤️</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-bounce delay-4000">🏠</div>
        <div className="absolute top-1/2 left-1/4 text-2xl animate-bounce delay-500">⭐</div>
        <div className="absolute top-1/3 right-1/3 text-2xl animate-bounce delay-1500">🌟</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <header className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <span className="text-6xl animate-bounce mr-4">🐕</span>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse">
              SmartDog
            </h1>
            <span className="text-6xl animate-bounce ml-4">😺</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            O seu pet pode salvar um animal perdido
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Crie esperança com uma simples foto.
          </p>

          {/* Stats Cards */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="happy-stat-card bg-gradient-to-br from-blue-100 to-blue-200">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-3xl">📷</span>
                <span className="text-3xl font-black text-blue-600">{petCount.toLocaleString()}</span>
              </div>
              <p className="text-blue-700 font-semibold">Pets Contribuindo</p>
            </div>
            
            <div className="happy-stat-card bg-gradient-to-br from-pink-100 to-pink-200">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-3xl animate-pulse">💖</span>
                <span className="text-3xl font-black text-pink-600">98%</span>
              </div>
              <p className="text-pink-700 font-semibold">Acurácia Alvo</p>
            </div>
            
            <div className="happy-stat-card bg-gradient-to-br from-yellow-100 to-yellow-200">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-3xl">🏆</span>
                <span className="text-3xl font-black text-yellow-600">∞</span>
              </div>
              <p className="text-yellow-700 font-semibold">Vidas Salvas</p>
            </div>
          </div>
        </header>

        {/* Roadmap Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              🗺️ Nosso Roadmap de Esperança
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada fase nos aproxima mais de reunir pets perdidos com suas famílias
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {roadmapPhases.map((phase, index) => (
              <div
                key={phase.id}
                className={`roadmap-phase-happy ${visiblePhases.includes(index) ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`happy-phase-card ${phase.bgColor} border-2 border-white shadow-xl`}>
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Phase Icon */}
                    <div className="flex-shrink-0">
                      <div className="happy-phase-icon bg-white shadow-lg">
                        <div className="text-2xl font-black text-gray-700 mb-1">
                          Fase {phase.id}
                        </div>
                        <div className="text-4xl">
                          {phase.icon}
                        </div>
                      </div>
                    </div>

                    {/* Phase Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            {phase.title}
                          </h3>
                          <p className="text-lg text-gray-700 mb-3">
                            {phase.subtitle}
                          </p>
                          <p className="text-gray-600">
                            {phase.description}
                          </p>
                        </div>
                        
                        <div className={`happy-status-badge ${phase.status}`}>
                          {phase.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                          {phase.status === 'in-progress' && <Clock className="w-4 h-4 animate-pulse" />}
                          {phase.status === 'upcoming' && <Star className="w-4 h-4" />}
                          <span className="text-sm font-bold">
                            {phase.status === 'in-progress' ? 'Em Progresso' : 
                             phase.status === 'completed' ? 'Concluído ✅' : 'Em Breve ⭐'}
                          </span>
                        </div>
                      </div>

                      {/* Phase Items */}
                      <div className="space-y-3">
                        {phase.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 hover:bg-white/80 transition-all duration-300 shadow-sm"
                          >
                            {getStatusIcon(item.status)}
                            <span className={`font-medium ${
                              item.status === 'completed' ? 'text-green-700' : 
                              item.status === 'in-progress' ? 'text-yellow-700' : 'text-gray-600'
                            }`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl animate-bounce mr-3">🌟</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-800">
                O futuro dos animais perdidos começa com você.
              </h2>
              <span className="text-4xl animate-bounce ml-3">🌟</span>
            </div>
            
            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              Cada foto que você contribui treina nossa IA para salvar mais vidas. 
              Seja parte desta revolução tecnológica com propósito social! 💝
            </p>

            <button
              onClick={handleContributeClick}
              className="happy-cta-button group"
            >
              <div className="flex items-center justify-center space-x-4">
                <span className="text-3xl group-hover:animate-bounce">📷</span>
                <span className="text-2xl font-black text-white">Contribuir com Imagens</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform text-white" />
              </div>
            </button>

            <div className="flex items-center justify-center mt-8 space-x-4">
              <span className="text-2xl animate-bounce">🐕</span>
              <span className="text-lg text-gray-600 font-semibold">
                Junte-se a {petCount.toLocaleString()} pets que já contribuíram!
              </span>
              <span className="text-2xl animate-bounce delay-300">😺</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className="text-3xl animate-pulse">💝</span>
              <span className="text-xl text-gray-700 font-semibold">
                Feito com amor para reunir famílias
              </span>
              <span className="text-3xl animate-pulse">💝</span>
            </div>
            
            <p className="text-gray-500 text-lg">
              © 2024 SmartDog. Tecnologia que salva vidas. 🐕💙😺
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;