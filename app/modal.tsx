import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Switch, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '@/services/api';

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const livroExistente = params.livro ? JSON.parse(params.livro as string) : null;
  const editando = !!livroExistente;

  const [titulo, setTitulo] = useState(livroExistente?.titulo || '');
  const [autor, setAutor] = useState(livroExistente?.autor || '');
  const [genero, setGenero] = useState(livroExistente?.genero || '');
  const [ano, setAno] = useState(livroExistente?.ano_publicacao ? String(livroExistente.ano_publicacao) : '');
  const [paginas, setPaginas] = useState(livroExistente?.paginas ? String(livroExistente.paginas) : '');
  const [lido, setLido] = useState(!!livroExistente?.lido);
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    if (!titulo.trim() || !autor.trim()) {
      Alert.alert('Atenção', 'Título e autor são obrigatórios.');
      return;
    }
    setSalvando(true);
    const dados = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero: genero.trim() || null,
      ano_publicacao: ano ? parseInt(ano) : null,
      paginas: paginas ? parseInt(paginas) : null,
      lido,
    };
    try {
      if (editando) {
        await api.atualizarLivro(livroExistente.id, dados);
        Alert.alert('Sucesso', 'Livro atualizado!', [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        await api.criarLivro(dados);
        Alert.alert('Sucesso', 'Livro cadastrado!', [{ text: 'OK', onPress: () => router.back() }]);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.titulo}>{editando ? '✏️ Editar Livro' : '➕ Novo Livro'}</Text>

        <Campo label="Título *" value={titulo} onChangeText={setTitulo} placeholder="Ex: Dom Casmurro" />
        <Campo label="Autor *" value={autor} onChangeText={setAutor} placeholder="Ex: Machado de Assis" />
        <Campo label="Gênero" value={genero} onChangeText={setGenero} placeholder="Ex: Romance, Ficção..." />
        <Campo label="Ano de Publicação" value={ano} onChangeText={setAno} placeholder="Ex: 1899" keyboardType="numeric" />
        <Campo label="Número de Páginas" value={paginas} onChangeText={setPaginas} placeholder="Ex: 256" keyboardType="numeric" />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Já li este livro</Text>
          <Switch value={lido} onValueChange={setLido} trackColor={{ true: '#5C4DB1' }} />
        </View>

        <TouchableOpacity style={styles.btnSalvar} onPress={salvar} disabled={salvando}>
          {salvando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnSalvarText}>{editando ? 'Salvar Alterações' : 'Cadastrar Livro'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnCancelar} onPress={() => router.back()}>
          <Text style={styles.btnCancelarText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({ label, value, onChangeText, placeholder, keyboardType }: any) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3FF', padding: 20 },
  titulo: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 24, marginTop: 16 },
  campo: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15, color: '#1A1A2E',
    borderWidth: 1, borderColor: '#E0D9FF',
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    marginBottom: 24, borderWidth: 1, borderColor: '#E0D9FF',
  },
  switchLabel: { fontSize: 15, color: '#1A1A2E', fontWeight: '500' },
  btnSalvar: {
    backgroundColor: '#5C4DB1', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', elevation: 4, marginBottom: 12,
  },
  btnSalvarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnCancelar: {
    borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#5C4DB1',
  },
  btnCancelarText: { color: '#5C4DB1', fontSize: 16, fontWeight: '600' },
});