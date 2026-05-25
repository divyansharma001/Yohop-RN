import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = 'All' | 'Activity' | 'Offers';

type Notification =
  | {
      id: string;
      kind: 'friend_checkin';
      title: 'Friend Check-in';
      avatar: string;
      friend: string;
      venue: string;
      time: string;
      tab: 'Activity';
    }
  | {
      id: string;
      kind: 'happy_hour';
      title: 'Happy Hour Alert';
      image: string;
      hours: number;
      venue: string;
      time: string;
      tab: 'Offers';
    }
  | {
      id: string;
      kind: 'social';
      title: 'Social';
      avatars: string[];
      friend: string;
      others: number;
      time: string;
      tab: 'Activity';
    }
  | {
      id: string;
      kind: 'booking';
      title: 'Booking';
      venue: string;
      timeAt: string;
      time: string;
      tab: 'Activity';
    };

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    kind: 'friend_checkin',
    title: 'Friend Check-in',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    friend: 'Riya',
    venue: 'Premium Omakase Experience',
    time: '2m ago',
    tab: 'Activity',
  },
  {
    id: '2',
    kind: 'happy_hour',
    title: 'Happy Hour Alert',
    image:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80',
    hours: 1,
    venue: 'East Wing Bar',
    time: '1h ago',
    tab: 'Offers',
  },
  {
    id: '3',
    kind: 'social',
    title: 'Social',
    avatars: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    ],
    friend: 'Aryan',
    others: 3,
    time: '4h ago',
    tab: 'Activity',
  },
  {
    id: '4',
    kind: 'booking',
    title: 'Booking',
    venue: 'The Botanist',
    timeAt: '8 PM',
    time: 'Yesterday',
    tab: 'Activity',
  },
];

export default function NotificationsScreen() {
  const [tab, setTab] = useState<Tab>('All');

  const filtered =
    tab === 'All' ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.tab === tab);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.tabsRow}>
        {(['All', 'Activity', 'Offers'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            activeOpacity={0.85}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        {filtered.map((n) => (
          <NotificationCard key={n.id} n={n} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationCard({ n }: { n: Notification }) {
  return (
    <View style={styles.card}>
      <NotificationIcon n={n} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{n.title}</Text>
        <Text style={styles.cardText}>
          {renderBody(n)}
        </Text>
      </View>
      <Text style={styles.cardTime}>{n.time}</Text>
    </View>
  );
}

function NotificationIcon({ n }: { n: Notification }) {
  if (n.kind === 'friend_checkin') {
    return (
      <View style={styles.iconWrap}>
        <Image source={{ uri: n.avatar }} style={styles.avatar} />
        <View style={styles.checkinDot}>
          <Ionicons name="location" size={8} color="#000" />
        </View>
      </View>
    );
  }
  if (n.kind === 'happy_hour') {
    return (
      <Image source={{ uri: n.image }} style={styles.thumb} />
    );
  }
  if (n.kind === 'social') {
    return (
      <View style={styles.iconWrap}>
        <Image source={{ uri: n.avatars[0] }} style={styles.avatar} />
        <View style={styles.plusBadge}>
          <Text style={styles.plusBadgeText}>+{n.others}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.iconWrap, styles.bookingIcon]}>
      <Ionicons name="checkmark" size={20} color="#C4F27F" />
    </View>
  );
}

function renderBody(n: Notification): React.ReactNode {
  if (n.kind === 'friend_checkin') {
    return (
      <>
        <Text style={styles.bold}>{n.friend}</Text> checked into{' '}
        <Text style={styles.bold}>{n.venue}</Text>
      </>
    );
  }
  if (n.kind === 'happy_hour') {
    return (
      <>
        Happy Hour starts in {n.hours}h at <Text style={styles.bold}>{n.venue}</Text>. Grab your spot!
      </>
    );
  }
  if (n.kind === 'social') {
    return (
      <>
        <Text style={styles.bold}>{n.friend}</Text> and {n.others} others liked your recent check-in
      </>
    );
  }
  return (
    <>
      Your table at <Text style={styles.bold}>{n.venue}</Text> is confirmed for {n.timeAt}.
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tabActive: {
    backgroundColor: '#C4F27F',
    borderColor: '#C4F27F',
  },
  tabText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#000',
  },
  list: {
    paddingHorizontal: 14,
    paddingBottom: 110,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  iconWrap: {
    position: 'relative',
    width: 42,
    height: 42,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  thumb: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  bookingIcon: {
    backgroundColor: 'rgba(196,242,127,0.15)',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkinDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C4F27F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#141414',
  },
  plusBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    minWidth: 22,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: '#C4F27F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#141414',
  },
  plusBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
  },
  cardBody: {
    flex: 1,
    paddingTop: 2,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  cardText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    lineHeight: 17,
  },
  bold: {
    color: '#fff',
    fontWeight: '700',
  },
  cardTime: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 2,
  },
});
