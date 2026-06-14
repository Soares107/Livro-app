import { useCallback, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '@/services/api';

type Livro = {
  id: number;
  titulo: string;
  autor: string;
  genero?: string;
  ano_publicacao?: number;
  paginas?: number;
  lido: number;
};

export default function HomeScreen() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const carregarLivros = async () => {
    try {
      const data = await api.listarLivros();
      setLivros(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { carregarLivros(); }, []));

  const confirmarDelete = (id: number, titulo: string) => {
    Alert.alert('Remover Livro', `Deseja remover "${titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          try {
            await api.deletarLivro(id);
            setLivros(prev => prev.filter(l => l.id !== id));
          } catch {
            Alert.alert('Erro', 'Não foi possível remover o livro.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#5C4DB1" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Minha Biblioteca</Text>
      <FlatList
        data={livros}
        keyExtractor={item => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregarLivros(); }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Nenhum livro cadastrado ainda.</Text>
            <Text style={styles.emptyHint}>Toque em + para adicionar!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.titulo} numberOfLines={1}>{item.titulo}</Text>
              <Text style={[styles.badge, item.lido ? styles.lido : styles.naoLido]}>
                {item.lido ? '✓ Lido' : '○ Pendente'}
              </Text>
            </View>
            <Text style={styles.autor}>✍️ {item.autor}</Text>
            {item.genero ? <Text style={styles.meta}>📖 {item.genero}{item.ano_publicacao ? ` · ${item.ano_publicacao}` : ''}</Text> : null}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => router.push({ pathname: '/modal', params: { livro: JSON.stringify(item) } })}
              >
                <Text style={styles.btnEditText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDelete} onPress={() => confirmarDelete(item.id, item.titulo)}>
                <Text style={styles.btnDeleteText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/modal')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3FF', padding: 16, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  titulo: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', flex: 1, marginRight: 8 },
  autor: { fontSize: 13, color: '#555', marginBottom: 4 },
  meta: { fontSize: 12, color: '#888' },
  badge: { fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  lido: { backgroundColor: '#D4EDDA', color: '#2D7A4F' },
  naoLido: { backgroundColor: '#FFF3CD', color: '#856404' },
  actions: { flexDirection: 'row', marginTop: 12, gap: 8 },
  btnEdit: { flex: 1, backgroundColor: '#EDE9FE', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  btnEditText: { color: '#5C4DB1', fontWeight: '600', fontSize: 13 },
  btnDelete: { flex: 1, backgroundColor: '#FEE2E2', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  btnDeleteText: { color: '#DC2626', fontWeight: '600', fontSize: 13 },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#5C4DB1', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 56 },
  emptyText: { fontSize: 16, color: '#555', marginTop: 12 },
  emptyHint: { fontSize: 13, color: '#999', marginTop: 4 },
});