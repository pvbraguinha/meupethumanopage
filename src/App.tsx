import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Brain, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Heart,
  Camera,
  Shield,
  Zap,
  Users,
  Trophy,
  ArrowRight,
  Star
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
  color: string;
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
    }, 300);

    return () => clearInterval(timer);
  }, []);

  const roadmapPhases: RoadmapPhase[] = [
    {
      id: 1,
      title: "Resgate o Futuro dos Pets",
      subtitle: "Coleta pública de imagens da comunidade",
      description: "Construindo a maior base de dados de focinhos da Europa e América Latina",
      icon: <Rocket className="w-8 h-8" />,
      status: 'in-progress',
      color: 'from-blue-500 to-cyan-400',
      items: [
        { text: "Uploads feitos por tutores e ONGs", status: 'completed' },
        { text: "Criação da maior base de focinhos da Europa e América Latina", status: 'in-progress' },
        { text: "Treinamento do modelo de IA", status: 'in-progress' },
        { text: "Acurácia de 98% no reconhecimento facial e de focinho", status: 'upcoming' }
      ]
    },
    {
      id: 2,
      title: "Treine a Inteligência",
      subtitle: "Lançamento do MVP com tecnologia de reconhecimento",
      description: "Sistema funcional para identificação precisa de pets perdidos",
      icon: <Brain className="w-8 h-8" />,
      status: 'completed',
      color: 'from-green-500 to-emerald-400',
      items: [
        { text: "Backend Laravel + API funcional", status: 'completed' },
        { text: "Upload de imagens direto no S3", status: 'completed' },
        { text: "Primeiros testes com ONGs parceiras", status: 'completed' }
      ]
    },
    {
      id: 3,
      title: "Conexão Global",
      subtitle: "Expansão para prefeituras, clínicas e ONGs",
      description: "Democratizando o acesso à tecnologia de reconhecimento",
      icon: <Globe className="w-8 h-8" />,
      status: 'upcoming',
      color: 'from-purple-500 to-pink-400',
      items: [
        { text: "Sistema aberto ao público", status: 'upcoming' },
        { text: "Parcerias com iniciativas públicas e privadas", status: 'upcoming' }
      ]
    },
    {
      id: 4,
      title: "SmartDog DAO?",
      subtitle: "Sistema de recompensas para a comunidade",
      description: "Reconhecendo quem contribui para salvar vidas",
      icon: <Sparkles className="w-8 h-8" />,
      status: 'upcoming',
      color: 'from-yellow-500 to-orange-400',
      items: [
        { text: "Recompensas por imagens úteis", status: 'upcoming' },
        { text: "Reconhecimento via NFTs não-transferíveis", status: 'upcoming' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleContributeClick = () => {
    // Redirecionar para a página de upload (você pode ajustar a URL)
    window.location.href = '/upload'; // ou usar React Router se tiver
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-pattern"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-cyan-400 mr-4 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-black neon-glow bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              SmartDog
            </h1>
            <Zap className="w-12 h-12 text-yellow-400 ml-4 animate-bounce" />
          </div>
          
          <p className="text-2xl md:text-3xl font-bold text-gray-300 mb-6">
            🚀 Roadmap Épico para o Futuro dos Pets
          </p>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Tecnologia de reconhecimento facial e de focinho para reunir animais perdidos com suas famílias
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="crypto-stat-card">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-cyan-400" />
                <span className="text-2xl font-bold text-cyan-400">{petCount.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-400">Pets Contribuindo</p>
            </div>
            
            <div className="crypto-stat-card">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
                <span className="text-2xl font-bold text-pink-400">98%</span>
              </div>
              <p className="text-sm text-gray-400">Acurácia Alvo</p>
            </div>
            
            <div className="crypto-stat-card">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">∞</span>
              </div>
              <p className="text-sm text-gray-400">Vidas Salvas</p>
            </div>
          </div>
        </header>

        {/* Roadmap */}
        <section className="mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 neon-glow">
            🗺️ Roadmap to the Moon
          </h2>

          <div className="max-w-6xl mx-auto">
            {roadmapPhases.map((phase, index) => (
              <div
                key={phase.id}
                className={`roadmap-phase ${visiblePhases.includes(index) ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Phase Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className={`phase-icon bg-gradient-to-br ${phase.color}`}>
                      <span className="text-2xl font-black text-white">
                        {phase.id}
                      </span>
                      <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-2">
                        {phase.icon}
                      </div>
                    </div>
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1">
                    <div className="crypto-card">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            🚩 Fase {phase.id} — "{phase.title}"
                          </h3>
                          <p className="text-lg text-gray-300 mb-4">
                            {phase.subtitle}
                          </p>
                          <p className="text-gray-400">
                            {phase.description}
                          </p>
                        </div>
                        
                        <div className={`status-badge ${phase.status}`}>
                          {phase.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                          {phase.status === 'in-progress' && <Clock className="w-4 h-4 animate-pulse" />}
                          {phase.status === 'upcoming' && <Star className="w-4 h-4" />}
                          <span className="text-sm font-semibold capitalize">
                            {phase.status === 'in-progress' ? 'Em Progresso' : 
                             phase.status === 'completed' ? 'Concluído' : 'Em Breve'}
                          </span>
                        </div>
                      </div>

                      {/* Phase Items */}
                      <div className="space-y-3">
                        {phase.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            {getStatusIcon(item.status)}
                            <span className={`${item.status === 'completed' ? 'text-green-300' : 
                                           item.status === 'in-progress' ? 'text-yellow-300' : 'text-gray-400'}`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < roadmapPhases.length - 1 && (
                  <div className="roadmap-connector"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-8 neon-glow">
              O futuro dos animais perdidos começa com você.
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Cada foto que você contribui treina nossa IA para salvar mais vidas. 
              Seja parte desta revolução tecnológica com propósito social.
            </p>

            <button
              onClick={handleContributeClick}
              className="crypto-cta-button group"
            >
              <div className="flex items-center justify-center space-x-4">
                <Camera className="w-8 h-8 group-hover:animate-pulse" />
                <span className="text-2xl font-black">Contribuir com Imagens</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
              <span className="text-lg text-gray-400">
                Feito com amor para reunir famílias
              </span>
              <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 SmartDog. Tecnologia que salva vidas. 🐕💙😺
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;