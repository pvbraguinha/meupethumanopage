import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Heart, 
  Users, 
  ArrowRight,
  CheckCircle,
  Clock,
  Brain,
  Globe,
  Award,
  Zap,
  Target
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
    }, 600);

    return () => clearInterval(timer);
  }, []);

  const roadmapPhases: RoadmapPhase[] = [
    {
      id: 1,
      title: "Resgate o Futuro dos Pets perdidos",
      subtitle: "Contribua enviando foto do seu pet",
      description: "As imagens enviadas serão utilizadas para treinar IA a reconhecer focinhos.",
      status: 'completed',
      icon: <Camera className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      items: [
        { text: "Plataforma de upload desenvolvida", status: 'completed' },
        { text: "Sistema de validação implementado", status: 'completed' },
        { text: "Parcerias com ONGs estabelecidas", status: 'completed' }
      ]
    },
    {
      id: 2,
      title: "Lançamento MVP",
      subtitle: "Disponibilização gratuita de IA para reconhecimento facial e focinho de cães e gatos com acurácia de 99%",
      description: "Redução do número de animais nas ruas no mundo todo",
      status: 'in-progress',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      items: [
        { text: "Arquitetura do modelo definida", status: 'completed' },
        { text: "Treinamento inicial em andamento", status: 'in-progress' },
        { text: "Testes de acurácia", status: 'in-progress' }
      ]
    },
    {
      id: 3,
      title: "Conexão Global",
      subtitle: "Criação de medidas e prevenção de risco à saúde pública",
      description: "Diminuição do número de zoonoses. Zero animais nas ruas",
      status: 'upcoming',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      items: [
        { text: "API pública disponível", status: 'upcoming' },
        { text: "Integração com sistemas existentes", status: 'upcoming' },
        { text: "Programa de certificação", status: 'upcoming' }
      ]
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
            <Zap className="w-4 h-4" />
            <span>Em Andamento</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            <span>Planejado</span>
          </div>
        );
    }
  };

  const handleContributeClick = () => {
    // Redirecionar para a página de upload
    window.location.href = '/upload';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target className="w-4 h-4" />
              <span>Roadmap de Desenvolvimento</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              Smartdog
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              O seu pet pode salvar um animal perdido
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Crie esperança com uma simples foto.
            </p>
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
        <section className="max-w-6xl mx-auto space-y-8">
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
                    
                    <p className="text-lg text-gray-600 mb-4 font-medium">
                      {phase.subtitle}
                    </p>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {phase.description}
                    </p>

                    {/* Phase Items */}
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center mt-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">
              Faça Parte dessa campanha
            </h2>
            
            <p className="text-xl mb-10 leading-relaxed opacity-90">
              A sua ajuda pode salvar um animal perdido.
            </p>

            <button
              onClick={handleContributeClick}
              className="professional-cta-button group"
            >
              <div className="flex items-center justify-center space-x-3">
                <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold">Contribuir com Imagens</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <div className="flex items-center justify-center mt-8 space-x-2 opacity-80">
              <Users className="w-5 h-5" />
              <span className="font-medium">
                {petCount.toLocaleString()} pets já contribuíram para esta causa
              </span>
            </div>
          </div>
        </section>

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