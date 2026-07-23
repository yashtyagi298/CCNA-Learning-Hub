import type { Achievement, ActivityItem, CcnaTopic, Learner, ResourceItem, StudyTask } from "@/types";

const topicSeed = [
  ["networking-basics", "Networking Basics", "Core concepts, device roles, topologies, media, and protocol behavior.", "Beginner", 3],
  ["osi-model", "OSI Model", "Seven-layer troubleshooting model with encapsulation and protocol mapping.", "Beginner", 2],
  ["tcp-ip", "TCP/IP", "Internet protocol suite, transport behavior, ports, sessions, and delivery.", "Beginner", 3],
  ["ethernet", "Ethernet", "Frames, duplex, speed negotiation, MTU, and switching fundamentals.", "Beginner", 3],
  ["mac-address", "MAC Address", "Layer 2 addressing, OUIs, CAM tables, and frame forwarding decisions.", "Beginner", 2],
  ["arp", "ARP", "Address resolution, cache behavior, gratuitous ARP, and troubleshooting.", "Beginner", 2],
  ["ipv4", "IPv4", "Addressing, headers, private ranges, host routing, and gateway logic.", "Beginner", 4],
  ["ipv6", "IPv6", "Global unicast, link-local, SLAAC, NDP, and transition concepts.", "Intermediate", 4],
  ["subnetting", "Subnetting", "Fast mental subnetting, block sizes, host ranges, and masks.", "Intermediate", 6],
  ["vlsm", "VLSM", "Variable-length subnet design for efficient address planning.", "Intermediate", 4],
  ["cidr", "CIDR", "Route aggregation, prefixes, summarization, and binary boundaries.", "Intermediate", 3],
  ["routing", "Routing", "Packet forwarding, route selection, AD, metrics, and RIB/FIB behavior.", "Intermediate", 5],
  ["static-routing", "Static Routing", "Next-hop and exit-interface routes, floating statics, and defaults.", "Intermediate", 4],
  ["rip", "RIP", "Distance-vector routing, timers, hop count, and loop prevention.", "Intermediate", 3],
  ["eigrp", "EIGRP", "DUAL, neighbors, metrics, successors, and feasible successors.", "Advanced", 5],
  ["ospf", "OSPF", "Link-state routing, areas, LSAs, DR/BDR, costs, and adjacency states.", "Advanced", 7],
  ["bgp-basics", "BGP Basics", "Autonomous systems, path vector logic, peering, and attributes.", "Advanced", 4],
  ["switching", "Switching", "Layer 2 forwarding, CAM learning, flooding, and segmentation.", "Intermediate", 4],
  ["vlan", "VLAN", "Access/trunk ports, tagging, native VLAN, and inter-VLAN routing.", "Intermediate", 5],
  ["vtp", "VTP", "VLAN database propagation, modes, versions, and revision risk.", "Intermediate", 2],
  ["stp", "STP", "Root bridge election, port states, costs, and loop prevention.", "Advanced", 5],
  ["rstp", "RSTP", "Rapid convergence, port roles, edge ports, and compatibility.", "Advanced", 3],
  ["etherchannel", "EtherChannel", "LACP/PAgP bundles, load balancing, and consistency checks.", "Intermediate", 3],
  ["acl", "ACL", "Standard and extended filtering, placement, wildcards, and verification.", "Intermediate", 5],
  ["nat", "NAT", "Inside/outside translations, static and dynamic NAT, and troubleshooting.", "Intermediate", 4],
  ["pat", "PAT", "Overload translations with ports, pools, and edge connectivity.", "Intermediate", 3],
  ["dhcp", "DHCP", "Address leasing, relay agents, exclusions, and option behavior.", "Beginner", 3],
  ["dns", "DNS", "Name resolution, records, hierarchy, and client troubleshooting.", "Beginner", 2],
  ["snmp", "SNMP", "Monitoring concepts, communities, traps, versions, and security.", "Intermediate", 2],
  ["syslog", "Syslog", "Event logging, severity levels, facilities, and centralized visibility.", "Beginner", 2],
  ["ntp", "NTP", "Time synchronization, strata, authentication, and drift issues.", "Beginner", 2],
  ["hsrp", "HSRP", "First-hop redundancy, active/standby election, tracking, and failover.", "Advanced", 3],
  ["vrrp", "VRRP", "Standards-based gateway redundancy and priority behavior.", "Advanced", 2],
  ["vpn", "VPN", "Tunnels, IPsec basics, remote access, and site-to-site concepts.", "Advanced", 4],
  ["wireless", "Wireless", "802.11 basics, channels, roaming, security, and controllers.", "Intermediate", 4],
  ["automation", "Automation", "Templates, configuration drift, APIs, and repeatable workflows.", "Intermediate", 3],
  ["network-security", "Network Security", "Hardening, device access, port security, and secure operations.", "Advanced", 5],
  ["network-programmability", "Network Programmability", "REST APIs, JSON, controllers, and software-defined networking.", "Advanced", 4]
] as const;

const topicContent: Record<string, Partial<Pick<CcnaTopic, "commands" | "lab" | "interviewQuestions" | "revisionNotes" | "commonMistakes" | "practiceTasks" | "resources">>> = {
  ospf: {
    commands: [
      "router ospf 1",
      "router-id 1.1.1.1",
      "network 10.0.0.0 0.255.255.255 area 0",
      "ip ospf 1 area 0",
      "ip ospf cost 10",
      "ip ospf priority 0",
      "passive-interface default",
      "no passive-interface g0/0",
      "default-information originate",
      "area 1 stub",
      "clear ip ospf process",
      "show ip ospf neighbor",
      "show ip ospf interface brief",
      "show ip ospf database",
      "show ip route ospf",
      "show ip protocols",
      "debug ip ospf adj"
    ],
    lab: "Real-life OSPF scenario: a branch office has R1, R2, and R3. R1 is HQ, R2 is distribution, R3 is branch. Configure single-area OSPF area 0, advertise LANs, make LAN-facing ports passive, force R1 as DR using priority, then troubleshoot a neighbor stuck in INIT because of hello/dead timer mismatch.",
    interviewQuestions: [
      "Why can an OSPF neighbor get stuck in 2-Way, INIT, EXSTART, or LOADING?",
      "How does OSPF choose DR and BDR on a broadcast network?",
      "What is the difference between router-id, process-id, area-id, cost, and administrative distance?",
      "Which commands prove OSPF is actually forwarding traffic, not just forming neighbors?"
    ],
    revisionNotes: [
      "OSPF process-id is locally significant; area-id must match between neighbors.",
      "Router ID selection order: manually configured router-id, highest loopback IP, highest active physical IP.",
      "Neighbors need matching area, subnet, hello/dead timers, authentication, and network type.",
      "OSPF AD is 110. Cost is based on interface bandwidth unless changed manually."
    ],
    commonMistakes: [
      "Using the wrong wildcard mask in the network statement.",
      "Forgetting no passive-interface on router-to-router links.",
      "Expecting FULL state between all routers on a broadcast segment; DROTHER to DROTHER stays 2-Way.",
      "Changing router-id without clearing the OSPF process."
    ],
    practiceTasks: [
      "Build a 3-router area 0 topology and verify all routes with show ip route ospf.",
      "Create a hello/dead timer mismatch, observe the failure, then fix it.",
      "Change interface cost so traffic prefers the backup link, then prove the route changed.",
      "Configure passive-interface default and selectively enable OSPF only on transit links."
    ],
    resources: [
      "Cisco OSPF configuration guide",
      "NetworkChuck Academy CCNA routing lessons",
      "CBT Nuggets OSPF CCNA training",
      "YouTube: OSPF CCNA lab walkthrough"
    ]
  },
  subnetting: {
    commands: ["show ip interface brief", "show ip route connected", "show running-config interface", "ping", "traceroute"],
    lab: "Design subnets for HQ, sales, engineering, voice, guest Wi-Fi, and WAN links using VLSM. Assign gateways, validate host ranges, and document broadcast addresses.",
    interviewQuestions: ["How do you calculate block size quickly?", "What is the difference between network, first host, last host, and broadcast address?", "Why do WAN point-to-point links often use /30 or /31?"],
    revisionNotes: ["Block size = 256 - interesting octet mask.", "Usable hosts = 2^host bits - 2, except /31 and /32 edge cases.", "Write subnet ranges before assigning devices."],
    commonMistakes: ["Counting the network address as a host.", "Mixing up /26 and /27 block sizes.", "Forgetting that the interesting octet changes at /8, /16, and /24 boundaries."],
    practiceTasks: ["Complete the 100-question subnetting sheet.", "Design a VLSM plan for five departments.", "Convert 20 masks to CIDR without notes."],
    resources: ["Subnetting MCQ Sheet inside this app", "Cisco IPv4 addressing docs", "NetworkChuck subnetting videos"]
  }
};

function contentForTopic(id: string, title: string) {
  const base = {
    commands: [
      `show ${id.replaceAll("-", " ")} summary`,
      "show running-config",
      "show ip interface brief",
      "show ip protocols",
      "show logging"
    ],
    lab: `${title} focused lab: configure the feature, capture baseline output, introduce one fault, troubleshoot it, and document the verification commands.`,
    interviewQuestions: [
      `What problem does ${title} solve in a real network?`,
      `Which commands verify ${title} is working correctly?`,
      `What are the most common ${title} failure symptoms?`
    ],
    revisionNotes: [
      `Learn ${title} by drawing packet flow first, then memorizing commands.`,
      `Keep one page for definition, configuration, verification, and troubleshooting.`,
      `Always compare expected output with actual show command output.`
    ],
    commonMistakes: [
      `Configuring ${title} without checking interface state first.`,
      `Skipping verification after the change.`,
      `Troubleshooting from memory instead of reading command output.`
    ],
    practiceTasks: [
      `Build a small ${title} lab in Packet Tracer.`,
      `Create one intentional ${title} failure and fix it.`,
      `Write five flashcards for ${title} concepts and commands.`
    ],
    resources: [
      `Cisco ${title} documentation`,
      `NetworkChuck CCNA ${title} video search`,
      `CBT Nuggets CCNA ${title} lesson search`
    ]
  };

  return { ...base, ...topicContent[id] };
}

export const topics: CcnaTopic[] = topicSeed.map(([id, title, description, difficulty, estimatedHours], index) => ({
  id,
  title,
  description,
  difficulty,
  estimatedHours,
  status: index < 8 ? "completed" : index < 18 ? "learning" : index < 25 ? "review" : "not-started",
  progress: index < 8 ? 100 : index < 18 ? 45 + ((index * 7) % 35) : index < 25 ? 20 + ((index * 9) % 30) : 0,
  ...contentForTopic(id, title)
}));

export const resources: ResourceItem[] = [
  { id: "r1", title: "Cisco CCNA Exam Topics", category: "Docs", source: "Cisco", duration: "Reference", favorite: true, tags: ["official", "exam"], url: "https://learningnetwork.cisco.com/s/ccna-exam-topics" },
  { id: "r2", title: "NetworkChuck Summer of CCNA", category: "Video", source: "NetworkChuck Academy", duration: "Full course", favorite: true, tags: ["networkchuck", "ccna"], url: "https://academy.networkchuck.com/course/free-summer-of-ccna" },
  { id: "r3", title: "CBT Nuggets CCNA Training", category: "Video", source: "CBT Nuggets", duration: "Course", favorite: true, tags: ["cbtnuggets", "ccna"], url: "https://www.cbtnuggets.com/it-training/cisco/ccna" },
  { id: "r4", title: "OSPF CCNA Videos", category: "Video", source: "YouTube", duration: "Playlist search", favorite: false, tags: ["ospf", "routing"], url: "https://www.youtube.com/results?search_query=NetworkChuck+CCNA+OSPF" },
  { id: "r5", title: "Subnetting CCNA Videos", category: "Video", source: "YouTube", duration: "Playlist search", favorite: true, tags: ["subnetting", "math"], url: "https://www.youtube.com/results?search_query=NetworkChuck+CCNA+subnetting" },
  { id: "r6", title: "VLAN and Switching Videos", category: "Video", source: "YouTube", duration: "Playlist search", favorite: false, tags: ["vlan", "switching"], url: "https://www.youtube.com/results?search_query=NetworkChuck+CCNA+VLAN+switching" },
  { id: "r7", title: "Cisco Packet Tracer", category: "Lab", source: "Cisco", duration: "Download", favorite: true, tags: ["labs", "packet-tracer"], url: "https://www.netacad.com/resources/lab-downloads" },
  { id: "r8", title: "ACL Troubleshooting Patterns", category: "Blog", source: "NetworkLessons", duration: "12 min", favorite: false, tags: ["acl", "security"], url: "https://networklessons.com/cisco/ccna-routing-switching-icnd1-100-105/access-lists-acls" }
];

export const activities: ActivityItem[] = [
  { id: "a1", title: "Completed VLAN trunk lab", meta: "12 verification checks passed", tone: "green" },
  { id: "a2", title: "Added OSPF adjacency notes", meta: "Area 0, DR/BDR, timers", tone: "blue" },
  { id: "a3", title: "Missed NAT overload review", meta: "Rescheduled for tonight", tone: "amber" },
  { id: "a4", title: "Unlocked Subnet Sprint badge", meta: "50 drills under 20 minutes", tone: "violet" }
];

export const tasks: StudyTask[] = [
  {
    id: "t1",
    title: "Memorize IPv6 multicast addresses",
    description: "Create a quick recall sheet for FF02::1, FF02::2, solicited-node multicast, and common neighbor discovery flows.",
    checklist: ["Write address purpose", "Add packet example", "Quiz without notes"],
    status: "todo",
    priority: "Medium",
    due: "Today",
    topic: "IPv6"
  },
  {
    id: "t2",
    title: "Build OSPF area 0 lab",
    description: "Three-router Packet Tracer lab with one broadcast segment, one point-to-point segment, and verification screenshots.",
    checklist: ["Configure router IDs", "Verify FULL adjacency", "Break timer mismatch"],
    status: "in-progress",
    priority: "High",
    due: "Tomorrow",
    topic: "OSPF"
  },
  {
    id: "t3",
    title: "Review VLAN native mismatch symptoms",
    description: "Document CDP warnings, trunk output, and the real traffic impact of native VLAN mismatches.",
    checklist: ["Capture show interfaces trunk", "Write root cause", "Add prevention note"],
    status: "review",
    priority: "Medium",
    due: "Fri",
    topic: "VLAN"
  },
  {
    id: "t4",
    title: "Publish subnetting cheat sheet",
    description: "Finalize block-size table from /16 through /30 and add five timed examples.",
    checklist: ["Proofread table", "Add examples", "Mark as reusable"],
    status: "completed",
    priority: "Low",
    due: "Done",
    topic: "Subnetting"
  },
  {
    id: "t5",
    title: "Practice ACL wildcard conversions",
    description: "Convert subnet masks to wildcards, place ACLs correctly, and test permitted versus denied traffic.",
    checklist: ["20 wildcard drills", "Standard ACL placement", "Extended ACL placement"],
    status: "todo",
    priority: "High",
    due: "Sat",
    topic: "ACL"
  },
  {
    id: "t6",
    title: "Document DHCP relay failure mode",
    description: "Explain when ip helper-address is needed and what show/debug commands prove the relay path.",
    checklist: ["Draw client-server path", "Add helper config", "Verify leased IP"],
    status: "in-progress",
    priority: "Medium",
    due: "Sun",
    topic: "DHCP"
  },
  {
    id: "t7",
    title: "Todo: NAT overload mini-lab",
    description: "Build inside/outside interfaces, configure PAT overload, and prove translations with live pings.",
    checklist: ["Mark inside/outside", "Create ACL for private subnet", "Verify translations"],
    status: "todo",
    priority: "High",
    due: "Tomorrow",
    topic: "NAT/PAT"
  },
  {
    id: "t8",
    title: "Todo: STP root bridge election notes",
    description: "Write the election order and test bridge priority changes in a three-switch topology.",
    checklist: ["Record root ID", "Change priority", "Confirm blocked port"],
    status: "todo",
    priority: "Medium",
    due: "Mon",
    topic: "STP"
  },
  {
    id: "t9",
    title: "Todo: EtherChannel consistency check",
    description: "Practice LACP configuration and collect the commands that expose bundle mismatch problems.",
    checklist: ["Configure channel group", "Verify port-channel", "Break speed mismatch"],
    status: "todo",
    priority: "Medium",
    due: "Tue",
    topic: "EtherChannel"
  },
  {
    id: "t10",
    title: "Todo: DNS and NTP quick review",
    description: "Summarize client lookup order, DNS record purpose, NTP strata, and clock verification commands.",
    checklist: ["Write DNS records", "List NTP commands", "Create five flashcards"],
    status: "todo",
    priority: "Low",
    due: "Wed",
    topic: "Services"
  }
];

export const learners: Learner[] = [
  { id: "u1", name: "Yash Tyagi", handle: "@yash", streak: 27, topics: 28, labs: 42, score: 9820 },
  { id: "u2", name: "Maya Chen", handle: "@maya", streak: 23, topics: 31, labs: 39, score: 9440 },
  { id: "u3", name: "Arjun Rao", handle: "@arjun", streak: 18, topics: 24, labs: 35, score: 8710 },
  { id: "u4", name: "Nina Patel", handle: "@nina", streak: 14, topics: 22, labs: 31, score: 7980 }
];

export const achievements: Achievement[] = [
  { id: "ach1", title: "First Topic", description: "Complete your first CCNA topic.", unlocked: true, progress: 100 },
  { id: "ach2", title: "7 Day Streak", description: "Study seven days in a row.", unlocked: true, progress: 100 },
  { id: "ach3", title: "30 Day Streak", description: "Maintain a month-long learning streak.", unlocked: false, progress: 90 },
  { id: "ach4", title: "Subnetting Master", description: "Finish 100 subnetting drills.", unlocked: true, progress: 100 },
  { id: "ach5", title: "Routing Master", description: "Complete RIP, EIGRP, OSPF, and BGP labs.", unlocked: false, progress: 68 },
  { id: "ach6", title: "OSPF Master", description: "Troubleshoot all OSPF adjacency failures.", unlocked: false, progress: 56 },
  { id: "ach7", title: "Quiz Champion", description: "Score 90%+ on five quizzes.", unlocked: false, progress: 72 },
  { id: "ach8", title: "Top Learner", description: "Reach the weekly leaderboard top three.", unlocked: true, progress: 100 }
];

export const weeklyStudy = [
  { day: "Mon", hours: 2.2, topics: 3 },
  { day: "Tue", hours: 1.5, topics: 2 },
  { day: "Wed", hours: 3.4, topics: 4 },
  { day: "Thu", hours: 2.8, topics: 3 },
  { day: "Fri", hours: 4.1, topics: 5 },
  { day: "Sat", hours: 5.2, topics: 6 },
  { day: "Sun", hours: 3.7, topics: 4 }
];

export const topicProgress = [
  { name: "Routing", value: 68 },
  { name: "Switching", value: 74 },
  { name: "Security", value: 52 },
  { name: "Wireless", value: 41 },
  { name: "Automation", value: 36 }
];
