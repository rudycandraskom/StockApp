import database from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  TextInput,
  useColorScheme,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  const [lastUpdate, setLastUpdate] = useState('');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const ref = database().ref('/stokFinal');
    ref.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setLastUpdate(data.lastUpdate || '');
        const listBarang = data.listBarang || {};
        const list = Object.keys(listBarang).map(key => ({
          id: key,
          ...listBarang[key],
        }));
        setItems(list);
      }
    });
    return () => ref.off();
  }, []);

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.namaProduk.toLowerCase().includes(query) ||
      item.kodeProduk.toLowerCase().includes(query)
    );
  });

  const renderItem = ({ item }) => {
    const isStokKosong = item.sisaStok === '0 BOX\n0 ROLL';

    const cardColors = isStokKosong
      ? isDark ? ['#d73636ff', '#880e4f'] : ['#f87c88ff', '#ff82adff']
      : isDark ? ['#3976bdff', '#0d47a1'] : ['#e3f2fd', '#bbdefb'];

    const boxColors = isStokKosong
      ? isDark ? ['#e95050ff', '#c62828'] : ['#ef5656ff', '#c62828']
      : isDark ? ['#419af3ff', '#0d47a1'] : ['#bbdefb', '#90caf9'];

    const textColor = isStokKosong
      ? isDark ? '#fff' : '#ffffffff'
      : isDark ? '#e3f2fd' : '#0d47a1';

    return (
      <LinearGradient colors={cardColors} style={styles.card}>
        <Text style={[styles.kode, { color: textColor }]}>{item.kodeProduk}</Text>
        <View style={styles.row}>
          <Text style={[styles.nama, { color: textColor }]}>{item.namaProduk}</Text>
          <LinearGradient colors={boxColors} style={styles.stokBox}>
            <Text style={[styles.stokText, { color: textColor }]}>{item.sisaStok}</Text>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View
      style={[
        styles.safeArea,
        {
          backgroundColor: isDark ? '#0d0d0d' : '#ffffff',
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <StatusBar
        backgroundColor={isDark ? '#0d0d0d' : '#ffffff'}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <Text style={[styles.title, { color: isDark ? '#90caf9' : '#1565c0' }]}>
            Stock App
          </Text>
        </View>

        <Text style={[styles.subtitle, { fontWeight: 'bold', color: isDark ? '#bbdefb' : '#555' }]}>
          🕒 Last Update: {lastUpdate}
        </Text>

        <View
          style={[
            styles.searchWrapper,
            {
              backgroundColor: isDark ? '#1c1c1c' : '#f0f0f0',
              borderColor: isDark ? '#444' : '#ccc',
            },
          ]}
        >
          <Text style={[styles.searchIcon, { color: isDark ? '#90caf9' : '#666' }]}>🔍</Text>
          <TextInput
            style={[
              styles.searchInput,
              {
                color: isDark ? '#fff' : '#000',
              },
            ]}
            placeholder="Search here..."
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 15 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  kode: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nama: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  stokBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  stokText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default App;