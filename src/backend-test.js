// Teste simples do backend sem usar DOM
async function testBackendCall() {
  console.log('🧪 TESTE DO BACKEND INICIADO');
  console.log('Endpoint:', 'https://smartdog-backend-vlm0.onrender.com/transform-pet');
  
  try {
    // Criar um blob de imagem JPEG simples (pixel vermelho 1x1)
    const imageData = new Uint8Array([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x00, 0xFF, 0xD9
    ]);
    
    const imageBlob = new Blob([imageData], { type: 'image/jpeg' });
    const testFile = new File([imageBlob], 'test-pet.jpg', { type: 'image/jpeg' });
    
    console.log('📁 Arquivo de teste criado:', {
      name: testFile.name,
      size: testFile.size,
      type: testFile.type
    });
    
    // Preparar FormData
    const formData = new FormData();
    formData.append('frontal', testFile);
    formData.append('session', 'teste-bolt');
    formData.append('breed', 'Labrador');
    formData.append('sex', 'macho');
    formData.append('age', '2 anos');
    formData.append('especie', 'cachorro');
    
    console.log('📤 Dados sendo enviados:');
    console.log('  frontal: File(test-pet.jpg, ' + testFile.size + ' bytes)');
    console.log('  session: teste-bolt');
    console.log('  breed: Labrador');
    console.log('  sex: macho');
    console.log('  age: 2 anos');
    console.log('  especie: cachorro');
    
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
    console.log('📋 Headers da resposta:');
    
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
      console.log('  ' + key + ':', value);
    });
    
    // Verificar Content-Type
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    let responseData;
    try {
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('✅ Resposta JSON recebida:', responseData);
      } else {
        const textResponse = await response.text();
        console.log('📝 Resposta em texto:', textResponse);
        responseData = { raw_response: textResponse };
      }
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse da resposta:', parseError);
      const rawText = await response.text();
      console.log('📝 Resposta bruta:', rawText);
      responseData = { parse_error: parseError.message, raw_response: rawText };
    }
    
    // Análise detalhada
    console.log('\n🔍 ANÁLISE DETALHADA:');
    console.log('Status Code:', response.status);
    console.log('Status OK:', response.ok);
    
    if (response.status === 200) {
      console.log('✅ SUCESSO - Requisição processada');
      
      if (responseData && typeof responseData === 'object') {
        console.log('🖼️ Campos encontrados na resposta:');
        Object.keys(responseData).forEach(key => {
          console.log('  - ' + key + ':', typeof responseData[key]);
          if (key.includes('image') || key.includes('url')) {
            console.log('    Valor:', responseData[key]);
          }
        });
        
        // Verificar campos específicos do DALL·E
        if (responseData.composite_image) {
          console.log('🎨 composite_image encontrado:', responseData.composite_image);
        }
        if (responseData.transformed_image) {
          console.log('🎨 transformed_image encontrado:', responseData.transformed_image);
        }
        if (responseData.prompt_used) {
          console.log('📝 prompt_used:', responseData.prompt_used);
        }
      }
    } else if (response.status === 422) {
      console.log('❌ ERRO 422 - Dados inválidos');
      console.log('Possíveis causas:');
      console.log('- Campos obrigatórios faltando');
      console.log('- Formato de dados incorreto');
      console.log('- Validação falhou no backend');
    } else if (response.status === 500) {
      console.log('❌ ERRO 500 - Erro interno do servidor');
    } else if (response.status === 0) {
      console.log('❌ ERRO DE REDE - Possível problema de CORS');
    } else {
      console.log(`❌ ERRO ${response.status} - Status inesperado`);
    }
    
    return {
      success: response.ok,
      status: response.status,
      headers: headers,
      data: responseData,
      duration: duration
    };
    
  } catch (error) {
    console.error('💥 ERRO NA REQUISIÇÃO:', error);
    
    // Análise do tipo de erro
    if (error.name === 'TypeError') {
      if (error.message.includes('Failed to fetch')) {
        console.log('🚫 ERRO DE CONECTIVIDADE');
        console.log('Possíveis causas:');
        console.log('1. Backend offline');
        console.log('2. Problema de CORS');
        console.log('3. URL incorreta');
        console.log('4. Firewall/proxy bloqueando');
      } else if (error.message.includes('NetworkError')) {
        console.log('🌐 ERRO DE REDE');
      }
    }
    
    return {
      success: false,
      error: error.message,
      errorType: error.name,
      stack: error.stack
    };
  }
}

// Executar o teste
console.log('🎯 Iniciando teste do backend...');
testBackendCall().then(result => {
  console.log('\n🏁 RESULTADO FINAL:');
  console.log('Success:', result.success);
  console.log('Status:', result.status);
  if (result.error) {
    console.log('Error:', result.error);
  }
  if (result.data) {
    console.log('Data keys:', Object.keys(result.data));
  }
  console.log('\n📋 Resultado completo:', result);
});