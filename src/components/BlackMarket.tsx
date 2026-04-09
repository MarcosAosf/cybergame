import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert
} from 'react-native';
import { useSecStore, BLACK_MARKET_CATALOG, MarketItem } from '../store/useSecStore';

interface BlackMarketProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  title: '// CUSTOM_TITLES (Equipáveis)',
  profile_fx: '// PROFILE_FX (Efeitos Visuais)',
  access_key: '// ACCESS_KEYS (Desbloqueios)',
};

const CATEGORY_COLORS: Record<string, string> = {
  title: '#bf00ff',
  profile_fx: '#00d4ff',
  access_key: '#ffaa00',
};

export const BlackMarket: React.FC<BlackMarketProps> = ({ visible, onClose }) => {
  const { stats, market, purchaseItem, equipTitle } = useSecStore();
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  const showFeedback = (msg: string, ok: boolean) => {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleBuy = (item: MarketItem) => {
    if (item.purchased) {
      if (item.type === 'title') {
        equipTitle(item.id);
        showFeedback(`// TITLE_EQUIPPED: ${item.name}`, true);
      } else {
        showFeedback('// ALREADY_OWNED: ITEM_IN_ARCHIVE', false);
      }
      return;
    }

    const result = purchaseItem(item.id);
    showFeedback(result.message, result.success);
  };

  const grouped = (['title', 'profile_fx', 'access_key'] as const).map(type => ({
    type,
    items: market.filter(i => i.type === type),
  }));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>// BLACK_MARKET_TERMINAL</Text>
              <Text style={styles.headerBalance}>[ ₿ {stats.bits.toLocaleString()} BITS DISPONÍVEIS ]</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>

          {feedback && (
            <View style={[styles.feedbackBar, { borderColor: feedback.ok ? '#00ff9f' : '#ff4040' }]}>
              <Text style={[styles.feedbackText, { color: feedback.ok ? '#00ff9f' : '#ff4040' }]}>
                {feedback.msg}
              </Text>
            </View>
          )}

          <ScrollView contentContainerStyle={styles.content}>
            {grouped.map(({ type, items }) => (
              <View key={type} style={styles.category}>
                <Text style={[styles.categoryLabel, { color: CATEGORY_COLORS[type] }]}>
                  {CATEGORY_LABELS[type]}
                </Text>
                {items.map(item => {
                  const canAfford = stats.bits >= item.cost;
                  const isOwned = item.purchased;
                  const isEquipped = item.equipped;
                  return (
                    <View key={item.id} style={[styles.itemCard, { borderColor: CATEGORY_COLORS[type] + '20' }]}>
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemName, { color: CATEGORY_COLORS[type] }]}>{item.name}</Text>
                        <Text style={styles.itemDesc}>{item.description}</Text>
                        {isOwned && item.type === 'title' && (
                          <Text style={styles.equippedHint}>
                            {isEquipped ? '▶ EQUIPADO' : 'TAP para equipar'}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => handleBuy(item)}
                        style={[
                          styles.buyBtn,
                          isOwned ? styles.ownedBtn : canAfford ? styles.affordBtn : styles.lockedBtn
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.buyBtnText,
                          { color: isOwned ? '#00ff9f' : canAfford ? '#000' : '#555' }
                        ]}>
                          {isOwned ? (item.type === 'title' ? (isEquipped ? 'ON' : 'EQUIP') : '✓') : `₿ ${item.cost.toLocaleString()}`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ))}

            <Text style={styles.footer}>
              MERCADO_NEGRO: ATIVO. TRANSAÇÕES SÃO PERMANENTES E IRREVOGÁVEIS. USE SEUS BITS COM SABEDORIA.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.exitBtn} onPress={onClose}>
            <Text style={styles.exitText}>FECHAR_TERMINAL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.98)',
    paddingTop: 45,
  },
  container: {
    flex: 1,
    backgroundColor: '#050505',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#111',
  },
  header: {
    padding: 20,
    backgroundColor: '#0a0a0a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    color: '#bf00ff',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 11,
    letterSpacing: 2,
  },
  headerBalance: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 10,
    marginTop: 4,
  },
  closeBtn: { padding: 5 },
  closeText: { color: '#333', fontFamily: 'RobotoMono_700Bold' },
  feedbackBar: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#0a0a0a',
  },
  feedbackText: {
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  content: { padding: 20, paddingBottom: 30 },
  category: { marginBottom: 30 },
  categoryLabel: {
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#080808',
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  itemInfo: { flex: 1, marginRight: 12 },
  itemName: {
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  itemDesc: {
    color: '#444',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 9,
    marginTop: 3,
    lineHeight: 13,
  },
  equippedHint: {
    color: '#00ff9f',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 8,
    marginTop: 5,
    opacity: 0.6,
  },
  buyBtn: {
    minWidth: 65,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  affordBtn: { backgroundColor: '#00ff9f' },
  lockedBtn: { backgroundColor: '#111', borderWidth: 1, borderColor: '#222' },
  ownedBtn: { backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#00ff9f44' },
  buyBtnText: {
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 10,
  },
  footer: {
    color: '#1a1a1a',
    fontSize: 7,
    fontFamily: 'RobotoMono_400Regular',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 12,
    marginBottom: 20,
  },
  exitBtn: {
    padding: 22,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  exitText: { color: '#bf00ff', fontFamily: 'RobotoMono_700Bold', fontSize: 12 },
});
