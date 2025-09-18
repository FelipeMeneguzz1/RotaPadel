// Função para debug de datas - pode ser removida após confirmação
export function debugDateConversion(dateString) {
  console.log('=== DEBUG DE CONVERSÃO DE DATA ===');
  console.log('Data original:', dateString);
  
  // Método antigo (problemático)
  const oldMethod = new Date(dateString);
  console.log('Método antigo (new Date):', oldMethod);
  console.log('Método antigo - toString():', oldMethod.toString());
  console.log('Método antigo - toLocaleDateString():', oldMethod.toLocaleDateString('pt-BR'));
  
  // Método novo (corrigido)
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    const newMethod = new Date(year, month - 1, day);
    console.log('Método novo (local):', newMethod);
    console.log('Método novo - toString():', newMethod.toString());
    console.log('Método novo - toLocaleDateString():', newMethod.toLocaleDateString('pt-BR'));
    
    console.log('Diferença em dias:', Math.floor((oldMethod - newMethod) / (1000 * 60 * 60 * 24)));
  }
  
  console.log('================================');
}
