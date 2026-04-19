import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import householdService from '@/services/householdService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // States for household creation/joining
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [householdName, setHouseholdName] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user?.householdId) {
      fetchMembers();
    }
  }, [user]);

  const fetchMembers = async () => {
    try {
      const res = await householdService.getMembers();
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  };

  const handleCreateHousehold = async () => {
    if (!householdName) return Alert.alert('Error', 'Please enter a household name');
    try {
      setLoading(true);
      await householdService.createHousehold(householdName);
      Alert.alert('Success', 'Household created!');
      // Assuming a mechanism to refresh user state or just re-fetch
      // For now, let's just re-fetch members if possible
    } catch (err) {
      Alert.alert('Error', 'Failed to create household');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHousehold = async () => {
    if (!inviteCode) return Alert.alert('Error', 'Please enter an invite code');
    try {
      setLoading(true);
      await householdService.joinHousehold(inviteCode);
      Alert.alert('Success', 'Joined household!');
    } catch (err) {
      Alert.alert('Error', 'Invalid invite code or failed to join');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (memberId: string, name: string) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${name} from the household?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              await householdService.removeMember(memberId);
              fetchMembers();
            } catch (err) {
              Alert.alert('Error', 'Failed to remove member');
            }
          }
        }
      ]
    );
  };

  const handleChangeRole = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    try {
      await householdService.updateRole(memberId, newRole);
      fetchMembers();
    } catch (err) {
      Alert.alert('Error', 'Failed to update role');
    }
  };

  const SettingItem = ({ icon, title, value, onValueChange, type = 'toggle', onPress }: any) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={type === 'toggle'}
    >
      <View style={styles.settingLabel}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.neutral[100] }]}>
          <Ionicons name={icon} size={20} color={theme.colors.neutral[700]} />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {type === 'toggle' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.neutral[200], true: theme.colors.success + '80' }}
          thumbColor={value ? theme.colors.success : theme.colors.neutral[400]}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral[300]} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={[styles.badge, { backgroundColor: isAdmin ? theme.colors.success + '15' : theme.colors.neutral[100] }]}>
              <Text style={[styles.badgeText, { color: isAdmin ? theme.colors.success : theme.colors.neutral[600] }]}>
                {user?.role?.toUpperCase()}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={theme.colors.success} />
          </TouchableOpacity>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>App Settings</Text>
      <Card style={styles.settingsGroup}>
        <SettingItem 
          icon="notifications-outline" 
          title="Push Notifications" 
          value={notifications} 
          onValueChange={setNotifications}
        />
        <SettingItem 
          icon="moon-outline" 
          title="Dark Mode" 
          value={darkMode} 
          onValueChange={setDarkMode}
        />
        <SettingItem 
          icon="language-outline" 
          title="Language" 
          type="link" 
          onPress={() => {}}
        />
        <SettingItem 
          icon="shield-checkmark-outline" 
          title="Privacy & Security" 
          type="link" 
          onPress={() => {}}
        />
      </Card>

      <Text style={styles.sectionTitle}>Household Management</Text>
      {!user?.householdId ? (
        <Card style={styles.noHouseholdCard}>
          <Ionicons name="home-outline" size={48} color={theme.colors.neutral[300]} />
          <Text style={styles.noHouseholdText}>You haven't joined a household yet.</Text>
          <View style={styles.householdActions}>
            <TextInput 
              placeholder="Enter Invite Code" 
              style={styles.inviteInput} 
              value={inviteCode}
              onChangeText={setInviteCode}
            />
            <Button title="Join" onPress={handleJoinHousehold} loading={loading} style={styles.joinBtn} />
          </View>
          <View style={styles.divider}>
            <View style={styles.line} /><Text style={styles.orText}>OR</Text><View style={styles.line} />
          </View>
          <TextInput 
            placeholder="New Household Name" 
            style={styles.inviteInput} 
            value={householdName}
            onChangeText={setHouseholdName}
          />
          <Button title="Create New Household" variant="outline" onPress={handleCreateHousehold} loading={loading} />
        </Card>
      ) : (
        <Card style={styles.memberCard}>
          <View style={styles.memberHeader}>
            <Text style={styles.memberCardTitle}>Household Members</Text>
            {isAdmin && (
              <TouchableOpacity onPress={() => setShowInviteModal(true)}>
                <Ionicons name="person-add" size={20} color={theme.colors.success} />
              </TouchableOpacity>
            )}
          </View>
          
          {members.map((member) => (
            <View key={member._id} style={styles.memberItem}>
              <View style={styles.memberMain}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>{member.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.memberName}>{member.name} {member._id === user?.id && <Text style={{color: theme.colors.neutral[400]}}>(You)</Text>}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: member.role === 'admin' ? theme.colors.success + '15' : theme.colors.neutral[50] }]}>
                    <Text style={[styles.roleBadgeText, { color: member.role === 'admin' ? theme.colors.success : theme.colors.neutral[500] }]}>
                      {member.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              
              {isAdmin && member._id !== user?.id && (
                <View style={styles.memberActions}>
                  <TouchableOpacity 
                    style={styles.actionBtn} 
                    onPress={() => handleChangeRole(member._id, member.role)}
                  >
                    <Ionicons name="swap-horizontal" size={18} color={theme.colors.neutral[500]} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionBtn} 
                    onPress={() => handleRemoveMember(member._id, member.name)}
                  >
                    <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </Card>
      )}

      <Button 
        title="Logout" 
        variant="ghost" 
        onPress={logout} 
        style={styles.logoutBtn}
        textStyle={{ color: theme.colors.error }}
      />
      <View style={{ height: 40 }} />

      {/* Invite Modal Placeholder */}
      <Modal visible={showInviteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Member</Text>
            <Text style={styles.inviteCodeText}>Invite Code: <Text style={{fontWeight: 'bold'}}>ABC123</Text></Text>
            <Text style={styles.modalHint}>Share this code with your family members to join this household.</Text>
            <Button title="Close" onPress={() => setShowInviteModal(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[50],
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.presets.caption,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.neutral[500],
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xl,
    marginLeft: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  profileCard: {
    padding: theme.spacing.lg,
    borderRadius: 20,
    ...theme.shadows.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    ...theme.typography.presets.h2,
    color: theme.colors.neutral[900],
  },
  profileEmail: {
    ...theme.typography.presets.caption,
    color: theme.colors.neutral[500],
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  editBtn: {
    padding: 8,
    backgroundColor: theme.colors.success + '10',
    borderRadius: 8,
  },
  settingsGroup: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[50],
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    ...theme.typography.presets.body,
    fontWeight: '500',
    color: theme.colors.neutral[800],
  },
  noHouseholdCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  noHouseholdText: {
    ...theme.typography.presets.body,
    color: theme.colors.neutral[500],
    textAlign: 'center',
  },
  householdActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },
  inviteInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.neutral[50],
  },
  joinBtn: {
    height: 48,
    paddingHorizontal: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.neutral[200],
  },
  orText: {
    marginHorizontal: 10,
    color: theme.colors.neutral[400],
    fontSize: 12,
  },
  memberCard: {
    padding: theme.spacing.md,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: 4,
  },
  memberCardTitle: {
    ...theme.typography.presets.body,
    fontWeight: 'bold',
    color: theme.colors.neutral[700],
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  memberMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontWeight: 'bold',
    color: theme.colors.neutral[600],
  },
  memberName: {
    ...theme.typography.presets.body,
    fontWeight: '600',
    color: theme.colors.neutral[800],
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 8,
  },
  logoutBtn: {
    marginTop: theme.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    gap: 16,
    alignItems: 'center',
  },
  modalTitle: {
    ...theme.typography.presets.h2,
    color: theme.colors.neutral[900],
  },
  inviteCodeText: {
    fontSize: 20,
    color: theme.colors.success,
  },
  modalHint: {
    ...theme.typography.presets.caption,
    textAlign: 'center',
    color: theme.colors.neutral[500],
  }
});