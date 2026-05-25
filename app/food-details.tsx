import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMerchantMenu } from '@/hooks/use-merchant';
import type { MenuItem } from '@/services/types';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80';

export default function FoodDetailsScreen() {
  const router = useRouter();
  const { merchantId } = useLocalSearchParams<{ merchantId?: string }>();
  const [query, setQuery] = useState('');
  const menuQ = useMerchantMenu(merchantId);

  const filtered = useMemo<MenuItem[]>(() => {
    const items = menuQ.data ?? [];
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.description ?? '').toLowerCase().includes(q),
    );
  }, [menuQ.data, query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dishes"
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {menuQ.isLoading ? (
        <ActivityIndicator color="#000" style={{ marginTop: 40 }} />
      ) : menuQ.error ? (
        <Text style={styles.empty}>
          {(menuQ.error as Error)?.message ?? 'Failed to load menu'}
        </Text>
      ) : filtered.length === 0 ? (
        <Text style={styles.empty}>
          {query ? 'No dishes match your search.' : 'No dishes available.'}
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}>
          {filtered.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function FoodCard({ item }: { item: MenuItem }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      <Image source={{ uri: item.image ?? FALLBACK_IMG }} style={styles.cardImage} />
      <View style={styles.cardOverlay} />
      <View style={styles.cardFooter}>
        <View style={styles.vegBadge}>
          <View style={styles.vegDot} />
        </View>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const GAP = 8;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 42,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#000',
    padding: 0,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    paddingTop: 40,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  card: {
    width: '48.5%',
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardFooter: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vegBadge: {
    width: 12,
    height: 12,
    borderWidth: 1.4,
    borderColor: '#2BB673',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  vegDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2BB673',
  },
  cardName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  cardPrice: {
    color: '#C4F27F',
    fontSize: 12,
    fontWeight: '700',
  },
});
