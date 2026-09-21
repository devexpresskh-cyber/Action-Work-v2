import React, { useState } from 'react';
import {
  Wifi,
  ShieldCheck,
  Globe,
  Sliders,
  Bell,
  Activity,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Lock,
  Search,
  ExternalLink,
  Laptop,
  Smartphone,
  Info,
  Layers,
  ChevronRight,
  RefreshCw,
  Clock,
  Send,
  Download,
  Filter,
  Trash2,
  Edit2,
  HelpCircle,
  Cpu,
  Server
} from 'lucide-react';
import { db } from '../services/db';
import { translations } from '../services/i18n';
import { WorkplaceNetwork, NetworkSettingsConfig, NetworkAccessLog, CurrentNetworkConnection, UserRole, Language } from '../types';

interface NetworkWhitelistViewProps {
  currentUserRole: UserRole;
  lang?: Language;
  onRefresh?: () => void;
}

export const NetworkWhitelistView: React.FC<NetworkWhitelistViewProps> = ({
  currentUserRole,
  lang = 'en',
  onRefresh,
}) => {
  const language = lang || 'en';
  const t = translations[language];

  const [activeSubTab, setActiveSubTab] = useState<
    'whitelist' | 'network-settings' | 'communication' | 'monitor'
  >('whitelist');

  const [networks, setNetworks] = useState<WorkplaceNetwork[]>(() => db.getWorkplaceNetworks());
  const [networkSettings, setNetworkSettings] = useState<NetworkSettingsConfig>(() => db.getNetworkSettings());
  const [networkLogs, setNetworkLogs] = useState<NetworkAccessLog[]>(() => db.getNetworkAccessLogs());
  const [currentConnection, setCurrentConnection] = useState<CurrentNetworkConnection>(() =>
    db.getCurrentNetworkConnection()
  );

  // Modal and Test States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<WorkplaceNetwork | null>(null);
  const [testIpInput, setTestIpInput] = useState('192.168.1.45');
  const [testResult, setTestResult] = useState<{ isWhitelisted: boolean; matchedNetwork?: WorkplaceNetwork; reason: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [announcementStatus, setAnnouncementStatus] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form State for Adding/Editing Network
  const [formData, setFormData] = useState({
    name: '',
    nameKm: '',
    ssid: '',
    bssidPrefix: '',
    ipRanges: '192.168.100.0/24',
    gatewayIp: '192.168.100.1',
    dnsServers: '1.1.1.1, 8.8.8.8',
    locationName: 'Phnom Penh HQ - Innovation Hub',
    securityType: 'WPA3 Enterprise (802.1X)' as WorkplaceNetwork['securityType'],
    status: 'Active' as WorkplaceNetwork['status'],
    allowSeamlessCheckIn: true,
    firewallConfigured: true,
    description: '',
  });

  const isSuperOrAdmin = currentUserRole === 'Super Admin' || currentUserRole === 'Admin';

  const refreshState = () => {
    setNetworks(db.getWorkplaceNetworks());
    setNetworkSettings(db.getNetworkSettings());
    setNetworkLogs(db.getNetworkAccessLogs());
    setCurrentConnection(db.getCurrentNetworkConnection());
    if (onRefresh) onRefresh();
  };

  const handleTestIp = (ipToTest?: string) => {
    const target = (ipToTest || testIpInput).trim();
    if (!target) return;
    const res = db.testIpAgainstWhitelist(target);
    setTestResult(res);
  };

  const handleSwitchSimulatedNetwork = (networkId: string) => {
    const updated = db.setCurrentNetworkConnection(networkId);
    setCurrentConnection(updated);
    refreshState();
  };

  const handleToggleNetworkStatus = (net: WorkplaceNetwork) => {
    if (!isSuperOrAdmin) return;
    const newStatus: WorkplaceNetwork['status'] = net.status === 'Active' ? 'Disabled' : 'Active';
    db.updateWorkplaceNetwork(net.id, { status: newStatus });
    refreshState();
  };

  const handleDeleteNetwork = (id: string, name: string) => {
    if (!isSuperOrAdmin) return;
    if (window.confirm(`Are you sure you want to remove "${name}" from the workplace whitelist?`)) {
      db.deleteWorkplaceNetwork(id);
      refreshState();
    }
  };

  const handleSaveNetwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ssid.trim()) return;

    const ranges = formData.ipRanges
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);
    const dns = formData.dnsServers
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    if (editingNetwork) {
      db.updateWorkplaceNetwork(editingNetwork.id, {
        name: formData.name,
        nameKm: formData.nameKm || undefined,
        ssid: formData.ssid,
        bssidPrefix: formData.bssidPrefix || undefined,
        ipRanges: ranges,
        gatewayIp: formData.gatewayIp,
        dnsServers: dns,
        locationName: formData.locationName,
        securityType: formData.securityType,
        status: formData.status,
        allowSeamlessCheckIn: formData.allowSeamlessCheckIn,
        firewallConfigured: formData.firewallConfigured,
        description: formData.description,
      });
    } else {
      db.addWorkplaceNetwork({
        name: formData.name,
        nameKm: formData.nameKm || undefined,
        ssid: formData.ssid,
        bssidPrefix: formData.bssidPrefix || undefined,
        ipRanges: ranges,
        gatewayIp: formData.gatewayIp,
        dnsServers: dns,
        locationName: formData.locationName,
        securityType: formData.securityType,
        status: formData.status,
        allowSeamlessCheckIn: formData.allowSeamlessCheckIn,
        firewallConfigured: formData.firewallConfigured,
        description: formData.description,
      });
    }

    setShowAddModal(false);
    setEditingNetwork(null);
    refreshState();
  };

  const handleOpenAddModal = (netToEdit?: WorkplaceNetwork) => {
    if (netToEdit) {
      setEditingNetwork(netToEdit);
      setFormData({
        name: netToEdit.name,
        nameKm: netToEdit.nameKm || '',
        ssid: netToEdit.ssid,
        bssidPrefix: netToEdit.bssidPrefix || '',
        ipRanges: netToEdit.ipRanges.join(', '),
        gatewayIp: netToEdit.gatewayIp,
        dnsServers: netToEdit.dnsServers.join(', '),
        locationName: netToEdit.locationName,
        securityType: netToEdit.securityType,
        status: netToEdit.status,
        allowSeamlessCheckIn: netToEdit.allowSeamlessCheckIn,
        firewallConfigured: netToEdit.firewallConfigured,
        description: netToEdit.description,
      });
    } else {
      setEditingNetwork(null);
      setFormData({
        name: '',
        nameKm: '',
        ssid: '',
        bssidPrefix: '',
        ipRanges: '192.168.100.0/24',
        gatewayIp: '192.168.100.1',
        dnsServers: '1.1.1.1, 8.8.8.8',
        locationName: 'Phnom Penh HQ - Main Tower',
        securityType: 'WPA3 Enterprise (802.1X)',
        status: 'Active',
        allowSeamlessCheckIn: true,
        firewallConfigured: true,
        description: '',
      });
    }
    setShowAddModal(true);
  };

  const handleSaveNetworkSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperOrAdmin) return;
    db.updateNetworkSettings(networkSettings);
    setSaveSuccessMsg('Network and firewall configuration updated successfully.');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
    refreshState();
  };

  const handleBroadcastAnnouncement = () => {
    const curUser = db.getCurrentUser();
    db.logAction(
      curUser.id,
      curUser.name,
      'NETWORK_GUIDE_BROADCAST',
      'Employee Communications',
      'Broadcasted workplace Wi-Fi seamless check-in guide to all staff.'
    );
    setAnnouncementStatus('Announcement broadcasted! All employee portals received the Wi-Fi connection update notification.');
    setTimeout(() => setAnnouncementStatus(null), 5000);
  };

  const activeNetworksCount = networks.filter(n => n.status === 'Active').length;
  const totalConnectedDevices = networks.reduce((acc, n) => acc + (n.connectedDevicesCount || 0), 0);
  const filteredLogs = networkLogs.filter(log => {
    if (logFilter !== 'all' && log.whitelistStatus !== logFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.employeeName.toLowerCase().includes(q) ||
        log.clientIp.includes(q) ||
        (log.matchedNetworkName && log.matchedNetworkName.toLowerCase().includes(q)) ||
        (log.ssid && log.ssid.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div id="network-whitelist-manager" className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-teal-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wifi className="w-64 h-64 text-teal-300" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-200 border border-teal-400/30 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  {language === 'km' ? 'បណ្តាញ Wi-Fi និង IP អនុញ្ញាត' : 'Workplace Wi-Fi & IP Whitelist Engine'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {networkSettings.enforceMode} Policy
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {language === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រង Wi-Fi និង IP អនុញ្ញាតសម្រាប់វត្តមាន' : 'Seamless Attendance Wi-Fi & IP Access Control'}
              </h2>
              <p className="text-teal-100/80 text-sm max-w-2xl leading-relaxed">
                {language === 'km'
                  ? 'អនុញ្ញាតឱ្យបុគ្គលិកកត់ត្រាវត្តមានដោយស្វ័យប្រវត្តិតាមរយៈបណ្តាញ Wi-Fi សហគ្រាស និង IP ដែលបានអនុញ្ញាត ដោយមិនចាំបាច់មាន GPS ឡើយ។'
                  : 'Allows employees to seamlessly check in and out via authorized workplace Wi-Fi connections and whitelisted IP subnets with zero interruptions.'}
              </p>
            </div>

            {/* Simulated Live Connection Pill */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-teal-500/30 shadow-inner flex flex-col gap-2 min-w-[280px]">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  {language === 'km' ? 'ការតភ្ជាប់បច្ចុប្បន្ន' : 'Your Live Network State'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    currentConnection.isWhitelisted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {currentConnection.isWhitelisted ? 'Whitelisted' : 'External'}
                </span>
              </div>

              <div className="text-sm font-semibold text-white truncate">
                {currentConnection.ssid}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono">{currentConnection.clientIp}</span>
                <span>{currentConnection.latencyMs}ms latency</span>
              </div>

              {/* Simulation Selector */}
              <div className="pt-2 border-t border-slate-700/60 mt-1 flex items-center justify-between gap-2">
                <label htmlFor="test-network-simulator" className="text-[11px] text-slate-400 whitespace-nowrap">
                  {language === 'km' ? 'សាកល្បងបណ្តាញ:' : 'Simulate Network:'}
                </label>
                <select
                  id="test-network-simulator"
                  value={currentConnection.networkId}
                  onChange={e => handleSwitchSimulatedNetwork(e.target.value)}
                  className="text-xs bg-slate-900/90 text-teal-200 border border-teal-500/40 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
                >
                  {db.getSimulatedConnectionProfiles().map(prof => (
                    <option key={prof.networkId} value={prof.networkId}>
                      {prof.ssid} ({prof.connectionType})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-teal-700/30">
            <div className="bg-slate-900/40 rounded-xl p-3 border border-teal-500/20">
              <div className="text-xs text-teal-300/80">{language === 'km' ? 'បណ្តាញសកម្ម' : 'Active Wi-Fi Networks'}</div>
              <div className="text-xl font-bold text-white mt-0.5">{activeNetworksCount} Networks</div>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-3 border border-teal-500/20">
              <div className="text-xs text-teal-300/80">{language === 'km' ? 'ឧបករណ៍តភ្ជាប់' : 'Active Connected Devices'}</div>
              <div className="text-xl font-bold text-white mt-0.5">{totalConnectedDevices} Devices</div>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-3 border border-teal-500/20">
              <div className="text-xs text-teal-300/80">{language === 'km' ? 'ច្រកទ្វារ & Firewall' : 'Firewall Status'}</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5" /> Configured
              </div>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-3 border border-teal-500/20">
              <div className="text-xs text-teal-300/80">{language === 'km' ? 'ភាពរលូននៃការកត់ត្រា' : 'Seamless Check-In'}</div>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">
                {networkSettings.seamlessCheckInEnabled ? 'Enabled (1-Tap)' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs corresponding to user steps */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-2 overflow-x-auto pb-0.5">
        <button
          id="tab-btn-whitelist"
          onClick={() => setActiveSubTab('whitelist')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'whitelist'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>1. {language === 'km' ? 'បញ្ជី Wi-Fi & IP អនុញ្ញាត' : 'Whitelist IP Addresses'}</span>
          <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
            {networks.length}
          </span>
        </button>

        <button
          id="tab-btn-network-settings"
          onClick={() => setActiveSubTab('network-settings')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'network-settings'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>2. {language === 'km' ? 'កំណត់រចនាសម្ព័ន្ធបណ្តាញ' : 'Configure Network Settings'}</span>
        </button>

        <button
          id="tab-btn-communication"
          onClick={() => setActiveSubTab('communication')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'communication'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>3. {language === 'km' ? 'សេចក្តីជូនដំណឹង និងការណែនាំ' : 'Communicate with Employees'}</span>
        </button>

        <button
          id="tab-btn-monitor"
          onClick={() => setActiveSubTab('monitor')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'monitor'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>4. {language === 'km' ? 'ការតាមដាន និងកែសម្រួល' : 'Monitor and Adjust'}</span>
          <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {networkLogs.length}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: WHITELIST IP ADDRESSES & WORKPLACE WI-FI */}
      {activeSubTab === 'whitelist' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Wifi className="w-4 h-4 text-teal-600" />
                {language === 'km' ? 'បណ្តាញ Wi-Fi និងបណ្តាញរង IP កន្លែងធ្វើការ' : 'Workplace Wi-Fi Networks & IP Subnets'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'km'
                  ? 'កំណត់ត្រា Wi-Fi SSID និងអាសយដ្ឋាន IP CIDR ដែលអនុញ្ញាតឱ្យបុគ្គលិកកត់ត្រាវត្តមានដោយរលូន'
                  : 'Registered Wi-Fi SSIDs and CIDR IP pools authorized for frictionless workplace attendance.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isSuperOrAdmin && (
                <button
                  id="btn-add-workplace-network"
                  onClick={() => handleOpenAddModal()}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'km' ? 'បន្ថែម Wi-Fi / IP' : 'Add Wi-Fi / IP Subnet'}</span>
                </button>
              )}
            </div>
          </div>

          {/* IP Whitelist Live Tester Utility */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-600" />
                {language === 'km' ? 'ឧបករណ៍សាកល្បងអាសយដ្ឋាន IP (Subnet CIDR Checker)' : 'Instant IP Whitelist & Subnet Validator'}
              </h4>
              <span className="text-xs text-slate-500">Supports IPv4 CIDR (e.g. 192.168.1.0/24)</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-test-ip-address"
                  type="text"
                  placeholder="Enter IP to test (e.g. 192.168.1.45, 10.8.0.22, 114.119.130.42)..."
                  value={testIpInput}
                  onChange={e => setTestIpInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTestIp()}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-run-ip-test"
                  onClick={() => handleTestIp()}
                  className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition flex items-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>{language === 'km' ? 'ត្រួតពិនិត្យ IP' : 'Validate IP'}</span>
                </button>

                <button
                  onClick={() => {
                    setTestIpInput('192.168.1.45');
                    handleTestIp('192.168.1.45');
                  }}
                  className="px-2.5 py-2 text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  title="Test HQ IP"
                >
                  HQ IP
                </button>

                <button
                  onClick={() => {
                    setTestIpInput('10.8.0.34');
                    handleTestIp('10.8.0.34');
                  }}
                  className="px-2.5 py-2 text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  title="Test VPN IP"
                >
                  VPN IP
                </button>

                <button
                  onClick={() => {
                    setTestIpInput('114.119.130.42');
                    handleTestIp('114.119.130.42');
                  }}
                  className="px-2.5 py-2 text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  title="Test External IP"
                >
                  External IP
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-sm border flex items-start gap-3 transition-all ${
                  testResult.isWhitelisted
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800/50'
                }`}
              >
                {testResult.isWhitelisted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <div className="font-semibold">
                    {testResult.isWhitelisted
                      ? 'IP Whitelisted — Seamless Check-In Eligible'
                      : 'IP Not in Workplace Whitelist'}
                  </div>
                  <div className="text-xs mt-0.5 opacity-90">{testResult.reason}</div>
                  {testResult.matchedNetwork && (
                    <div className="text-xs font-mono mt-1 text-teal-800 dark:text-teal-300">
                      Matched Network: {testResult.matchedNetwork.name} ({testResult.matchedNetwork.ssid}) • Gateway: {testResult.matchedNetwork.gatewayIp}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Network Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {networks.map(net => (
              <div
                key={net.id}
                id={`network-card-${net.id}`}
                className={`rounded-xl border transition-all p-5 flex flex-col justify-between bg-white dark:bg-slate-900 ${
                  net.status === 'Active'
                    ? 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-950'
                }`}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          net.securityType.includes('VPN')
                            ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400'
                            : 'bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400'
                        }`}
                      >
                        {net.securityType.includes('VPN') ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <Wifi className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {language === 'km' && net.nameKm ? net.nameKm : net.name}
                        </h4>
                        <div className="text-xs font-mono text-teal-600 dark:text-teal-400 font-medium">
                          SSID: {net.ssid}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        net.status === 'Active'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                          : net.status === 'Under Maintenance'
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {net.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {language === 'km' && net.descriptionKm ? net.descriptionKm : net.description}
                  </p>

                  {/* Network Details */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Whitelisted Subnets:</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200 text-right truncate max-w-[180px]">
                        {net.ipRanges.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Gateway IP:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{net.gatewayIp}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Location / Campus:</span>
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{net.locationName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Security:</span>
                      <span className="text-slate-700 dark:text-slate-300">{net.securityType}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400">Connected Devices:</span>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        {net.connectedDevicesCount} devices active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Seamless 1-Tap</span>
                  </div>

                  {isSuperOrAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleNetworkStatus(net)}
                        className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                      >
                        {net.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleOpenAddModal(net)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Edit configuration"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNetwork(net.id, net.name)}
                        className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        title="Delete from whitelist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CONFIGURE NETWORK SETTINGS & FIREWALL */}
      {activeSubTab === 'network-settings' && (
        <form onSubmit={handleSaveNetworkSettings} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-600" />
                {language === 'km' ? 'ការកំណត់រចនាសម្ព័ន្ធបណ្តាញ និងក្បួន Firewall' : 'Firewall & Network Access Policies'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'km'
                  ? 'កំណត់ការអនុវត្តគោលការណ៍កត់ត្រាវត្តមាន ច្រកទ្វារ Ports និងការឆ្លងកាត់ Captive Portal'
                  : 'Configure network permissions, port access, captive portal bypass, and whitelist enforcement behavior.'}
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 rounded-lg text-sm border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Policy Enforcement Mode */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-white block">
                {language === 'km' ? 'កម្រិតតឹងរ៉ឹងនៃការអនុវត្តបញ្ជី Wi-Fi' : 'Network Whitelist Enforcement Policy'}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setNetworkSettings(prev => ({ ...prev, enforceMode: 'Flexible' }))}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    networkSettings.enforceMode === 'Flexible'
                      ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Flexible (Recommended)</span>
                    <input
                      type="radio"
                      name="enforceMode"
                      checked={networkSettings.enforceMode === 'Flexible'}
                      onChange={() => {}}
                      className="text-teal-600"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Workplace Wi-Fi enables 1-tap seamless check-in. Remote or field staff can still check in with Zero-Tracking or standard badges.
                  </p>
                </div>

                <div
                  onClick={() => setNetworkSettings(prev => ({ ...prev, enforceMode: 'Strict' }))}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    networkSettings.enforceMode === 'Strict'
                      ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Strict (On-Premises Only)</span>
                    <input
                      type="radio"
                      name="enforceMode"
                      checked={networkSettings.enforceMode === 'Strict'}
                      onChange={() => {}}
                      className="text-teal-600"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Enforces attendance ONLY from whitelisted workplace Wi-Fi or Corporate VPN subnets. Blocks unauthorized external IPs.
                  </p>
                </div>

                <div
                  onClick={() => setNetworkSettings(prev => ({ ...prev, enforceMode: 'Advisory' }))}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    networkSettings.enforceMode === 'Advisory'
                      ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Advisory / Audit Only</span>
                    <input
                      type="radio"
                      name="enforceMode"
                      checked={networkSettings.enforceMode === 'Advisory'}
                      onChange={() => {}}
                      className="text-teal-600"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Allows check-ins from any connection, but flags non-whitelisted IPs in network telemetry logs for IT review.
                  </p>
                </div>
              </div>
            </div>

            {/* Network & Firewall Toggles */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {language === 'km' ? 'ក្បួន Firewall និងច្រកទ្វារសុវត្ថិភាព' : 'Firewall & Network Permission Rules'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={networkSettings.seamlessCheckInEnabled}
                    onChange={e =>
                      setNetworkSettings(prev => ({ ...prev, seamlessCheckInEnabled: e.target.checked }))
                    }
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white block">
                      Enable 1-Tap Seamless Check-In
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
                      Automatically recognizes employees on authorized Wi-Fi and bypasses manual verification prompts.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={networkSettings.captivePortalAutoBypass}
                    onChange={e =>
                      setNetworkSettings(prev => ({ ...prev, captivePortalAutoBypass: e.target.checked }))
                    }
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white block">
                      Captive Portal Walled Garden Bypass
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
                      Whitelists attendance web service endpoints so clock-in functions even before web portal login redirects.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={networkSettings.allowVpnFallback}
                    onChange={e =>
                      setNetworkSettings(prev => ({ ...prev, allowVpnFallback: e.target.checked }))
                    }
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white block">
                      Corporate VPN Subnet Fallback (10.8.0.0/16)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
                      Accepts encrypted IPsec and WireGuard tunnels as authorized workplace network endpoints.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={networkSettings.sslTlsInspectionBypass}
                    onChange={e =>
                      setNetworkSettings(prev => ({ ...prev, sslTlsInspectionBypass: e.target.checked }))
                    }
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white block">
                      SSL/TLS Deep Packet Inspection Bypass
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
                      Prevents certificate pinning conflicts on mobile devices checking in on corporate Wi-Fi.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={networkSettings.rateLimitExemption}
                    onChange={e =>
                      setNetworkSettings(prev => ({ ...prev, rateLimitExemption: e.target.checked }))
                    }
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white block">
                      Morning Clock-In Rate-Limit Exemption
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
                      Exempts internal workplace Wi-Fi subnets from burst API throttles during 07:45 - 08:30 peak arrivals.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={networkSettings.mDnsDiscovery}
                    onChange={e =>
                      setNetworkSettings(prev => ({ ...prev, mDnsDiscovery: e.target.checked }))
                    }
                    className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white block">
                      Local mDNS / Subnet Device Beaconing
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
                      Allows fast zero-configuration handshake with workplace kiosk terminals and web tablets.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Allowed Ports Configuration */}
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="text-sm font-semibold text-slate-900 dark:text-white block">
                {language === 'km' ? 'ច្រក Port អនុញ្ញាតតាម Firewall' : 'Firewall Authorized Port Numbers'}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {networkSettings.allowedPorts.map(port => (
                  <span
                    key={port}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1.5"
                  >
                    <Server className="w-3.5 h-3.5 text-teal-600" />
                    Port {port} {port === 443 ? '(HTTPS)' : port === 80 ? '(HTTP)' : port === 8443 ? '(App API)' : '(NTP Time)'}
                  </span>
                ))}
              </div>
            </div>

            {/* Save Button */}
            {isSuperOrAdmin && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  id="btn-save-network-settings"
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'km' ? 'រក្សាទុកការកំណត់រចនាសម្ព័ន្ធ' : 'Save & Apply Network Policies'}</span>
                </button>
              </div>
            )}
          </div>
        </form>
      )}

      {/* SUB-TAB 3: COMMUNICATE WITH EMPLOYEES */}
      {activeSubTab === 'communication' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-teal-600" />
                  {language === 'km' ? 'សេចក្តីណែនាំ និងការជូនដំណឹងដល់បុគ្គលិក' : 'Employee Wi-Fi Connection Guide & Policy'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'km'
                    ? 'ផ្តល់ការណែនាំដល់បុគ្គលិកអំពីរបៀបតភ្ជាប់ Wi-Fi កន្លែងធ្វើការ ដើម្បីកត់ត្រាវត្តមានរហ័សដោយគ្មានការរំខាន'
                    : 'Clear guidance and setup steps for staff to connect to authorized workplace Wi-Fi for seamless check-in.'}
                </p>
              </div>

              {isSuperOrAdmin && (
                <button
                  id="btn-broadcast-announcement"
                  onClick={handleBroadcastAnnouncement}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'km' ? 'ផ្ញើសេចក្តីជូនដំណឹងដល់បុគ្គលិកទាំងអស់' : 'Broadcast Update to Staff'}</span>
                </button>
              )}
            </div>

            {announcementStatus && (
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 rounded-lg text-sm border border-teal-200 dark:border-teal-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>{announcementStatus}</span>
              </div>
            )}
          </div>

          {/* Guide Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step-by-Step Connection Instructions */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-teal-600" />
                <span>How to Connect for Seamless Check-In</span>
              </h4>

              <ol className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Select Corporate Wi-Fi</strong>
                    When arriving at your designated office campus, open Wi-Fi settings and choose{' '}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-teal-600 dark:text-teal-400">
                      CORP-HQ-SECURE-5G
                    </code>{' '}
                    or your branch regional SSID.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Authenticate via Enterprise Single Sign-On</strong>
                    Use your employee username and security token. Devices with installed corporate profiles will authenticate automatically.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Open Attendance & Clock In</strong>
                    Once connected, open the portal. Your network status will show "Whitelisted (Seamless)" with a green badge, and you can clock in with 1 click.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Remote Work & Travel Coverage</strong>
                    If working from home or offsite, connect via{' '}
                    <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-teal-600 dark:text-teal-400">
                      Corporate VPN Tunnel
                    </code>{' '}
                    or use the authorized Zero-Tracking manual self-attestation option.
                  </div>
                </li>
              </ol>
            </div>

            {/* Privacy Guarantee & Reassurance */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy Reassurance: Wi-Fi Whitelist vs Zero-Tracking</span>
              </h4>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white">What Wi-Fi Whitelisting Does:</div>
                  <p>
                    It only verifies that the clock-in request originates from the corporate network gateway IP. It provides proof of presence without tracking movements.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-200">What It NEVER Does:</div>
                  <ul className="list-disc list-inside space-y-1 text-emerald-800 dark:text-emerald-300">
                    <li>Never accesses your device GPS coordinates or precise lat/long.</li>
                    <li>Never scans for neighboring personal Wi-Fi networks or Bluetooth beacons.</li>
                    <li>Never monitors personal web traffic, messaging, or apps on your device.</li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Audited under Ministry HR Compliance Standard 2026</span>
                  <span className="text-teal-600 font-semibold">100% Zero-Tracking Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MONITOR AND ADJUST */}
      {activeSubTab === 'monitor' && (
        <div className="space-y-6">
          {/* Real-time Monitoring Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                {language === 'km' ? 'កំណត់ត្រាតាមដានការតភ្ជាប់បណ្តាញផ្ទាល់' : 'Real-Time Network Telemetry & Access Log'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monitor live clock-in events, IP resolutions, latency, and whitelist compliance. Adjust subnets with 1 click.
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search staff, IP, SSID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 w-44"
                />
              </div>

              <select
                value={logFilter}
                onChange={e => setLogFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Statuses</option>
                <option value="Whitelisted (Seamless)">Whitelisted (Seamless)</option>
                <option value="VPN-Secured">VPN-Secured</option>
                <option value="External / Remote">External / Remote</option>
                <option value="Blocked (Non-Whitelisted)">Blocked</option>
              </select>

              <button
                onClick={refreshState}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Refresh logs"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Timestamp</th>
                    <th className="px-4 py-3 font-semibold">Employee</th>
                    <th className="px-4 py-3 font-semibold">Client IP</th>
                    <th className="px-4 py-3 font-semibold">Matched Network / SSID</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-4 py-3 font-semibold">Latency</th>
                    <th className="px-4 py-3 font-semibold text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredLogs.map(log => {
                    const isWhitelisted = log.whitelistStatus.includes('Whitelisted') || log.whitelistStatus.includes('VPN');
                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-slate-500">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{log.employeeName}</div>
                          <div className="text-[10px] text-slate-400">{log.departmentName}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-800 dark:text-slate-200">
                          {log.clientIp}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {log.matchedNetworkName || 'External ISP Pool'}
                          </div>
                          {log.ssid && (
                            <div className="text-[10px] font-mono text-teal-600 dark:text-teal-400">
                              SSID: {log.ssid}
                            </div>
                          )}
                          {log.flaggedReason && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                              {log.flaggedReason}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.whitelistStatus === 'Whitelisted (Seamless)'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : log.whitelistStatus === 'VPN-Secured'
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                                : log.whitelistStatus === 'Blocked (Non-Whitelisted)'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {log.whitelistStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{log.action}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{log.latencyMs}ms</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {isSuperOrAdmin && !isWhitelisted && (
                            <button
                              onClick={() => {
                                const cleanIp = log.clientIp.split('/')[0].split(' ')[0];
                                const parts = cleanIp.split('.');
                                const subnetGuess = parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0/24` : cleanIp;
                                setFormData({
                                  name: `Branch / Subnet for ${log.employeeName}`,
                                  nameKm: '',
                                  ssid: log.ssid || 'REMOTE-BRANCH-WIFI',
                                  bssidPrefix: '',
                                  ipRanges: subnetGuess,
                                  gatewayIp: parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.1` : '192.168.1.1',
                                  dnsServers: '1.1.1.1, 8.8.8.8',
                                  locationName: `${log.departmentName} Regional Site`,
                                  securityType: 'WPA2/WPA3 Personal',
                                  status: 'Active',
                                  allowSeamlessCheckIn: true,
                                  firewallConfigured: true,
                                  description: `Auto-whitelisted following monitoring adjustment for employee ${log.employeeName}`,
                                });
                                setEditingNetwork(null);
                                setShowAddModal(true);
                              }}
                              className="px-2 py-1 text-[11px] font-semibold bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 rounded border border-teal-300 dark:border-teal-800 transition"
                            >
                              + Whitelist Subnet
                            </button>
                          )}
                          {isWhitelisted && (
                            <span className="text-[11px] text-emerald-600 font-medium">Verified</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Network Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wifi className="w-5 h-5 text-teal-600" />
                {editingNetwork
                  ? language === 'km'
                    ? 'កែសម្រួលបណ្តាញ Wi-Fi / IP'
                    : 'Edit Workplace Wi-Fi Network'
                  : language === 'km'
                  ? 'បន្ថែមបណ្តាញ Wi-Fi / IP អនុញ្ញាត'
                  : 'Add Workplace Wi-Fi / IP Subnet'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNetwork} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Network Name (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Phnom Penh HQ - Floor 3 Wi-Fi"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Network Name (Khmer)
                  </label>
                  <input
                    type="text"
                    placeholder="ឈ្មោះបណ្តាញជាភាសាខ្មែរ..."
                    value={formData.nameKm}
                    onChange={e => setFormData({ ...formData, nameKm: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Wi-Fi SSID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CORP-HQ-SECURE-5G"
                    value={formData.ssid}
                    onChange={e => setFormData({ ...formData, ssid: e.target.value })}
                    className="w-full p-2 font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Security Type
                  </label>
                  <select
                    value={formData.securityType}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        securityType: e.target.value as WorkplaceNetwork['securityType'],
                      })
                    }
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="WPA3 Enterprise (802.1X)">WPA3 Enterprise (802.1X)</option>
                    <option value="WPA2/WPA3 Personal">WPA2/WPA3 Personal</option>
                    <option value="Corporate VPN Tunnel">Corporate VPN Tunnel</option>
                    <option value="Dedicated Lease Line">Dedicated Lease Line</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Whitelisted IP Ranges / CIDR (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 192.168.1.0/24, 192.168.2.0/24"
                  value={formData.ipRanges}
                  onChange={e => setFormData({ ...formData, ipRanges: e.target.value })}
                  className="w-full p-2 font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Devices connected with an IP inside these CIDR blocks will be recognized as authorized.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Gateway IP
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.1"
                    value={formData.gatewayIp}
                    onChange={e => setFormData({ ...formData, gatewayIp: e.target.value })}
                    className="w-full p-2 font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Phnom Penh HQ - Main Tower"
                    value={formData.locationName}
                    onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Department Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Network coverage details, floor information, or purpose..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowSeamlessCheckIn}
                    onChange={e => setFormData({ ...formData, allowSeamlessCheckIn: e.target.checked })}
                    className="rounded text-teal-600"
                  />
                  <span className="text-slate-800 dark:text-slate-200">Allow 1-Tap Seamless Check-In</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'Active'}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Disabled' })
                    }
                    className="rounded text-teal-600"
                  />
                  <span className="text-slate-800 dark:text-slate-200">Network Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition"
                >
                  {editingNetwork ? 'Update Whitelist' : 'Add to Whitelist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
