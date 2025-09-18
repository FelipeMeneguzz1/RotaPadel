// Função para criar uma data local sem problemas de fuso horário
export function createLocalDate(dateString) {
  if (!dateString) return null;
  
  // Se a data já está no formato YYYY-MM-DD, criar diretamente
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  // Para outros formatos, usar o construtor normal
  return new Date(dateString);
}

// Função para formatar data para exibição no formato brasileiro
export function formatDateBR(dateString) {
  const date = createLocalDate(dateString);
  if (!date || isNaN(date.getTime())) return 'Data inválida';
  
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Função para obter a data de hoje no formato YYYY-MM-DD
export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Função para converter data para string no formato YYYY-MM-DD
export function dateToString(date) {
  if (!date) return null;
  
  const d = createLocalDate(date);
  if (!d || isNaN(d.getTime())) return null;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Função para verificar se uma data é hoje
export function isToday(dateString) {
  const today = getTodayDateString();
  return dateString === today;
}

// Função para verificar se uma data é no passado
export function isPastDate(dateString) {
  const date = createLocalDate(dateString);
  const today = createLocalDate(getTodayDateString());
  
  if (!date || !today) return false;
  
  // Comparar apenas a parte da data, ignorando horário
  return date < today;
}
