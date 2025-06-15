// Função para testar a integração com o backend
async function testBackendIntegration() {
  console.log('🧪 INICIANDO TESTE DE INTEGRAÇÃO COM BACKEND');
  console.log('Endpoint:', 'https://smartdog-backend-vlm0.onrender.com/transform-pet');
  
  try {
    // Criar uma imagem de teste (pixel transparente 1x1)
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Desenhar um quadrado colorido simples
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#4ECDC4';
    ctx.fillRect(25, 25, 50, 50);
    
    // Converter canvas para blob
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });
    
    // Criar arquivo de teste
    const testFile = new File([blob], 'test-pet.jpg', { type: 'image/jpeg' });
    
    console.log('📁 Arquivo de teste criado:', {
      name: testFile.name,
      size: testFile.size,
      type: testFile.type
    });
    
    // Preparar FormData
    const formData = new FormData();
    formData.append('frontal', testFile);
    formData.append('session', 'teste_' + Date.now());
    formData.append('breed', 'Poodle');
    formData.append('sex', 'fêmea');
    formData.append('age', '2 anos');
    formData.append('especie', 'cachorro');
    
    console.log('📤 Dados sendo enviados:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }
    
    console.log('🚀 Enviando requisição...');
    const startTime = Date.now();
    
    const response = await fetch('https://smartdog-backend-vlm0.onrender.com/transform-pet', {
      method: 'POST',
      body: formData,
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('⏱️ Tempo de resposta:', duration + 'ms');
    console.log('📊 Status HTTP:', response.status);
    console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()));
    
    // Verificar se a resposta é JSON
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    let responseData;
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
      console.log('✅ Resposta JSON recebida:', responseData);
    } else {
      const textResponse = await response.text();
      console.log('📝 Resposta em texto:', textResponse);
      responseData = textResponse;
    }
    
    // Análise detalhada da resposta
    console.log('\n🔍 ANÁLISE DA RESPOSTA:');
    console.log('Status Code:', response.status);
    
    if (response.status === 200) {
      console.log('✅ SUCESSO - Requisição processada com sucesso');
      
      if (typeof responseData === 'object') {
        console.log('🖼️ Campos de imagem encontrados:');
        if (responseData.composite_image) {
          console.log('  - composite_image:', responseData.composite_image);
        }
        if (responseData.transformed_image) {
          console.log('  - transformed_image:', responseData.transformed_image);
        }
        if (responseData.prompt_used) {
          console.log('  - prompt_used:', responseData.prompt_used);
        }
        
        console.log('📋 Todos os campos da resposta:', Object.keys(responseData));
      }
    } else if (response.status === 422) {
      console.log('❌ ERRO 422 - Dados inválidos ou campos obrigatórios faltando');
    } else if (response.status === 500) {
      console.log('❌ ERRO 500 - Erro interno do servidor');
    } else {
      console.log(`❌ ERRO ${response.status} - Status não esperado`);
    }
    
    return {
      success: response.ok,
      status: response.status,
      data: responseData,
      duration: duration
    };
    
  } catch (error) {
    console.error('💥 ERRO NA REQUISIÇÃO:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.log('🚫 POSSÍVEL ERRO DE CORS ou CONECTIVIDADE');
      console.log('Verifique se:');
      console.log('1. O backend está rodando');
      console.log('2. O CORS está configurado corretamente');
      console.log('3. A URL está correta');
    }
    
    return {
      success: false,
      error: error.message,
      type: error.name
    };
  }
}

// Executar o teste automaticamente
console.log('🎯 Executando teste de integração...');
testBackendIntegration().then(result => {
  console.log('\n🏁 RESULTADO FINAL DO TESTE:', result);
});