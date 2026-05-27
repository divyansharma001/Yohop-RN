import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image as RNImage,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNearbyDeals } from '@/hooks/use-deals';
import { useEvents } from '@/hooks/use-events';
import { useLocation } from '@/hooks/use-location';
import type { Deal, PlatformEvent } from '@/services/types';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

type FeedItem = {
  id: string;
  images: string[];
  thumb: string;
  title: string;
  views: string;
  likes: string;
  off?: string;
  timer?: string;
  location: string;
  bounty: string;
  deal: string;
  kind: 'deal' | 'event';
  raw: Deal | PlatformEvent;
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80';
const EVENT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80';

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function timeUntil(dateStr: string | null): string | undefined {
  if (!dateStr) return undefined;
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return undefined;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h ${m}m`;
  return `${h}h ${m}m`;
}

function dealToFeedItem(d: Deal): FeedItem {
  const images = d.images && d.images.length > 0 ? d.images : [PLACEHOLDER];
  const merchantName = d.merchant?.businessName ?? d.title;
  const loc =
    d.merchant?.address && d.merchant?.city
      ? `${d.merchant.address}, ${d.merchant.city}`
      : d.merchant?.city ?? 'Nearby';
  return {
    id: d.id,
    kind: 'deal',
    images,
    thumb: d.merchant?.logo ?? images[0],
    title: merchantName,
    views: formatNumber(d.viewCount ?? 0),
    likes: formatNumber(d.likeCount ?? 0),
    off: d.discountPercentage ? `${Math.round(d.discountPercentage)}% OFF` : undefined,
    timer: timeUntil(d.startTime),
    location: loc,
    bounty: d.isBounty && d.bountyReward ? `$${Math.round(d.bountyReward)}` : '',
    deal: d.description ?? d.title,
    raw: d,
  };
}

function eventToFeedItem(e: PlatformEvent): FeedItem {
  const images =
    e.images && e.images.length > 0
      ? e.images
      : e.coverImage
        ? [e.coverImage]
        : [EVENT_PLACEHOLDER];
  const loc =
    e.venue && e.city ? `${e.venue} • ${e.city}` : (e.venue ?? e.city ?? 'Venue TBD');
  return {
    id: e.id,
    kind: 'event',
    images,
    thumb: e.merchant?.logo ?? images[0],
    title: e.title,
    views: '—',
    likes: '—',
    location: loc,
    bounty: '',
    deal: 'See More',
    raw: e,
  };
}

const FILTERS = ['Events', 'Bars', 'Retail'];

const FALLBACK_DEALS: Deal[] = [
  {
    id: 'fb-1',
    merchantId: 'fb-m1',
    merchant: {
      id: 'fb-m1',
      businessName: 'The Dead Rabbit',
      logo: null,
      address: '30 Water St',
      city: 'New York',
      latitude: 40.7033,
      longitude: -74.012,
    },
    title: 'Whiskey Hour',
    description: 'Half-priced whiskey flights tonight only',
    discountPercentage: 50,
    discountAmount: null,
    startTime: new Date(Date.now() + 2 * 3600_000).toISOString(),
    endTime: new Date(Date.now() + 6 * 3600_000).toISOString(),
    images: [
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&q=80',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=80',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200&q=80',
    ],
    isActive: true,
    isBounty: true,
    bountyReward: 50,
    isFlashSale: true,
    currentRedemptions: 57,
    maxRedemptions: 200,
    viewCount: 6500,
    likeCount: 24500,
  },
  {
    id: 'fb-2',
    merchantId: 'fb-m2',
    merchant: {
      id: 'fb-m2',
      businessName: 'Death & Co.',
      logo: null,
      address: '433 E 6th St',
      city: 'East Village',
      latitude: 40.7251,
      longitude: -73.9836,
    },
    title: 'Classic Pepperoni Night',
    description: 'Two-for-one pies all night long',
    discountPercentage: 30,
    discountAmount: null,
    startTime: new Date(Date.now() + 3600_000).toISOString(),
    endTime: new Date(Date.now() + 4 * 3600_000).toISOString(),
    images: [
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
    ],
    isActive: true,
    isBounty: false,
    bountyReward: null,
    isFlashSale: false,
    currentRedemptions: null,
    maxRedemptions: null,
    viewCount: 4200,
    likeCount: 18100,
  },
  {
    id: 'fb-3',
    merchantId: 'fb-m3',
    merchant: {
      id: 'fb-m3',
      businessName: 'Trick Dog',
      logo: null,
      address: '3010 20th St',
      city: 'San Francisco',
      latitude: 37.759,
      longitude: -122.413,
    },
    title: 'Gourmet Burger Fest',
    description: 'Limited combos this weekend',
    discountPercentage: 25,
    discountAmount: null,
    startTime: new Date(Date.now() + 24 * 3600_000).toISOString(),
    endTime: new Date(Date.now() + 30 * 3600_000).toISOString(),
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    ],
    isActive: true,
    isBounty: true,
    bountyReward: 40,
    isFlashSale: false,
    currentRedemptions: null,
    maxRedemptions: null,
    viewCount: 9100,
    likeCount: 31700,
  },
  {
    id: 'fb-4',
    merchantId: 'fb-m4',
    merchant: {
      id: 'fb-m4',
      businessName: 'Kimball House',
      logo: null,
      address: '303 E Howard Ave',
      city: 'Decatur',
      latitude: 33.7748,
      longitude: -84.295,
    },
    title: "Chef's Steakhouse Tasting",
    description: 'Five-course chef tasting menu',
    discountPercentage: 40,
    discountAmount: null,
    startTime: new Date(Date.now() + 5 * 3600_000).toISOString(),
    endTime: new Date(Date.now() + 9 * 3600_000).toISOString(),
    images: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
    ],
    isActive: true,
    isBounty: true,
    bountyReward: 75,
    isFlashSale: true,
    currentRedemptions: null,
    maxRedemptions: null,
    viewCount: 12000,
    likeCount: 45900,
  },
];

const FALLBACK_EVENTS: PlatformEvent[] = [
  {
    id: 'fb-e1',
    title: 'Sabrina Carpenter — Live in Brooklyn',
    type: 'PARTY',
    status: 'PUBLISHED',
    venue: 'Barclays Center',
    address: '620 Atlantic Ave',
    city: 'Brooklyn',
    state: 'NY',
    latitude: 40.6826,
    longitude: -73.9754,
    startDate: new Date(Date.now() + 7 * 86400_000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400_000 + 3 * 3600_000).toISOString(),
    capacity: 19000,
    images: [
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80',
    ],
    coverImage: null,
    description: null,
  },
  {
    id: 'fb-e2',
    title: 'Indie Rock Festival',
    type: 'FESTIVAL',
    status: 'PUBLISHED',
    venue: 'The Greek Theatre',
    address: '2700 N Vermont Ave',
    city: 'Los Angeles',
    state: 'CA',
    latitude: 34.1184,
    longitude: -118.2965,
    startDate: new Date(Date.now() + 14 * 86400_000).toISOString(),
    endDate: new Date(Date.now() + 14 * 86400_000 + 5 * 3600_000).toISOString(),
    capacity: 5900,
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80',
    ],
    coverImage: null,
    description: null,
  },
  {
    id: 'fb-e3',
    title: 'Taylor Swift Night',
    type: 'PARTY',
    status: 'PUBLISHED',
    venue: 'House of Blues',
    address: '329 N Dearborn St',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8889,
    longitude: -87.6294,
    startDate: new Date(Date.now() + 4 * 86400_000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400_000 + 3 * 3600_000).toISOString(),
    capacity: 1500,
    images: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80',
    ],
    coverImage: null,
    description: null,
  },
];

export default function ExploreScreen() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { location } = useLocation();
  const isEvents = activeFilter === 'Events';
  const dealsQuery = useNearbyDeals({
    latitude: location.latitude,
    longitude: location.longitude,
    radius: 50,
  });
  const eventsQuery = useEvents({ upcoming: true });

  const loading = isEvents ? eventsQuery.isLoading : dealsQuery.isLoading;

  const feed: FeedItem[] = useMemo(() => {
    if (isEvents) {
      const live = (eventsQuery.data ?? []).map(eventToFeedItem);
      return live.length > 0 ? live : FALLBACK_EVENTS.map(eventToFeedItem);
    }
    const live = (dealsQuery.data ?? []).map(dealToFeedItem);
    const deals = live.length > 0 ? live : FALLBACK_DEALS.map(dealToFeedItem);
    if (activeFilter === 'All') return deals;
    return deals.filter((f) => {
      const d = f.raw as Deal;
      const cat = d.merchant ? '' : '';
      return cat === activeFilter || f.deal.toLowerCase().includes(activeFilter.toLowerCase());
    });
  }, [isEvents, activeFilter, dealsQuery.data, eventsQuery.data]);

  const toggleLike = (id: string) =>
    setLiked((s) => ({ ...s, [id]: !s[id] }));
  const toggleFollow = (id: string) =>
    setFollowed((s) => ({ ...s, [id]: !s[id] }));
  const toggleExpand = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      {loading && feed.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#C4F27F" />
        </View>
      ) : (
        <FlatList
          data={feed}
          extraData={activeFilter}
          keyExtractor={(it) => it.id}
          pagingEnabled
          snapToInterval={SCREEN_H}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FeedCard
              item={item}
              liked={!!liked[item.id]}
              followed={!!followed[item.id]}
              expanded={!!expanded[item.id]}
              onLike={() => toggleLike(item.id)}
              onFollow={() => toggleFollow(item.id)}
              onExpand={() => toggleExpand(item.id)}
            />
          )}
        />
      )}

      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.topRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersRow}>
            <TouchableOpacity
              style={[styles.filterChip, styles.filterAll]}
              activeOpacity={0.8}
              onPress={() => setFiltersOpen((o) => !o)}>
              <Ionicons
                name="options-outline"
                size={14}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.filterText}>All</Text>
            </TouchableOpacity>
            {!filtersOpen && activeFilter !== 'All' && (
              <TouchableOpacity
                style={[styles.filterChip, styles.filterChipActive]}
                activeOpacity={0.8}
                onPress={() => setActiveFilter('All')}>
                <Text style={[styles.filterText, styles.filterTextActive]}>
                  {activeFilter}
                </Text>
                <Ionicons
                  name="close"
                  size={14}
                  color="#000"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            )}
            {filtersOpen &&
              FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterChip,
                    activeFilter === f && styles.filterChipActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setActiveFilter(f);
                    setFiltersOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === f && styles.filterTextActive,
                    ]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <View style={styles.topRight}>
            <TouchableOpacity style={styles.greenPill} activeOpacity={0.8}>
              <Ionicons name="location" size={14} color="#000" />
              <Ionicons name="chevron-down" size={12} color="#000" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.greenRound} activeOpacity={0.8}>
              <Ionicons name="search" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function FeedCard({
  item,
  liked,
  followed,
  expanded,
  onLike,
  onFollow,
  onExpand,
}: {
  item: FeedItem;
  liked: boolean;
  followed: boolean;
  expanded: boolean;
  onLike: () => void;
  onFollow: () => void;
  onExpand: () => void;
}) {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <View style={styles.card}>
      <FlatList
        data={item.images}
        keyExtractor={(uri, i) => `${item.id}-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setImageIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W))
        }
        renderItem={({ item: uri }) => (
          <RNImage source={{ uri }} style={styles.cardImage} resizeMode="cover" />
        )}
      />
      <View style={styles.sideActions}>
        <TouchableOpacity style={styles.sideButton} onPress={onLike} activeOpacity={0.8}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? '#E53935' : '#fff'}
          />
        </TouchableOpacity>
        <Text style={styles.sideLabel}>{item.likes}</Text>

        <TouchableOpacity style={[styles.sideButton, { marginTop: 14 }]}>
          <Ionicons name="share-social-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.sideLabel}>Share</Text>

        {!!item.bounty && <BlinkingBounty bounty={item.bounty} />}

        <View style={styles.thumbWrap}>
          {!!item.off && (
            <View style={styles.thumbLabel}>
              <Text style={styles.thumbLabelText}>{item.off}</Text>
            </View>
          )}
          <RNImage source={{ uri: item.thumb }} style={styles.thumbImage} />
        </View>

        <View style={styles.dots}>
          {item.images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === imageIndex && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.bottomWrap}>
        <View style={styles.bottomContent}>
          <View style={styles.viewsRow}>
            <Ionicons name="eye-outline" size={14} color="#fff" />
            <Text style={styles.viewsText}>{item.views}</Text>
            <TouchableOpacity
              style={[styles.followBtn, followed && styles.followBtnActive]}
              activeOpacity={0.8}
              onPress={onFollow}>
              <Text style={[styles.followText, followed && styles.followTextActive]}>
                {followed ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.titleRow}>
            <View style={styles.avatar} />
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </View>

          {item.kind === 'deal' && (
            <View style={styles.badgesRow}>
              {item.off && (
                <View style={styles.offBadge}>
                  <Text style={styles.offText}>{item.off}</Text>
                </View>
              )}
              {item.timer && (
                <View style={styles.timerBadge}>
                  <Ionicons name="time-outline" size={12} color="#2BB673" />
                  <Text style={styles.timerText}>Begins : {item.timer}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>

          <TouchableOpacity style={styles.dealRow} activeOpacity={0.7} onPress={onExpand}>
            <Text style={styles.dealText}>{item.deal}</Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color="#fff"
            />
          </TouchableOpacity>
          {expanded && (
            <Text style={styles.dealDetail}>
              {item.kind === 'event'
                ? 'Live performance with special guest artists. Grab your tickets before they sell out.'
                : "Enjoy exclusive savings during our happy hours. Tap Book or Buy to grab this deal before it's gone."}
            </Text>
          )}
          <View style={styles.progressBar}>
            {item.images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressSegment,
                  i === imageIndex && styles.progressSegmentActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.bookBuy}>
          <TouchableOpacity
            style={styles.bookBtn}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/book',
                params:
                  item.kind === 'event'
                    ? {
                        type: 'event',
                        eventId: item.id,
                        title: item.title,
                        image: item.images[0],
                      }
                    : {
                        dealId: item.id,
                        merchantId: (item.raw as Deal).merchantId,
                        title: item.title,
                      },
              })
            }>
            <Text style={styles.bookText}>Book</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyBtn}
            activeOpacity={0.8}
            onPress={() => {
              if (item.kind === 'event') {
                router.push({
                  pathname: '/event',
                  params: { id: item.id, title: item.title },
                });
              } else {
                router.push({
                  pathname: '/deal',
                  params: {
                    dealId: item.id,
                    merchantId: (item.raw as Deal).merchantId,
                  },
                });
              }
            }}>
            <Text style={styles.buyText}>{item.kind === 'event' ? 'View' : 'Buy'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function BlinkingBounty({ bounty }: { bounty: string }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.bountyWrap, { opacity }]}>
      <View style={styles.bountyBadge}>
        <Text style={styles.bountyValue}>{bounty}</Text>
        <Text style={styles.bountyLabel}>Bounty</Text>
      </View>
    </Animated.View>
  );
}

const DARK = 'rgba(0,0,0,0.55)';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  centeredText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: '#000',
  },
  cardImage: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  filtersScroll: {
    flex: 1,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    backgroundColor: DARK,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  filterAll: {
    paddingHorizontal: 12,
  },
  filterChipActive: {
    backgroundColor: '#C4F27F',
    borderColor: '#C4F27F',
  },
  filterText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#000', fontWeight: '600' },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: '#C4F27F',
  },
  greenRound: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#C4F27F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideActions: {
    position: 'absolute',
    right: 12,
    top: SCREEN_H * 0.32,
    alignItems: 'center',
  },
  sideButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  bountyWrap: { marginTop: 14 },
  bountyBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#C4F27F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bountyValue: { color: '#C4F27F', fontSize: 13, fontWeight: '700', lineHeight: 14 },
  bountyLabel: { color: '#C4F27F', fontSize: 8, fontWeight: '600' },
  thumbWrap: {
    marginTop: 14,
    alignItems: 'center',
  },
  thumbLabel: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  thumbLabelText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  thumbImage: {
    width: 54,
    height: 54,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  dots: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 10,
  },
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 110,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bottomContent: { flex: 1 },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  viewsText: { color: '#fff', fontSize: 12, marginRight: 8 },
  followBtn: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  followBtnActive: {
    backgroundColor: '#C4F27F',
    borderColor: '#C4F27F',
  },
  followText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  followTextActive: { color: '#000', fontWeight: '600' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C4F27F',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  offBadge: {
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2BB673',
  },
  timerText: { color: '#2BB673', fontSize: 11, fontWeight: '600' },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  locationText: { color: '#fff', fontSize: 12 },
  dealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dealText: { color: '#fff', fontSize: 12, opacity: 0.9 },
  dealDetail: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.85,
    marginTop: 6,
    lineHeight: 15,
    maxWidth: '90%',
  },
  progressBar: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
    width: '92%',
  },
  progressSegment: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 1,
  },
  progressSegmentActive: {
    backgroundColor: '#fff',
    height: 3,
  },
  bookBuy: {
    gap: 8,
    marginLeft: 8,
    marginBottom: 4,
  },
  bookBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  buyBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
