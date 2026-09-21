import { WorkplaceNetwork, NetworkSettingsConfig, NetworkAccessLog, CurrentNetworkConnection } from '../types';

export const initialWorkplaceNetworks: WorkplaceNetwork[] = [
  {
    id: 'net-hq-primary',
    name: 'Phnom Penh HQ - Primary Wi-Fi (Floors 1-5)',
    nameKm: 'ការិយាល័យកណ្តាលភ្នំពេញ - Wi-Fi ចម្បង (ជាន់ទី ១-៥)',
    ssid: 'CORP-HQ-SECURE-5G',
    bssidPrefix: '74:83:C2:A1',
    ipRanges: ['192.168.1.0/24', '192.168.2.0/24'],
    gatewayIp: '192.168.1.1',
    dnsServers: ['192.168.1.2', '1.1.1.1'],
    locationName: 'Phnom Penh HQ - Main Tower',
    departmentId: 'all',
    securityType: 'WPA3 Enterprise (802.1X)',
    status: 'Active',
    allowSeamlessCheckIn: true,
    firewallConfigured: true,
    connectedDevicesCount: 148,
    description: 'High-density corporate mesh covering executive floor, administrative suites, and open desks.',
    descriptionKm: 'បណ្តាញ Wi-Fi កម្រិតសហគ្រាសគ្របដណ្តប់ជាន់ថ្នាក់ដឹកនាំ រដ្ឋបាល និងតុបំពេញការងារទូទៅ។',
    addedAt: '2026-01-10',
    lastActive: 'Just now',
  },
  {
    id: 'net-tech-datacenter',
    name: 'Tech Wing & Data Center Secure Network',
    nameKm: 'ផ្នែកបច្ចេកវិទ្យា & មជ្ឈមណ្ឌលទិន្នន័យ (DC Wing)',
    ssid: 'CORP-DC-ENGINEERING-5G',
    bssidPrefix: '74:83:C2:B9',
    ipRanges: ['192.168.10.0/24'],
    gatewayIp: '192.168.10.1',
    dnsServers: ['192.168.10.2', '8.8.8.8'],
    locationName: 'HQ Data Center - Room 102',
    departmentId: 'dept-tech',
    securityType: 'WPA3 Enterprise (802.1X)',
    status: 'Active',
    allowSeamlessCheckIn: true,
    firewallConfigured: true,
    connectedDevicesCount: 42,
    description: 'Dedicated isolated VLAN for software engineering, devops, and infrastructure administrators.',
    descriptionKm: 'VLAN ដាច់ដោយឡែកសម្រាប់ក្រុមវិស្វកម្មកម្មវិធី DevOps និងអ្នកគ្រប់គ្រងហេដ្ឋារចនាសម្ព័ន្ធ។',
    addedAt: '2026-02-15',
    lastActive: 'Just now',
  },
  {
    id: 'net-siemreap-branch',
    name: 'Siem Reap Regional Office Wi-Fi',
    nameKm: 'ការិយាល័យតំបន់ខេត្តសៀមរាប',
    ssid: 'CORP-SR-OFFICE-WIFI',
    bssidPrefix: 'E4:95:6E:33',
    ipRanges: ['192.168.20.0/24'],
    gatewayIp: '192.168.20.1',
    dnsServers: ['192.168.20.2', '1.0.0.1'],
    locationName: 'Siem Reap Regional Branch',
    departmentId: 'all',
    securityType: 'WPA2/WPA3 Personal',
    status: 'Active',
    allowSeamlessCheckIn: true,
    firewallConfigured: true,
    connectedDevicesCount: 28,
    description: 'Branch office wireless infrastructure with direct SD-WAN tunnel to Phnom Penh HQ core.',
    descriptionKm: 'ហេដ្ឋារចនាសម្ព័ន្ធឥតខ្សែសាខាខេត្តសៀមរាប ភ្ជាប់តាមរយៈ SD-WAN មកកាន់ទីស្នាក់ការកណ្តាល។',
    addedAt: '2026-03-01',
    lastActive: '3 mins ago',
  },
  {
    id: 'net-enterprise-vpn',
    name: 'Corporate WireGuard / IPsec VPN Gateway',
    nameKm: 'ច្រកទ្វារបណ្តាញសុវត្ថិភាព Corporate VPN (WireGuard/IPsec)',
    ssid: 'CORP-VPN-TUNNEL',
    ipRanges: ['10.8.0.0/16', '10.9.0.0/16'],
    gatewayIp: '10.8.0.1',
    dnsServers: ['10.8.0.2', '1.1.1.1'],
    locationName: 'Remote / Field Office (VPN Masked)',
    departmentId: 'all',
    securityType: 'Corporate VPN Tunnel',
    status: 'Active',
    allowSeamlessCheckIn: true,
    firewallConfigured: true,
    connectedDevicesCount: 76,
    description: 'Encrypted corporate split-tunnel subnet for authorized remote workforce and travel assignments.',
    descriptionKm: 'បណ្តាញរង VPN ដែលបានអ៊ិនគ្រីបសម្រាប់បុគ្គលិកធ្វើការពីចម្ងាយ និងបេសកកម្មក្រៅកន្លែង។',
    addedAt: '2026-01-05',
    lastActive: 'Just now',
  },
  {
    id: 'net-battambang-hub',
    name: 'Battambang Operations Center Wi-Fi',
    nameKm: 'មជ្ឈមណ្ឌលប្រតិបត្តិការខេត្តបាត់ដំបង',
    ssid: 'CORP-BB-OPERATIONS',
    bssidPrefix: 'D8:07:B6:5C',
    ipRanges: ['192.168.30.0/24'],
    gatewayIp: '192.168.30.1',
    dnsServers: ['192.168.30.2', '8.8.4.4'],
    locationName: 'Battambang Field Center',
    departmentId: 'dept-ops',
    securityType: 'WPA2/WPA3 Personal',
    status: 'Active',
    allowSeamlessCheckIn: true,
    firewallConfigured: true,
    connectedDevicesCount: 19,
    description: 'Operational center Wi-Fi serving logistics, quality assurance, and regional field teams.',
    descriptionKm: 'បណ្តាញ Wi-Fi មជ្ឈមណ្ឌលប្រតិបត្តិការសម្រាប់ក្រុមភស្តុភារកម្ម និងត្រួតពិនិត្យគុណភាព។',
    addedAt: '2026-04-12',
    lastActive: '12 mins ago',
  },
];

export const defaultNetworkSettings: NetworkSettingsConfig = {
  enforceMode: 'Flexible',
  seamlessCheckInEnabled: true,
  allowVpnFallback: true,
  allowedPorts: [80, 443, 8443, 123],
  sslTlsInspectionBypass: true,
  captivePortalAutoBypass: true,
  rateLimitExemption: true,
  mDnsDiscovery: true,
  sessionTimeoutMinutes: 480,
  lastUpdated: '2026-09-17T14:30:00Z',
};

export const simulatedConnectionProfiles: CurrentNetworkConnection[] = [
  {
    networkId: 'net-hq-primary',
    networkName: 'Phnom Penh HQ - Primary Wi-Fi (Floors 1-5)',
    ssid: 'CORP-HQ-SECURE-5G',
    clientIp: '192.168.1.45',
    gatewayIp: '192.168.1.1',
    isWhitelisted: true,
    seamlessEligible: true,
    latencyMs: 3,
    connectionType: 'Workplace Wi-Fi',
  },
  {
    networkId: 'net-tech-datacenter',
    networkName: 'Tech Wing & Data Center Secure Network',
    ssid: 'CORP-DC-ENGINEERING-5G',
    clientIp: '192.168.10.22',
    gatewayIp: '192.168.10.1',
    isWhitelisted: true,
    seamlessEligible: true,
    latencyMs: 1,
    connectionType: 'Workplace Wi-Fi',
  },
  {
    networkId: 'net-enterprise-vpn',
    networkName: 'Corporate WireGuard / IPsec VPN Gateway',
    ssid: 'CORP-VPN-TUNNEL',
    clientIp: '10.8.0.34',
    gatewayIp: '10.8.0.1',
    isWhitelisted: true,
    seamlessEligible: true,
    latencyMs: 18,
    connectionType: 'Corporate VPN',
  },
  {
    networkId: 'ext-guest-wifi',
    networkName: 'HQ Guest / Visitor Wireless (Restricted)',
    ssid: 'CORP-GUEST-OPEN',
    clientIp: '172.16.0.88',
    gatewayIp: '172.16.0.1',
    isWhitelisted: false,
    seamlessEligible: false,
    latencyMs: 12,
    connectionType: 'Guest Wi-Fi',
  },
  {
    networkId: 'ext-home-lte',
    networkName: 'External Home Broadband / Cellular LTE',
    ssid: 'Home_Fiber_5G / Cell-Data',
    clientIp: '114.119.130.42',
    gatewayIp: '114.119.130.1',
    isWhitelisted: false,
    seamlessEligible: false,
    latencyMs: 44,
    connectionType: 'External / Cellular',
  },
];

export const initialNetworkAccessLogs: NetworkAccessLog[] = [
  {
    id: 'log-net-001',
    timestamp: '2026-09-17 07:58:21',
    employeeId: 'usr-1',
    employeeName: 'Sokha Chea',
    departmentName: 'Executive Leadership',
    clientIp: '192.168.1.45',
    matchedNetworkId: 'net-hq-primary',
    matchedNetworkName: 'Phnom Penh HQ - Primary Wi-Fi',
    ssid: 'CORP-HQ-SECURE-5G',
    whitelistStatus: 'Whitelisted (Seamless)',
    action: 'Check-In',
    latencyMs: 3,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0',
  },
  {
    id: 'log-net-002',
    timestamp: '2026-09-17 08:02:11',
    employeeId: 'usr-2',
    employeeName: 'Vanna Kim',
    departmentName: 'Strategic Planning',
    clientIp: '192.168.1.62',
    matchedNetworkId: 'net-hq-primary',
    matchedNetworkName: 'Phnom Penh HQ - Primary Wi-Fi',
    ssid: 'CORP-HQ-SECURE-5G',
    whitelistStatus: 'Whitelisted (Seamless)',
    action: 'Check-In',
    latencyMs: 4,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/128.0',
  },
  {
    id: 'log-net-003',
    timestamp: '2026-09-17 08:04:45',
    employeeId: 'usr-3',
    employeeName: 'Channarith Meng',
    departmentName: 'Digital Transformation',
    clientIp: '192.168.10.14',
    matchedNetworkId: 'net-tech-datacenter',
    matchedNetworkName: 'Tech Wing & Data Center Secure Network',
    ssid: 'CORP-DC-ENGINEERING-5G',
    whitelistStatus: 'Whitelisted (Seamless)',
    action: 'Check-In',
    latencyMs: 1,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Firefox/130.0',
  },
  {
    id: 'log-net-004',
    timestamp: '2026-09-17 08:07:02',
    employeeId: 'usr-6',
    employeeName: 'Bopha Pich',
    departmentName: 'Quality Assurance',
    clientIp: '10.8.0.22',
    matchedNetworkId: 'net-enterprise-vpn',
    matchedNetworkName: 'Corporate WireGuard / IPsec VPN Gateway',
    ssid: 'CORP-VPN-TUNNEL',
    whitelistStatus: 'VPN-Secured',
    action: 'Check-In',
    latencyMs: 16,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Mobile/Safari',
  },
  {
    id: 'log-net-005',
    timestamp: '2026-09-17 08:12:30',
    employeeId: 'usr-7',
    employeeName: 'Kosal Seng',
    departmentName: 'Operations',
    clientIp: '192.168.30.15',
    matchedNetworkId: 'net-battambang-hub',
    matchedNetworkName: 'Battambang Operations Center Wi-Fi',
    ssid: 'CORP-BB-OPERATIONS',
    whitelistStatus: 'Whitelisted (Seamless)',
    action: 'Check-In',
    latencyMs: 6,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'log-net-006',
    timestamp: '2026-09-17 08:15:19',
    employeeId: 'usr-9',
    employeeName: 'Piseth Heng',
    departmentName: 'Sales & Partnerships',
    clientIp: '114.119.130.42',
    whitelistStatus: 'External / Remote',
    action: 'Check-In',
    latencyMs: 46,
    userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:130.0) Gecko/Firefox',
    flaggedReason: 'Client connected from external ISP pool outside registered workplace IP subnets.',
  },
  {
    id: 'log-net-007',
    timestamp: '2026-09-17 08:18:04',
    employeeId: 'usr-8',
    employeeName: 'Rathana Lim',
    departmentName: 'Financial Control',
    clientIp: '192.168.1.88',
    matchedNetworkId: 'net-hq-primary',
    matchedNetworkName: 'Phnom Penh HQ - Primary Wi-Fi',
    ssid: 'CORP-HQ-SECURE-5G',
    whitelistStatus: 'Whitelisted (Seamless)',
    action: 'Check-In',
    latencyMs: 3,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: 'log-net-008',
    timestamp: '2026-09-17 08:24:50',
    employeeId: 'usr-11',
    employeeName: 'Sambath Touch',
    departmentName: 'Human Resources',
    clientIp: '172.16.0.45',
    ssid: 'CORP-GUEST-OPEN',
    whitelistStatus: 'Blocked (Non-Whitelisted)',
    action: 'Check-In',
    latencyMs: 14,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1)',
    flaggedReason: 'Guest Wi-Fi subnet has strict intranet isolation rules. Redirected to workplace SSID.',
  },
  {
    id: 'log-net-009',
    timestamp: '2026-09-17 08:30:15',
    employeeId: 'usr-4',
    employeeName: 'Dany Ouk',
    departmentName: 'Strategic Planning',
    clientIp: '192.168.1.51',
    matchedNetworkId: 'net-hq-primary',
    matchedNetworkName: 'Phnom Penh HQ - Primary Wi-Fi',
    ssid: 'CORP-HQ-SECURE-5G',
    whitelistStatus: 'Whitelisted (Seamless)',
    action: 'Heartbeat / Ping',
    latencyMs: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: 'log-net-010',
    timestamp: '2026-09-17 08:35:40',
    employeeId: 'usr-10',
    employeeName: 'Sreymom Keo',
    departmentName: 'Legal & Compliance',
    clientIp: '192.168.20.12',
    matchedNetworkId: 'net-siemreap-branch',
    matchedNetworkName: 'Siem Reap Regional Office Wi-Fi',
    ssid: 'CORP-SR-OFFICE-WIFI',
    whitelistStatus: 'Whitelisted (Seamless)',
    action: 'Check-In',
    latencyMs: 7,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
];

/**
 * Checks whether an IPv4 address falls within a given CIDR notation (e.g. 192.168.1.0/24)
 * or matches an exact IP.
 */
export function isIpInCidr(ip: string, cidr: string): boolean {
  try {
    const cleanIp = ip.trim().split(' ')[0]; // Remove extra tags if any
    const cleanCidr = cidr.trim();

    if (!cleanCidr.includes('/')) {
      return cleanIp === cleanCidr;
    }

    const [range, bitsStr] = cleanCidr.split('/');
    const bits = parseInt(bitsStr, 10);
    if (isNaN(bits) || bits < 0 || bits > 32) return false;

    const ipToLong = (ipAddr: string) => {
      const parts = ipAddr.split('.').map(p => parseInt(p, 10));
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
      return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
    };

    const targetLong = ipToLong(cleanIp);
    const rangeLong = ipToLong(range);

    if (targetLong === null || rangeLong === null) return false;

    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (targetLong & mask) === (rangeLong & mask);
  } catch {
    return false;
  }
}

/**
 * Validates whether an IP address matches any of the given networks' whitelisted ranges.
 */
export function checkIpAgainstNetworks(
  ip: string,
  networks: WorkplaceNetwork[]
): { isWhitelisted: boolean; matchedNetwork?: WorkplaceNetwork } {
  const activeNetworks = networks.filter(n => n.status === 'Active');
  for (const net of activeNetworks) {
    for (const range of net.ipRanges) {
      if (isIpInCidr(ip, range)) {
        return { isWhitelisted: true, matchedNetwork: net };
      }
    }
  }
  return { isWhitelisted: false };
}
