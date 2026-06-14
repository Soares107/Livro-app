const BASE_URL = 'http://192.168.1.9:3000';

export const api = {
  async listarLivros() {
    const res = await fetch(`${BASE_URL}/livros`);
    if (!res.ok) throw new Error('Erro ao buscar livros');
    return res.json();
  },
  async criarLivro(dados: any) {
    const res = await fetch(`${BASE_URL}/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!res.ok) throw new Error('Erro ao criar livro');
    return res.json();
  },
  async atualizarLivro(id: number, dados: any) {
    const res = await fetch(`${BASE_URL}/livros/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!res.ok) throw new Error('Erro ao atualizar livro');
    return res.json();
  },
  async deletarLivro(id: number) {
    const res = await fetch(`${BASE_URL}/livros/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar livro');
    return res.json();
  },
};